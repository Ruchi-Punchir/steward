"use client";

import React from "react";
import TypewriterStage from "./TypewriterStage";

interface HeroSectionProps {
  onAuditClick?: (sourceButton?: string) => void;
  onConversationClick?: (sourceButton?: string) => void;
  externalSpent?: number;
  externalEarned?: number;
  onSpend?: (tier: 20 | 50 | 100, earnedDelta?: number) => void;
  isTransitionLocked?: boolean;
}

export default function HeroSection({
  onAuditClick,
  onConversationClick,
  externalSpent,
  externalEarned,
  onSpend,
  isTransitionLocked,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-20 pb-10 lg:py-0"
    >
      {/* Subtle atmospheric radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.06)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
      />

      {/* Full-width editorial layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-24">
        {/* LEFT COLUMN: Editorial Headline, Subline, and Two CTAs */}
        <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[#e89b3c]">
              01
            </span>
            <span
              aria-hidden="true"
              className="h-px w-6 bg-[var(--text-muted)] opacity-40"
            />
            <span className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Product, design &amp; growth
            </span>
          </div>

          <h1
            id="hero-heading"
            style={{ textWrap: "balance" }}
            className="max-w-[16ch] text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.55rem] xl:text-[4.15rem] 2xl:text-[4.65rem]"
          >
            <span className="sm:whitespace-nowrap">
              Shipping is <span className="whitespace-nowrap">easy now.</span>
            </span>{" "}
            <span className="font-serif-editorial mt-1 block text-[1.08em] font-normal italic tracking-[-0.01em] text-[#e89b3c]">
              Selling isn&apos;t.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[17px]">
            Anyone can build and launch in a weekend. Getting paid is the hard
            part. We find out why your product isn&apos;t earning, and fix it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              data-cta-source="hero"
              onClick={(e) =>
                onAuditClick?.(
                  e.currentTarget.getAttribute("data-cta-source") ?? "hero"
                )
              }
              className="cursor-pointer rounded-full bg-[#e89b3c] px-7 py-3.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[#08080a] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Get a free audit
            </button>

            <button
              type="button"
              data-cta-source="hero"
              onClick={(e) =>
                onConversationClick?.(
                  e.currentTarget.getAttribute("data-cta-source") ?? "hero"
                )
              }
              className="cursor-pointer rounded-full border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] px-7 py-3.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-primary)] transition-all duration-200 hover:border-[#e89b3c] hover:bg-[#e89b3c] hover:text-[#08080a] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Start the conversation
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Minimalist Award-Winning Typewriter Stage
            On desktop (lg+), the shared fixed TypewriterStage in page.tsx occupies this exact space
            so the same typewriter seamlessly transitions into Section 2 on scroll. */}
        <div className="w-full lg:col-span-6 xl:col-span-6">
          <div className="lg:hidden">
            <TypewriterStage
              externalSpent={externalSpent}
              externalEarned={externalEarned}
              onSpend={onSpend}
              isTransitionLocked={isTransitionLocked}
            />
          </div>
          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-[680px] lg:w-full"
          />
        </div>
      </div>
    </section>
  );
}
