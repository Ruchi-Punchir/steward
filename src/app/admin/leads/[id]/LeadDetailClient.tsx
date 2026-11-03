"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addLeadNoteAction,
  deleteLeadAction,
  updateLeadAssigneeAction,
  updateLeadStatusAction,
  type LeadAssignee,
  type LeadStatus,
} from "@/app/admin/leads/actions";
import {
  formatDateTimeStable,
  LEAD_STATUS_META,
  type LeadEventRecord,
  type LeadNoteRecord,
  type LeadRecord,
} from "@/lib/leads/format";

interface LeadDetailClientProps {
  lead: LeadRecord;
  notes: LeadNoteRecord[];
  events: LeadEventRecord[];
  currentAdminName: "Ashish" | "Ruchi";
}

export default function LeadDetailClient({
  lead,
  notes,
  events,
  currentAdminName,
}: LeadDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [assignedTo, setAssignedTo] = useState<LeadAssignee>(lead.assigned_to);
  const [noteBody, setNoteBody] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    setFeedback(null);
    startTransition(async () => {
      const res = await updateLeadStatusAction(lead.id, newStatus);
      if (!res.success) {
        setFeedback({
          type: "err",
          text: res.error ?? "Failed to update status.",
        });
      } else {
        setFeedback({
          type: "ok",
          text: `Status updated to "${LEAD_STATUS_META[newStatus].label}".`,
        });
        router.refresh();
      }
    });
  };

  const handleAssigneeChange = (val: string) => {
    const nextAssignee: LeadAssignee =
      val === "Ashish" || val === "Ruchi" ? val : null;
    setAssignedTo(nextAssignee);
    setFeedback(null);
    startTransition(async () => {
      const res = await updateLeadAssigneeAction(lead.id, nextAssignee);
      if (!res.success) {
        setFeedback({
          type: "err",
          text: res.error ?? "Failed to update assignee.",
        });
      } else {
        setFeedback({
          type: "ok",
          text: nextAssignee
            ? `Assigned to ${nextAssignee}.`
            : "Unassigned lead.",
        });
        router.refresh();
      }
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setFeedback(null);

    startTransition(async () => {
      const res = await addLeadNoteAction(lead.id, noteBody);
      if (!res.success) {
        setFeedback({
          type: "err",
          text: res.error ?? "Could not save note.",
        });
      } else {
        setNoteBody("");
        setFeedback({ type: "ok", text: "Note added." });
        router.refresh();
      }
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setFeedback(null);
    const res = await deleteLeadAction(lead.id);
    if (!res.success) {
      setIsDeleting(false);
      setFeedback({
        type: "err",
        text: res.error ?? "Could not delete lead.",
      });
      return;
    }
    router.push("/admin/leads");
    router.refresh();
  };

  const replySubject = encodeURIComponent(
    lead.intent === "audit"
      ? `Your Steward Audit (${lead.name})`
      : `Steward — Following up on your note`
  );
  const replyBody = encodeURIComponent(
    `Hi ${lead.name},\n\nThanks for reaching out to Steward.\n\n— ${currentAdminName}`
  );
  const mailtoHref = `mailto:${lead.email}?subject=${replySubject}&body=${replyBody}`;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left 7 columns: All Lead Fields + Notes */}
      <div className="space-y-6 lg:col-span-7">
        {/* Core Lead Details Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#e89b3c]">
                Lead Submission ({lead.intent})
              </span>
              <h2 className="mt-1 text-xl font-semibold text-[#f4f0ea]">
                {lead.name}
              </h2>
              <p className="text-sm text-[#a09c94]">{lead.email}</p>
            </div>

            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#e89b3c] px-4 py-2 font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c]"
            >
              Reply by email ↗
            </a>
          </div>

          {/* Message / What feels stuck? */}
          <div className="mt-5">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
              {lead.intent === "audit" ? "What feels stuck?" : "Message"}
            </span>
            <div className="mt-2 whitespace-pre-wrap rounded-lg border border-white/[0.07] bg-[#0a0a0d] p-4 text-sm leading-relaxed text-[#f4f0ea]">
              {lead.message}
            </div>
          </div>

          {/* All Fields Grid */}
          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-5 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Product Link
              </dt>
              <dd className="mt-1 break-all text-[#f4f0ea]">
                {lead.product_link ? (
                  <a
                    href={
                      lead.product_link.startsWith("http")
                        ? lead.product_link
                        : `https://${lead.product_link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e89b3c] underline underline-offset-4 hover:text-[#f2aa4c]"
                  >
                    {lead.product_link}
                  </a>
                ) : (
                  <span className="text-[#66635c]">—</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Stage
              </dt>
              <dd className="mt-1 text-[#f4f0ea]">
                {lead.stage ?? <span className="text-[#66635c]">—</span>}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Source Button
              </dt>
              <dd className="mt-1 font-mono-label text-[#f4f0ea]">
                {lead.source_button || "—"}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Source Page
              </dt>
              <dd className="mt-1 font-mono-label text-[#f4f0ea]">
                {lead.source_page || "—"}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                UTM Source / Medium / Campaign
              </dt>
              <dd className="mt-1 font-mono-label text-[#a09c94]">
                {[lead.utm_source, lead.utm_medium, lead.utm_campaign]
                  .filter(Boolean)
                  .join(" / ") || "—"}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                First Landing Referrer
              </dt>
              <dd className="mt-1 break-all font-mono-label text-[#a09c94]">
                {lead.referrer || "—"}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Submitted At
              </dt>
              <dd className="mt-1 font-mono-label text-[#a09c94]">
                {formatDateTimeStable(lead.created_at)}
              </dd>
            </div>

            <div>
              <dt className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Lead ID
              </dt>
              <dd className="mt-1 font-mono-label text-[11px] text-[#66635c]">
                {lead.id}
              </dd>
            </div>
          </dl>
        </div>

        {/* Internal Notes Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-6">
          <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
            Notes ({notes.length})
          </h3>

          <form onSubmit={handleAddNote} className="mt-4 space-y-3">
            <textarea
              rows={3}
              maxLength={2000}
              disabled={isPending}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder={`Add a note as ${currentAdminName}...`}
              className="w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] p-3 text-sm text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending || !noteBody.trim()}
                className="cursor-pointer rounded-lg bg-[#e89b3c] px-4 py-2 font-mono-label text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Add Note"}
              </button>
            </div>
          </form>

          {notes.length > 0 && (
            <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-white/[0.06] bg-[#0a0a0d] p-3.5"
                >
                  <div className="flex items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                    <span className="text-[#e89b3c]">{n.author}</span>
                    <span>{formatDateTimeStable(n.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#f4f0ea]">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right 5 columns: Status & Assignment Controls + Simple History + Permanent Delete */}
      <div className="space-y-6 lg:col-span-5">
        {/* Status & Assignment Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-6">
          <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
            Status &amp; Assignment
          </h3>

          {feedback && (
            <div
              className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                feedback.type === "ok"
                  ? "border-[#10b981]/35 bg-[#10b981]/10 text-[#10b981]"
                  : "border-red-500/35 bg-red-500/10 text-red-300"
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="lead-detail-status"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Status
              </label>
              <select
                id="lead-detail-status"
                disabled={isPending}
                value={status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as LeadStatus)
                }
                className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0a0a0d] px-3.5 py-2.5 text-sm text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
              >
                {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {LEAD_STATUS_META[st].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lead-detail-assignee"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Assigned To
              </label>
              <select
                id="lead-detail-assignee"
                disabled={isPending}
                value={assignedTo ?? ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0a0a0d] px-3.5 py-2.5 text-sm text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
              >
                <option value="">Unassigned</option>
                <option value="Ashish">Ashish</option>
                <option value="Ruchi">Ruchi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simple History Log (lead_events) */}
        <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-6">
          <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
            History
          </h3>

          <ol className="mt-4 space-y-3 text-xs">
            {events.map((ev) => {
              let description = "";
              const meta = ev.metadata ?? {};
              if (ev.type === "status_change") {
                const actor =
                  typeof meta.actor === "string" ? meta.actor : "Admin";
                const from = typeof meta.from === "string" ? meta.from : "—";
                const to = typeof meta.to === "string" ? meta.to : "—";
                description = `${actor} changed status from "${from}" to "${to}"`;
              } else if (ev.type === "note") {
                const author =
                  typeof meta.author === "string" ? meta.author : "Admin";
                description = `${author} added a note`;
              } else if (ev.type === "email_sent") {
                description = "Automated notification & confirmation emails sent";
              }

              return (
                <li
                  key={ev.id}
                  className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-2.5 text-[#a09c94]"
                >
                  <span>{description}</span>
                  <span className="shrink-0 font-mono-label text-[10px] text-[#66635c]">
                    {formatDateTimeStable(ev.created_at)}
                  </span>
                </li>
              );
            })}

            <li className="flex items-start justify-between gap-3 text-[#a09c94]">
              <span>
                Lead captured via{" "}
                <strong className="text-[#f4f0ea]">
                  {lead.source_button || lead.intent}
                </strong>
              </span>
              <span className="shrink-0 font-mono-label text-[10px] text-[#66635c]">
                {formatDateTimeStable(lead.created_at)}
              </span>
            </li>
          </ol>
        </div>

        {/* Permanent Delete with Confirmation Step */}
        <div className="rounded-xl border border-red-500/20 bg-[#101014] p-6">
          <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-red-300">
            Danger Zone
          </h3>
          <p className="mt-1.5 text-xs text-[#66635c]">
            Permanently remove this lead, its notes, and history from the
            database. This cannot be undone.
          </p>

          {!confirmDeleteOpen ? (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="mt-4 cursor-pointer rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-red-300 transition-colors hover:bg-red-500/20"
            >
              Delete lead...
            </button>
          ) : (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3.5">
              <p className="text-xs font-medium text-red-200">
                Are you sure you want to permanently delete {lead.name} (
                {lead.email})?
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="cursor-pointer rounded bg-red-500 px-3 py-1.5 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, permanently delete"}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="cursor-pointer rounded border border-white/[0.15] px-3 py-1.5 font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-[#a09c94] hover:text-[#f4f0ea]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
