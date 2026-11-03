import type { LeadAssignee, LeadStatus } from "@/app/admin/leads/actions";

export interface LeadRecord {
  id: string;
  created_at: string;
  intent: "audit" | "conversation";
  name: string;
  email: string;
  product_link: string | null;
  stage: "Idea" | "Live product" | "Not sure" | null;
  message: string;
  source_button: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  status: LeadStatus;
  assigned_to: LeadAssignee;
}

export interface LeadNoteRecord {
  id: string;
  lead_id: string;
  author: "Ashish" | "Ruchi";
  body: string;
  created_at: string;
}

export interface LeadEventRecord {
  id: string;
  lead_id: string;
  type: "status_change" | "note" | "email_sent";
  metadata: Record<string, unknown>;
  created_at: string;
}

export const LEAD_STATUS_META: Record<
  LeadStatus,
  { label: string; badgeClass: string }
> = {
  new: {
    label: "New",
    badgeClass:
      "border-[#e89b3c]/40 bg-[#e89b3c]/15 text-[#e89b3c]",
  },
  replied: {
    label: "Replied",
    badgeClass:
      "border-sky-400/35 bg-sky-400/10 text-sky-300",
  },
  audit_sent: {
    label: "Audit sent",
    badgeClass:
      "border-purple-400/35 bg-purple-400/10 text-purple-300",
  },
  call_booked: {
    label: "Call booked",
    badgeClass:
      "border-indigo-400/35 bg-indigo-400/10 text-indigo-300",
  },
  won: {
    label: "Won",
    badgeClass:
      "border-[#10b981]/40 bg-[#10b981]/15 text-[#10b981]",
  },
  lost: {
    label: "Lost",
    badgeClass:
      "border-white/[0.1] bg-white/[0.04] text-[#66635c]",
  },
};

export function isNeedsReply(lead: Pick<LeadRecord, "status" | "created_at">): boolean {
  if (lead.status !== "new") return false;
  const createdMs = new Date(lead.created_at).getTime();
  if (Number.isNaN(createdMs)) return false;
  const ageHours = (Date.now() - createdMs) / (1000 * 60 * 60);
  return ageHours >= 24;
}

export function formatLeadAge(isoDate: string): string {
  const createdMs = new Date(isoDate).getTime();
  if (Number.isNaN(createdMs)) return "—";
  const diffSec = Math.max(0, Math.floor((Date.now() - createdMs) / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export function formatLeadSource(
  lead: Pick<LeadRecord, "source_button" | "utm_source">
): string {
  const btn = lead.source_button?.trim() || "direct";
  const utm = lead.utm_source?.trim();
  return utm ? `${btn} (${utm})` : btn;
}

/**
 * Deterministic date+time formatter that produces identical output on Node SSR and browser.
 */
export function formatDateTimeStable(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(d);
}

