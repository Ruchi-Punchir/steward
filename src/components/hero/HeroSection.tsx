"use client";

import React from "react";
import TypewriterStage from "./TypewriterStage";

interface HeroSectionProps {
  onAuditClick?: (sourceButton?: string) => void;
  onConversationClick?: (sourceButton?: string) => void;
  externalSpent?: number;
  externalEarned?: number;
  onSpend?: (tier: 20 | 5000 | 10000, earnedDelta?: number) => void;
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
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-20 pb-10 lg:py-0 [@media(max-height:800px)]:lg:pt-12 [@media(max-height:740px)]:lg:pt-14 [@media(max-height:740px)]:lg:pb-3"
    >
      {/* Subtle atmospheric radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.06)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
      />

      {/* Full-width editorial layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-center gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-24">
        {/* LEFT COLUMN: Editorial Headline, Subline, and Spend Cards Slot */}
        <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
          <div className="mb-4 inline-flex items-center gap-3 [@media(max-height:740px)]:mb-2">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[#e89b3c]">
              01
            </span>
            <span
              aria-hidden="true"
              className="h-px w-6 bg-[var(--text-muted)] opacity-40"
            />
            <span className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Product, strategy, design &amp; growth
            </span>
          </div>

          <h1
            id="hero-heading"
            style={{ textWrap: "balance" }}
            className="max-w-[18ch] text-balance text-[2.45rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.35rem] xl:text-[3.9rem] 2xl:text-[4.35rem] [@media(max-height:740px)]:lg:text-[2.4rem] [@media(max-height:740px)]:lg:leading-[1.04]"
          >
            Increasing your revenue is the{" "}
            <span className="font-serif-editorial mt-1 block text-[1.06em] font-normal italic tracking-[-0.01em] text-[#e89b3c]">
              only metric we care about.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base font-normal leading-[1.65] text-[var(--text-secondary)] sm:text-[17px] [@media(max-height:740px)]:mt-2.5 [@media(max-height:740px)]:text-[13.5px] [@media(max-height:740px)]:leading-[1.5]">
            We help startups uncover growth bottlenecks, identify untapped
            opportunities and build practical soutions to improve acquisition,
            conversion and retention through research, marketing expertise,
            product thinking and engineering.
          </p>

          {/* Anchor slot where the 3 Bill Cards sit in Section 1 (replaces CTAs) */}
          <div
            data-hero-cta-slot="true"
            aria-hidden="true"
            className="mt-14 hidden h-[118px] w-full lg:block [@media(max-height:740px)]:mt-5 [@media(max-height:740px)]:h-[96px]"
          />
        </div>

        {/* RIGHT COLUMN: Minimalist Award-Winning Typewriter Stage
            On desktop (lg+), the shared fixed TypewriterStage in page.tsx occupies this exact space
            so the same typewriter seamlessly transitions into Section 2 on scroll. */}
        <div className="w-full lg:col-span-6 xl:col-span-6">
          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-[580px] lg:w-full xl:h-[610px] 2xl:h-[640px] [@media(max-height:740px)]:lg:h-[470px]"
          />
        </div>
      </div>
    </section>
  );
}
