import React from "react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/auth";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import {
  formatLeadAge,
  formatLeadSource,
  isNeedsReply,
  LEAD_STATUS_META,
  type LeadRecord,
} from "@/lib/leads/format";
import type { LeadStatus } from "@/app/admin/leads/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminLeadsPageProps {
  searchParams: Promise<{
    status?: string;
    intent?: string;
    source?: string;
    q?: string;
  }>;
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  const admin = await requireAdminPage();
  const params = await searchParams;

  const statusFilter = (params.status ?? "all").trim();
  const intentFilter = (params.intent ?? "all").trim();
  const sourceFilter = (params.source ?? "all").trim();
  const searchQuery = (params.q ?? "").trim().toLowerCase();

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  let allLeads: LeadRecord[] = [];
  let fetchError: string | null = null;

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    fetchError = error.message;
  } else if (data) {
    allLeads = data as LeadRecord[];
  }

  // --- Summary Strip Calculations (No charts) ---
  const nowMs = Date.now();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoMs = nowMs - 30 * 24 * 60 * 60 * 1000;

  const newThisWeekCount = allLeads.filter((l) => {
    const t = new Date(l.created_at).getTime();
    return !Number.isNaN(t) && t >= sevenDaysAgoMs;
  }).length;

  const awaitingReplyLeads = allLeads.filter((l) => l.status === "new");
  const awaitingReplyCount = awaitingReplyLeads.length;
  const overdueReplyCount = awaitingReplyLeads.filter((l) =>
    isNeedsReply(l)
  ).length;

  const sourceCountsLast30d = new Map<string, number>();
  for (const lead of allLeads) {
    const t = new Date(lead.created_at).getTime();
    if (!Number.isNaN(t) && t >= thirtyDaysAgoMs) {
      const srcKey = lead.source_button?.trim() || "direct";
      sourceCountsLast30d.set(srcKey, (sourceCountsLast30d.get(srcKey) ?? 0) + 1);
    }
  }
  const sortedSourcesLast30d = Array.from(sourceCountsLast30d.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  // Unique sources for the filter dropdown
  const uniqueSources = Array.from(
    new Set(allLeads.map((l) => l.source_button?.trim() || "direct"))
  ).sort();

  // --- Apply Filters & Search ---
  const filteredLeads = allLeads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) {
      return false;
    }
    if (intentFilter !== "all" && lead.intent !== intentFilter) {
      return false;
    }
    const leadSource = lead.source_button?.trim() || "direct";
    if (sourceFilter !== "all" && leadSource !== sourceFilter) {
      return false;
    }
    if (searchQuery) {
      const matchesName = lead.name.toLowerCase().includes(searchQuery);
      const matchesEmail = lead.email.toLowerCase().includes(searchQuery);
      if (!matchesName && !matchesEmail) return false;
    }
    return true;
  });

  const hasActiveFilters =
    statusFilter !== "all" ||
    intentFilter !== "all" ||
    sourceFilter !== "all" ||
    Boolean(searchQuery);

  return (
    <AdminShell admin={admin}>
      {/* Top Header + CSV Export */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
            01 / Leads
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f4f0ea]">
            Website Leads
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/leads/export"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-[#101014] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
          >
            Export CSV ({allLeads.length})
          </a>
        </div>
      </div>

      {fetchError && (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          Database notice: {fetchError}
        </div>
      )}

      {/* Summary Strip: New this week, Awaiting reply, Leads by source (last 30 days) — No charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-4">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
            New this week (7d)
          </span>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-2xl font-semibold text-[#f4f0ea]">
              {newThisWeekCount}
            </span>
            <span className="text-xs text-[#a09c94]">
              {newThisWeekCount === 1 ? "lead captured" : "leads captured"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-4">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
            Awaiting reply (status: new)
          </span>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-2xl font-semibold text-[#f4f0ea]">
              {awaitingReplyCount}
            </span>
            {overdueReplyCount > 0 ? (
              <span className="inline-flex items-center rounded-full border border-red-500/40 bg-red-500/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] text-red-300">
                {overdueReplyCount} &gt; 24h needs reply
              </span>
            ) : (
              <span className="text-xs text-[#a09c94]">all under 24h</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-4">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
            Leads by source (last 30 days)
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sortedSourcesLast30d.length === 0 ? (
              <span className="text-xs text-[#66635c]">
                No leads in the last 30 days
              </span>
            ) : (
              sortedSourcesLast30d.map(([src, count]) => (
                <span
                  key={src}
                  className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono-label text-[10.5px] text-[#a09c94]"
                >
                  <span>{src}</span>
                  <strong className="text-[#f4f0ea]">{count}</strong>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <form
        method="GET"
        action="/admin/leads"
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-white/[0.08] bg-[#101014] p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="lg:col-span-2">
          <label
            htmlFor="filter-q"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Search name or email
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={params.q ?? ""}
            placeholder="Search by name or email..."
            className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="filter-status"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={statusFilter}
            className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
          >
            <option value="all">All statuses</option>
            {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((st) => (
              <option key={st} value={st}>
                {LEAD_STATUS_META[st].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-intent"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Intent
          </label>
          <select
            id="filter-intent"
            name="intent"
            defaultValue={intentFilter}
            className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
          >
            <option value="all">All intents</option>
            <option value="audit">Audit</option>
            <option value="conversation">Conversation</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-source"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Source
          </label>
          <div className="mt-1 flex items-center gap-2">
            <select
              id="filter-source"
              name="source"
              defaultValue={sourceFilter}
              className="w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
            >
              <option value="all">All sources</option>
              {uniqueSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-lg bg-[#e89b3c] px-3.5 py-2 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c]"
            >
              Apply
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-xs text-[#a09c94] sm:col-span-2 lg:col-span-5">
            <span>
              Showing <strong className="text-[#f4f0ea]">{filteredLeads.length}</strong>{" "}
              of {allLeads.length} leads
            </span>
            <Link
              href="/admin/leads"
              className="font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-[#e89b3c] hover:underline"
            >
              Clear filters
            </Link>
          </div>
        )}
      </form>

      {/* Leads List Table (newest first: intent, name, email, source, status, age) */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014]">
        {filteredLeads.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#a09c94]">
              No matching leads
            </p>
            <p className="mt-1.5 text-xs text-[#66635c]">
              {allLeads.length === 0
                ? "Submissions from the Free Audit and Start the Conversation forms will appear here."
                : "Try clearing or adjusting your active search and filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
                  <th className="px-4 py-3.5">Intent</th>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Source</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Assigned</th>
                  <th className="px-4 py-3.5 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredLeads.map((lead) => {
                  const needsReply = isNeedsReply(lead);
                  const statusMeta =
                    LEAD_STATUS_META[lead.status] ?? LEAD_STATUS_META.new;

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors hover:bg-white/[0.03] ${
                        needsReply ? "bg-red-500/[0.04]" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.14em] ${
                            lead.intent === "audit"
                              ? "border border-[#e89b3c]/35 bg-[#e89b3c]/10 text-[#e89b3c]"
                              : "border border-white/[0.12] bg-white/[0.04] text-[#a09c94]"
                          }`}
                        >
                          {lead.intent}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-[#f4f0ea]">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="block hover:text-[#e89b3c] hover:underline"
                        >
                          {lead.name}
                        </Link>
                        {lead.stage && (
                          <span className="mt-0.5 block text-[11px] font-normal text-[#66635c]">
                            Stage: {lead.stage}
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#a09c94]">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="hover:text-[#f4f0ea]"
                        >
                          {lead.email}
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 font-mono-label text-[11px] text-[#a09c94]">
                        {formatLeadSource(lead)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
                          >
                            {statusMeta.label}
                          </span>

                          {needsReply && (
                            <span className="inline-flex items-center rounded-full border border-red-500/45 bg-red-500/15 px-2 py-0.5 font-mono-label text-[9.5px] font-semibold uppercase tracking-[0.12em] text-red-300">
                              Needs reply
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#a09c94]">
                        {lead.assigned_to ?? (
                          <span className="text-[#66635c]">Unassigned</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono-label text-xs text-[#a09c94]">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="hover:text-[#e89b3c]"
                        >
                          {formatLeadAge(lead.created_at)} →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
