"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { CrispDollarBillGraphic } from "./TestSolutionStage";

type SpendTier = 20 | 50 | 100;

interface LaunchMeasureStageProps {
  /** 0..1 progress of Stage 4 ("Launch and measure") */
  launchProgress: number;
  isLight: boolean;
}

const PROFIT_MULTIPLIER = 4.2; // Every $1 spent now yields $4.20 in revenue

const LAUNCH_TERMINAL_LOGS: Record<SpendTier, [string, string]> = {
  20: [
    "scaling high-converting acquisition...",
    "+$20.00 spent → +$84.00 revenue!",
  ],
  50: [
    "compounding verified funnel...",
    "+$50.00 spent → +$210.00 revenue!",
  ],
  100: [
    "shipping high-ROI feature release...",
    "+$100.00 spent → +$420.00 revenue!",
  ],
};

export default function LaunchMeasureStage({
  launchProgress,
  isLight,
}: LaunchMeasureStageProps) {
  const [spent, setSpent] = useState<number>(280);
  const [earned, setEarned] = useState<number>(1180);
  const [activeTier, setActiveTier] = useState<SpendTier | null>(null);
  const [billPercent, setBillPercent] = useState<number>(62);
  const [terminalLines, setTerminalLines] = useState<[string, string]>([
    "leaks fixed · funnel verified",
    "revenue outpacing spend (4.2x ROI)",
  ]);

  const typewriterChassisRef = useRef<HTMLDivElement | null>(null);
  const carriageHandleRef = useRef<HTMLDivElement | null>(null);
  const pulseDotGroupRef = useRef<SVGGElement | null>(null);
  const wire20PathRef = useRef<SVGPathElement | null>(null);
  const wire50PathRef = useRef<SVGPathElement | null>(null);
  const wire100PathRef = useRef<SVGPathElement | null>(null);

  // Fade & scale in as Stage 4 ("Launch and measure") enters
  const stageOpacity = Math.max(0, Math.min(1, (launchProgress - 0.15) / 0.45));
  const stageScale = 0.95 + 0.05 * stageOpacity;
  const isInteractive = stageOpacity > 0.55;

  const animateCarriageHandle = () => {
    if (!carriageHandleRef.current) return;
    gsap.killTweensOf(carriageHandleRef.current);
    const tl = gsap.timeline();
    tl.to(carriageHandleRef.current, {
      rotation: -26,
      x: -7,
      y: 2,
      duration: 0.14,
      ease: "power3.out",
    })
      .to(carriageHandleRef.current, {
        rotation: 6,
        x: 2,
        y: 0,
        duration: 0.18,
        ease: "back.out(2.1)",
      })
      .to(carriageHandleRef.current, {
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.22,
        ease: "elastic.out(1.1, 0.5)",
      });
  };

  const animateWirePulse = (tier: SpendTier) => {
    const pathEl =
      tier === 20
        ? wire20PathRef.current
        : tier === 50
        ? wire50PathRef.current
        : wire100PathRef.current;
    const dotGroup = pulseDotGroupRef.current;
    if (!pathEl || !dotGroup) return;

    const totalLen = pathEl.getTotalLength();
    gsap.killTweensOf(dotGroup);
    const proxy = { dist: 0 };
    const startPt = pathEl.getPointAtLength(0);
    dotGroup.setAttribute(
      "transform",
      `translate(${startPt.x.toFixed(1)}, ${startPt.y.toFixed(1)})`
    );

    gsap.fromTo(
      dotGroup,
      { opacity: 1, scale: 0.9 },
      { opacity: 1, scale: 1.15, duration: 0.12 }
    );

    gsap.to(proxy, {
      dist: totalLen,
      duration: 0.42,
      ease: "power2.in",
      onUpdate: () => {
        const pt = pathEl.getPointAtLength(proxy.dist);
        dotGroup.setAttribute(
          "transform",
          `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`
        );
      },
      onComplete: () => {
        gsap.to(dotGroup, { opacity: 0, duration: 0.15 });
      },
    });
  };

  const handleInjectSpend = (tier: SpendTier) => {
    if (!isInteractive) return;

    setActiveTier(tier);
    const addedRevenue = Math.round(tier * PROFIT_MULTIPLIER);
    setSpent((prev) => prev + tier);
    setEarned((prev) => prev + addedRevenue);
    setTerminalLines(LAUNCH_TERMINAL_LOGS[tier]);
    setBillPercent((prev) => (prev >= 90 ? 64 : Math.min(96, prev + 18)));

    animateWirePulse(tier);
    animateCarriageHandle();

    if (typewriterChassisRef.current) {
      gsap.fromTo(
        typewriterChassisRef.current,
        { x: -2, y: 1 },
        {
          x: 2,
          y: -1,
          duration: 0.045,
          repeat: 8,
          yoyo: true,
          ease: "none",
          onComplete: () => {
            gsap.set(typewriterChassisRef.current, { x: 0, y: 0 });
          },
        }
      );
    }

    setTimeout(() => {
      setActiveTier((curr) => (curr === tier ? null : curr));
    }, 650);
  };

  // =========================================================================
  // PROFITABILITY CHART GEOMETRY (Spend stays controlled & low, Revenue climbs high!)
  // =========================================================================
  const plotLeft = 48;
  const plotRight = 548;
  const plotTop = 22;
  const plotBottom = 188;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const yAxisMax = Math.max(1500, Math.ceil((earned + 250) / 500) * 500);
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
    {
      y: Math.round(plotTop + plotHeight * 0.33),
      label: formatAxisDollar(Math.round(yAxisMax * 0.67)),
    },
    {
      y: Math.round(plotTop + plotHeight * 0.66),
      label: formatAxisDollar(Math.round(yAxisMax * 0.33)),
    },
    { y: plotBottom, label: "$0" },
  ];

  const totalDataPoints = 16;
  const xLabels = [
    { ptIdx: 0, label: "Q1" },
    { ptIdx: 5, label: "Q2" },
    { ptIdx: 10, label: "Q3" },
    { ptIdx: 15, label: "NOW" },
  ];

  // Controlled, lean Spend curve (stays low in the bottom 18%–28% of the chart)
  const spendRatioCap = Math.min(0.32, Math.max(0.18, spent / yAxisMax));
  const leanSpendProfile = [
    0.1, 0.12, 0.14, 0.13, 0.15, 0.16, 0.15, 0.17, 0.18, 0.17, 0.19, 0.2, 0.21,
    0.2, 0.22, 0.24,
  ];
  const spendPoints = leanSpendProfile.map((r, idx) => {
    const x = +(plotLeft + (idx / (totalDataPoints - 1)) * plotWidth).toFixed(
      1
    );
    const scaled =
      idx === totalDataPoints - 1
        ? spendRatioCap
        : r * (spendRatioCap / 0.24);
    const y = +(plotBottom - Math.min(0.36, scaled) * plotHeight).toFixed(1);
    return { x, y };
  });

  // High-Growth Revenue curve (climbs steeply above Spend into the top 78%–94% of the chart)
  const revRatioCap = Math.min(0.94, Math.max(0.72, earned / yAxisMax));
  const climbingRevenueProfile = [
    0.11, 0.16, 0.22, 0.29, 0.34, 0.42, 0.49, 0.56, 0.62, 0.69, 0.75, 0.81,
    0.85, 0.9, 0.95, 1.0,
  ];
  const revenuePoints = climbingRevenueProfile.map((r, idx) => {
    const x = +(plotLeft + (idx / (totalDataPoints - 1)) * plotWidth).toFixed(
      1
    );
    const y = +(
      plotBottom -
      Math.min(0.95, r * revRatioCap) * plotHeight
    ).toFixed(1);
    return { x, y };
  });

  const buildPath = (pts: { x: number; y: number }[]) =>
    pts.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");

  const spendLinePath = buildPath(spendPoints);
  const spendAreaPath = `${spendLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const revenueLinePath = buildPath(revenuePoints);
  const revenueAreaPath = `${revenueLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const spendEndPt = spendPoints[spendPoints.length - 1];
  const revEndPt = revenuePoints[revenuePoints.length - 1];
  const netProfit = Math.max(0, earned - spent);

  const hiddenFraction = Math.max(0, Math.min(60, 100 - billPercent));

  return (
    <div
      style={{
        opacity: stageOpacity,
        transform: `scale(${stageScale.toFixed(3)})`,
        pointerEvents: isInteractive ? "auto" : "none",
      }}
      className="relative flex h-full w-full items-center justify-center select-none"
    >
      <div className="flex w-full max-w-[1060px] flex-col items-center justify-center gap-6 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
        {/* ===================================================================
            LEFT SIDE OF TYPEWRITER: SPEND VS. REVENUE PROFITABILITY GRAPH
            (Sits cleanly below "4. Launch and measure" copy and above bottom bar)
        =================================================================== */}
        <div
          className={`w-full max-w-[500px] rounded-2xl border p-4 transition-colors duration-300 sm:p-5 lg:mt-6 lg:w-[460px] xl:w-[500px] ${
            isLight
              ? "border-black/10 bg-[#eae5dc]/95 shadow-[0_20px_50px_rgba(20,20,19,0.08)]"
              : "border-white/[0.08] bg-[#101015]/95 shadow-[0_24px_60px_rgba(0,0,0,0.78)]"
          }`}
        >
          {/* Top Bar: Spent, Earned & Net Profit */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10b981]">
                  Profitable Growth
                </span>
              </div>
              <p className="mt-0.5 font-mono-label text-xs text-[var(--text-secondary)]">
                Net Profit:{" "}
                <strong className="font-semibold text-[#10b981]">
                  +${netProfit.toLocaleString()}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Spent Pill */}
              <div
                className={`rounded-lg border px-3 py-1.5 ${
                  isLight
                    ? "border-black/10 bg-[#fbf9f5]"
                    : "border-white/[0.08] bg-[#17171f]"
                }`}
              >
                <span className="block font-mono-label text-[8.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Spent
                </span>
                <span className="font-mono-label text-base font-semibold tabular-nums text-[#e89b3c] sm:text-lg">
                  ${spent.toLocaleString()}
                </span>
              </div>

              {/* Earned Pill */}
              <div
                className={`rounded-lg border px-3 py-1.5 ${
                  isLight
                    ? "border-[#059669]/35 bg-[#e6f4ec]"
                    : "border-[#10b981]/35 bg-[#11221c]"
                }`}
              >
                <span className="block font-mono-label text-[8.5px] uppercase tracking-[0.18em] text-[#10b981]">
                  Revenue
                </span>
                <span className="font-mono-label text-base font-semibold tabular-nums text-[#10b981] sm:text-lg">
                  ${earned.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Chart Box */}
          <div
            className={`relative mt-3.5 rounded-xl border p-3.5 ${
              isLight
                ? "border-black/10 bg-[#f6f3ec]"
                : "border-white/[0.07] bg-[#0b0b0f]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Spend vs. Revenue
              </span>
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <span className="font-mono-label text-[9px] uppercase tracking-[0.14em] text-[#10b981]">
                    Revenue
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#e89b3c]" />
                  <span className="font-mono-label text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Spend
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-[185px] w-full sm:h-[205px]">
              <svg
                viewBox="0 0 580 215"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
                role="img"
                aria-label="Chart showing Revenue climbing far above Spend, generating net profit"
              >
                <defs>
                  <linearGradient
                    id="launch-rev-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.34" />
                    <stop offset="65%" stopColor="#10b981" stopOpacity="0.09" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient
                    id="launch-spend-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#e89b3c" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#e89b3c" stopOpacity="0.0" />
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
                      <text
                        x={xPos}
                        y={plotBottom + 16}
                        textAnchor="middle"
                        fill={
                          label === "NOW"
                            ? "#10b981"
                            : isLight
                            ? "#6e6960"
                            : "#6e6b64"
                        }
                        className={`font-mono-label text-[8.5px] ${
                          label === "NOW" ? "font-semibold" : ""
                        }`}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Horizontal Y-Axis Grid Lines */}
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
                        x={plotLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        fill={isLight ? "#6e6960" : "#6e6b64"}
                        className="font-mono-label text-[8.5px]"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* Profit Margin Vertical Callout Line between Revenue & Spend */}
                <line
                  x1={revEndPt.x}
                  y1={revEndPt.y + 6}
                  x2={spendEndPt.x}
                  y2={spendEndPt.y - 6}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.7"
                />

                {/* Steeply Climbing Revenue Area & Line (ABOVE Spend!) */}
                <path d={revenueAreaPath} fill="url(#launch-rev-grad)" />
                <path
                  d={revenueLinePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Revenue Vertex Dots */}
                {revenuePoints.map((pt, idx) => {
                  const isLast = idx === revenuePoints.length - 1;
                  if (idx % 3 !== 0 && !isLast) return null;
                  return (
                    <circle
                      key={`rev-${idx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={isLast ? "5" : "2.5"}
                      fill={
                        isLast
                          ? "#10b981"
                          : isLight
                          ? "#f6f3ec"
                          : "#0b0b0f"
                      }
                      stroke="#10b981"
                      strokeWidth={isLast ? "2" : "1.6"}
                    />
                  );
                })}

                {/* Controlled Low Spend Area & Line (BELOW Revenue!) */}
                <path d={spendAreaPath} fill="url(#launch-spend-grad)" />
                <path
                  d={spendLinePath}
                  fill="none"
                  stroke="#e89b3c"
                  strokeWidth="2"
                />
                <circle
                  cx={spendEndPt.x}
                  cy={spendEndPt.y}
                  r="3.5"
                  fill="#e89b3c"
                  stroke={isLight ? "#f6f3ec" : "#0b0b0f"}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Floating Revenue & Spend Callout Badges on the Chart */}
              <div
                style={{
                  top: `${Math.max(2, Math.round((revEndPt.y / 215) * 100) - 10)}%`,
                }}
                className="pointer-events-none absolute right-2 rounded-md border border-[#10b981]/45 bg-[#10b981]/15 px-2 py-0.5 font-mono-label text-[9.5px] font-semibold text-[#10b981] backdrop-blur-xs transition-all duration-300"
              >
                REVENUE: ${earned.toLocaleString()}
              </div>

              <div
                style={{
                  top: `${Math.min(76, Math.round((spendEndPt.y / 215) * 100) - 6)}%`,
                }}
                className="pointer-events-none absolute right-2 rounded-md border border-[#e89b3c]/40 bg-[var(--bg-panel)]/90 px-2 py-0.5 font-mono-label text-[9.5px] text-[#e89b3c] transition-all duration-300"
              >
                SPEND: ${spent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT SIDE: TYPEWRITER EXACTLY LIKE SECTION 1
            (3 Arched +$20 / +$50 / +$100 Buttons + Connecting Power Wires +
             Front-View Vintage Typewriter)
        =================================================================== */}
        <div className="relative h-[420px] w-[350px] shrink-0 sm:h-[440px] sm:w-[440px] lg:-mt-4 lg:h-[450px] lg:w-[470px] xl:w-[500px]">
          {/* LAYER 1: CONNECTING POWER WIRES FROM THE 3 ARCHED BUTTONS TO THE TYPEWRITER */}
          <svg
            aria-hidden="true"
            viewBox="0 0 500 490"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          >
            {/* Base conduit tracks */}
            <path
              ref={wire20PathRef}
              d="M 62 96 Q 115 215 185 255"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.18)" : "rgba(244,240,234,0.14)"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              ref={wire50PathRef}
              d="M 250 74 Q 250 175 250 245"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.18)" : "rgba(244,240,234,0.14)"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              ref={wire100PathRef}
              d="M 438 96 Q 385 215 315 255"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.22)" : "rgba(232,155,60,0.22)"}
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Animated dotted energy streams */}
            <path
              d="M 62 96 Q 115 215 185 255"
              fill="none"
              stroke={activeTier === 20 ? "#10b981" : "#e89b3c"}
              strokeWidth={activeTier === 20 ? "3.2" : "2.2"}
              strokeLinecap="round"
              strokeDasharray={activeTier === 20 ? undefined : "3 10"}
              className={activeTier === 20 ? "" : "wire-energy-flow"}
            />
            <path
              d="M 250 74 Q 250 175 250 245"
              fill="none"
              stroke={activeTier === 50 ? "#10b981" : "#e89b3c"}
              strokeWidth={activeTier === 50 ? "3.2" : "2.2"}
              strokeLinecap="round"
              strokeDasharray={activeTier === 50 ? undefined : "3 10"}
              className={activeTier === 50 ? "" : "wire-energy-flow"}
            />
            <path
              d="M 438 96 Q 385 215 315 255"
              fill="none"
              stroke={activeTier === 100 ? "#10b981" : "#e89b3c"}
              strokeWidth={activeTier === 100 ? "3.4" : "2.4"}
              strokeLinecap="round"
              strokeDasharray={activeTier === 100 ? undefined : "3 10"}
              className={activeTier === 100 ? "" : "wire-energy-flow"}
            />

            {/* Traveling energy pulse dot */}
            <g
              ref={pulseDotGroupRef}
              style={{
                opacity: 0,
                filter: "drop-shadow(0 0 10px rgba(16,185,129,0.95))",
              }}
            >
              <circle r="9" fill="#10b981" opacity="0.35" />
              <circle
                r="5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.2"
              />
            </g>
          </svg>

          {/* LAYER 2: THREE ARCHED SPEND BUTTONS ABOVE TYPEWRITER (EXACT SECTION 1 LAYOUT) */}
          {/* NODE 1: +$20 (TOOLS & SUBS) */}
          <div className="pointer-events-auto absolute left-[0%] top-[4%] z-30">
            <button
              type="button"
              onClick={() => handleInjectSpend(20)}
              className={`group relative flex h-[72px] w-[104px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[78px] sm:w-[116px] ${
                activeTier === 20
                  ? "bg-[#10b981] text-[#08080a] shadow-[0_0_28px_rgba(16,185,129,0.55)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-black/12 shadow-[0_12px_28px_rgba(20,20,19,0.08)] hover:bg-[#e89b3c] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-white/[0.09] shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:bg-[#f4f0ea] hover:text-[#08080a]"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono-label text-[7.5px] font-medium uppercase tracking-[0.14em] opacity-65 sm:text-[8px]">
                  TOOLS &amp; SUBS
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
              </div>
              <span className="font-mono-label text-lg font-semibold tracking-tight sm:text-xl">
                +$20
              </span>
              <div className="flex w-full items-center justify-between border-t border-current/10 pt-0.5">
                <span className="font-mono-label text-[7.5px] uppercase tracking-[0.14em] opacity-70">
                  ⚡ +$84 rev
                </span>
                <span className="font-mono-label text-[8.5px] opacity-75">
                  →
                </span>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-1/2 flex h-2 w-4 -translate-x-1/2 items-center justify-center rounded-xs border border-white/25 bg-[#1b1b22]"
              >
                <span className="h-1 w-1 rounded-full bg-[#10b981]" />
              </span>
            </button>
          </div>

          {/* NODE 2: +$50 (ADS & GROWTH) */}
          <div className="pointer-events-auto absolute left-1/2 -top-[2%] z-30 -translate-x-1/2">
            <button
              type="button"
              onClick={() => handleInjectSpend(50)}
              className={`group relative flex h-[76px] w-[110px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[82px] sm:w-[122px] ${
                activeTier === 50
                  ? "bg-[#10b981] text-[#08080a] shadow-[0_0_32px_rgba(16,185,129,0.55)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-black/12 shadow-[0_12px_28px_rgba(20,20,19,0.08)] hover:bg-[#e89b3c] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-white/[0.09] shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:bg-[#f4f0ea] hover:text-[#08080a]"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono-label text-[7.5px] font-medium uppercase tracking-[0.14em] opacity-65 sm:text-[8px]">
                  ADS &amp; GROWTH
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
              </div>
              <span className="font-mono-label text-xl font-semibold tracking-tight sm:text-2xl">
                +$50
              </span>
              <div className="flex w-full items-center justify-between border-t border-current/10 pt-0.5">
                <span className="font-mono-label text-[7.5px] uppercase tracking-[0.14em] opacity-70">
                  ⚡ +$210 rev
                </span>
                <span className="font-mono-label text-[8.5px] opacity-75">
                  →
                </span>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-1/2 flex h-2 w-4 -translate-x-1/2 items-center justify-center rounded-xs border border-white/25 bg-[#1b1b22]"
              >
                <span className="h-1 w-1 rounded-full bg-[#10b981]" />
              </span>
            </button>
          </div>

          {/* NODE 3: +$100 (DEVS & REBUILD) */}
          <div className="pointer-events-auto absolute right-[0%] top-[3%] z-30">
            <button
              type="button"
              onClick={() => handleInjectSpend(100)}
              className={`group relative flex h-[80px] w-[118px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[86px] sm:w-[130px] ${
                activeTier === 100
                  ? "bg-[#10b981] text-[#08080a] shadow-[0_0_38px_rgba(16,185,129,0.65)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-[#10b981]/45 shadow-[0_14px_32px_rgba(20,20,19,0.10)] hover:bg-[#10b981] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-[#10b981]/35 shadow-[0_18px_42px_rgba(0,0,0,0.8)] hover:bg-[#10b981] hover:text-[#08080a]"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono-label text-[7.5px] font-semibold uppercase tracking-[0.13em] text-[#10b981] group-hover:text-[#08080a] sm:text-[8px]">
                  SCALE &amp; SHIP
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              </div>
              <span className="font-mono-label text-xl font-semibold tracking-tight sm:text-2xl">
                +$100
              </span>
              <div className="flex w-full items-center justify-between border-t border-current/15 pt-0.5">
                <span className="font-mono-label text-[7.5px] uppercase tracking-[0.14em] opacity-80">
                  ⚡ +$420 rev
                </span>
                <span className="font-mono-label text-[8.5px] opacity-80">
                  →
                </span>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-1/2 flex h-2 w-4 -translate-x-1/2 items-center justify-center rounded-xs border border-[#10b981]/60 bg-[#1b1b22]"
              >
                <span className="h-1 w-1 rounded-full bg-[#10b981]" />
              </span>
            </button>
          </div>

          {/* LAYER 3: FRONT-VIEW VINTAGE TYPEWRITER (EXACT SECTION 1 DESIGN) */}
          <div
            ref={typewriterChassisRef}
            className="pointer-events-auto absolute bottom-0 left-1/2 z-20 flex w-[320px] -translate-x-1/2 flex-col items-center sm:w-[390px] lg:w-[415px] xl:w-[435px]"
          >
            {/* Emerging Crisp $1 Bill */}
            <div className="relative z-20 -mb-2.5 flex w-full flex-col items-center">
              <div className="relative z-10 flex h-[96px] w-[212px] items-end justify-center overflow-hidden sm:h-[112px] sm:w-[258px] lg:h-[118px] lg:w-[276px]">
                <div
                  style={{
                    transform: `translateY(${hiddenFraction}%) rotate(-0.8deg)`,
                  }}
                  className="relative h-full w-full transition-transform duration-500 ease-out"
                >
                  <CrispDollarBillGraphic idPrefix="launch-stage-crisp-bill" />
                </div>
              </div>
            </div>

            {/* Vintage Typewriter Carriage & Stepped Chassis */}
            <div className="relative z-30 flex w-full flex-col items-center">
              {/* 1. Carriage Platen Roller + Knurled Chrome Thumb Wheels */}
              <div className="mx-auto flex w-[96%] items-center justify-center">
                <div className="flex shrink-0 items-center">
                  <div
                    className={`flex h-6 w-3 flex-col justify-between rounded-l-sm border-y border-l py-0.5 sm:h-7 sm:w-3.5 ${
                      isLight
                        ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                        : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                    }`}
                  >
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                  </div>
                  <div className="h-2 w-1.5 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952]" />
                </div>

                <div className="relative flex h-7 flex-1 flex-col items-center justify-start rounded-sm border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12] shadow-md sm:h-8">
                  <div className="h-1.5 w-[76%] rounded-b-full bg-black" />
                  <div className="mt-1 flex w-[76%] items-center justify-between border-t border-[#d8d4cc]/80 px-4">
                    <span className="-mt-1 h-2.5 w-3 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a]" />
                    <span className="-mt-1 h-2.5 w-3 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a]" />
                  </div>
                  <div className="mt-auto flex h-1.5 w-[88%] items-center justify-between border-t border-white/15 bg-[#121216] px-2">
                    {Array.from({ length: 21 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-px ${
                          i === 10
                            ? "h-1.5 bg-[#10b981]"
                            : i % 4 === 0
                            ? "h-1 bg-[#d8d4cc]/70"
                            : "h-0.5 bg-[#d8d4cc]/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative flex shrink-0 items-center">
                  <div className="h-2 w-1.5 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952]" />
                  <div
                    className={`flex h-6 w-3 flex-col justify-between rounded-r-sm border-y border-r py-0.5 sm:h-7 sm:w-3.5 ${
                      isLight
                        ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                        : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                    }`}
                  >
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                  </div>

                  {/* Pivoting Carriage Return Lever */}
                  <div
                    ref={carriageHandleRef}
                    style={{ transformOrigin: "bottom left" }}
                    className="pointer-events-none absolute bottom-1.5 left-full -ml-1 flex flex-col items-end"
                  >
                    <div className="h-3 w-5 -rotate-12 rounded-full border border-black/30 bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669] shadow-[0_2px_10px_rgba(16,185,129,0.5)]" />
                    <div className="-mt-1 mr-1.5 h-8 w-2 rotate-25 rounded-full border border-black/25 bg-gradient-to-b from-[#f4f0ea] via-[#a8a49c] to-[#52504a] shadow-md" />
                  </div>
                </div>
              </div>

              {/* 2. Upper Ribbon Spool Hood & Typebar Basket */}
              <div
                className={`relative -mt-0.5 flex w-[88%] flex-col items-center rounded-t-[22px] border-x border-t px-3.5 pt-2.5 pb-1.5 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#f5f0e4] to-[#e5decb]"
                    : "border-white/15 bg-gradient-to-b from-[#2a2a33] to-[#1c1c23]"
                }`}
              >
                <div className="relative z-10 flex w-full items-center justify-between">
                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-inner sm:h-8 sm:w-8 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    } ${activeTier !== null ? "animate-spin" : ""}`}
                  >
                    <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                    <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                    <div className="z-10 h-3 w-3 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c]" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative mb-1 flex h-5 w-26 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e] shadow-inner sm:h-5.5 sm:w-32">
                      {[-52, -38, -24, -12, 0, 12, 24, 38, 52].map((deg) => (
                        <span
                          key={deg}
                          style={{
                            transform: `rotate(${deg}deg)`,
                            transformOrigin: "top center",
                          }}
                          className="absolute top-0 h-5.5 w-0.5 bg-gradient-to-b from-[#c8c4bc] to-[#4a4842] opacity-75"
                        />
                      ))}
                      <div className="z-10 h-2 w-3 rounded-b-xs border-x border-b border-[#10b981]/80 bg-[#2a2825]" />
                    </div>

                    <div className="flex items-center gap-1.5 rounded-sm border border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] px-2.5 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-[#10b981]" />
                      <span className="font-mono-label text-[8px] font-bold uppercase tracking-[0.22em] text-[#f3b15c] sm:text-[9px]">
                        YOUR BUSINESS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#10b981]" />
                    </div>
                  </div>

                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-inner sm:h-8 sm:w-8 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    } ${activeTier !== null ? "animate-spin" : ""}`}
                  >
                    <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                    <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                    <div className="z-10 h-3 w-3 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c]" />
                  </div>
                </div>
              </div>

              {/* 3. Lower Keybed Housing Terminal & Spacebar */}
              <div
                className={`relative -mt-0.5 w-full rounded-t-xl rounded-b-2xl border px-3.5 pt-2.5 pb-3 transition-all duration-300 sm:px-4 sm:pt-3 sm:pb-3.5 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#ede6d6] via-[#e2dac8] to-[#d2c9b4] shadow-[0_22px_48px_rgba(20,20,19,0.16)]"
                    : "border-white/12 bg-gradient-to-b from-[#22222b] via-[#15151b] to-[#0c0c10] shadow-[0_26px_55px_rgba(0,0,0,0.82)]"
                }`}
              >
                <div className="mx-auto mb-2 flex w-[96%] items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                    <span className="font-mono-label text-[7.5px] font-semibold uppercase tracking-[0.16em] text-[#10b981] sm:text-[8px]">
                      ✓ HIGH-YIELD ENGINE — 4.2x RETURN
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4, 5].map((segIdx) => (
                      <span
                        key={segIdx}
                        className="h-1.5 w-2 rounded-[1px] bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.75)]"
                      />
                    ))}
                  </div>
                </div>

                {/* Recessed Terminal Screen */}
                <div
                  className={`rounded-lg border p-2.5 shadow-inner ${
                    isLight
                      ? "border-black/15 bg-[#f7f3eb]"
                      : "border-white/10 bg-[#07070a]"
                  }`}
                >
                  <div
                    className={`mb-1.5 flex items-center justify-between border-b pb-1 ${
                      isLight ? "border-black/10" : "border-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-current/25" />
                      <span className="h-1.5 w-1.5 rounded-full bg-current/25" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>
                    <span className="font-mono-label text-[7.5px] uppercase tracking-[0.18em] opacity-60">
                      tty://revenue.log
                    </span>
                    <span className="font-mono-label text-[7.5px] font-semibold uppercase tracking-[0.16em] text-[#10b981]">
                      PROFITABLE
                    </span>
                  </div>

                  <div className="flex h-[44px] flex-col justify-end space-y-1 font-mono-label text-[9.5px] leading-snug sm:text-[10px]">
                    <div className="truncate px-1 opacity-70">
                      &gt; {terminalLines[0]}
                    </div>
                    <div
                      className={`truncate rounded px-1.5 py-0.5 font-semibold ${
                        isLight
                          ? "border-l-2 border-[#059669] bg-[#10b981]/15 text-[#065f46]"
                          : "border-l-2 border-[#10b981] bg-[#10b981]/15 text-[#ecfdf5]"
                      }`}
                    >
                      ▸ {terminalLines[1]}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Shift Keys + Spacebar */}
                <div
                  aria-hidden="true"
                  className="mt-2.5 flex items-center justify-center gap-2.5 px-1.5"
                >
                  <div
                    className={`flex h-5.5 w-5.5 items-center justify-center rounded-full border shadow-sm ${
                      isLight
                        ? "border-[#9e988c] bg-[#262522] text-[#f4f0ea]"
                        : "border-[#b8b3a8] bg-[#18181d] text-[#dcd8ce]"
                    }`}
                  >
                    <span className="font-mono-label text-[5.5px] font-bold">
                      SHIFT
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={`h-3 w-full max-w-[200px] rounded-sm border shadow-sm ${
                        isLight
                          ? "border-black/40 bg-gradient-to-b from-[#33312d] to-[#181715]"
                          : "border-white/15 bg-gradient-to-b from-[#32323d] to-[#14141a]"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex h-5.5 w-5.5 items-center justify-center rounded-full border shadow-sm ${
                      isLight
                        ? "border-[#9e988c] bg-[#262522] text-[#f4f0ea]"
                        : "border-[#b8b3a8] bg-[#18181d] text-[#dcd8ce]"
                    }`}
                  >
                    <span className="font-mono-label text-[5.5px] font-bold">
                      LOCK
                    </span>
                  </div>
                </div>
              </div>

              {/* Rubber Desk Feet */}
              <div
                aria-hidden="true"
                className="mx-auto flex w-[84%] justify-between px-5"
              >
                <div className="h-1.5 w-8 rounded-b-sm bg-[#141416]" />
                <div className="h-1.5 w-8 rounded-b-sm bg-[#141416]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
