"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { LEAD_COPY, LEAD_STAGE_OPTIONS } from "@/config/leadCopy";
import {
  createSupabaseServiceClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  sendLeadEmails,
  verifyTurnstileToken,
} from "@/lib/leads/notifications";

const MAX_LEADS_PER_IP_PER_HOUR = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ipSubmissionBuckets = new Map<
  string,
  { count: number; windowStart: number }
>();

function checkLeadIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = ip.trim().toLowerCase();
  const entry = ipSubmissionBuckets.get(key);

  if (!entry || now - entry.windowStart > ONE_HOUR_MS) {
    ipSubmissionBuckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= MAX_LEADS_PER_IP_PER_HOUR) {
    return false;
  }

  entry.count += 1;
  ipSubmissionBuckets.set(key, entry);
  return true;
}

const submitLeadSchema = z
  .object({
    intent: z.enum(["audit", "conversation"]),
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name.")
      .max(120, "Name must be 120 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(200),
    product_link: z
      .string()
      .trim()
      .max(500, "Product link is too long.")
      .optional()
      .or(z.literal("")),
    stage: z
      .enum(LEAD_STAGE_OPTIONS)
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(1, "Please share a short note before sending.")
      .max(1000, "Please keep your message under 1,000 characters."),
    source_button: z.string().trim().max(120).optional().or(z.literal("")),
    source_page: z.string().trim().max(500).optional().or(z.literal("")),
    utm_source: z.string().trim().max(200).optional().or(z.literal("")),
    utm_medium: z.string().trim().max(200).optional().or(z.literal("")),
    utm_campaign: z.string().trim().max(200).optional().or(z.literal("")),
    referrer: z.string().trim().max(500).optional().or(z.literal("")),
    honeypot: z.string().optional().or(z.literal("")),
    turnstileToken: z.string().optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    if (val.intent === "audit" && !val.stage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stage"],
        message: "Please select your current stage.",
      });
    }
  });

export interface SubmitLeadResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "product_link" | "stage" | "message", string>
  >;
}

export async function submitLeadAction(
  formData: FormData
): Promise<SubmitLeadResult> {
  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "127.0.0.1";

  const rawInput = {
    intent: String(formData.get("intent") ?? "audit"),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    product_link: String(formData.get("product_link") ?? ""),
    stage: String(formData.get("stage") ?? ""),
    message: String(formData.get("message") ?? ""),
    source_button: String(formData.get("source_button") ?? ""),
    source_page: String(formData.get("source_page") ?? ""),
    utm_source: String(formData.get("utm_source") ?? ""),
    utm_medium: String(formData.get("utm_medium") ?? ""),
    utm_campaign: String(formData.get("utm_campaign") ?? ""),
    referrer: String(formData.get("referrer") ?? ""),
    honeypot: String(formData.get("company_website") ?? ""),
    turnstileToken: String(
      formData.get("cf-turnstile-response") ??
        formData.get("turnstileToken") ??
        ""
    ),
  };

  // 1. Silent rejection if hidden honeypot field is filled by a bot
  if (rawInput.honeypot && rawInput.honeypot.trim().length > 0) {
    console.warn("[STEWARD_SPAM_BLOCKED] Honeypot triggered", { ipAddress });
    return { success: true };
  }

  // 2. Validate with Zod
  const parsed = submitLeadSchema.safeParse(rawInput);
  if (!parsed.success) {
    const fieldErrors: SubmitLeadResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<
        SubmitLeadResult["fieldErrors"]
      >;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check your inputs.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // 3. Rate limit by IP (5 per hour) -> silent rejection of suspicious floods
  if (!checkLeadIpRateLimit(ipAddress)) {
    console.warn("[STEWARD_SPAM_BLOCKED] IP rate limit exceeded (5/hr)", {
      ipAddress,
    });
    return { success: true };
  }

  // 4. Verify Cloudflare Turnstile token -> silent rejection if invalid
  const turnstileOk = await verifyTurnstileToken(
    data.turnstileToken,
    ipAddress
  );
  if (!turnstileOk) {
    console.warn("[STEWARD_SPAM_BLOCKED] Turnstile verification failed", {
      ipAddress,
    });
    return { success: true };
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      success: false,
      error: LEAD_COPY.common.genericError,
    };
  }

  // 5. INSERT LEAD INTO DATABASE FIRST (Never lose a lead!)
  const supabase = createSupabaseServiceClient();
  const insertPayload = {
    intent: data.intent,
    name: data.name,
    email: data.email.toLowerCase(),
    product_link:
      data.intent === "audit" && data.product_link ? data.product_link : null,
    stage:
      data.intent === "audit" && data.stage
        ? (data.stage as "Idea" | "Live product" | "Not sure")
        : null,
    message: data.message,
    source_button: data.source_button || null,
    source_page: data.source_page || null,
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    referrer: data.referrer || null,
    status: "new" as const,
    assigned_to: null,
  };

  const { data: insertedLead, error: insertError } = await supabase
    .from("leads")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError || !insertedLead) {
    console.error("[STEWARD_LEAD_INSERT_ERROR]", insertError);
    if (
      process.env.NODE_ENV !== "production" &&
      insertError?.code === "PGRST205"
    ) {
      return {
        success: false,
        error:
          "Supabase table 'public.leads' does not exist yet. Run supabase/migrations/001_phase1_foundation.sql in your Supabase SQL Editor.",
      };
    }
    return {
      success: false,
      error: LEAD_COPY.common.genericError,
    };
  }

  // 6. Send notification + confirmation emails and record lead_events.
  //    If ANY step after the DB insert fails, still return success and keep the lead!
  try {
    const emailResult = await sendLeadEmails({
      id: insertedLead.id,
      created_at: insertedLead.created_at,
      intent: insertedLead.intent,
      name: insertedLead.name,
      email: insertedLead.email,
      product_link: insertedLead.product_link,
      stage: insertedLead.stage,
      message: insertedLead.message,
      source_button: insertedLead.source_button,
      source_page: insertedLead.source_page,
      utm_source: insertedLead.utm_source,
      utm_medium: insertedLead.utm_medium,
      utm_campaign: insertedLead.utm_campaign,
      referrer: insertedLead.referrer,
    });

    if (emailResult.founderEmailSent || emailResult.visitorEmailSent) {
      await supabase.from("lead_events").insert({
        lead_id: insertedLead.id,
        type: "email_sent",
        metadata: {
          founderEmailSent: emailResult.founderEmailSent,
          visitorEmailSent: emailResult.visitorEmailSent,
        },
      });
    }
  } catch (postInsertErr) {
    console.error(
      "[STEWARD_POST_INSERT_WARNING] Lead saved, but post-insert step failed:",
      postInsertErr
    );
  }

  return { success: true };
}
