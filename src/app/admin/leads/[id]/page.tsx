import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import LeadDetailClient from "@/app/admin/leads/[id]/LeadDetailClient";
import {
  isNeedsReply,
  LEAD_STATUS_META,
  type LeadEventRecord,
  type LeadNoteRecord,
  type LeadRecord,
} from "@/lib/leads/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminLeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLeadDetailPage({
  params,
}: AdminLeadDetailPageProps) {
  const admin = await requireAdminPage();
  const { id } = await params;

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { data: leadData, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (leadErr || !leadData) {
    notFound();
  }

  const lead = leadData as LeadRecord;

  const [{ data: notesData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const notes = (notesData ?? []) as LeadNoteRecord[];
  const events = (eventsData ?? []) as LeadEventRecord[];
  const needsReply = isNeedsReply(lead);
  const statusMeta = LEAD_STATUS_META[lead.status] ?? LEAD_STATUS_META.new;

  return (
    <AdminShell admin={admin}>
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/leads"
            className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[#a09c94] transition-colors hover:text-[#e89b3c]"
          >
            ← Back to Leads
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#f4f0ea]">
              {lead.name}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
            >
              {statusMeta.label}
            </span>
            {needsReply && (
              <span className="inline-flex items-center rounded-full border border-red-500/45 bg-red-500/15 px-2.5 py-0.5 font-mono-label text-[10px] font-semibold uppercase tracking-[0.12em] text-red-300">
                Needs reply (&gt;24h)
              </span>
            )}
          </div>
        </div>
      </div>

      <LeadDetailClient
        lead={lead}
        notes={notes}
        events={events}
        currentAdminName={admin.name}
      />
    </AdminShell>
  );
}
