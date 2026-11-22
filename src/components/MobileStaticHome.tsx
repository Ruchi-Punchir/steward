"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { DollarBillGraphic } from "@/components/hero/TypewriterStage";
import { CrispDollarBillGraphic } from "@/components/process/TestSolutionStage";
import { PRODUCT_UNITS } from "@/components/process/ExplodedTypewriter3D";
import StewardLogo from "@/components/StewardLogo";

type SpendTier = 20 | 5000 | 10000;

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

const STATIC_SPEND_POINTS = [
  { x: 58, y: 202.6 },
  { x: 86.3, y: 197.0 },
  { x: 114.6, y: 163.1 },
  { x: 142.9, y: 185.7 },
  { x: 171.1, y: 180.0 },
  { x: 199.4, y: 172.5 },
  { x: 227.7, y: 129.3 },
  { x: 256.0, y: 153.7 },
  { x: 284.3, y: 161.2 },
  { x: 312.6, y: 144.3 },
  { x: 340.9, y: 103.0 },
  { x: 369.1, y: 114.2 },
  { x: 397.4, y: 134.9 },
  { x: 425.7, y: 119.9 },
  { x: 454.0, y: 72.9 },
  { x: 482.3, y: 97.3 },
  { x: 510.6, y: 87.9 },
  { x: 538.9, y: 104.8 },
  { x: 567.1, y: 54.1 },
  { x: 595.4, y: 69.1 },
  { x: 623.7, y: 46.6 },
  { x: 652.0, y: 29.6 },
];

const STATIC_REV_POINTS = [
  { x: 58, y: 210.5 },
  { x: 86.3, y: 209.7 },
  { x: 114.6, y: 199.8 },
  { x: 142.9, y: 208.6 },
  { x: 171.1, y: 209.4 },
  { x: 199.4, y: 207.9 },
  { x: 227.7, y: 195.5 },
  { x: 256.0, y: 207.5 },
  { x: 284.3, y: 209.0 },
  { x: 312.6, y: 207.3 },
  { x: 340.9, y: 201.5 },
  { x: 369.1, y: 208.6 },
  { x: 397.4, y: 209.7 },
  { x: 425.7, y: 207.9 },
  { x: 454.0, y: 192.3 },
  { x: 482.3, y: 206.7 },
  { x: 510.6, y: 208.4 },
  { x: 538.9, y: 209.0 },
  { x: 567.1, y: 198.5 },
  { x: 595.4, y: 207.5 },
  { x: 623.7, y: 205.2 },
  { x: 652.0, y: 201.8 },
];

const buildPath = (pts: { x: number; y: number }[]) =>
  pts.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");

const SPEND_LINE_PATH = buildPath(STATIC_SPEND_POINTS);
const SPEND_AREA_PATH = `${SPEND_LINE_PATH} L 652 212 L 58 212 Z`;
const REV_LINE_PATH = buildPath(STATIC_REV_POINTS);
const REV_AREA_PATH = `${REV_LINE_PATH} L 652 212 L 58 212 Z`;

