"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";

export const AUDIT_SUBMISSION_STORAGE_KEY = "steward_last_audit_submission";
export const TALK_SUBMISSION_STORAGE_KEY = "steward_last_talk_submission";

export interface StoredAuditSubmission {
  name?: string;
  email?: string;
  productLink?: string;
  stage?: string;
  selectedUnits?: string[];
  submittedAt?: string;
}

export interface StoredTalkSubmission {
  name?: string;
  email?: string;
  selectedTopic?: string;
  submittedAt?: string;
}

/**
 * =============================================================================
 * 1. AUDIT THANK-YOU PAGE (/audit/thank-you)
 * =============================================================================
 */
export function AuditThankYouPageClient() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [submission, setSubmission] = useState<StoredAuditSubmission | null>(
    null,
  );
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(AUDIT_SUBMISSION_STORAGE_KEY);
      if (raw) {
        setSubmission(JSON.parse(raw) as StoredAuditSubmission);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const firstName = submission?.name?.trim().split(/\s+/)[0] || "";
  const refPrefix =
    submission?.name
      ?.trim()
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase() || "STW";

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("connect@hellosteward.agency")
        .catch(() => {});
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="relative overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32">
        {/* Ambient Architectural Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[12%] top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.08)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[10%] bottom-12 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.07)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 sm:px-8 lg:px-16 xl:px-24">
          {/* Top Status Strip */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4 sm:mb-10 lg:mb-14 lg:pb-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[#10b981] sm:text-[11px]">
                01 / Diagnostic Teardown · Request Confirmed
              </span>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c] sm:text-[11px]"
            >
              <span>←</span>
              <span>Back to Homepage</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            {/* LEFT 7 COLS: Confirmation Statement & Primary Homepage CTA */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-4 py-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
                <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#10b981] sm:text-[11px]">
                  Diagnostic Queued · #{refPrefix}-05
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.65rem]">
                {firstName
                  ? `Thanks, ${firstName}. We’ve got your audit request.`
                  : "We’ve got your audit request."}{" "}
                <span className="font-serif-editorial mt-1 block text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c]">
                  Now we inspect the leaks.
                </span>
              </h1>

              <p className="mt-5 max-w-[600px] text-base leading-[1.7] text-[var(--text-secondary)] sm:text-lg">
                We’ve logged your details and queued your product for a 5-unit
                teardown. Our team will inspect your funnel, positioning, and
                onboarding flows to isolate what is costing you conversions—and
                reach out to{" "}
                {submission?.email ? (
                  <strong className="font-medium text-[var(--text-primary)]">
                    {submission.email}
                  </strong>
                ) : (
                  "your inbox"
                )}{" "}
                if we need anything else.
              </p>

              {/* Primary CTA to Visit Website Again (Homepage) in Same Tab */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#e89b3c] px-8 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] shadow-[0_10px_30px_rgba(232,155,60,0.3)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  <span>Visit Website Again</span>
                </Link>

                <Link
                  href="/talk"
                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-4 font-mono-label text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                    isLight
                      ? "border-black/15 text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                      : "border-white/15 text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                  }`}
                >
                  <span>Talk to us directly</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* RIGHT 5 COLS: Diagnostic Summary & Direct Founder Line Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-2xl border p-6 sm:p-7 ${
                  isLight
                    ? "border-black/10 bg-[#f6f3ec] shadow-[0_16px_40px_rgba(20,20,19,0.06)]"
                    : "border-white/[0.08] bg-[#101015] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
                  <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                    Teardown Dossier
                  </span>
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#10b981]">
                    ● In Review Queue
                  </span>
                </div>

                {submission &&
                (submission.productLink ||
                  submission.stage ||
                  (submission.selectedUnits &&
                    submission.selectedUnits.length > 0)) ? (
                  <dl className="mt-4 divide-y divide-[var(--border-hairline)] text-sm">
                    {submission.productLink && (
                      <div className="py-3 first:pt-0">
                        <dt className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Product Link
                        </dt>
                        <dd className="mt-1 truncate font-medium text-[var(--text-primary)]">
                          {submission.productLink}
                        </dd>
                      </div>
                    )}
                    {submission.stage && (
                      <div className="py-3">
                        <dt className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Current Stage
                        </dt>
                        <dd className="mt-1 font-medium text-[var(--text-primary)]">
                          {submission.stage}
                        </dd>
                      </div>
                    )}
                    {submission.selectedUnits &&
                      submission.selectedUnits.length > 0 && (
                        <div className="py-3 last:pb-0">
                          <dt className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                            Priority Units Selected
                          </dt>
                          <dd className="mt-2 flex flex-wrap gap-1.5">
                            {submission.selectedUnits.map((unit) => (
                              <span
                                key={unit}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#e89b3c]/35 bg-[#e89b3c]/10 px-2.5 py-0.5 font-mono-label text-[10px] text-[var(--text-primary)]"
                              >
                                <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                                {unit}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Every audit request is reviewed directly by our senior
                    product and growth engineers—never automated scrapers or
                    junior account reps.
                  </p>
                )}

                <div className="mt-5 border-t border-[var(--border-hairline)] pt-4">
                  <span className="block font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Want to share extra context or metrics?
                  </span>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="mailto:connect@hellosteward.agency"
                      className="font-mono-label text-xs font-medium text-[var(--text-primary)] underline decoration-[#e89b3c] underline-offset-4 transition-colors hover:text-[#e89b3c]"
                    >
                      connect@hellosteward.agency
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="cursor-pointer rounded-full border border-[var(--border-hairline)] px-2.5 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
                    >
                      {copiedEmail ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Roadmap Grid */}
          <div className="mt-14 border-t border-[var(--border-hairline)] pt-10 lg:mt-20 lg:pt-12">
            <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
              What Happens Next
            </span>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                  Step 01 · Inspection
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  5-Unit Funnel &amp; UX Teardown
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  We walk through your live acquisition funnel, value
                  proposition, onboarding flow, and pricing tiers as a real
                  buyer would.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                  Step 02 · Diagnosis
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  Prioritized Leak Breakdown
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  We pinpoint the exact drop-off points costing you signups or
                  paid conversions and rank the highest-leverage fixes.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10b981]">
                  Step 03 · Delivery
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  Actionable Findings, Zero Strings
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  We send over our findings and reach out if we need any extra
                  context. You keep everything we find.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * =============================================================================
 * 2. TALK THANK-YOU PAGE (/talk/thank-you)
 * =============================================================================
 */
export function TalkThankYouPageClient() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [submission, setSubmission] = useState<StoredTalkSubmission | null>(
    null,
  );
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(TALK_SUBMISSION_STORAGE_KEY);
      if (raw) {
        setSubmission(JSON.parse(raw) as StoredTalkSubmission);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const firstName = submission?.name?.trim().split(/\s+/)[0] || "";

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("connect@hellosteward.agency")
        .catch(() => {});
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="relative overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32">
        {/* Ambient Emerald + Warm Gold Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-20 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] bottom-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.07)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 sm:px-8 lg:px-16 xl:px-24">
          {/* Top Status Strip */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4 sm:mb-10 lg:mb-14 lg:pb-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[#10b981] sm:text-[11px]">
                Direct Line · Message Received
              </span>
            </div>

            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c] sm:text-[11px]"
            >
              <span>←</span>
              <span>Back to Homepage</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            {/* LEFT 7 COLS: Confirmation Headline & Primary Homepage Link */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#10b981] sm:text-[11px]">
                  Note Delivered to the Builders
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.65rem]">
                {firstName
                  ? `Thanks for reaching out, ${firstName}.`
                  : "Message received."}{" "}
                <span className="font-serif-editorial mt-1 block text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c]">
                  We’ll take it from here.
                </span>
              </h1>

              <p className="mt-5 max-w-[580px] text-base leading-[1.7] text-[var(--text-secondary)] sm:text-lg">
                Your note went straight to our core product and growth team—no
                account managers and no handoffs. We’ll review what you shared
                and reply to{" "}
                {submission?.email ? (
                  <strong className="font-medium text-[var(--text-primary)]">
                    {submission.email}
                  </strong>
                ) : (
                  "your email"
                )}{" "}
                shortly.
              </p>

              {/* Primary CTA to Visit Website Again (Homepage) in Same Tab */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#e89b3c] px-8 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] shadow-[0_10px_30px_rgba(232,155,60,0.3)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  <span>Visit Website Again</span>
                </Link>

                <Link
                  href="/audit"
                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-4 font-mono-label text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                    isLight
                      ? "border-black/15 text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                      : "border-white/15 text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                  }`}
                >
                  <span>Request a Free Audit</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* RIGHT 5 COLS: Conversation Summary & Direct Email Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-2xl border p-6 sm:p-7 ${
                  isLight
                    ? "border-black/10 bg-[#f6f3ec] shadow-[0_16px_40px_rgba(20,20,19,0.06)]"
                    : "border-white/[0.08] bg-[#101015] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
                  <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                    Direct Line Status
                  </span>
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#10b981]">
                    ● Logged
                  </span>
                </div>

                {submission?.selectedTopic && (
                  <div className="mt-4 border-b border-[var(--border-hairline)] pb-4">
                    <span className="block font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Conversation Topic
                    </span>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#e89b3c]/35 bg-[#e89b3c]/10 px-3 py-1 font-mono-label text-[10.5px] font-medium text-[var(--text-primary)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                      {submission.selectedTopic}
                    </span>
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  We read every note personally. If you want to attach a deck,
                  product link, or metrics before we reply, send them directly
                  to our team inbox below.
                </p>

                <div className="mt-5 border-t border-[var(--border-hairline)] pt-4">
                  <span className="block font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Direct Team Inbox
                  </span>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="mailto:connect@hellosteward.agency"
                      className="font-mono-label text-xs font-medium text-[var(--text-primary)] underline decoration-[#e89b3c] underline-offset-4 transition-colors hover:text-[#e89b3c]"
                    >
                      connect@hellosteward.agency
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="cursor-pointer rounded-full border border-[var(--border-hairline)] px-2.5 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
                    >
                      {copiedEmail ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Direct Partnership Pillars */}
          <div className="mt-14 border-t border-[var(--border-hairline)] pt-10 lg:mt-20 lg:pt-12">
            <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
              How We Move Forward
            </span>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10b981]">
                  01 · Builder Review
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  Reviewed by Senior Operators
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  The product, growth, and engineering partners who actually do
                  the work review your note and product context first.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                  02 · Candid Reply
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  Clear Point of View
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  We’ll reply with specific thoughts on your product and where
                  we see the highest-leverage path forward.
                </p>
              </div>

              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.07] bg-[#0e0e13]"
                }`}
              >
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                  03 · Shared Outcome
                </span>
                <h2 className="mt-2 text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  One Metric, Full Ownership
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                  If there’s a strong fit, we agree on one revenue metric up
                  front and take end-to-end responsibility for moving it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
