import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { LEAD_COPY } from "@/config/leadCopy";

export const metadata: Metadata = {
  title: "Privacy Policy | Steward",
  description: LEAD_COPY.privacyPage.intro,
};

export default function PrivacyPage() {
  const { eyebrow, headline, lastUpdated, intro, sections } =
    LEAD_COPY.privacyPage;

  return (
    <main className="min-h-screen bg-[var(--bg-stage)] px-6 py-20 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c]"
        >
          <span>←</span>
          <span>Back to Steward</span>
        </Link>

        <div className="mt-10">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[#e89b3c]">
              {eyebrow}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {headline}
          </h1>

          <p className="mt-2 font-mono-label text-xs text-[var(--text-muted)]">
            Last updated: {lastUpdated}
          </p>

          <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)]">
            {intro}
          </p>
        </div>

        <div className="mt-10 space-y-8 border-t border-[var(--border-hairline)] pt-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-5">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[#e89b3c]">
            Data Deletion Requests
          </p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Email{" "}
            <a
              href="mailto:connect@hellosteward.agency?subject=Data%20Deletion%20Request"
              className="font-mono-label text-xs text-[var(--text-primary)] underline decoration-[#e89b3c] underline-offset-4 hover:text-[#e89b3c]"
            >
              connect@hellosteward.agency
            </a>{" "}
            anytime to request a copy or permanent deletion of your data.
          </p>
        </div>
      </div>
    </main>
  );
}
