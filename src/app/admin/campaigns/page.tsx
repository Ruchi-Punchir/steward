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
  isNeedsReply,
  LEAD_STATUS_META,
  parseLeadAdAttribution,
  type LeadRecord,
  type ParsedAdAttributionMeta,
} from "@/lib/leads/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminCampaignsPageProps {
  searchParams: Promise<{
    lead_type?: string;
    gclid?: string;
    q?: string;
  }>;
}

const AD_ROUTE_META: Record<
  "mvp-rescue" | "conversion-engineering" | "speed-audit",
  { label: string; path: string; badgeClass: string; desc: string }
> = {
  "mvp-rescue": {
    label: "MVP Rescue",
    path: "/mvp-rescue",
    badgeClass: "border-[#e89b3c]/40 bg-[#e89b3c]/15 text-[#e89b3c]",
    desc: "$60/hr Project Sprint · AI & Prototype Stabilization",
  },
  "conversion-engineering": {
    label: "Conversion Engineering",
    path: "/conversion-engineering",
    badgeClass: "border-[#10b981]/40 bg-[#10b981]/15 text-[#10b981]",
    desc: "$100/hr Partnership (40% At Risk) · Funnel Leak Audit",
  },
  "speed-audit": {
    label: "Speed Audit",
    path: "/speed-audit",
    badgeClass: "border-sky-400/40 bg-sky-400/15 text-sky-300",
    desc: "Sub-1.5s Load Times · React & Next.js Core Web Vitals",
  },
};

