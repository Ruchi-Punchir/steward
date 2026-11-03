import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/**
 * Scheduled job endpoint: deletes leads older than 24 months unless status = 'won'.
 * Can be triggered by:
 * 1. Vercel Cron / external scheduler passing `Authorization: Bearer <CRON_SECRET>`
 * 2. An authenticated MFA-verified admin session
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const isCronAuthorized =
    Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;

  if (!isCronAuthorized) {
    const adminAuth = await requireAdminApi();
    if (!adminAuth.authorized) {
      return adminAuth.response;
    }
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase admin client not configured" },
      { status: 500 }
    );
  }

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 24);
  const cutoffIso = cutoffDate.toISOString();

  const { data, error } = await supabase
    .from("leads")
    .delete()
    .lt("created_at", cutoffIso)
    .neq("status", "won")
    .select("id");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    deletedCount: data?.length ?? 0,
    cutoffIso,
  });
}
