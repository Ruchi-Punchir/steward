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
  const stickyStageRef = useRef<HTMLDivElement | null>(null);
  const dashboardBgBlurRef = useRef<HTMLDivElement | null>(null);
  const backdropVignetteRef = useRef<HTMLDivElement | null>(null);
  const dashboardShellRef = useRef<HTMLDivElement | null>(null);
  const copyBlockRef = useRef<HTMLDivElement | null>(null);

  // Refs for "Let's fix it together!" inline -> center headline handoff & Partnership lockup
  const inlineFixPhraseRef = useRef<HTMLSpanElement | null>(null);
  const inlineLetsFixRef = useRef<HTMLSpanElement | null>(null);
  const inlineTogetherBaseRef = useRef<HTMLSpanElement | null>(null);
  const inlineTogetherSerifRef = useRef<HTMLSpanElement | null>(null);
  const floatingHeadlineRef = useRef<HTMLDivElement | null>(null);
  const plusSignRef = useRef<HTMLDivElement | null>(null);
  const stewardLockupRef = useRef<HTMLDivElement | null>(null);
  const mobilePartnerTwRef = useRef<HTMLDivElement | null>(null);

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

  // Continuous scroll handoff animation:
  // 1) Entry into Section 2 (top 100% -> top 0%): Dashboard & Copy slide in
  // 2) Phase A inside Section 2 (0 -> 0.6 vh): "together" turns italic & orange (#e89b3c)
  // 3) Phase B inside Section 2 (0.6 -> 1.6 vh): "Let's fix it together" glides to center,
  //    background blurs & dims, and "+ Steward (Growth & Engineering Partner)" locks in next to the typewriter
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      // Entry timeline as Section 2 scrolls into view from Section 1
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 100%",
          end: "top 0%",
          scrub: true,
        },
      });

      if (dashboardShellRef.current) {
        entryTl.fromTo(
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
        entryTl.fromTo(
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

      // Measure exact offset of inline "Let's fix it together" relative to the center headline target (50% X, 24% Y)
      // Evaluated ONLY on ScrollTrigger refresh/resize — never during scroll frames!
      let cachedOffset = { x: 240, y: 36, scale: 0.31 };
      const measureInlineOffset = () => {
        const stageEl = stickyStageRef.current;
        const inlineEl = inlineFixPhraseRef.current;
        const floatEl = floatingHeadlineRef.current;
        if (!stageEl || !inlineEl || !floatEl) return cachedOffset;

        const stageRect = stageEl.getBoundingClientRect();
        const inlineRect = inlineEl.getBoundingClientRect();
        const copyY =
          (gsap.getProperty(copyBlockRef.current, "y") as number) || 0;
        const bgScale =
          (gsap.getProperty(dashboardBgBlurRef.current, "scaleX") as number) ||
          1;

        const inlineCenterX =
          (inlineRect.left - stageRect.left + inlineRect.width * 0.5) / bgScale;
        const inlineCenterY =
          (inlineRect.top - stageRect.top - copyY + inlineRect.height * 0.5) /
          bgScale;

        const targetCenterX = stageRect.width * 0.5;
        const targetCenterY = stageRect.height * 0.24;

        const naturalFloatW = floatEl.offsetWidth || 380;
        const naturalInlineW = inlineEl.offsetWidth || 125;
        const ratio = Math.max(
          0.24,
          Math.min(0.55, naturalInlineW / naturalFloatW)
        );

        cachedOffset = {
          x: Math.round(inlineCenterX - targetCenterX),
          y: Math.round(inlineCenterY - targetCenterY),
          scale: +ratio.toFixed(3),
        };
        return cachedOffset;
      };

      measureInlineOffset();

      // Pure GPU-accelerated GSAP Timeline for Section 2 -> Partnership Lockup (1.6 * vh total scroll)
      const partnerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.6}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measureInlineOffset();
          },
        },
      });

      // -----------------------------------------------------------------
      // PHASE A (0.0 -> 0.6): "together" smoothly crossfades into Instrument Serif italic orange (#e89b3c)
      // -----------------------------------------------------------------
      if (inlineLetsFixRef.current) {
        partnerTl.to(
          inlineLetsFixRef.current,
          {
            color: "var(--text-primary)",
            duration: 0.48,
            ease: "power2.out",
          },
          0.04
        );
      }

      if (inlineTogetherBaseRef.current) {
        partnerTl.to(
          inlineTogetherBaseRef.current,
          {
            opacity: 0,
            duration: 0.42,
            ease: "power2.out",
          },
          0.04
        );
      }

      if (inlineTogetherSerifRef.current) {
        partnerTl.fromTo(
          inlineTogetherSerifRef.current,
          {
            opacity: 0,
            scale: 0.94,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.48,
            ease: "back.out(1.6)",
          },
          0.06
        );
      }

      // -----------------------------------------------------------------
      // PHASE B (0.6 -> 1.6): "Let's fix it together" lifts off and glides to center,
      // background dims & blurs via GPU backdrop-filter, and "+ Steward" locks in
      // -----------------------------------------------------------------
      if (inlineFixPhraseRef.current) {
        partnerTl.to(
          inlineFixPhraseRef.current,
          {
            opacity: 0,
            duration: 0.06,
            ease: "none",
          },
          0.58
        );
      }

      if (floatingHeadlineRef.current) {
        partnerTl.fromTo(
          floatingHeadlineRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
          },
          0.58
        );

        partnerTl.fromTo(
          floatingHeadlineRef.current,
          {
            x: () => measureInlineOffset().x,
            y: () => measureInlineOffset().y,
            scale: () => measureInlineOffset().scale,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.88,
            ease: "power2.inOut",
            immediateRender: true,
          },
          0.58
        );
      }

      // GPU-composited scale & opacity fade on Section 2 Dashboard + vignette veil
      if (dashboardBgBlurRef.current) {
        partnerTl.to(
          dashboardBgBlurRef.current,
          {
            opacity: 0.08,
            scale: 0.96,
            duration: 0.86,
            ease: "power2.inOut",
          },
          0.6
        );
      }

      if (backdropVignetteRef.current) {
        partnerTl.to(
          backdropVignetteRef.current,
          {
            opacity: 1,
            duration: 0.86,
            ease: "power2.inOut",
          },
          0.6
        );
      }

      // Reveal "+" and "Steward / Growth & Engineering Partner" (1.02 -> 1.6)
      if (plusSignRef.current) {
        partnerTl.fromTo(
          plusSignRef.current,
          {
            opacity: 0,
            scale: 0.65,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: "power2.out",
          },
          1.05
        );
      }

      if (stewardLockupRef.current) {
        partnerTl.fromTo(
          stewardLockupRef.current,
          {
            opacity: 0,
            x: 28,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          1.05
        );
      }

      if (mobilePartnerTwRef.current) {
        partnerTl.fromTo(
          mobilePartnerTwRef.current,
          {
            opacity: 0,
            x: -28,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          1.05
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
      className="relative h-[260vh] w-full"
    >
      {/* Sticky Layer 1 (z-10): Section 2 Dashboard & Copy (sits below the lg:z-30 interactive Typewriter & Spend buttons) */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 z-10 flex h-screen w-full items-center overflow-hidden py-16 lg:py-20"
      >
        {/* Subtle ambient glow behind the dashboard */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.05)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />

        {/* LAYER 1: Section 2 Dashboard & Editorial Copy (blurs and dims as "Let's fix it together" moves to center) */}
        <div
          ref={dashboardBgBlurRef}
          className="relative z-10 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-10 px-6 will-change-[filter,opacity,transform] sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-24"
        >
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
            data-typewriter-anchor="dashboard-copy"
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
              one specific place.{" "}
              <span
                ref={inlineFixPhraseRef}
                className="inline-block whitespace-nowrap will-change-[opacity]"
              >
                <span ref={inlineLetsFixRef}>Let&apos;s fix it </span>
                <span className="relative inline-grid items-baseline">
                  {/* Upright base "together!" */}
                  <span
                    ref={inlineTogetherBaseRef}
                    className="col-start-1 row-start-1 will-change-[opacity]"
                  >
                    together!
                  </span>
                  {/* Same Instrument Serif italic used in "Still not profitable.", highlighted in orange */}
                  <span
                    ref={inlineTogetherSerifRef}
                    className="font-serif-editorial col-start-1 row-start-1 origin-center text-[1.24em] font-normal italic tracking-[-0.015em] text-[#e89b3c] opacity-0 drop-shadow-[0_0_16px_rgba(232,155,60,0.4)] will-change-[opacity,transform]"
                  >
                    together
                  </span>
                </span>
              </span>
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
      </div>

      {/* Sticky Layer 2 (z-40): Vignette Overlay & Partnership Lockup (sits ABOVE the lg:z-30 Section 2 Typewriter & Spend buttons) */}
      <div className="pointer-events-none sticky top-0 z-40 -mt-[100vh] flex h-screen w-full items-center overflow-hidden">
        {/* LAYER 2: GPU-Composited Vignette Veil (above Section 2 typewriter & buttons) */}
        <div
          ref={backdropVignetteRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 opacity-0 will-change-[opacity] ${
            isLight
              ? "bg-[radial-gradient(circle_at_center,rgba(245,242,235,0.88)_0%,rgba(245,242,235,0.98)_100%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(8,8,10,0.88)_0%,rgba(8,8,10,0.98)_100%)]"
          }`}
        />

        {/* LAYER 3: PARTNERSHIP LOCKUP OVERLAY (Matches User Mockup & Section 2 Headline Typography) */}
        <div className="pointer-events-none absolute inset-0 z-40">
          {/* Top-Center Headline: Same font & size as "You keep paying. Still not profitable." */}
          <div
            ref={floatingHeadlineRef}
            className="pointer-events-none absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] opacity-0 will-change-transform sm:text-5xl xl:text-[3.5rem]"
          >
            Let&apos;s fix it{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] drop-shadow-[0_0_24px_rgba(232,155,60,0.32)]">
              together
            </span>
          </div>

          {/* Static Partner Typewriter fixed alongside "+ Steward" across all viewports */}
          <div
            ref={mobilePartnerTwRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-1/2 top-[53%] mr-[40px] flex -translate-y-1/2 flex-col items-center opacity-0 will-change-transform sm:mr-[56px] lg:mr-[64px] xl:mr-[74px]"
          >
            {/* Scaled static replica of the Vintage Typewriter so it never flickers on scroll */}
            <div className="flex w-[150px] flex-col items-center sm:w-[210px] lg:w-[260px] xl:w-[278px]">
              {/* Emerging $1 Bill */}
              <div className="relative z-10 -mb-1.5 flex h-[48px] w-[112px] items-end justify-center overflow-hidden sm:h-[64px] sm:w-[152px] lg:h-[76px] lg:w-[190px] xl:h-[80px] xl:w-[200px]">
                <div
                  style={{ transform: "translateY(42%) rotate(-1.1deg)" }}
                  className="relative h-full w-full"
                >
                  <DollarBillGraphic idPrefix="static-partner-bill" />
                </div>
              </div>

              {/* 1. Vintage Carriage Platen Roller + Chrome Thumb Wheels */}
              <div className="relative z-20 mx-auto flex w-[96%] items-center justify-center">
                <div className="flex shrink-0 items-center">
                  <div
                    className={`flex h-3.5 w-2 flex-col justify-between rounded-l-xs border-y border-l py-0.5 sm:h-4 sm:w-2.5 ${
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

                <div className="relative flex h-4.5 flex-1 flex-col items-center justify-start rounded-xs border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12] shadow-md sm:h-5">
                  <div className="h-1 w-[74%] rounded-b-full bg-black" />
                  <div className="mt-0.5 flex w-[74%] items-center justify-between border-t border-[#d8d4cc]/80 px-3">
                    <span className="-mt-0.5 h-1.5 w-2 rounded-xs bg-[#2c2b28]" />
                    <span className="-mt-0.5 h-1.5 w-2 rounded-xs bg-[#2c2b28]" />
                  </div>
                </div>

                <div className="relative flex shrink-0 items-center">
                  <div className="h-1.5 w-1 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952]" />
                  <div
                    className={`flex h-3.5 w-2 flex-col justify-between rounded-r-xs border-y border-r py-0.5 sm:h-4 sm:w-2.5 ${
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
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border sm:h-5.5 sm:w-5.5 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-[#b8b3a8]" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex h-3 w-16 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e] sm:h-3.5 sm:w-22">
                      <div className="h-1.5 w-2 rounded-b-xs border-x border-b border-[#e89b3c]/80 bg-[#2a2825]" />
                    </div>
                    <div className="flex items-center gap-1 rounded-xs border border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] px-1.5 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                      <span className="font-mono-label text-[5.5px] font-bold uppercase tracking-[0.22em] text-[#f3b15c] sm:text-[6.5px]">
                        YOUR BUSINESS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                    </div>
                  </div>

                  <div
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border sm:h-5.5 sm:w-5.5 ${
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
                    className={`font-mono-label text-[5px] uppercase tracking-[0.14em] sm:text-[6px] ${
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
                  className={`rounded-md border p-1.5 sm:p-2 ${
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

                  <div className="space-y-0.5 text-left font-mono-label text-[5.5px] leading-tight sm:text-[6.5px]">
                    <div className="truncate opacity-60">&gt; business.sys ready</div>
                    <div className="truncate opacity-60">&gt; awaiting partner lockup...</div>
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
          </div>

          {/* Center "+" Sign */}
          <div
            ref={plusSignRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[55%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 will-change-transform"
          >
            <span className="absolute h-px w-8 bg-[var(--text-primary)]/85 sm:w-10 lg:w-11" />
            <span className="absolute h-8 w-px bg-[var(--text-primary)]/85 sm:h-10 lg:h-11" />
          </div>

          {/* Right-of-Center "Steward / Growth & Engineering Partner" Lockup (exact 64px lg / 74px xl gap from "+") */}
          <div
            ref={stewardLockupRef}
            className="pointer-events-none absolute left-1/2 top-[55%] ml-[40px] flex -translate-y-1/2 flex-col items-center text-center opacity-0 will-change-transform sm:ml-[56px] lg:ml-[64px] xl:ml-[74px]"
          >
            <span className="text-3xl font-medium tracking-[-0.025em] text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem]">
              Steward
            </span>
            <span className="mt-1.5 whitespace-nowrap text-xs font-normal tracking-[-0.01em] text-[var(--text-secondary)] sm:text-sm lg:text-[15px]">
              Growth &amp; Engineering Partner
            </span>
          </div>
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
