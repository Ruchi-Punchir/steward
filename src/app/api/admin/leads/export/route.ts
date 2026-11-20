import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import {
  parseLeadAdAttribution,
  type LeadRecord,
} from "@/lib/leads/format";

export const dynamic = "force-dynamic";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  // Mitigate spreadsheet formula injection
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(`Error exporting leads: ${error.message}`, {
      status: 500,
    });
  }

  const leads = (data ?? []) as LeadRecord[];

  const headers = [
    "id",
    "created_at",
    "intent",
    "lead_type",
    "name",
    "email",
    "product_link",
    "stage",
    "message",
    "source_button",
    "source_page",
    "gclid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_adgroup",
    "utm_term",
    "utm_matchtype",
    "utm_device",
    "visitor_id",
    "pages_visited",
    "referrer",
    "status",
    "assigned_to",
  ];

  const rows = [
    headers.join(","),
    ...leads.map((l) => {
      const { cleanMessage, adAttribution } = parseLeadAdAttribution(
        l.message,
      );
      return [
        l.id,
        l.created_at,
        l.intent,
        adAttribution?.lead_type ?? "",
        l.name,
        l.email,
        l.product_link,
        l.stage,
        cleanMessage,
        l.source_button,
        l.source_page,
        adAttribution?.gclid ?? "",
        l.utm_source,
        l.utm_medium,
        l.utm_campaign,
        adAttribution?.utm_adgroup ?? "",
        adAttribution?.utm_term ?? "",
        adAttribution?.utm_matchtype ?? "",
        adAttribution?.utm_device ?? "",
        adAttribution?.visitor_id ?? "",
        adAttribution?.pages_visited?.join(" -> ") ?? "",
        l.referrer,
        l.status,
        l.assigned_to,
      ]
        .map(escapeCsvCell)
        .join(",");
    }),
  ];

  const csvContent = rows.join("\r\n");
  const dateStamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="steward-leads-${dateStamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