export default function MobileStaticHome() {
  const { theme } = useTheme();
  const isLight = theme === "light";

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

  const handleTierClick = (tier: SpendTier) => {
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

  const returnPerDollar = spent > 0 ? +(earned / spent).toFixed(2) : 0;
  const yieldPercent =
    spent > 0 ? Math.min(100, Math.round((earned / spent) * 100)) : 0;
  const burnPercent = spent > 0 ? Math.max(0, 100 - yieldPercent) : 100;
  const netBurnDollars = Math.max(0, Math.round(spent - earned));

  const cardSurface = isLight
    ? "border-black/10 bg-[#eae5dc] shadow-[0_14px_34px_rgba(20,20,19,0.06)]"
    : "border-white/[0.08] bg-[#101015] shadow-[0_18px_40px_rgba(0,0,0,0.65)]";

  const innerSurface = isLight
    ? "border-black/10 bg-[#fbf9f5]"
    : "border-white/[0.08] bg-[#16161d]";

  return (
    <div className="flex w-full flex-col">
      {/* =====================================================================
          SECTION 01: HERO (STATIC MOBILE VIEW)
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

          <h1
            id="mobile-hero-heading"
            className="text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl"
          >
            Increasing your revenue is the{" "}
            <span className="font-serif-editorial mt-1 block text-[1.06em] font-normal italic tracking-[-0.01em] text-[#e89b3c]">
              only metric we care about.
            </span>
          </h1>

          <p className="mt-4 text-[15px] font-normal leading-[1.65] text-[var(--text-secondary)] sm:text-base">
            We help startups uncover growth bottlenecks, identify untapped
            opportunities and build practical soutions to improve acquisition,
            conversion and retention through research, marketing expertise,
            product thinking and engineering.
          </p>

          {/* Direct Hero CTAs for Mobile */}
          <div className="mt-6 flex w-full flex-wrap items-center gap-3">
            <Link
              href="/audit?source=hero"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#e89b3c] px-6 py-3 font-mono-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#08080a]"
            >
              Get a free audit →
            </Link>
            <Link
              href="/talk?source=hero"
              target="_blank"
              rel="noopener noreferrer"
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
                    { tier: 20 as SpendTier, amount: "+$20/m", label: "Tools & SaaS" },
                    { tier: 5000 as SpendTier, amount: "+$5,000/m", label: "Paid Ads" },
                    { tier: 10000 as SpendTier, amount: "+$10K/m", label: "Product & Dev" },
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

      {/* =====================================================================
          SECTION 02: WHERE THE MONEY WENT & DASHBOARD (STATIC MOBILE VIEW)
      ===================================================================== */}
      <section
        id="dashboard"
        aria-labelledby="mobile-dashboard-heading"
        className="relative w-full border-t border-[var(--border-subtle)] px-5 py-14 sm:px-10 sm:py-16"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start text-left">
          <div className="mb-2.5 inline-flex items-center gap-2">
            <span className="font-mono-label text-[10.5px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              02 / WHERE THE MONEY WENT
            </span>
          </div>

          <h2
            id="mobile-dashboard-heading"
            className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl"
          >
            You keep paying.{" "}
            <span className="font-serif-editorial font-normal italic tracking-[-0.015em] text-[#e89b3c]">
              Still not profitable.
            </span>
          </h2>

          <p className="mt-3 text-sm font-medium leading-snug text-[var(--text-primary)] sm:text-base">
            The product is live. People visit. Revenue stays flat.
          </p>

          <p className="mt-2 text-sm font-normal leading-[1.6] text-[var(--text-secondary)] sm:text-[15px]">
            Every new tool, agency and relaunch costs more, and none of them
            moves the one number that matters. Most stuck products break in one
            specific place.{" "}
            <span className="font-medium text-[var(--text-primary)]">
              Let&apos;s fix it{" "}
              <span className="font-serif-editorial text-[1.1em] font-normal italic text-[#e89b3c]">
                together!
              </span>
            </span>
          </p>

          {/* Static Business Dashboard Container */}
          <div
            className={`mt-7 w-full rounded-2xl border p-4 sm:p-6 ${cardSurface}`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-mono-label text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-primary)]">
                  Your Business
                </span>
                <span className="font-serif-editorial block text-base font-normal italic text-[#e89b3c]">
                  Dashboard
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`flex min-w-[96px] flex-col rounded-xl border px-2.5 py-1.5 ${innerSurface}`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono-label text-[8.5px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Investment
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                  </div>
                  <span className="mt-0.5 font-mono-label text-base font-semibold tabular-nums text-[#e89b3c]">
                    ${spent.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`flex min-w-[96px] flex-col rounded-xl border px-2.5 py-1.5 ${innerSurface}`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono-label text-[8.5px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Revenue
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff383c]" />
                  </div>
                  <span className="mt-0.5 font-mono-label text-base font-semibold tabular-nums text-[var(--text-primary)]">
                    ${earned.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Spend Buttons inside Dashboard so user can also tap here */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(
                [
                  { tier: 20 as SpendTier, amount: "+$20/m", label: "Tools" },
                  { tier: 5000 as SpendTier, amount: "+$5,000/m", label: "Ads" },
                  { tier: 10000 as SpendTier, amount: "+$10K/m", label: "Product" },
                ] as const
              ).map((item) => (
                <button
                  key={item.tier}
                  type="button"
                  onClick={() => handleTierClick(item.tier)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150 active:scale-[0.97] ${
                    activeTier === item.tier
                      ? "border-[#e89b3c] bg-[#e89b3c]/15"
                      : innerSurface
                  }`}
                >
                  <span className="font-mono-label text-[11px] font-semibold text-[#e89b3c]">
                    {item.amount}
                  </span>
                  <span className="text-[9.5px] text-[var(--text-muted)]">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Static Spend vs Revenue SVG Chart */}
            <div
              className={`relative mt-3.5 rounded-xl border p-3 ${
                isLight
                  ? "border-black/10 bg-[#f6f3ec]"
                  : "border-white/[0.07] bg-[#0b0b0f]"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Spend vs. Revenue
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono-label text-[8px] uppercase tracking-[0.14em] ${
                      isLight
                        ? "bg-black/[0.06] text-[#524e46]"
                        : "bg-white/[0.06] text-[#8e8a80]"
                    }`}
                  >
                    12M · Monthly
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                    <span className="font-mono-label text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-primary)]">
                      Outflow
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4ea885]" />
                    <span className="font-mono-label text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      Revenue
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative h-[135px] w-full sm:h-[180px]">
                <svg
                  viewBox="0 0 680 240"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  role="img"
                  aria-label="Chart showing Spend climbing while Revenue stays flat near the floor"
                >
                  <defs>
                    <linearGradient
                      id="mobile-static-spend-grad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#e89b3c"
                        stopOpacity="0.28"
                      />
                      <stop
                        offset="100%"
                        stopColor="#e89b3c"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="mobile-static-rev-grad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4ea885"
                        stopOpacity="0.18"
                      />
                      <stop
                        offset="100%"
                        stopColor="#4ea885"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {[
                    { y: 24, label: "$15k" },
                    { y: 118, label: "$7.5k" },
                    { y: 212, label: "$0" },
                  ].map(({ y, label }, idx) => (
                    <g key={y}>
                      <line
                        x1="58"
                        y1={y}
                        x2="652"
                        y2={y}
                        stroke={
                          isLight
                            ? "rgba(20,20,19,0.12)"
                            : "rgba(244,240,234,0.1)"
                        }
                        strokeWidth={idx === 2 ? "1.5" : "1"}
                        strokeDasharray={idx === 2 ? undefined : "4 6"}
                      />
                      <text
                        x="48"
                        y={y + 3}
                        textAnchor="end"
                        fill={isLight ? "#6e6960" : "#6e6b64"}
                        className="font-mono-label text-[11px]"
                      >
                        {label}
                      </text>
                    </g>
                  ))}

                  <path
                    d={SPEND_AREA_PATH}
                    fill="url(#mobile-static-spend-grad)"
                  />
                  <path
                    d={SPEND_LINE_PATH}
                    fill="none"
                    stroke="#e89b3c"
                    strokeWidth="2.5"
                  />
                  <circle cx="652" cy="29.6" r="4.5" fill="#e89b3c" />

                  <path d={REV_AREA_PATH} fill="url(#mobile-static-rev-grad)" />
                  <path
                    d={REV_LINE_PATH}
                    fill="none"
                    stroke="#4ea885"
                    strokeWidth="2"
                  />
                  <circle cx="652" cy="201.8" r="4" fill="#4ea885" />
                </svg>
              </div>
            </div>

            {/* Bottom Two Diagnostic Tiles */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div
                className={`flex flex-col justify-between rounded-xl border p-3 ${innerSurface}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono-label text-[8.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Return
                  </span>
                  <span className="rounded bg-[#e89b3c]/15 px-1.5 py-0.5 font-mono-label text-[8px] font-semibold uppercase text-[#e89b3c]">
                    {yieldPercent}% Yield
                  </span>
                </div>
                <div className="my-2">
                  <span className="font-mono-label text-xs font-semibold text-[var(--text-primary)] sm:text-sm">
                    ${returnPerDollar.toFixed(2)} back per $1
                  </span>
                  <p className="mt-1 text-[10.5px] leading-snug text-[var(--text-secondary)]">
                    {spent > 0
                      ? `${burnPercent}% of spend ($${netBurnDollars.toLocaleString()} burned) went to tools, agencies, and rebuilds.`
                      : "Tap +$20/m, +$5,000/m, or +$10K/m to measure return per $1."}
                  </p>
                </div>
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    style={{ width: `${burnPercent}%` }}
                    className="h-full bg-[#e89b3c] transition-all duration-300"
                  />
                  <div
                    style={{ width: `${yieldPercent}%` }}
                    className="h-full bg-[#4ea885] transition-all duration-300"
                  />
                </div>
              </div>

              <div
                className={`flex flex-col justify-between rounded-xl border p-3 ${innerSurface}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono-label text-[8.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Diagnosis
                  </span>
                  <span className="truncate rounded bg-[#ff383c]/15 px-1.5 py-0.5 font-mono-label text-[8px] font-semibold uppercase text-[#ff383c]">
                    {spent > 0
                      ? `Loss: -$${netBurnDollars.toLocaleString()}`
                      : "Funnel audit"}
                  </span>
                </div>
                <div className="my-2">
                  <p className="text-xs font-semibold leading-snug text-[var(--text-primary)] sm:text-sm">
                    Your product isn&apos;t the problem.{" "}
                    <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                      The leak is.
                    </span>
                  </p>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-1.5 font-mono-label text-[8.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
                  Conversion: Leaking
                </div>
              </div>
            </div>
          </div>

          {/* Static Partnership Lockup ("Let's fix it together") with Vintage Typewriter */}
          <div
            className={`mt-6 flex w-full flex-col items-center rounded-2xl border px-5 py-8 text-center ${cardSurface}`}
          >
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl">
              Let&apos;s fix it{" "}
              <span className="font-serif-editorial text-[1.08em] font-normal italic text-[#e89b3c]">
                together
              </span>
            </h3>

            <div className="mt-6 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              {/* Miniature Vintage Typewriter representing Your Business */}
              <div
                aria-hidden="true"
                className="flex w-[180px] flex-col items-center"
              >
                {/* Emerging $1 Bill */}
                <div className="relative z-10 -mb-1.5 flex h-[54px] w-[124px] items-end justify-center overflow-hidden">
                  <div
                    style={{ transform: "translateY(42%) rotate(-1.1deg)" }}
                    className="relative h-full w-full"
                  >
                    <DollarBillGraphic idPrefix="mobile-partner-lockup-bill" />
                  </div>
                </div>

                {/* 1. Vintage Carriage Platen Roller + Chrome Thumb Wheels */}
                <div className="relative z-20 mx-auto flex w-[96%] items-center justify-center">
                  <div className="flex shrink-0 items-center">
                    <div
                      className={`flex h-3.5 w-2 flex-col justify-between rounded-l-xs border-y border-l py-0.5 ${
                        isLight
                          ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                          : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                      }`}
                    >
                      <span className="h-px w-full bg-black/35" />
                      <span className="h-px w-full bg-black/35" />
                    </div>
                    <div className="h-1.5 w-1 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952]" />
                  </div>

                  <div className="relative flex h-4.5 flex-1 flex-col items-center justify-start rounded-xs border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12] shadow-md">
                    <div className="h-1 w-[74%] rounded-b-full bg-black" />
                    <div className="mt-0.5 flex w-[74%] items-center justify-between border-t border-[#d8d4cc]/80 px-3">
                      <span className="-mt-0.5 h-1.5 w-2 rounded-xs bg-[#2c2b28]" />
                      <span className="-mt-0.5 h-1.5 w-2 rounded-xs bg-[#2c2b28]" />
                    </div>
                  </div>

                  <div className="relative flex shrink-0 items-center">
                    <div className="h-1.5 w-1 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952]" />
                    <div
                      className={`flex h-3.5 w-2 flex-col justify-between rounded-r-xs border-y border-r py-0.5 ${
                        isLight
                          ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                          : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                      }`}
                    >
                      <span className="h-px w-full bg-black/35" />
                      <span className="h-px w-full bg-black/35" />
                    </div>
                  </div>
                </div>

                {/* 2. Upper Ribbon Spool Hood & Typebar Basket */}
                <div
                  className={`relative z-20 -mt-0.5 flex w-[88%] flex-col items-center rounded-t-[14px] border-x border-t px-2.5 pt-1.5 pb-1 ${
                    isLight
                      ? "border-black/20 bg-gradient-to-b from-[#f5f0e4] to-[#e5decb]"
                      : "border-white/15 bg-gradient-to-b from-[#2a2a33] to-[#1c1c23]"
                  }`}
                >
                  <div className="relative z-10 flex w-full items-center justify-between">
                    <div
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                        isLight
                          ? "border-[#8c867a] bg-[#22211f]"
                          : "border-[#5a5852] bg-[#0c0c10]"
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#b8b3a8]" />
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-3 w-16 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e]">
                        <div className="h-1.5 w-2 rounded-b-xs border-x border-b border-[#e89b3c]/80 bg-[#2a2825]" />
                      </div>
                      <div className="flex items-center gap-1 rounded-xs border border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] px-1.5 py-0.5">
                        <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                        <span className="font-mono-label text-[5.5px] font-bold uppercase tracking-[0.22em] text-[#f3b15c]">
                          YOUR BUSINESS
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                      </div>
                    </div>

                    <div
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                        isLight
                          ? "border-[#8c867a] bg-[#22211f]"
                          : "border-[#5a5852] bg-[#0c0c10]"
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-[#b8b3a8]" />
                    </div>
                  </div>
                </div>

                {/* 3. Lower Keybed Housing Terminal & Spacebar */}
                <div
                  className={`relative z-20 -mt-0.5 w-full rounded-t-lg rounded-b-xl border px-2.5 pt-2 pb-2.5 ${
                    isLight
                      ? "border-black/20 bg-gradient-to-b from-[#ede6d6] via-[#e2dac8] to-[#d2c9b4] shadow-[0_14px_30px_rgba(20,20,19,0.16)]"
                      : "border-white/12 bg-gradient-to-b from-[#22222b] via-[#15151b] to-[#0c0c10] shadow-[0_18px_38px_rgba(0,0,0,0.78)]"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between px-0.5">
                    <span
                      className={`font-mono-label text-[5px] uppercase tracking-[0.14em] ${
                        isLight ? "text-[#6e6a62]" : "text-[#8e8a80]"
                      }`}
                    >
                      ⚡ FUEL: LOW — FEED $ TO RUN
                    </span>
                    <div className="flex items-center gap-0.5">
                      <span className="h-1 w-1.5 rounded-[1px] bg-[#e89b3c]" />
                      <span className="h-1 w-1.5 rounded-[1px] bg-current/15" />
                      <span className="h-1 w-1.5 rounded-[1px] bg-current/15" />
                      <span className="h-1 w-1.5 rounded-[1px] bg-current/15" />
                    </div>
                  </div>

                  {/* Recessed Terminal Screen */}
                  <div
                    className={`rounded-md border p-1.5 ${
                      isLight
                        ? "border-black/15 bg-[#f7f3eb]"
                        : "border-white/10 bg-[#07070a]"
                    }`}
                  >
                    <div
                      className={`mb-1 flex items-center justify-between border-b pb-0.5 ${
                        isLight ? "border-black/10" : "border-white/[0.07]"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-current/25" />
                        <span className="h-1 w-1 rounded-full bg-current/25" />
                        <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                      </div>
                      <span className="font-mono-label text-[5px] uppercase tracking-[0.16em] opacity-60">
                        tty://spend.log
                      </span>
                      <span className="font-mono-label text-[5px] uppercase tracking-[0.14em] opacity-55">
                        READY
                      </span>
                    </div>

                    <div className="space-y-0.5 text-left font-mono-label text-[5.5px] leading-tight">
                      <div className="truncate opacity-60">
                        &gt; business.sys ready
                      </div>
                      <div className="truncate opacity-60">
                        &gt; awaiting partner lockup...
                      </div>
                      <div
                        className={`truncate rounded px-1 py-0.5 font-semibold ${
                          isLight
                            ? "border-l border-[#b86409] bg-[#e89b3c]/20 text-[#8a4600]"
                            : "border-l border-[#e89b3c] bg-[#e89b3c]/20 text-[#f4f0ea]"
                        }`}
                      >
                        ▸ Steward connected.
                      </div>
                    </div>
                  </div>

                  {/* Shift Keys + Spacebar */}
                  <div className="mt-1.5 flex items-center justify-center gap-2 px-1">
                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#9e988c] bg-[#262522] text-[4px] font-bold text-[#f4f0ea]">
                      SHIFT
                    </div>
                    <div className="h-2 flex-1 rounded-xs border border-black/40 bg-gradient-to-b from-[#33312d] to-[#181715]" />
                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#9e988c] bg-[#262522] text-[4px] font-bold text-[#f4f0ea]">
                      LOCK
                    </div>
                  </div>
                </div>

                {/* Rubber Desk Feet */}
                <div className="mx-auto flex w-[84%] justify-between px-3">
                  <div className="h-1 w-5 rounded-b-xs bg-[#141416]" />
                  <div className="h-1 w-5 rounded-b-xs bg-[#141416]" />
                </div>
              </div>

              {/* "+" Sign */}
              <div
                aria-hidden="true"
                className="relative flex h-8 w-8 items-center justify-center"
              >
                <span className="absolute h-px w-6 bg-[var(--text-primary)]/85" />
                <span className="absolute h-6 w-px bg-[var(--text-primary)]/85" />
              </div>

              {/* Steward Lockup */}
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <StewardLogo className="h-8 w-auto sm:h-10" />
                <span className="mt-2.5 text-xs font-normal tracking-[-0.01em] text-[var(--text-secondary)]">
                  Product and Growth Partner for Founders
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 03: HOW WE WORK TOGETHER (STATIC 5-STEP MOBILE VIEW)
      ===================================================================== */}
      <section
        id="process"
        aria-labelledby="mobile-process-heading"
        className="relative w-full border-t border-[var(--border-subtle)] px-5 py-14 sm:px-10 sm:py-16"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start text-left">
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[#e89b3c]">
              03
            </span>
            <span
              aria-hidden="true"
              className="h-px w-6 bg-[var(--text-muted)] opacity-45"
            />
            <span className="font-mono-label text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Revenue is the only metric
            </span>
          </div>

          <h2
            id="mobile-process-heading"
            className="text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl"
          >
            How we work{" "}
            <span className="font-serif-editorial font-normal italic tracking-[-0.015em] text-[#e89b3c]">
              together
            </span>
          </h2>

          {/* Static 5 Process Step Cards */}
          <div className="mt-8 flex w-full flex-col gap-5">
            {/* STEP 1: Understand the problem */}
            <div className={`w-full rounded-2xl border p-5 ${cardSurface}`}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-label text-2xl font-light text-[#e89b3c]">
                  1.
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                  Understand the problem
                </h3>
              </div>

              <p className="mt-2 text-sm leading-[1.6] text-[var(--text-secondary)]">
                Before writing a single line of code or running another ad, we
                scan your numbers, product, and funnel to pinpoint the exact
                bottlenecks costing you sales.
              </p>

              {/* Static 5 Product Units Diagnostic Breakdown */}
              <div className="mt-4 space-y-2">
                {PRODUCT_UNITS.map((unit) => (
                  <div
                    key={unit.id}
                    className={`flex flex-col rounded-xl border p-3 ${innerSurface}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-label text-[10px] font-semibold text-[#e89b3c]">
                          #{unit.code}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {unit.name}
                        </span>
                      </div>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono-label text-[8px] font-semibold uppercase tracking-[0.12em] ${
                          unit.isProblem
                            ? "bg-[#c94f45]/15 text-[#c94f45]"
                            : "bg-[#e89b3c]/15 text-[#e89b3c]"
                        }`}
                      >
                        {unit.isProblem ? "Leak Detected" : "Audited"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-[var(--text-secondary)]">
                      {unit.finding}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: Build a solution */}
            <div className={`w-full rounded-2xl border p-5 ${cardSurface}`}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-label text-2xl font-light text-[#10b981]">
                  2.
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                  Build a solution
                </h3>
              </div>

              <p className="mt-2 text-sm leading-[1.6] text-[var(--text-secondary)]">
                We fix what’s costing you sales, starting with the biggest leak.
                And if something’s missing, we build it.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div
                  className={`flex items-center justify-between rounded-xl border p-3 ${innerSurface}`}
                >
                  <div>
                    <span className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#10b981]">
                      Unit #02 · Repaired
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-[var(--text-primary)]">
                      Acquisition &amp; Growth
                    </span>
                  </div>
                  <span className="rounded-full bg-[#10b981]/15 px-2.5 py-1 font-mono-label text-[9px] font-semibold text-[#10b981]">
                    ✓ Fixed
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between rounded-xl border p-3 ${innerSurface}`}
                >
                  <div>
                    <span className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#10b981]">
                      Unit #04 · Repaired
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-[var(--text-primary)]">
                      Product &amp; Development
                    </span>
                  </div>
                  <span className="rounded-full bg-[#10b981]/15 px-2.5 py-1 font-mono-label text-[9px] font-semibold text-[#10b981]">
                    ✓ Fixed
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 3: Test the solution */}
            <div className={`w-full rounded-2xl border p-5 ${cardSurface}`}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-label text-2xl font-light text-[#e89b3c]">
                  3.
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                  Test the solution
                </h3>
              </div>

              <p className="mt-2 text-sm leading-[1.6] text-[var(--text-secondary)]">
                Before going wide, we put it in front of real people and watch
                what they actually do. We prove it works before you spend
                another dime on ads or development.
              </p>

              {/* Static Before vs After Dollar Bill Comparison */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className={`flex flex-col items-start rounded-xl border p-2.5 ${innerSurface}`}
                >
                  <span className="mb-1.5 font-mono-label text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Version 1 · Before
                  </span>
                  <div className="h-[68px] w-full overflow-hidden rounded">
                    <DollarBillGraphic idPrefix="mobile-static-v1-bill" />
                  </div>
                </div>

                <div
                  className={`flex flex-col items-start rounded-xl border p-2.5 ${innerSurface}`}
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    <span className="font-mono-label text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#10b981]">
                      Version 1.1 · Verified
                    </span>
                  </div>
                  <div className="h-[68px] w-full overflow-hidden rounded">
                    <CrispDollarBillGraphic idPrefix="mobile-static-v1-1-bill" />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: Launch and measure */}
            <div className={`w-full rounded-2xl border p-5 ${cardSurface}`}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-label text-2xl font-light text-[#10b981]">
                  4.
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                  Launch and measure
                </h3>
              </div>

              <p className="mt-2 text-sm leading-[1.6] text-[var(--text-secondary)]">
                Same budget. Completely different outcome. We ship the winning
                fix fast and track one number: net revenue. No vanity clicks or
                guesswork. You see every dollar come back with profit.
              </p>

              <div
                className={`mt-4 flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${innerSurface}`}
              >
                <span className="font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  Measured Outcome
                </span>
                <span className="font-mono-label text-xs font-semibold text-[#10b981]">
                  ✓ High-Yield Engine · Net Revenue Up
                </span>
              </div>
            </div>

            {/* STEP 5: Iterate and scale */}
            <div className={`w-full rounded-2xl border p-5 ${cardSurface}`}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-label text-2xl font-light text-[#e89b3c]">
                  5.
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                  Iterate and scale
                </h3>
              </div>

              <p className="mt-2 text-sm leading-[1.6] text-[var(--text-secondary)]">
                We stay, adjust, and keep pushing that number up, quarter after
                quarter.
              </p>

              <div
                className={`mt-4 flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${innerSurface}`}
              >
                <span className="font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  Long-Term Partnership
                </span>
                <span className="font-mono-label text-xs font-semibold text-[#e89b3c]">
                  Powered by Steward
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: WHO WE WORK WITH (STATIC MOBILE VIEW)
      ===================================================================== */}
      <section
        aria-labelledby="mobile-who-heading"
        className="relative w-full border-t border-[var(--border-subtle)] px-5 py-14 text-center sm:px-10 sm:py-16"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
              04
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              /
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              WHO WE WORK WITH
            </span>
          </div>

          <h2
            id="mobile-who-heading"
            className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl"
          >
            We own the{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c]">
              outcome.
            </span>
          </h2>

          <p className="mt-4 text-base font-normal leading-[1.6] text-[var(--text-primary)]/90 sm:text-lg">
            You’ve built the product. We take on everything between it and your
            next paying customer: finding what’s in the way, fixing it, and
            tracking whether it worked.
          </p>

          <p className="mt-3.5 text-sm font-normal leading-[1.65] text-[var(--text-secondary)]">
            You keep the vision and the decisions. We agree on one number up
            front, and we answer for it.
          </p>
        </div>
      </section>

      {/* =====================================================================
          SECTION 05: LET'S START (STATIC MOBILE VIEW)
      ===================================================================== */}
      <section
        id="contact"
        aria-labelledby="mobile-start-heading"
        className="relative w-full border-t border-[var(--border-subtle)] px-5 py-16 text-center sm:px-10 sm:py-20"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
              05
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              /
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              LET’S START
            </span>
          </div>

          <h2
            id="mobile-start-heading"
            className="max-w-[18ch] text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl"
          >
            Let’s find what’s costing{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c]">
              you revenue.
            </span>
          </h2>

          <p className="mt-4 text-base font-normal leading-[1.65] text-[var(--text-secondary)]">
            Clear diagnosis. Prioritized fixes. Zero guesswork.
          </p>

          <div className="mt-7 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/audit?source=close-section"
              target="_blank"
              rel="noopener noreferrer"
              data-cta-source="close-section"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#e89b3c] px-8 py-3.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[#08080a] sm:w-auto"
            >
              Get a free audit
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <span>Or just say hello,</span>
              <a
                href="mailto:connect@hellosteward.agency"
                className="font-mono-label text-xs font-medium tracking-[0.06em] text-[var(--text-primary)] underline decoration-[#e89b3c] decoration-1 underline-offset-4"
              >
                connect@hellosteward.agency
              </a>
            </div>
          </div>

          <p className="mt-4 font-mono-label text-[11px] tracking-[0.06em] text-[var(--text-muted)]">
            No cost, no strings. You keep everything we find.
          </p>
        </div>
      </section>
    </div>
  );
}
