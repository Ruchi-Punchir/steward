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

  // Also purge stale admin rate-limit records (> 24 hours) and old security audit logs (> 90 days)
  const rateLimitCutoffIso = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();
  const auditLogCutoffIso = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000
  ).toISOString();

  await supabase
    .from("admin_rate_limits")
    .delete()
    .lt("first_attempt_at", rateLimitCutoffIso);

  await supabase
    .from("admin_audit_logs")
    .delete()
    .lt("created_at", auditLogCutoffIso);

  return NextResponse.json({
    ok: true,
    deletedCount: data?.length ?? 0,
    cutoffIso,
  });
}
