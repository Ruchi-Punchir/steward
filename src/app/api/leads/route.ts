import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LEAD_COPY } from "@/config/leadCopy";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  sendLeadEmails,
  verifyTurnstileToken,
} from "@/lib/leads/notifications";

const MAX_LEADS_PER_IP_PER_HOUR = 30;
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

const adLeadPayloadSchema = z.object({
  lead_type: z.enum([
    "mvp-rescue",
    "conversion-engineering",
    "speed-audit",
    "pricing-strategy",
    "onboarding-retention",
    "engagement-models",
  ]),
  email: z
    .string()
    .trim()
    .email("Please enter a valid work email address.")
    .max(200),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  product_link: z.string().trim().max(500).optional().or(z.literal("")),
  // Route-specific fields
  current_stack: z.string().trim().max(120).optional().or(z.literal("")),
  built_by: z.string().trim().max(120).optional().or(z.literal("")),
  breaking_right_now: z.string().trim().max(1000).optional().or(z.literal("")),
  current_stage: z.string().trim().max(120).optional().or(z.literal("")),
  biggest_leak: z.string().trim().max(120).optional().or(z.literal("")),
  primary_stack: z.string().trim().max(120).optional().or(z.literal("")),
  main_goal: z.string().trim().max(120).optional().or(z.literal("")),
  // Attribution payload
  visitor_id: z.string().trim().max(120).optional().or(z.literal("")),
  gclid: z.string().trim().max(250).optional().or(z.literal("")),
  utm_source: z.string().trim().max(200).optional().or(z.literal("")),
  utm_medium: z.string().trim().max(200).optional().or(z.literal("")),
  utm_campaign: z.string().trim().max(200).optional().or(z.literal("")),
  utm_adgroup: z.string().trim().max(200).optional().or(z.literal("")),
  utm_term: z.string().trim().max(200).optional().or(z.literal("")),
  utm_matchtype: z.string().trim().max(100).optional().or(z.literal("")),
  utm_device: z.string().trim().max(100).optional().or(z.literal("")),
  landing_page: z.string().trim().max(500).optional().or(z.literal("")),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
  first_seen: z.string().trim().max(100).optional().or(z.literal("")),
  pages_visited: z.array(z.string().max(300)).max(50).optional(),
  // Spam protection
  honeypot: z.string().optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const body = await req.json();
    const parsed = adLeadPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ?? "Please check your inputs.",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Rate limit check
    if (!checkLeadIpRateLimit(ipAddress)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many submissions in a short time. Please try again in a few minutes.",
        },
        { status: 429 },
      );
    }

    // Turnstile check
    const turnstileOk = await verifyTurnstileToken(
      data.turnstileToken,
      ipAddress,
    );
    if (!turnstileOk) {
      return NextResponse.json(
        {
          success: false,
          error: "Security verification failed. Please refresh and try again.",
        },
        { status: 400 },
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: LEAD_COPY.common.genericError,
        },
        { status: 500 },
      );
    }

    const isSuspectedBot = Boolean(
      data.honeypot && data.honeypot.trim().length > 0,
    );

    const leadId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Derive display name from email handle if name wasn't explicitly supplied
    const emailClean = data.email.trim().toLowerCase();
    const derivedName =
      data.name?.trim() ||
      emailClean
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Founder";

    // Build structured message block containing all route-specific fields & full Google Ads attribution
    const detailsLines: string[] = [
      `[Google Ads Lead: /${data.lead_type}]`,
    ];

    if (data.lead_type === "mvp-rescue") {
      if (data.current_stack)
        detailsLines.push(`Current Stack: ${data.current_stack}`);
      if (data.built_by)
        detailsLines.push(`How was it built?: ${data.built_by}`);
      if (data.breaking_right_now)
        detailsLines.push(`What is breaking right now?: ${data.breaking_right_now}`);
    } else if (data.lead_type === "conversion-engineering") {
      if (data.current_stage)
        detailsLines.push(`Current Stage: ${data.current_stage}`);
      if (data.biggest_leak)
        detailsLines.push(`Biggest Leak Right Now: ${data.biggest_leak}`);
    } else if (data.lead_type === "speed-audit") {
      if (data.primary_stack)
        detailsLines.push(`Primary Stack: ${data.primary_stack}`);
      if (data.main_goal)
        detailsLines.push(`Main Goal: ${data.main_goal}`);
    } else {
      if (data.current_stage)
        detailsLines.push(`Current Stage: ${data.current_stage}`);
      if (data.biggest_leak)
        detailsLines.push(`Primary Focus: ${data.biggest_leak}`);
      if (data.main_goal)
        detailsLines.push(`Main Goal: ${data.main_goal}`);
      if (data.breaking_right_now)
        detailsLines.push(`Notes: ${data.breaking_right_now}`);
    }

    const attributionMeta = {
      lead_type: data.lead_type,
      visitor_id: data.visitor_id || "",
      gclid: data.gclid || "",
      utm_source: data.utm_source || "",
      utm_medium: data.utm_medium || "",
      utm_campaign: data.utm_campaign || "",
      utm_adgroup: data.utm_adgroup || "",
      utm_term: data.utm_term || "",
      utm_matchtype: data.utm_matchtype || "",
      utm_device: data.utm_device || "",
      landing_page: data.landing_page || `/${data.lead_type}`,
      referrer: data.referrer || "direct",
      first_seen: data.first_seen || createdAt,
      pages_visited: data.pages_visited ?? [`/${data.lead_type}`],
      form_fields: {
        current_stack: data.current_stack || undefined,
        built_by: data.built_by || undefined,
        breaking_right_now: data.breaking_right_now || undefined,
        current_stage: data.current_stage || undefined,
        biggest_leak: data.biggest_leak || undefined,
        primary_stack: data.primary_stack || undefined,
        main_goal: data.main_goal || undefined,
      },
    };

    detailsLines.push("");
    detailsLines.push("--- Attribution & Journey ---");
    if (attributionMeta.gclid)
      detailsLines.push(`GCLID: ${attributionMeta.gclid}`);
    if (attributionMeta.utm_term)
      detailsLines.push(`UTM Term: ${attributionMeta.utm_term}`);
    if (attributionMeta.utm_adgroup)
      detailsLines.push(`UTM AdGroup: ${attributionMeta.utm_adgroup}`);
    if (attributionMeta.utm_matchtype)
      detailsLines.push(`Match Type: ${attributionMeta.utm_matchtype}`);
    if (attributionMeta.utm_device)
      detailsLines.push(`Device: ${attributionMeta.utm_device}`);
    if (attributionMeta.visitor_id)
      detailsLines.push(`Visitor ID: ${attributionMeta.visitor_id}`);
    if (attributionMeta.landing_page)
      detailsLines.push(`First Landing Page: ${attributionMeta.landing_page}`);
    if (attributionMeta.pages_visited.length > 0)
      detailsLines.push(
        `Journey: ${attributionMeta.pages_visited.join(" → ")}`,
      );
    detailsLines.push(
      `<!--STEWARD_AD_ATTRIBUTION:${JSON.stringify(attributionMeta)}-->`,
    );

    const formattedMessage = detailsLines.join("\n").slice(0, 3500);

    // Map stage to public.leads enum ('Idea' | 'Live product' | 'Not sure')
    const mappedStage: "Idea" | "Live product" | "Not sure" =
      data.current_stage === "Pre-Seed" || data.lead_type === "mvp-rescue"
        ? "Idea"
        : "Live product";

    const insertPayload = {
      id: leadId,
      created_at: createdAt,
      intent: "audit" as const,
      name: derivedName,
      email: emailClean,
      product_link: data.product_link?.trim() || null,
      stage: mappedStage,
      message: formattedMessage,
      source_button: `ad:${data.lead_type}`,
      source_page: data.landing_page || `/${data.lead_type}`,
      utm_source: data.utm_source || (data.gclid ? "google" : null),
      utm_medium: data.utm_medium || (data.gclid ? "cpc" : null),
      utm_campaign: data.utm_campaign || null,
      referrer: data.referrer || null,
      status: "new" as const,
      assigned_to: null,
    };

    const adminSupabase = createSupabaseAdminClient();
    const dbClient = adminSupabase ?? (await createSupabaseServerClient());

    const { error: insertError } = await dbClient
      .from("leads")
      .insert(insertPayload);

    if (insertError) {
      console.error("[STEWARD_AD_LEAD_INSERT_ERROR]", insertError);
      return NextResponse.json(
        {
          success: false,
          error: LEAD_COPY.common.genericError,
        },
        { status: 500 },
      );
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/campaigns");
    revalidatePath("/admin");

    if (!isSuspectedBot) {
      try {
        const emailResult = await sendLeadEmails({
          id: insertPayload.id,
          created_at: insertPayload.created_at,
          intent: insertPayload.intent,
          name: insertPayload.name,
          email: insertPayload.email,
          product_link: insertPayload.product_link,
          stage: insertPayload.stage,
          message: detailsLines
            .filter((line) => !line.startsWith("<!--STEWARD_AD_ATTRIBUTION:"))
            .join("\n"),
          source_button: insertPayload.source_button,
          source_page: insertPayload.source_page,
          utm_source: insertPayload.utm_source,
          utm_medium: insertPayload.utm_medium,
          utm_campaign: insertPayload.utm_campaign,
          referrer: insertPayload.referrer,
        });

        if (
          adminSupabase &&
          (emailResult.founderEmailSent || emailResult.visitorEmailSent)
        ) {
          await adminSupabase.from("lead_events").insert({
            lead_id: insertPayload.id,
            type: "email_sent",
            metadata: {
              founderEmailSent: emailResult.founderEmailSent,
              visitorEmailSent: emailResult.visitorEmailSent,
            },
          });
        }
      } catch (postInsertErr) {
        console.error(
          "[STEWARD_AD_POST_INSERT_WARNING] Lead saved, but email notification failed:",
          postInsertErr,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: leadId,
        lead_id: leadId,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[STEWARD_AD_LEAD_API_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: LEAD_COPY.common.genericError,
      },
      { status: 500 },
    );
  }
}
