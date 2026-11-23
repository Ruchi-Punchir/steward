"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import { DollarBillGraphic } from "@/components/shared/DollarBillGraphics";

type SpendTier = 20 | 5000 | 10000;

const MobileBelowFoldSections = dynamic(
  () => import("./MobileBelowFoldSections"),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden="true" className="min-h-[260vh] w-full" />
    ),
  }
);

const MOBILE_TERMINAL_SEQUENCES: Record<
  SpendTier,
  { steps: string[]; summary: string; earned: number }[]
> = {
  20: [
    {
      steps: [
        "Added 5 analytics tools...",
        "Still don't know why users aren't buying",
      ],
      summary: "Earned +$9",
      earned: 9,
    },
    {
      steps: [
        "Upgraded to pro plans...",
        "Still paying for features nobody uses",
      ],
      summary: "Earned +$7",
      earned: 7,
    },
    {
      steps: [
        "$20 spent on session recording tools...",
        "You see users drop off, but nobody fixes UX",
      ],
      summary: "Earned +$5",
      earned: 5,
    },
  ],
  5000: [
    {
      steps: [
        "Ran a new ad campaign...",
        "Brought in free signups who never pay",
      ],
      summary: "Earned +$2,100",
      earned: 2100,
    },
    {
      steps: [
        "Pushed more traffic to the site...",
        "Confusing homepage scares buyers away",
      ],
      summary: "Earned +$1,650",
      earned: 1650,
    },
    {
      steps: [
        "Increased ad budget 2x...",
        "Cost per customer doubled, profit stayed flat",
      ],
      summary: "Earned +$1,200",
      earned: 1200,
    },
  ],
  10000: [
    {
      steps: [
        "Shipped 3 new features users asked for...",
        "Core onboarding is still broken, churn stayed high",
      ],
      summary: "Earned +$4,200",
      earned: 4200,
    },
    {
      steps: [
        "Hired devs for a full UI redesign...",
        "Looks cleaner, converts at the exact same rate",
      ],
      summary: "Earned +$3,300",
      earned: 3300,
    },
    {
      steps: [
        "$10,000 spent rebuilding the product...",
        "2 months of code shipped, revenue barely moved",
      ],
      summary: "Earned +$2,400",
      earned: 2400,
    },
  ],
};

