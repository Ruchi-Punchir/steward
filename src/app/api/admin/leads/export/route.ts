import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { LeadRecord } from "@/lib/leads/format";

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

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return new NextResponse("Database not configured", { status: 500 });
  }

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
    "name",
    "email",
    "product_link",
    "stage",
    "message",
    "source_button",
    "source_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "referrer",
    "status",
    "assigned_to",
  ];

  const rows = [
    headers.join(","),
    ...leads.map((l) =>
      [
        l.id,
        l.created_at,
        l.intent,
        l.name,
        l.email,
        l.product_link,
        l.stage,
        l.message,
        l.source_button,
        l.source_page,
        l.utm_source,
        l.utm_medium,
        l.utm_campaign,
        l.referrer,
        l.status,
        l.assigned_to,
      ]
        .map(escapeCsvCell)
        .join(",")
    ),
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
