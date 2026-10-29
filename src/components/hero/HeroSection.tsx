"use client";

import React from "react";
import TypewriterStage from "./TypewriterStage";

interface HeroSectionProps {
  onAuditClick?: () => void;
  onConversationClick?: () => void;
}

export default function HeroSection({
  onAuditClick,
  onConversationClick,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-20 pb-10 lg:py-0"
    >
      {/* Subtle ambient glow across the full page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.09)_0%,rgba(10,10,13,0)_70%)] blur-3xl"
      />

      {/* Full-width grid with no max-w container */}
      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 px-6 sm:px-10 lg:grid-cols-12 lg:gap-6 lg:px-14 xl:px-20">
        {/* LEFT COLUMN: Headline, Subline, and Two CTAs */}
        <div className="flex flex-col items-start text-left lg:col-span-5 xl:col-span-4">
          <div className="mb-5 inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#e89b3c]"
            />
            <span className="font-mono-label text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Product, design and growth under one roof
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl xl:text-6xl 2xl:text-7xl"
          >
            Shipping is easy now.{" "}
            <span className="block text-[#e89b3c]">Selling isn&apos;t.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg xl:text-xl">
            Anyone can use AI tools and ship an app in a weekend. Code is not a
            product. A product&apos;s job is to make money. We find out why
            yours isn&apos;t earning and fix it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onAuditClick}
              className="cursor-pointer rounded-full bg-[#e89b3c] px-7 py-4 font-mono-label text-xs font-semibold uppercase tracking-wider text-[#0a0a0d] shadow-[0_0_28px_rgba(232,155,60,0.38)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] hover:shadow-[0_0_36px_rgba(232,155,60,0.5)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:text-sm"
            >
              Get a free audit
            </button>

            <button
              type="button"
              onClick={onConversationClick}
              className="cursor-pointer rounded-full bg-[var(--btn-secondary-bg)] px-7 py-4 font-mono-label text-xs font-medium uppercase tracking-wider text-[var(--text-primary)] transition-all duration-200 hover:bg-[#e89b3c] hover:text-[#0a0a0d] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:text-sm"
            >
              Start the conversation
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Larger Full-Bleed Interactive Typewriter Scene */}
        <div className="w-full lg:col-span-7 xl:col-span-8">
          <TypewriterStage />
        </div>
      </div>
    </section>
  );
}
