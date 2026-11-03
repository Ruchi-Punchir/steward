"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface FooterProps {
  onAuditClick?: (sourceButton?: string) => void;
}

export default function Footer({ onAuditClick }: FooterProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className={`relative z-40 w-full overflow-hidden border-t transition-colors duration-300 ${
        isLight
          ? "border-black/10 bg-[#ede8de] text-[#121216]"
          : "border-white/[0.08] bg-[#060608] text-[#f4f0ea]"
      }`}
    >
      {/* Subtle top ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-32 h-[320px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.08)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1560px] px-6 pt-16 pb-10 sm:px-10 sm:pt-20 sm:pb-12 lg:px-16 xl:px-24">
        {/* TOP GRID: Brand Statement + Navigation Columns + Direct Line */}
        <div className="grid grid-cols-1 gap-12 pb-14 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN (Cols 1-5): Brand Identity & Positioning */}
          <div className="flex flex-col items-start justify-between lg:col-span-5">
            <div>
              <Link
                href="/"
                className="group inline-flex items-center text-[var(--text-primary)] transition-opacity hover:opacity-80"
              >
                <span className="flex flex-col items-start leading-none">
                  <span className="font-mono-label text-[8.5px] font-medium uppercase tracking-[0.32em] text-[#e89b3c]">
                    Hello
                  </span>
                  <span className="mt-0.5 text-sm font-semibold tracking-[0.26em] text-[var(--text-primary)]">
                    STEWARD
                  </span>
                </span>
              </Link>

              <p className="mt-5 max-w-md text-lg font-medium leading-[1.45] tracking-[-0.02em] text-[var(--text-primary)] sm:text-xl">
                Product and{" "}
                <span className="font-serif-editorial text-[1.08em] font-normal italic text-[#e89b3c]">
                  Growth Partners
                </span>
              </p>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                Steward is a founder-led product and growth partner. No account
                managers, just the people accountable for your result, finding
                the leaks and scaling what sells. Revenue is the only metric we
                care about.
              </p>
            </div>
          </div>

          {/* MIDDLE COLUMNS (Cols 6-9): Services & Connect */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:col-start-6">
            {/* Services */}
            <div className="flex flex-col space-y-3">
              <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                Services
              </span>
              <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                <li>Product and engineering</li>
                <li>Design</li>
                <li>Growth marketing</li>
                <li>Pricing and conversion</li>
              </ul>
            </div>

            {/* Connect */}
            <div className="flex flex-col space-y-3">
              <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                Connect
              </span>
              <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                <li>
                  <a
                    href="mailto:connect@hellosteward.agency"
                    className="transition-colors hover:text-[var(--text-primary)]"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN (Cols 10-12): Direct Audit Card */}
          <div className="flex flex-col justify-between lg:col-span-3">
            <div
              className={`flex flex-col justify-between rounded-2xl border p-5 ${
                isLight
                  ? "border-black/10 bg-[#f6f3ec] shadow-[0_12px_30px_rgba(20,20,19,0.05)]"
                  : "border-white/[0.08] bg-[#0d0d12] shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[9.5px] uppercase tracking-[0.2em] text-[#e89b3c]">
                    Direct Line
                  </span>
                  <span className="font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[#10b981]">
                    ● Online
                  </span>
                </div>

                <p className="mt-2.5 text-sm font-medium leading-snug text-[var(--text-primary)]">
                  Ready to find where your funnel is leaking revenue?
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  data-cta-source="footer"
                  onClick={(e) =>
                    onAuditClick?.(
                      e.currentTarget.getAttribute("data-cta-source") ??
                        "footer"
                    )
                  }
                  className="w-full cursor-pointer rounded-full bg-[#e89b3c] px-5 py-2.5 font-mono-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#08080a] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98]"
                >
                  Get a free audit →
                </button>
                <a
                  href="mailto:connect@hellosteward.agency"
                  className="text-center font-mono-label text-[11px] tracking-[0.06em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c]"
                >
                  connect@hellosteward.agency
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ARCHITECTURAL OVERSIZED WORDMARK: Single-line HELLO STEWARD */}
        <div
          aria-hidden="true"
          className={`select-none border-y py-6 text-center sm:py-8 ${
            isLight ? "border-black/10" : "border-white/[0.07]"
          }`}
        >
          <span
            className={`block whitespace-nowrap font-semibold leading-[0.86] tracking-[-0.05em] text-[10vw] sm:text-[9.2vw] lg:text-[8.4vw] ${
              isLight
                ? "bg-gradient-to-b from-[#121216]/18 to-[#121216]/[0.04] bg-clip-text text-transparent"
                : "bg-gradient-to-b from-white/18 to-white/[0.03] bg-clip-text text-transparent"
            }`}
          >
            HELLO STEWARD
          </span>
        </div>

        {/* BOTTOM BAR: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3 font-mono-label text-[11px] tracking-[0.12em] text-[var(--text-muted)]">
            <span>© 2026 HELLO STEWARD</span>
            <span aria-hidden="true">•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            className="group inline-flex cursor-pointer items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c]"
          >
            <span>Back to top</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current/25 transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