export default function MobileStaticHome() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isBelowFoldReady, setIsBelowFoldReady] = useState<boolean>(false);
  const [spent, setSpent] = useState<number>(0);
  const [earned, setEarned] = useState<number>(0);
  const [activeTier, setActiveTier] = useState<SpendTier | null>(null);
  const [billProgress, setBillProgress] = useState<number>(32);
  const [terminalLines, setTerminalLines] = useState<{
    steps: string[];
    summary: string;
  }>({
    steps: ["business.sys ready", "awaiting spend..."],
    summary: "Tap +$20, +$5,000, or +$10K above to feed budget",
  });

  const seqCursorRef = useRef<Record<SpendTier, number>>({
    20: 0,
    5000: 0,
    10000: 0,
  });

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    if (window.scrollY > 10 || window.location.hash) {
      setIsBelowFoldReady(true);
      return;
    }

    const activate = () => {
      setIsBelowFoldReady(true);
    };

    window.addEventListener("scroll", activate, { passive: true, once: true });
    window.addEventListener("touchstart", activate, {
      passive: true,
      once: true,
    });
    window.addEventListener("pointerdown", activate, {
      passive: true,
      once: true,
    });
    window.addEventListener("wheel", activate, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("wheel", activate);
    };
  }, []);

  const handleTierClick = (tier: SpendTier) => {
    setIsBelowFoldReady(true);
    const list = MOBILE_TERMINAL_SEQUENCES[tier];
    const cursor = seqCursorRef.current[tier] % list.length;
    seqCursorRef.current[tier] += 1;
    const item = list[cursor];

    setActiveTier(tier);
    setSpent((prev) => prev + tier);
    setEarned((prev) => prev + item.earned);
    setTerminalLines({
      steps: item.steps,
      summary: item.summary,
    });
    setBillProgress((prev) => (prev >= 82 ? 36 : Math.min(86, prev + 16)));
  };

  const cardSurface = isLight
    ? "border-black/10 bg-[#eae5dc] shadow-[0_14px_34px_rgba(20,20,19,0.06)]"
    : "border-white/[0.08] bg-[#101015] shadow-[0_18px_40px_rgba(0,0,0,0.65)]";

  const innerSurface = isLight
    ? "border-black/10 bg-[#fbf9f5]"
    : "border-white/[0.08] bg-[#16161d]";

  return (
    <div className="flex w-full flex-col">
      {/* =====================================================================
          SECTION 01: HERO (STATIC MOBILE VIEW — RENDERED IN SSR FOR 0 CLS & INSTANT LCP)
      ===================================================================== */}
      <section
        id="top"
        aria-labelledby="mobile-hero-heading"
        className="relative w-full px-5 pt-24 pb-14 sm:px-10 sm:pt-28 sm:pb-16"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start text-left">
          <div className="mb-3.5 inline-flex items-center gap-2.5">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[#e89b3c]">
              01
            </span>
            <span
              aria-hidden="true"
              className="h-px w-6 bg-[var(--text-muted)] opacity-40"
            />
            <span className="font-mono-label text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Product, strategy, design &amp; growth
            </span>
          </div>

          <p
            id="mobile-hero-heading"
            className="text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl"
          >
            Increasing your revenue is the{" "}
            <span className="font-serif-editorial mt-1 block text-[1.06em] font-normal italic tracking-[-0.01em] text-[#e89b3c]">
              only metric we care about.
            </span>
          </p>

          <p className="mt-4 text-[15px] font-normal leading-[1.65] text-[var(--text-secondary)] sm:text-base">
            We help startups uncover growth bottlenecks, identify untapped
            opportunities and build practical solutions to improve acquisition,
            conversion and retention through research, marketing expertise,
            product thinking and engineering.
          </p>

          {/* Direct Hero CTAs for Mobile */}
          <div className="mt-6 flex w-full flex-wrap items-center gap-3">
            <Link
              href="/audit?source=hero"
              className="inline-flex items-center justify-center rounded-full bg-[#e89b3c] px-6 py-3 font-mono-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#08080a]"
            >
              Get a free audit →
            </Link>
            <Link
              href="/talk?source=hero"
              className={`inline-flex items-center justify-center rounded-full border px-5 py-3 font-mono-label text-[11px] font-medium uppercase tracking-[0.16em] ${
                isLight
                  ? "border-black/15 text-[#141413]"
                  : "border-white/15 text-[#f4f0ea]"
              }`}
            >
              Talk to us
            </Link>
          </div>

          {/* Static Typewriter & Spend Visual Card */}
          <div
            className={`mt-9 w-full rounded-2xl border p-4 sm:p-6 ${cardSurface}`}
          >
            {/* Clickable Spend Tier Buttons */}
            <div className="mb-4">
              <span className="mb-2 block font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Tap to feed budget into your business
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    {
                      tier: 20 as SpendTier,
                      amount: "+$20/m",
                      label: "Tools & SaaS",
                    },
                    {
                      tier: 5000 as SpendTier,
                      amount: "+$5,000/m",
                      label: "Paid Ads",
                    },
                    {
                      tier: 10000 as SpendTier,
                      amount: "+$10K/m",
                      label: "Product & Dev",
                    },
                  ] as const
                ).map((item) => {
                  const isActive = activeTier === item.tier;
                  return (
                    <button
                      key={item.tier}
                      type="button"
                      onClick={() => handleTierClick(item.tier)}
                      className={`group flex cursor-pointer flex-col rounded-xl border px-2.5 py-2.5 text-left transition-all duration-150 active:scale-[0.97] ${
                        isActive
                          ? "border-[#e89b3c] bg-[#e89b3c]/15 shadow-[0_0_16px_rgba(232,155,60,0.25)]"
                          : `${innerSurface} hover:border-[#e89b3c]/60`
                      }`}
                    >
                      <span className="font-mono-label text-xs font-semibold text-[#e89b3c] sm:text-sm">
                        {item.amount}
                      </span>
                      <span className="mt-0.5 text-[10px] leading-tight text-[var(--text-secondary)] sm:text-xs">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Static Vintage "YOUR BUSINESS" Typewriter Illustration */}
            <div className="mx-auto mt-2 flex w-full max-w-[300px] flex-col items-center">
              {/* Emerging Torn $1 Bill */}
              <div className="relative z-10 -mb-2 flex h-[86px] w-[196px] items-end justify-center overflow-hidden">
                <div
                  style={{
                    transform: `translateY(${100 - billProgress}%) rotate(-1.1deg)`,
                  }}
                  className="relative h-full w-full transition-transform duration-300 ease-out"
                >
                  <DollarBillGraphic idPrefix="mobile-static-hero-bill" />
                </div>
              </div>

              {/* Platen Roller */}
              <div className="relative z-20 mx-auto flex w-[96%] items-center justify-center">
                <div
                  className={`h-6 w-3 rounded-l-xs border-y border-l ${
                    isLight
                      ? "border-black/30 bg-[#b8b3a8]"
                      : "border-white/20 bg-[#7e7b74]"
                  }`}
                />
                <div className="h-2 w-1.5 bg-[#8a867c]" />
                <div className="relative flex h-7 flex-1 flex-col items-center justify-start rounded-xs border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12]">
                  <div className="h-1.5 w-[76%] rounded-b-full bg-black" />
                  <div className="mt-1 flex w-[76%] items-center justify-between border-t border-[#d8d4cc]/80 px-4">
                    <span className="-mt-1 h-2 w-2.5 rounded-xs bg-[#2c2b28]" />
                    <span className="-mt-1 h-2 w-2.5 rounded-xs bg-[#2c2b28]" />
                  </div>
                </div>
                <div className="h-2 w-1.5 bg-[#8a867c]" />
                <div
                  className={`h-6 w-3 rounded-r-xs border-y border-r ${
                    isLight
                      ? "border-black/30 bg-[#b8b3a8]"
                      : "border-white/20 bg-[#7e7b74]"
                  }`}
                />
              </div>

              {/* Upper Ribbon Hood */}
              <div
                className={`relative z-20 -mt-0.5 flex w-[88%] flex-col items-center rounded-t-[20px] border-x border-t px-3.5 pt-2.5 pb-1.5 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#f5f0e4] to-[#e5decb]"
                    : "border-white/15 bg-gradient-to-b from-[#2a2a33] to-[#1c1c23]"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    }`}
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-[#b8b3a8]" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex h-4.5 w-24 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e]">
                      <div className="h-2 w-3 rounded-b-xs border-x border-b border-[#e89b3c]/80 bg-[#2a2825]" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xs border border-[#e89b3c]/60 bg-[#1a1712] px-2.5 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                      <span className="font-mono-label text-[8px] font-bold uppercase tracking-[0.22em] text-[#f3b15c]">
                        YOUR BUSINESS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                    </div>
                  </div>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    }`}
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-[#b8b3a8]" />
                  </div>
                </div>
              </div>

              {/* Lower Terminal Keybed */}
              <div
                className={`relative z-20 -mt-0.5 w-full rounded-t-xl rounded-b-2xl border px-3.5 pt-2.5 pb-3 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#ede6d6] via-[#e2dac8] to-[#d2c9b4]"
                    : "border-white/12 bg-gradient-to-b from-[#22222b] via-[#15151b] to-[#0c0c10]"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between px-0.5">
                  <span
                    className={`font-mono-label text-[8px] uppercase tracking-[0.16em] ${
                      activeTier
                        ? "font-semibold text-[#e89b3c]"
                        : isLight
                          ? "text-[#6e6a62]"
                          : "text-[#8e8a80]"
                    }`}
                  >
                    {activeTier === 20
                      ? "⚡ BURNING +$20 FUEL..."
                      : activeTier === 5000
                        ? "⚡ BURNING +$5,000 FUEL..."
                        : activeTier === 10000
                          ? "⚡ BURNING +$10,000 FUEL..."
                          : "⚡ FUEL: LOW — TAP ABOVE TO RUN"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3].map((idx) => {
                      const litCount =
                        activeTier === 10000
                          ? 4
                          : activeTier === 5000
                            ? 3
                            : activeTier === 20
                              ? 2
                              : 1;
                      return (
                        <span
                          key={idx}
                          className={`h-1.5 w-2 rounded-[1px] ${
                            idx < litCount ? "bg-[#e89b3c]" : "bg-current/15"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`rounded-lg border p-2.5 font-mono-label text-[10px] leading-snug ${
                    isLight
                      ? "border-black/15 bg-[#f7f3eb] text-[#6e6a62]"
                      : "border-white/10 bg-[#07070a] text-[#8e8a80]"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between border-b border-current/10 pb-1 text-[8px] uppercase tracking-[0.18em]">
                    <span>tty://spend.log</span>
                    <span className="text-[#e89b3c]">
                      {spent > 0 ? "LEAKING" : "READY"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {terminalLines.steps.map((line, i) => (
                      <div key={i} className="truncate">
                        &gt; {line}
                      </div>
                    ))}
                    <div
                      className={`truncate rounded px-1.5 py-0.5 font-semibold ${
                        isLight
                          ? "border-l-2 border-[#b86409] bg-[#e89b3c]/20 text-[#8a4600]"
                          : "border-l-2 border-[#e89b3c] bg-[#e89b3c]/20 text-[#f4f0ea]"
                      }`}
                    >
                      -&gt; {terminalLines.summary}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Spent vs Earned Counter Row */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-current/10 pt-3.5">
              <div className="flex items-baseline justify-between px-1">
                <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Spent
                </span>
                <span className="font-mono-label text-lg font-semibold tabular-nums text-[#e89b3c]">
                  ${spent.toLocaleString()}
                </span>
              </div>
              <div className="flex items-baseline justify-between px-1">
                <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Earned
                </span>
                <span className="font-mono-label text-lg font-semibold tabular-nums text-[var(--text-primary)]">
                  ${earned.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isBelowFoldReady ? (
        <MobileBelowFoldSections
          isLight={isLight}
          spent={spent}
          earned={earned}
          activeTier={activeTier}
          onTierClick={handleTierClick}
          cardSurface={cardSurface}
          innerSurface={innerSurface}
        />
      ) : (
        <div aria-hidden="true" className="min-h-[260vh] w-full" />
      )}
    </div>
  );
}
