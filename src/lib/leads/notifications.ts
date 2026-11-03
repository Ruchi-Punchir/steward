import { LEAD_COPY, type LeadIntent, type LeadStage } from "@/config/leadCopy";
import { getAdminAllowlist } from "@/lib/admin/auth";

export interface LeadRecordForEmail {
  id: string;
  created_at: string;
  intent: LeadIntent;
  name: string;
  email: string;
  product_link: string | null;
  stage: LeadStage | null;
  message: string;
  source_button: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
}

/**
 * Verify Cloudflare Turnstile token on the server.
 * When using Cloudflare's standard test secret key (1x0000000000000000000000000000000AA)
 * or if Turnstile is not configured in local dev, handles verification gracefully.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  ipAddress: string
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();

  // If no secret key or using Cloudflare's dummy test secret key in local dev without widget token
  if (
    !secretKey ||
    (secretKey === "1x0000000000000000000000000000000AA" && !token)
  ) {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", ipAddress);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (err) {
    console.error("[STEWARD_TURNSTILE_ERROR]", err);
    // Do not block real leads if Cloudflare verification endpoint is unreachable
    return true;
  }
}

async function sendResendEmail(params: {
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || "Steward <onboarding@resend.dev>";

  if (!apiKey || apiKey.startsWith("re_xxxx")) {
    console.info(
      "[STEWARD_EMAIL_SIMULATED] (Set RESEND_API_KEY in .env.local to send live emails)",
      {
        to: params.to,
        subject: params.subject,
      }
    );
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errBody}`);
  }

  return true;
}

/**
 * Send:
 * 1) Notification email to both founders (Ashish & Ruchi) with all lead fields + UTM/source
 * 2) Plain, warm confirmation email to the visitor
 */
export async function sendLeadEmails(lead: LeadRecordForEmail): Promise<{
  founderEmailSent: boolean;
  visitorEmailSent: boolean;
}> {
  const founders = getAdminAllowlist();
  const recipientFounders =
    founders.length > 0
      ? founders
      : ["ashish@hellosteward.agency", "ruchi@hellosteward.agency"];

  const founderText = [
    `NEW STEWARD LEAD (${lead.intent.toUpperCase()})`,
    `==================================================`,
    `Name:          ${lead.name}`,
    `Email:         ${lead.email}`,
    `Intent:        ${lead.intent}`,
    ...(lead.intent === "audit"
      ? [
          `Product Link:  ${lead.product_link || "—"}`,
          `Stage:         ${lead.stage || "—"}`,
        ]
      : []),
    ``,
    `Message / What feels stuck:`,
    `${lead.message}`,
    ``,
    `--------------------------------------------------`,
    `ATTRIBUTION & CONTEXT`,
    `Source Button: ${lead.source_button || "—"}`,
    `Source Page:   ${lead.source_page || "—"}`,
    `UTM Source:    ${lead.utm_source || "—"}`,
    `UTM Medium:    ${lead.utm_medium || "—"}`,
    `UTM Campaign:  ${lead.utm_campaign || "—"}`,
    `Referrer:      ${lead.referrer || "—"}`,
    `Submitted At:  ${lead.created_at}`,
    `Admin Link:    ${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/admin/leads/${lead.id}`,
  ].join("\n");

  let founderEmailSent = false;
  let visitorEmailSent = false;

  try {
    founderEmailSent = await sendResendEmail({
      to: recipientFounders,
      replyTo: lead.email,
      subject: LEAD_COPY.emails.founderNotificationSubject(
        lead.intent,
        lead.name
      ),
      text: founderText,
    });
  } catch (err) {
    console.error("[STEWARD_FOUNDER_EMAIL_ERROR]", err);
  }

  try {
    const visitorTemplate =
      lead.intent === "audit"
        ? LEAD_COPY.emails.visitorAuditConfirmation
        : LEAD_COPY.emails.visitorConversationConfirmation;

    visitorEmailSent = await sendResendEmail({
      to: [lead.email],
      subject: visitorTemplate.subject,
      text: visitorTemplate.body(lead.name),
    });
  } catch (err) {
    console.error("[STEWARD_VISITOR_EMAIL_ERROR]", err);
  }

  return { founderEmailSent, visitorEmailSent };
}
