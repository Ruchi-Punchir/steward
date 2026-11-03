import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import type { LeadIntent } from "@/config/leadCopy";
import { LeadFormContent } from "@/components/leads/LeadCaptureModal";

export const metadata: Metadata = {
  title: "Contact & Free Audit | Steward",
  description:
    "Request a free product and revenue audit or start a conversation directly with Ashish and Ruchi.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; source?: string }>;
}) {
  const params = await searchParams;
  const intent: LeadIntent =
    params.intent === "conversation" ? "conversation" : "audit";
  const sourceButton = params.source?.trim() || `contact-page-${intent}`;

  return (
    <main className="min-h-screen bg-[var(--bg-stage)] px-6 py-16 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c]"
          >
            <span>←</span>
            <span>Back to Steward</span>
          </Link>

          <div className="inline-flex rounded-full border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-1">
            <Link
              href="/contact?intent=audit"
              className={`rounded-full px-3.5 py-1 font-mono-label text-[10px] uppercase tracking-[0.16em] transition-colors ${
                intent === "audit"
                  ? "bg-[#e89b3c] font-semibold text-[#08080a]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Free Audit
            </Link>
            <Link
              href="/contact?intent=conversation"
              className={`rounded-full px-3.5 py-1 font-mono-label text-[10px] uppercase tracking-[0.16em] transition-colors ${
                intent === "conversation"
                  ? "bg-[#e89b3c] font-semibold text-[#08080a]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Conversation
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-6 shadow-2xl sm:p-8">
          <LeadFormContent
            key={intent}
            intent={intent}
            sourceButton={sourceButton}
            isStandalonePage
          />
        </div>
      </div>
    </main>
  );
}
