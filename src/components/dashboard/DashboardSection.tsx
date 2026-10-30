"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DollarBillGraphic } from "@/components/hero/TypewriterStage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface DashboardSectionProps {
  spent: number;
  earned: number;
  hundredClickCount: number;
  onSpend: (tier: 20 | 50 | 100, earnedDelta?: number) => void;
  isTransitionLocked: boolean;
}

export default function DashboardSection({
  spent,
  earned,
  hundredClickCount,
  onSpend,
  isTransitionLocked,
}: DashboardSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const dashboardShellRef = useRef<HTMLDivElement | null>(null);
  const copyBlockRef = useRef<HTMLDivElement | null>(null);

  // Animated count-up display states for tiles
  const [displaySpent, setDisplaySpent] = useState<number>(spent);
  const [displayEarned, setDisplayEarned] = useState<number>(earned);
  const prevSpentRef = useRef<number>(spent);
  const prevEarnedRef = useRef<number>(earned);

  const spentTileValueRef = useRef<HTMLSpanElement | null>(null);
  const earnedTileValueRef = useRef<HTMLSpanElement | null>(null);

  // Animated chart progress (0 -> 1 based on spend)
  const [chartSpendLevel, setChartSpendLevel] = useState<number>(spent);
  const chartLevelObjRef = useRef<{ val: number }>({ val: spent });

  // Active amber flash state for mobile fallback cards
  const [activeCard, setActiveCard] = useState<20 | 50 | 100 | null>(null);
  const activeCardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Sync light/dark theme for subtle SVG styling
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const syncTheme = () => {
      setIsLight(
        document.documentElement.getAttribute("data-theme") === "light"
      );
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Animate Spent & Earned tiles and Chart whenever `spent` or `earned` updates
  useEffect(() => {
    const startSpent = prevSpentRef.current;
    const startEarned = prevEarnedRef.current;

    if (startSpent === spent && startEarned === earned) return;

    const counterObj = { s: startSpent, e: startEarned };
    gsap.to(counterObj, {
      s: spent,
      e: earned,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        setDisplaySpent(Math.round(counterObj.s));
        setDisplayEarned(+(counterObj.e).toFixed(2));
      },
      onComplete: () => {
        setDisplaySpent(spent);
        setDisplayEarned(earned);
      },
    });

    gsap.to(chartLevelObjRef.current, {
      val: spent,
      duration: 0.65,
      ease: "power3.out",
      onUpdate: () => {
        setChartSpendLevel(chartLevelObjRef.current.val);
      },
    });

    if (spentTileValueRef.current) {
      gsap.fromTo(
        spentTileValueRef.current,
        { scale: 1.14 },
        { scale: 1, duration: 0.45, ease: "back.out(2)" }
      );
    }
    if (earnedTileValueRef.current) {
      gsap.fromTo(
        earnedTileValueRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 0.45, ease: "power2.out" }
      );
    }

    prevSpentRef.current = spent;
    prevEarnedRef.current = earned;
  }, [spent, earned]);

  // Continuous scroll handoff animation for Dashboard (left) and Editorial Copy (top-right)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 100%",
          end: "top 0%",
          scrub: true,
        },
      });

      if (dashboardShellRef.current) {
        tl.fromTo(
          dashboardShellRef.current,
          {
            x: -80,
            opacity: 0,
            scale: 0.97,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            duration: 1,
          },
          0
        );
      }

      if (copyBlockRef.current) {
        tl.fromTo(
          copyBlockRef.current,
          {
            y: 36,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.9,
          },
          0.1
        );
      }
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleMobileCardClick = (tier: 20 | 50 | 100) => {
    if (isTransitionLocked) return;

    if (activeCardTimeoutRef.current) {
      clearTimeout(activeCardTimeoutRef.current);
    }
    setActiveCard(tier);
    activeCardTimeoutRef.current = setTimeout(() => {
      setActiveCard(null);
    }, 550);

    onSpend(tier);
  };

  useEffect(() => {
    return () => {
      if (activeCardTimeoutRef.current) {
        clearTimeout(activeCardTimeoutRef.current);
      }
    };
  }, []);

  // Realistic 12-Month Dashboard Chart Geometry (SVG viewBox: 0 0 680 256)
  // Plot area: X from 58 to 652, Y from 24 (ceiling) to 212 (floor $0)
  const plotLeft = 58;
  const plotRight = 652;
  const plotTop = 24;
  const plotBottom = 212;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Dynamic Y-Axis ceiling that scales believably with Spend
  const yAxisMax = Math.max(500, Math.ceil((Math.max(spent, 200) + 120) / 250) * 250);
  const formatAxisDollar = (val: number) => {
    if (val === 0) return "$0";
    if (val >= 1000) {
      return val % 1000 === 0
        ? `$${val / 1000}k`
        : `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${val}`;
  };

  const yTicks = [
    { y: plotTop, label: formatAxisDollar(yAxisMax) },
    { y: Math.round(plotTop + plotHeight * 0.25), label: formatAxisDollar(Math.round(yAxisMax * 0.75)) },
    { y: Math.round(plotTop + plotHeight * 0.5), label: formatAxisDollar(Math.round(yAxisMax * 0.5)) },
    { y: Math.round(plotTop + plotHeight * 0.75), label: formatAxisDollar(Math.round(yAxisMax * 0.25)) },
    { y: plotBottom, label: "$0" },
  ];

  // X-Axis labels across the 22-point high-resolution timeline (JAN -> NOW)
  const totalDataPoints = 22;
  const xLabels = [
    { ptIdx: 0, label: "JAN" },
    { ptIdx: 4, label: "MAR" },
    { ptIdx: 8, label: "MAY" },
    { ptIdx: 12, label: "JUL" },
    { ptIdx: 16, label: "SEP" },
    { ptIdx: 19, label: "NOV" },
    { ptIdx: 21, label: "NOW" },
  ];

  // Spiky, irregular Spend trajectory (sharp campaign spikes, plateaus, sudden drops, and steep climbs)
  const normalizedSpend = Math.min(1, chartSpendLevel / 600);
  const spendScale = 0.42 + normalizedSpend * 0.52;

  const spendSpikyProfile = [
    0.05, // 0: Jan start
    0.08, // 1: slow creep
    0.26, // 2: sharp initial tool + ad spike!
    0.14, // 3: drop after ad test
    0.17, // 4: Mar plateau
    0.21, // 5: creeping SaaS bills
    0.44, // 6: sharp agency deposit spike!
    0.31, // 7: pullback
    0.27, // 8: May dip
    0.36, // 9: climbing
    0.58, // 10: paid acquisition surge
    0.52, // 11: slight dip
    0.41, // 12: Jul drop
    0.49, // 13: dev contractor bill
    0.74, // 14: sharp MVP rebuild spike!
    0.61, // 15: post-rebuild dip
    0.66, // 16: Sep climb
    0.57, // 17: brief dip
    0.84, // 18: relaunch campaign spike!
    0.76, // 19: Nov pullback
    0.88, // 20: aggressive push
    0.97, // 21: NOW peak
  ];

  const spendPoints = spendSpikyProfile.map((ratio, idx) => {
    const x = +(plotLeft + (idx / (totalDataPoints - 1)) * plotWidth).toFixed(1);
    const recencyWeight = idx >= 15 ? 1 + normalizedSpend * 0.06 : 1;
    const clampedRatio = Math.min(0.97, ratio * spendScale * recencyWeight);
    const y = +(plotBottom - clampedRatio * plotHeight).toFixed(1);
    return { x, y };
  });

  // Spiky Revenue trajectory: hugs the floor with occasional sharp little needle-blips that respond to Earned
  const normalizedEarned = Math.min(1, displayEarned / Math.max(250, yAxisMax * 0.35));
  const revenueLiftScale = 1 + normalizedEarned * 1.15;
  const revenueSpikyProfile = [
    0.008, // 0
    0.012, // 1
    0.065, // 2: tiny launch spike
    0.018, // 3: immediate drop
    0.014, // 4
    0.022, // 5
    0.088, // 6: brief ad blip
    0.024, // 7: drop
    0.016, // 8
    0.025, // 9
    0.056, // 10: tiny bump
    0.018, // 11
    0.012, // 12
    0.022, // 13
    0.105, // 14: brief rebuild launch spike
    0.028, // 15: immediate drop back to floor
    0.019, // 16
    0.016, // 17
    0.072, // 18: tiny relaunch blip
    0.024, // 19
    0.036, // 20
    0.045 + normalizedEarned * 0.12, // 21: NOW responds to earned while staying far below Spend
  ];

  const revenuePoints = revenueSpikyProfile.map((ratio, idx) => {
    const x = +(plotLeft + (idx / (totalDataPoints - 1)) * plotWidth).toFixed(1);
    const y = +(plotBottom - Math.min(0.24, ratio * revenueLiftScale) * plotHeight).toFixed(1);
    return { x, y };
  });

  // Build crisp spiky linear SVG path (`L x y`) instead of rounded sine-wave beziers
  const buildSpikyPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    return pts
      .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" ");
  };

  const spendLinePath = buildSpikyPath(spendPoints);
  const spendAreaPath = `${spendLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const revenueLinePath = buildSpikyPath(revenuePoints);
  const revenueAreaPath = `${revenueLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const spendEndPt = spendPoints[spendPoints.length - 1];
  const revEndPt = revenuePoints[revenuePoints.length - 1];
  const spendEndY = spendEndPt.y;
  const revEndY = revEndPt.y;

  // Format Earned: two decimals where needed, "$0" when 0
  const formattedEarned =
    displayEarned === 0
      ? "$0"
      : displayEarned % 1 === 0
      ? `$${displayEarned.toFixed(0)}`
      : `$${displayEarned.toFixed(2)}`;

  // Live Return Card metrics computed directly from Spent & Earned
  const returnPerDollar =
    displaySpent > 0 ? +(displayEarned / displaySpent).toFixed(2) : 0;
  const yieldPercent =
    displaySpent > 0
      ? Math.min(100, Math.round((displayEarned / displaySpent) * 100))
      : 0;
  const burnPercent = displaySpent > 0 ? Math.max(0, 100 - yieldPercent) : 100;
  const netBurnDollars = Math.max(0, Math.round(displaySpent - displayEarned));

  // Positions along the flat Revenue floor line for dropped miniature "1 USD" bills ($100 clicks)
  const droppedBillsCount = Math.min(hundredClickCount, 6);
  const billDropXPositions = [58, 70, 82, 46, 64, 76]; // percentages along chart width

  return (
    <section
      ref={sectionRef}
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className="relative flex min-h-screen w-full items-center overflow-x-clip py-16 lg:py-20"
    >
      {/* Subtle ambient glow behind the dashboard */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.05)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
      />

      <div className="relative z-20 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-24">
        {/* =====================================================================
            LEFT COLUMN (lg:col-span-6): 02 YOUR BUSINESS DASHBOARD CONTAINER
            Matches the user's reference wireframe:
            - Outer container box
            - Top bar: "02 Your Business Dashboard" on left + [Spent] [Earned] boxes on right
            - Middle wide box: Spend vs. Revenue chart
            - Bottom 2 side-by-side boxes: [Return: $0.01 back per $1] & [Closing diagnosis]
        ===================================================================== */}
        <div
          ref={dashboardShellRef}
          className={`w-full rounded-2xl border p-5 transition-colors duration-300 sm:p-7 lg:col-span-6 ${
            isLight
              ? "border-black/10 bg-[#eae5dc] shadow-[0_24px_60px_rgba(20,20,19,0.08)]"
              : "border-white/[0.08] bg-[#101015] shadow-[0_28px_70px_rgba(0,0,0,0.75)]"
          }`}
        >
          {/* TOP BAR INSIDE DASHBOARD: Label on Left + Spent & Earned Boxes on Right */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-label text-xs font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                02
              </span>
              <span className="font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-primary)] sm:text-[13px]">
                Your Business Dashboard
              </span>
            </div>

            {/* SPENT & EARNED RECTANGULAR BOXES (Top-Right of Dashboard Container) */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3.5">
              {/* SPENT BOX */}
              <div
                className={`flex min-w-[124px] flex-col justify-between rounded-xl border px-4 py-3 sm:min-w-[136px] ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5] shadow-xs"
                    : "border-white/[0.08] bg-[#17171f]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Spent
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                </div>
                <span
                  ref={spentTileValueRef}
                  data-testid="dashboard-spent-tile"
                  className="mt-1 inline-block font-mono-label text-2xl font-semibold tabular-nums tracking-tight text-[#e89b3c] sm:text-[26px]"
                >
                  ${displaySpent}
                </span>
              </div>

              {/* EARNED BOX */}
              <div
                className={`flex min-w-[124px] flex-col justify-between rounded-xl border px-4 py-3 sm:min-w-[136px] ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5] shadow-xs"
                    : "border-white/[0.08] bg-[#17171f]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Earned
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
                </div>
                <span
                  ref={earnedTileValueRef}
                  data-testid="dashboard-earned-tile"
                  className="mt-1 inline-block font-mono-label text-2xl font-semibold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-[26px]"
                >
                  {formattedEarned}
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE WIDE BOX: THE CHART (Spend vs. Revenue over time) */}
          <div
            className={`relative mt-5 rounded-xl border p-4 sm:p-5 ${
              isLight
                ? "border-black/10 bg-[#f6f3ec]"
                : "border-white/[0.07] bg-[#0b0b0f]"
            }`}
          >
            {/* Chart Title, Timeframe Pill & Legend */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Spend vs. Revenue
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono-label text-[9px] uppercase tracking-[0.14em] ${
                    isLight
                      ? "bg-black/[0.06] text-[#524e46]"
                      : "bg-white/[0.06] text-[#8e8a80]"
                  }`}
                >
                  12M · Monthly
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#e89b3c]" />
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Outflow (Spend)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#4ea885]" />
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Net Revenue
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Chart Canvas */}
            <div className="relative h-[230px] w-full sm:h-[256px]">
              <svg
                viewBox="0 0 680 256"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
                role="img"
                aria-label="Chart showing Spend climbing through peaks and dips while Revenue stays near the floor with tiny blips"
              >
                <defs>
                  <linearGradient
                    id="dashboard-spend-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#e89b3c" stopOpacity="0.32" />
                    <stop offset="65%" stopColor="#e89b3c" stopOpacity="0.08" />
                    <stop
                      offset="100%"
                      stopColor="#e89b3c"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="dashboard-rev-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4ea885" stopOpacity="0.18" />
                    <stop
                      offset="100%"
                      stopColor="#4ea885"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Vertical X-Axis Grid Columns */}
                {xLabels.map(({ ptIdx, label }) => {
                  const xPos = +(
                    plotLeft +
                    (ptIdx / (totalDataPoints - 1)) * plotWidth
                  ).toFixed(1);
                  return (
                    <g key={label}>
                      <line
                        x1={xPos}
                        y1={plotTop}
                        x2={xPos}
                        y2={plotBottom}
                        stroke={
                          isLight
                            ? "rgba(20,20,19,0.05)"
                            : "rgba(244,240,234,0.04)"
                        }
                        strokeWidth="1"
                      />
                      {/* X-Axis Tick & Month Label */}
                      <line
                        x1={xPos}
                        y1={plotBottom}
                        x2={xPos}
                        y2={plotBottom + 5}
                        stroke={
                          isLight
                            ? "rgba(20,20,19,0.2)"
                            : "rgba(244,240,234,0.18)"
                        }
                        strokeWidth="1"
                      />
                      <text
                        x={xPos}
                        y={plotBottom + 19}
                        textAnchor="middle"
                        fill={
                          label === "NOW"
                            ? "#e89b3c"
                            : isLight
                            ? "#6e6960"
                            : "#6e6b64"
                        }
                        className={`font-mono-label text-[9px] ${
                          label === "NOW" ? "font-semibold" : ""
                        }`}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Horizontal Y-Axis Grid Lines & Dollar Scale Labels */}
                {yTicks.map(({ y, label }, idx) => {
                  const isBaseline = idx === yTicks.length - 1;
                  return (
                    <g key={y}>
                      <line
                        x1={plotLeft}
                        y1={y}
                        x2={plotRight}
                        y2={y}
                        stroke={
                          isBaseline
                            ? isLight
                              ? "rgba(20,20,19,0.22)"
                              : "rgba(244,240,234,0.18)"
                            : isLight
                            ? "rgba(20,20,19,0.08)"
                            : "rgba(244,240,234,0.07)"
                        }
                        strokeWidth={isBaseline ? "1.5" : "1"}
                        strokeDasharray={isBaseline ? undefined : "4 6"}
                      />
                      <text
                        x={plotLeft - 10}
                        y={y + 3}
                        textAnchor="end"
                        fill={isLight ? "#6e6960" : "#6e6b64"}
                        className="font-mono-label text-[9px]"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Left Y-Axis Spine */}
                <line
                  x1={plotLeft}
                  y1={plotTop}
                  x2={plotLeft}
                  y2={plotBottom}
                  stroke={
                    isLight
                      ? "rgba(20,20,19,0.14)"
                      : "rgba(244,240,234,0.12)"
                  }
                  strokeWidth="1"
                />

                {/* Steep Climbing Spend Area & Spiky Multi-Peak/Drop Curve */}
                <path d={spendAreaPath} fill="url(#dashboard-spend-grad)" />
                <path
                  d={spendLinePath}
                  fill="none"
                  stroke="#e89b3c"
                  strokeWidth="2.5"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="6"
                />

                {/* Spend Spike Peak Vertex Dots */}
                {spendPoints.map((pt, idx) => {
                  const isLast = idx === spendPoints.length - 1;
                  const isMajorSpike =
                    idx === 2 || idx === 6 || idx === 10 || idx === 14 || idx === 18 || isLast;
                  if (!isMajorSpike) return null;
                  return (
                    <circle
                      key={`spend-pt-${idx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isLast ? "5" : "2.75"}
                      fill={
                        isLast
                          ? "#e89b3c"
                          : isLight
                          ? "#f6f3ec"
                          : "#0b0b0f"
                      }
                      stroke="#e89b3c"
                      strokeWidth={isLast ? "2" : "1.75"}
                    />
                  );
                })}

                {/* The Gap Annotation (Vertical Burn Delta Callout at Major Spike) */}
                <line
                  x1={spendPoints[18].x}
                  y1={spendPoints[18].y + 6}
                  x2={spendPoints[18].x}
                  y2={revenuePoints[18].y - 4}
                  stroke="#e89b3c"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity="0.55"
                />

                {/* Revenue Area & Spiky Curve (Tiny Blips Hugging the Floor) */}
                <path d={revenueAreaPath} fill="url(#dashboard-rev-grad)" />
                <path
                  d={revenueLinePath}
                  fill="none"
                  stroke="#4ea885"
                  strokeWidth="2"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="6"
                />

                {/* Revenue Endpoint Dot */}
                <circle
                  cx={revEndPt.x}
                  cy={revEndPt.y}
                  r="4"
                  fill="#4ea885"
                  stroke={isLight ? "#f6f3ec" : "#0b0b0f"}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Floating Callout Labels inside the Chart */}
              <div
                style={{
                  top: `${Math.max(4, Math.round((spendEndY / 256) * 100) - 13)}%`,
                }}
                className="pointer-events-none absolute right-3 rounded-md border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-2 py-0.5 font-mono-label text-[10px] font-semibold text-[#e89b3c] backdrop-blur-xs transition-all duration-300"
              >
                SPEND: ${displaySpent}
              </div>

              <div className="pointer-events-none absolute bottom-10 right-3 rounded-md border border-[#4ea885]/35 bg-[var(--bg-panel)]/90 px-2 py-0.5 font-mono-label text-[10px] text-[#4ea885]">
                REVENUE: {formattedEarned}
              </div>
            </div>
          </div>

          {/* BOTTOM TWO SIDE-BY-SIDE BOXES INSIDE DASHBOARD */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* BOTTOM-LEFT BOX: LIVE DATA-DRIVEN RETURN CARD */}
            <div
              className={`flex flex-col justify-between rounded-xl border p-4 sm:p-5 ${
                isLight
                  ? "border-black/10 bg-[#fbf9f5]"
                  : "border-white/[0.08] bg-[#16161d]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Return
                </span>
                <span className="rounded bg-[#e89b3c]/15 px-2 py-0.5 font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e89b3c] tabular-nums">
                  {yieldPercent}% Yield
                </span>
              </div>

              <div className="my-3">
                <span
                  data-testid="dashboard-return-tile"
                  className="font-mono-label text-lg font-semibold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-xl"
                >
                  ${returnPerDollar.toFixed(2)} back per $1
                </span>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {displaySpent > 0
                    ? `${burnPercent}% of your spend ($${netBurnDollars} burned) went to tools, agencies, and rebuilds.`
                    : "Click +$20, +$50, or +$100 to measure your return per $1 spent."}
                </p>
              </div>

              {/* Live Data-Driven Visual Bar Comparison */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between font-mono-label text-[9px] uppercase tracking-[0.16em] tabular-nums text-[var(--text-muted)]">
                  <span>Burned (${(1 - returnPerDollar).toFixed(2)})</span>
                  <span className="text-[#4ea885]">
                    Returned (${returnPerDollar.toFixed(2)})
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-black/20">
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
            </div>

            {/* BOTTOM-RIGHT BOX: RESPECTFUL FOUNDER-EMPATHETIC DIAGNOSIS */}
            <div
              className={`flex flex-col justify-between rounded-xl border p-4 sm:p-5 ${
                isLight
                  ? "border-black/10 bg-[#fbf9f5]"
                  : "border-white/[0.08] bg-[#16161d]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Diagnosis
                </span>
                <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#e89b3c]">
                  {displaySpent > 0
                    ? `Net leak: -$${netBurnDollars}`
                    : "Funnel audit"}
                </span>
              </div>

              <div className="my-3">
                <p className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-xl">
                  Your product isn&apos;t the problem.{" "}
                  <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                    The leak is.
                  </span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  You already did the hard work of building it. More tools and
                  rebuilds won&apos;t fix the gap between traffic and revenue.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 font-mono-label text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <span>Product: Ready</span>
                <span className="text-[#e89b3c]">Conversion: Leaking</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (lg:col-span-6):
            - Top-Right Editorial Copy (Right-Aligned, matching user's image)
            - Bottom-Right Space reserved for the shared Section 1 TypewriterStage
              (which slides its $20/$50/$100 buttons & vintage typewriter here)
        ===================================================================== */}
        <div className="flex flex-col justify-between lg:col-span-6 lg:min-h-[640px]">
          {/* TOP-RIGHT EDITORIAL COPY (Right-Aligned on Desktop as in Reference Image) */}
          <div
            ref={copyBlockRef}
            className="flex flex-col items-start text-left lg:ml-auto lg:max-w-[520px] lg:items-end lg:text-right"
          >
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                02 / WHERE THE MONEY WENT
              </span>
            </div>

            <h2
              id="dashboard-heading"
              className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl xl:text-[3.5rem]"
            >
              You keep paying.
              <span className="font-serif-editorial mt-1 block font-normal italic tracking-[-0.015em] text-[var(--text-primary)]">
                Still not profitable.
              </span>
            </h2>

            <p className="mt-4 max-w-[480px] text-base font-medium leading-snug text-[var(--text-primary)] sm:text-[18px]">
              The product is live. People visit. Revenue stays flat.
            </p>

            <p className="mt-2.5 max-w-[480px] text-sm font-normal leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]">
              Every new tool, agency and relaunch costs more, and none of them
              moves the one number that matters. Most stuck products break in
              one specific place. Let&apos;s fix it together!
            </p>
          </div>

          {/* MOBILE ONLY (< lg): Horizontal Spend Buttons + Peeking Typewriter
              (On desktop lg+, the actual Section 1 TypewriterStage occupies this bottom-right space) */}
          <div className="mt-8 flex flex-col gap-4 lg:hidden">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Spend Controls — Tap to feed the machine
            </span>
            <div className="grid grid-cols-3 gap-3">
              {([20, 50, 100] as const).map((tier, idx) => {
                const isLit = activeCard === tier;
                const labels = [
                  "TOOLS & SUBS",
                  "ADS & GROWTH",
                  "DEVS & REBUILD",
                ];
                return (
                  <button
                    key={tier}
                    type="button"
                    disabled={isTransitionLocked}
                    onClick={() => handleMobileCardClick(tier)}
                    className={`group relative flex h-[84px] cursor-pointer flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 active:scale-[0.97] ${
                      isLit
                        ? "bg-[#e89b3c] text-[#08080a] shadow-[0_0_32px_rgba(232,155,60,0.65)]"
                        : isLight
                        ? "bg-[#e2ddd3] text-[#141413] ring-1 ring-black/10 hover:bg-[#e89b3c] hover:text-[#08080a]"
                        : "bg-[#16161d] text-[#f4f0ea] ring-1 ring-white/10 hover:bg-[#e89b3c] hover:text-[#08080a]"
                    }`}
                  >
                    <span className="font-mono-label text-[8px] uppercase tracking-[0.15em] opacity-65">
                      {labels[idx]}
                    </span>
                    <span className="font-mono-label text-xl font-semibold tracking-tight">
                      +${tier}
                    </span>
                    <span className="font-mono-label text-[8px] uppercase tracking-[0.15em] opacity-65">
                      ⚡ Feed cash →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop spacer so the right column matches the height needed for the shared Typewriter below the copy */}
          <div
            aria-hidden="true"
            className="hidden pointer-events-none lg:block lg:h-[370px]"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Miniature torn/creased "1 USD" bill that drops onto the flat Revenue line
 * whenever the user clicks the $100 spend card, keeping the central character in the story.
 */
function DroppedBillDataPoint({
  index,
  leftPercent,
}: {
  index: number;
  leftPercent: number;
}) {
  const billRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!billRef.current) return;
    gsap.fromTo(
      billRef.current,
      {
        y: -115,
        rotation: -14 + (index % 3) * 8,
        scale: 1.25,
        opacity: 0,
      },
      {
        y: 0,
        rotation: -4 + (index % 2) * 7,
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: "bounce.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={billRef}
      style={{ left: `${leftPercent}%` }}
      title="$1.00 revenue from $100 spend"
      className="pointer-events-none absolute bottom-[12px] z-20 -translate-x-1/2"
    >
      <div className="h-[26px] w-[54px] overflow-hidden rounded-[2px] shadow-[0_6px_14px_rgba(0,0,0,0.55)] ring-1 ring-[#789d70]/60">
        <DollarBillGraphic idPrefix={`chart-bill-${index}`} />
      </div>
    </div>
  );
}