export default async function AdminCampaignsPage({
  searchParams,
}: AdminCampaignsPageProps) {
  const admin = await requireAdminPage();
  const params = await searchParams;

  const leadTypeFilter = (params.lead_type ?? "all").trim();
  const gclidFilter = (params.gclid ?? "all").trim();
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

  // Enrich leads with parsed Google Ads attribution metadata
  const enrichedAdLeads = allLeads
    .map((lead) => {
      const { cleanMessage, adAttribution } = parseLeadAdAttribution(
        lead.message,
      );
      const isAdLead =
        Boolean(adAttribution) ||
        lead.source_button?.startsWith("ad:") ||
        lead.source_page === "/mvp-rescue" ||
        lead.source_page === "/conversion-engineering" ||
        lead.source_page === "/speed-audit";

      const inferredType =
        adAttribution?.lead_type ||
        (lead.source_button?.replace("ad:", "") as
          | "mvp-rescue"
          | "conversion-engineering"
          | "speed-audit"
          | undefined);

      return {
        lead,
        cleanMessage,
        adAttribution,
        isAdLead,
        leadType: inferredType,
      };
    })
    .filter((item) => item.isAdLead);

  const countByType = {
    "mvp-rescue": enrichedAdLeads.filter((i) => i.leadType === "mvp-rescue")
      .length,
    "conversion-engineering": enrichedAdLeads.filter(
      (i) => i.leadType === "conversion-engineering",
    ).length,
    "speed-audit": enrichedAdLeads.filter((i) => i.leadType === "speed-audit")
      .length,
  };

  const withGclidCount = enrichedAdLeads.filter((i) =>
    Boolean(i.adAttribution?.gclid),
  ).length;

  const filteredAdLeads = enrichedAdLeads.filter((item) => {
    if (leadTypeFilter !== "all" && item.leadType !== leadTypeFilter) {
      return false;
    }
    if (gclidFilter === "with_gclid" && !item.adAttribution?.gclid) {
      return false;
    }
    if (searchQuery) {
      const hay = [
        item.lead.email,
        item.lead.name,
        item.lead.product_link,
        item.adAttribution?.gclid,
        item.adAttribution?.utm_campaign,
        item.adAttribution?.utm_term,
        item.adAttribution?.utm_adgroup,
        item.adAttribution?.visitor_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    return true;
  });

  const renderFormHighlights = (attr: ParsedAdAttributionMeta | null) => {
    if (!attr?.form_fields) return null;
    const f = attr.form_fields;
    const pills: string[] = [];
    if (f.current_stack) pills.push(`Stack: ${f.current_stack}`);
    if (f.built_by) pills.push(`Built: ${f.built_by}`);
    if (f.current_stage) pills.push(`Stage: ${f.current_stage}`);
    if (f.biggest_leak) pills.push(`Leak: ${f.biggest_leak}`);
    if (f.primary_stack) pills.push(`Stack: ${f.primary_stack}`);
    if (f.main_goal) pills.push(`Goal: ${f.main_goal}`);
    return pills;
  };

  return (
    <AdminShell admin={admin}>
      {/* Top Header + Quick Links to Live Ad Landing Pages */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-center">
        <div>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
            02 / Google Ads Attribution &amp; Funnels
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f4f0ea]">
            Google Ads Landing Pages &amp; Captured Leads
          </h1>
          <p className="mt-1 text-xs text-[#a09c94]">
            Tracks <code className="text-[#e89b3c]">gclid</code>,{" "}
            <code className="text-[#e89b3c]">utm_term</code>,{" "}
            <code className="text-[#e89b3c]">st_visitor_id</code>,{" "}
            <code className="text-[#e89b3c]">st_journey</code>, and route-specific
            diagnostic answers across all 3 paid acquisition funnels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/admin/leads/export"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-[#101014] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
          >
            Export Full CSV
          </a>
        </div>
      </div>

      {fetchError && (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          Database notice: {fetchError}
        </div>
      )}

      {/* 3 Ad Landing Page Cards + GCLID Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          Object.keys(AD_ROUTE_META) as Array<keyof typeof AD_ROUTE_META>
        ).map((key) => {
          const meta = AD_ROUTE_META[key];
          const count = countByType[key];
          return (
            <div
              key={key}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#101014] p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 font-mono-label text-[9.5px] font-semibold uppercase tracking-[0.14em] ${meta.badgeClass}`}
                  >
                    {meta.label}
                  </span>
                  <Link
                    href={meta.path}
                    target="_blank"
                    className="font-mono-label text-[10px] text-[#a09c94] hover:text-[#e89b3c]"
                  >
                    {meta.path} ↗
                  </Link>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#f4f0ea]">
                    {count}
                  </span>
                  <span className="text-xs text-[#a09c94]">
                    {count === 1 ? "ad lead" : "ad leads"}
                  </span>
                </div>
              </div>
              <p className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] text-[#66635c]">
                {meta.desc}
              </p>
            </div>
          );
        })}

        <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#101014] p-4">
          <div>
            <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
              Verified GCLID Clicks
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[#10b981]">
                {withGclidCount}
              </span>
              <span className="text-xs text-[#a09c94]">
                of {enrichedAdLeads.length} total ad leads
              </span>
            </div>
          </div>
          <p className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] text-[#66635c]">
            GTM Event: <code className="text-[#a09c94]">steward_lead_submitted</code>
          </p>
        </div>
      </div>

      {/* Filters */}
      <form
        method="GET"
        action="/admin/campaigns"
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-white/[0.08] bg-[#101014] p-4 sm:grid-cols-4"
      >
        <div className="sm:col-span-2">
          <label
            htmlFor="ad-q"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Search Email, URL, GCLID, Keyword (utm_term), or Campaign
          </label>
          <input
            id="ad-q"
            name="q"
            type="search"
            defaultValue={params.q ?? ""}
            placeholder="e.g. gclid, fix broken mvp, founder@..."
            className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="ad-lead-type"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            Landing Page Funnel
          </label>
          <select
            id="ad-lead-type"
            name="lead_type"
            defaultValue={leadTypeFilter}
            className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
          >
            <option value="all">All 3 Ad Landing Pages</option>
            <option value="mvp-rescue">/mvp-rescue</option>
            <option value="conversion-engineering">/conversion-engineering</option>
            <option value="speed-audit">/speed-audit</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ad-gclid"
            className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
          >
            GCLID Filter
          </label>
          <div className="mt-1 flex items-center gap-2">
            <select
              id="ad-gclid"
              name="gclid"
              defaultValue={gclidFilter}
              className="w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
            >
              <option value="all">All Ad Submissions</option>
              <option value="with_gclid">Has GCLID Only</option>
            </select>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-lg bg-[#e89b3c] px-3.5 py-2 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c]"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* Captured Google Ads Leads & Attribution Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014]">
        {filteredAdLeads.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#a09c94]">
              No Google Ads Landing Page Leads Captured Yet
            </p>
            <p className="mt-1.5 text-xs text-[#66635c]">
              Submissions from{" "}
              <Link href="/mvp-rescue" className="text-[#e89b3c] underline">
                /mvp-rescue
              </Link>
              ,{" "}
              <Link
                href="/conversion-engineering"
                className="text-[#e89b3c] underline"
              >
                /conversion-engineering
              </Link>
              , and{" "}
              <Link href="/speed-audit" className="text-[#e89b3c] underline">
                /speed-audit
              </Link>{" "}
              will appear here with their full GCLID, keyword, and session journey.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
                  <th className="px-4 py-3.5">Funnel (`lead_type`)</th>
                  <th className="px-4 py-3.5">Founder Email &amp; URL</th>
                  <th className="px-4 py-3.5">Route Answers</th>
                  <th className="px-4 py-3.5">GCLID &amp; Search Term</th>
                  <th className="px-4 py-3.5">Session Journey (`st_journey`)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredAdLeads.map(({ lead, adAttribution, leadType }) => {
                  const needsReply = isNeedsReply(lead);
                  const statusMeta =
                    LEAD_STATUS_META[lead.status] ?? LEAD_STATUS_META.new;
                  const routeMeta =
                    (leadType && AD_ROUTE_META[leadType]) ||
                    AD_ROUTE_META["mvp-rescue"];
                  const answerPills = renderFormHighlights(adAttribution);

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors hover:bg-white/[0.03] ${
                        needsReply ? "bg-red-500/[0.04]" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 align-top">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] ${routeMeta.badgeClass}`}
                        >
                          /{leadType || "ad-lead"}
                        </span>
                        {adAttribution?.visitor_id && (
                          <span className="mt-1 block font-mono-label text-[10px] text-[#66635c]">
                            VID: {adAttribution.visitor_id.slice(0, 8)}…
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium text-[#f4f0ea] hover:text-[#e89b3c] hover:underline"
                        >
                          {lead.email}
                        </Link>
                        {lead.product_link && (
                          <a
                            href={
                              lead.product_link.startsWith("http")
                                ? lead.product_link
                                : `https://${lead.product_link}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 block max-w-[220px] truncate font-mono-label text-[11px] text-[#e89b3c] hover:underline"
                          >
                            {lead.product_link}
                          </a>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-wrap gap-1">
                          {answerPills && answerPills.length > 0 ? (
                            answerPills.map((pill) => (
                              <span
                                key={pill}
                                className="inline-flex rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono-label text-[10px] text-[#f4f0ea]"
                              >
                                {pill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#66635c]">—</span>
                          )}
                        </div>
                        {adAttribution?.form_fields?.breaking_right_now && (
                          <p className="mt-1.5 line-clamp-2 max-w-[260px] text-xs text-[#a09c94]">
                            “{adAttribution.form_fields.breaking_right_now}”
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top font-mono-label text-xs">
                        {adAttribution?.gclid ? (
                          <span className="inline-flex items-center gap-1 rounded bg-[#10b981]/15 px-2 py-0.5 text-[10px] font-semibold text-[#10b981]">
                            GCLID: {adAttribution.gclid}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#66635c]">
                            No GCLID
                          </span>
                        )}
                        {adAttribution?.utm_term && (
                          <span className="mt-1 block text-[11px] text-[#f4f0ea]">
                            Term: &ldquo;{adAttribution.utm_term}&rdquo;
                          </span>
                        )}
                        {(adAttribution?.utm_campaign ||
                          lead.utm_campaign) && (
                          <span className="mt-0.5 block text-[10px] text-[#a09c94]">
                            Camp:{" "}
                            {adAttribution?.utm_campaign || lead.utm_campaign}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="flex max-w-[240px] flex-wrap items-center gap-1 font-mono-label text-[10px] text-[#a09c94]">
                          {(adAttribution?.pages_visited?.length
                            ? adAttribution.pages_visited
                            : [lead.source_page || `/${leadType}`]
                          ).map((p, idx, arr) => (
                            <React.Fragment key={`${p}-${idx}`}>
                              <span className="rounded border border-white/[0.08] bg-[#0a0a0d] px-1.5 py-0.5 text-[#f4f0ea]">
                                {p}
                              </span>
                              {idx < arr.length - 1 && (
                                <span className="text-[#e89b3c]">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 align-top">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-right align-top font-mono-label text-xs text-[#a09c94]">
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
