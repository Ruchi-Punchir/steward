"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmokeSparksCanvas from "./SmokeSparksCanvas";
import { useTheme } from "@/context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

type OrbTier = 20 | 50 | 100;
type PowerState = "idle" | "surge20" | "surge50" | "surge100" | "silence100";

interface OrbScorePopup {
  id: number;
  tier: OrbTier;
  x: number;
  y: number;
}

interface FlyingCompletedBill {
  id: number;
}

interface FloatingDelta {
  id: number;
  text: string;
}

interface TerminalLogEntry {
  id: number;
  text: string;
  isSummary?: boolean;
  tier?: OrbTier;
}

const TERMINAL_SEQUENCES: Record<
  OrbTier,
  { steps: string[]; summary: string }[]
> = {
  20: [
    {
      steps: [
        "launching social ad campaign...",
        "buying 420 clicks (0 conversions)...",
      ],
      summary: "20USD spent on ad campaign.",
    },
    {
      steps: [
        "briefing a freelance dev...",
        "refactoring landing page hero...",
      ],
      summary: "20USD spent on freelance dev.",
    },
    {
      steps: [
        "scraping 500 cold prospects...",
        "blasting automated outreach...",
      ],
      summary: "20USD spent on cold email tool.",
    },
    {
      steps: [
        "generating 12 new logo variants...",
        "tweaking button border radius...",
      ],
      summary: "20USD spent on UI redesign.",
    },
    {
      steps: [
        "subscribing to a new tool...",
        "annual plan, no refunds...",
      ],
      summary: "20USD spent on a tool nobody opened.",
    },
  ],
  50: [
    {
      steps: [
        "scaling search & display ads...",
        "traffic bouncing in 1.8s...",
      ],
      summary: "50USD spent on ad campaign.",
    },
    {
      steps: [
        "shipping chatbot widget...",
        "deploying dark mode v3...",
      ],
      summary: "50USD spent on dev features.",
    },
    {
      steps: [
        "publishing 30 blog posts...",
        "indexing zero-buyer keywords...",
      ],
      summary: "50USD spent on SEO automation.",
    },
    {
      steps: [
        "installing 5 analytics trackers...",
        "watching empty checkout funnel...",
      ],
      summary: "50USD spent on analytics stack.",
    },
    {
      steps: [
        "hiring agency, 3 months...",
        "approving 40-page strategy deck...",
      ],
      summary: "50USD spent on agency retainer.",
    },
  ],
  100: [
    {
      steps: [
        "hiring a dev team for a full rebuild...",
        "shipping 10,000 lines of code...",
        "yielding 1.00 USD return...",
      ],
      summary: "100USD spent on full rebuild.",
    },
    {
      steps: [
        "maxing out paid ad budget...",
        "burning impressions across 4 channels...",
        "yielding 1.00 USD return...",
      ],
      summary: "100USD spent on ad campaign.",
    },
    {
      steps: [
        "rebuilding entire MVP in 48h...",
        "migrating auth & billing stack...",
        "yielding 1.00 USD return...",
      ],
      summary: "100USD spent on weekend rebuild.",
    },
    {
      steps: [
        "relaunching, again...",
        "new brand, new site, new logo...",
        "yielding 1.00 USD return...",
      ],
      summary: "100USD spent on relaunch.",
    },
  ],
};

/**
 * Classic Vintage Green US $1 Federal Reserve Note — Old, Creased, Torn & Chewed by the Typewriter
 */
export function DollarBillGraphic({ idPrefix }: { idPrefix: string }) {
  return (
    <svg
      viewBox="0 0 320 165"
      className="h-full w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
      role="img"
      aria-label="Old, creased, and torn classic green 1 US Dollar bill"
    >
      <defs>
        {/* Aged cotton-linen greenback paper gradient */}
        <linearGradient
          id={`${idPrefix}-paper`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#d9e5cc" />
          <stop offset="28%" stopColor="#c3d4b4" />
          <stop offset="48%" stopColor="#adc29d" />
          <stop offset="53%" stopColor="#cfdec0" />
          <stop offset="78%" stopColor="#b9cca9" />
          <stop offset="100%" stopColor="#a7bc96" />
        </linearGradient>

        {/* Deep vintage paper stain / age vignette */}
        <radialGradient
          id={`${idPrefix}-age`}
          cx="50%"
          cy="50%"
          r="65%"
        >
          <stop offset="0%" stopColor="#d4c598" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#8c7d56" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3d3522" stopOpacity="0.42" />
        </radialGradient>

        {/* Fine intaglio green guilloche crosshatch pattern */}
        <pattern
          id={`${idPrefix}-guilloche`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
            stroke="#1e462c"
            strokeWidth="0.55"
            opacity="0.42"
          />
        </pattern>

        {/* Jagged torn paper outer silhouette (top-right rip, left roller bite, top-left nick) */}
        <clipPath id={`${idPrefix}-torn-clip`}>
          <path
            d="
              M 0 4
              L 42 0
              L 46 8
              L 51 2
              L 55 11
              L 61 0
              L 208 0
              L 215 16
              L 221 7
              L 228 24
              L 235 4
              L 241 0
              L 314 0
              L 320 9
              L 320 64
              L 310 69
              L 318 74
              L 307 81
              L 320 86
              L 320 165
              L 0 165
              L 0 108
              L 11 103
              L 3 97
              L 14 91
              L 0 85
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Main Torn & Creased Bill Group */}
      <g clipPath={`url(#${idPrefix}-torn-clip)`}>
        {/* Aged cotton-linen greenback base paper */}
        <rect width="320" height="165" fill={`url(#${idPrefix}-paper)`} />
        <rect width="320" height="165" fill={`url(#${idPrefix}-age)`} />

        {/* Diagonal accordion fold shadow bands (gives 3D crumpled paper depth) */}
        <polygon
          points="32,0 64,0 180,165 148,165"
          fill="#152b1c"
          opacity="0.14"
        />
        <polygon
          points="212,0 240,0 138,165 110,165"
          fill="#152b1c"
          opacity="0.12"
        />
        <polygon
          points="0,68 320,82 320,98 0,84"
          fill="#152b1c"
          opacity="0.11"
        />

        {/* Outer ornate intaglio green frame */}
        <rect
          x="7"
          y="7"
          width="306"
          height="151"
          fill={`url(#${idPrefix}-guilloche)`}
          stroke="#1a3d27"
          strokeWidth="2.3"
        />
        <rect
          x="12"
          y="12"
          width="296"
          height="141"
          fill="#c4d5b6"
          fillOpacity="0.82"
          stroke="#214a30"
          strokeWidth="1.2"
        />
        <rect
          x="15"
          y="15"
          width="290"
          height="135"
          fill="none"
          stroke="#2b5c3c"
          strokeWidth="0.75"
          strokeDasharray="3 1.5"
        />

        {/* Typewriter Platen Gear-Tooth Skid Marks along Left & Right Margins */}
        <g fill="#1c241e" opacity="0.42">
          {[22, 32, 42, 52, 62, 72, 114, 124, 134].map((yPos) => (
            <rect key={`l-${yPos}`} x="3" y={yPos} width="5" height="2.2" rx="0.5" />
          ))}
          {[26, 36, 46, 56, 96, 106, 116, 126].map((yPos) => (
            <rect key={`r-${yPos}`} x="312" y={yPos} width="5" height="2.2" rx="0.5" />
          ))}
        </g>

        {/* Four Corner "1" Green Rosettes */}
        <g transform="translate(28, 28)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry="10"
            fill="none"
            stroke="#84a98c"
            strokeWidth="0.7"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(292, 28)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry="10"
            fill="none"
            stroke="#84a98c"
            strokeWidth="0.7"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(28, 136)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(292, 136)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        {/* Header Banner */}
        <text
          x="160"
          y="24"
          textAnchor="middle"
          fill="#1b3d28"
          fontSize="6.5"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="serif"
        >
          FEDERAL RESERVE NOTE
        </text>
        <text
          x="160"
          y="35"
          textAnchor="middle"
          fill="#11291a"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1.4"
          fontFamily="serif"
        >
          THE UNITED STATES OF AMERICA
        </text>

        {/* Left Federal Reserve Seal + Green Serial Number */}
        <g transform="translate(68, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="none"
            stroke="#1b3a26"
            strokeWidth="1.4"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#1b3a26"
            strokeWidth="0.8"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#16301f"
            fontSize="12"
            fontWeight="800"
            fontFamily="serif"
          >
            L
          </text>
        </g>
        <text
          x="46"
          y="54"
          fill="#156b38"
          fontSize="7.2"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="monospace"
        >
          L00000001A
        </text>

        {/* Right Emerald Green Treasury Seal + Green Serial Number */}
        <g transform="translate(252, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#19723d"
            fillOpacity="0.14"
            stroke="#19723d"
            strokeWidth="1.5"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#19723d"
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#145c31"
            fontSize="11"
            fontWeight="900"
            fontFamily="serif"
          >
            $1
          </text>
        </g>
        <text
          x="218"
          y="112"
          fill="#156b38"
          fontSize="7.2"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="monospace"
        >
          L00000001A
        </text>

        {/* Center Portrait Oval (George Washington Green Intaglio Engraving) */}
        <g transform="translate(160, 82)">
          <ellipse
            cx="0"
            cy="0"
            rx="34"
            ry="40"
            fill="#adc29e"
            stroke="#173823"
            strokeWidth="2.2"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="30"
            ry="36"
            fill={`url(#${idPrefix}-guilloche)`}
            stroke="#285438"
            strokeWidth="0.9"
          />
          <path
            d="M -21 32 C -18 15, -10 11, 0 11 C 10 11, 18 15, 21 32 Z"
            fill="#183824"
          />
          <path d="M -5 12 L 0 25 L 5 12 Z" fill="#d9e5cc" />
          <path
            d="M -11 -14 C -15 -12, -16 -4, -14 2 C -12 5, -9 7, -9 10 L 9 10 C 9 7, 12 5, 14 2 C 16 -4, 15 -12, 11 -14 C 8 -20, -8 -20, -11 -14 Z"
            fill="#d4e0c7"
            stroke="#183824"
            strokeWidth="1.2"
          />
          <ellipse
            cx="0"
            cy="-4"
            rx="9.5"
            ry="12"
            fill="#c3d4b4"
            stroke="#183824"
            strokeWidth="1.1"
          />
          <line
            x1="-5"
            y1="-6"
            x2="-2"
            y2="-6"
            stroke="#142e1d"
            strokeWidth="1.3"
          />
          <line
            x1="2"
            y1="-6"
            x2="5"
            y2="-6"
            stroke="#142e1d"
            strokeWidth="1.3"
          />
          <path
            d="M 0 -6 L -1 0 L 1 0"
            fill="none"
            stroke="#142e1d"
            strokeWidth="1.1"
          />
          <path
            d="M -4 4 Q 0 1.5 4 4"
            fill="none"
            stroke="#142e1d"
            strokeWidth="1.2"
          />
        </g>

        {/* High-Contrast Classic Green "ONE • 1 USD" Bottom Banner */}
        <rect
          x="92"
          y="122"
          width="136"
          height="24"
          rx="2"
          fill="#163622"
          stroke="#d9e5cc"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="139"
          textAnchor="middle"
          fill="#eff5e8"
          fontSize="16"
          fontWeight="900"
          letterSpacing="3"
          fontFamily="monospace"
        >
          ONE • 1 USD
        </text>

        {/* Malfunctioning Typewriter Ribbon Smudge & Misaligned Strike Marks */}
        <g transform="rotate(-4 195 62)" opacity="0.55">
          <text
            x="178"
            y="62"
            fill="#8f2419"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="1.5"
            fontFamily="monospace"
          >
            #ERR-FEED
          </text>
        </g>
        <circle cx="112" cy="44" r="5" fill="#1a1c19" opacity="0.18" />
        <circle cx="115" cy="47" r="3" fill="#1a1c19" opacity="0.22" />
        <circle cx="204" cy="108" r="6" fill="#5e4b2b" opacity="0.16" />

        {/* Deep Paper Creases, Fold Cracks & Internal Rip Fissures */}
        <path
          d="M 35 0 L 92 78 L 155 165"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.8"
          opacity="0.65"
        />
        <path
          d="M 37 0 L 94 78 L 157 165"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <path
          d="M 228 18 L 172 86 L 118 165"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path
          d="M 230 18 L 174 86 L 120 165"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M 0 74 L 160 85 L 320 79"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.6"
          opacity="0.58"
        />
        <path
          d="M 0 76 L 160 87 L 320 81"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1.1"
          opacity="0.65"
        />
        <path
          d="M 265 0 L 242 52 L 288 112"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.1"
          opacity="0.45"
        />
      </g>

      {/* Dark Frayed Paper Edge Outline around the Tears so the rips pop visually */}
      <path
        d="M 42 0 L 46 8 L 51 2 L 55 11 L 61 0 M 208 0 L 215 16 L 221 7 L 228 24 L 235 4 L 241 0 M 320 64 L 310 69 L 318 74 L 307 81 L 320 86 M 0 108 L 11 103 L 3 97 L 14 91 L 0 85"
        fill="none"
        stroke="#e8efe0"
        strokeWidth="1.4"
        opacity="0.85"
      />
    </svg>
  );
}

interface WireSpringNode {
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  prevStartX: number;
  prevStartY: number;
}

export interface TypewriterStageProps {
  externalSpent?: number;
  externalEarned?: number;
  onSpend?: (tier: OrbTier, earnedDelta?: number) => void;
  isTransitionLocked?: boolean;
  handoffTriggerRef?: React.RefObject<HTMLElement | null>;
  onTransitionLockChange?: (locked: boolean) => void;
}

export default function TypewriterStage({
  externalSpent,
  externalEarned,
  onSpend,
  isTransitionLocked = false,
  handoffTriggerRef,
  onTransitionLockChange,
}: TypewriterStageProps = {}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Actual targets vs animated display counters
  const [spentTarget, setSpentTarget] = useState<number>(externalSpent ?? 0);
  const [displaySpent, setDisplaySpent] = useState<number>(externalSpent ?? 0);
  const [earnedTarget, setEarnedTarget] = useState<number>(externalEarned ?? 0);
  const [displayEarned, setDisplayEarned] = useState<number>(
    externalEarned ?? 0
  );

  // Bill printing progress: starts at 30% emerging from the typewriter
  const [billPercent, setBillPercent] = useState<number>(30);
  const billPercentRef = useRef<number>(30);

  const [powerState, setPowerState] = useState<PowerState>("idle");
  const [hasCompletedPayoff, setHasCompletedPayoff] = useState<boolean>(false);
  const [isBegging, setIsBegging] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogEntry[]>([
    { id: 1, text: "business.sys ready" },
    { id: 2, text: "awaiting spend..." },
  ]);
  const [orbPopups, setOrbPopups] = useState<OrbScorePopup[]>([]);
  const [flyingBills, setFlyingBills] = useState<FlyingCompletedBill[]>([]);
  const [spentDeltas, setSpentDeltas] = useState<FloatingDelta[]>([]);
  const [earnedDeltas, setEarnedDeltas] = useState<FloatingDelta[]>([]);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>("");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const typewriterGroupRef = useRef<HTMLDivElement | null>(null);
  const typewriterTiltRef = useRef<HTMLDivElement | null>(null);
  const carriageHandleRef = useRef<HTMLDivElement | null>(null);
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  const seqCursorRef = useRef<Record<OrbTier, number>>({ 20: 0, 50: 0, 100: 0 });
  const spentValueRef = useRef<HTMLSpanElement | null>(null);
  const earnedValueRef = useRef<HTMLSpanElement | null>(null);

  // Refs for the 3 magnetic/rubbery buttons and their bottom cable sockets
  const orb20PosRef = useRef<HTMLDivElement | null>(null);
  const orb50PosRef = useRef<HTMLDivElement | null>(null);
  const orb100PosRef = useRef<HTMLDivElement | null>(null);
  const orb20WrapRef = useRef<HTMLDivElement | null>(null);
  const orb50WrapRef = useRef<HTMLDivElement | null>(null);
  const orb100WrapRef = useRef<HTMLDivElement | null>(null);
  const orb20BtnRef = useRef<HTMLButtonElement | null>(null);
  const orb50BtnRef = useRef<HTMLButtonElement | null>(null);
  const orb100BtnRef = useRef<HTMLButtonElement | null>(null);
  const socket20Ref = useRef<HTMLSpanElement | null>(null);
  const socket50Ref = useRef<HTMLSpanElement | null>(null);
  const socket100Ref = useRef<HTMLSpanElement | null>(null);
  const hoveredOrbRef = useRef<OrbTier | null>(null);
  const heroCountersRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const [inDashboardMode, setInDashboardMode] = useState<boolean>(false);

  // Refs for dynamic physics SVG wire paths
  const wiresSvgRef = useRef<SVGSVGElement | null>(null);
  const wire20BaseRef = useRef<SVGPathElement | null>(null);
  const wire20FlowRef = useRef<SVGPathElement | null>(null);
  const wire20GlowRef = useRef<SVGPathElement | null>(null);

  const wire50BaseRef = useRef<SVGPathElement | null>(null);
  const wire50FlowRef = useRef<SVGPathElement | null>(null);
  const wire50GlowRef = useRef<SVGPathElement | null>(null);

  const wire100BaseRef = useRef<SVGPathElement | null>(null);
  const wire100FlowRef = useRef<SVGPathElement | null>(null);
  const wire100GlowRef = useRef<SVGPathElement | null>(null);

  // Ref & state for the glowing circle traveling from clicked button -> typewriter
  const pulseDotGroupRef = useRef<SVGGElement | null>(null);
  const pulseStateRef = useRef<{
    active: boolean;
    tier: OrbTier;
    progress: number;
  }>({
    active: false,
    tier: 20,
    progress: 0,
  });

  // Animated counter objects for GSAP number tweening
  const spentCounterObj = useRef<{ val: number }>({ val: 0 });
  const earnedCounterObj = useRef<{ val: number }>({ val: 0 });

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const uniqueIdRef = useRef<number>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const clearSequenceTimers = useCallback(() => {
    sequenceTimeoutsRef.current.forEach((t) => clearTimeout(t));
    sequenceTimeoutsRef.current = [];
  }, []);

  const resetIdleBegTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setIsBegging(false);
    idleTimerRef.current = setTimeout(() => {
      setIsBegging(true);
    }, 4000);
  }, []);

  useEffect(() => {
    resetIdleBegTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      clearSequenceTimers();
    };
  }, [resetIdleBegTimer, clearSequenceTimers]);

  // Sync external Spent / Earned when updated from Dashboard section
  useEffect(() => {
    if (typeof externalSpent === "number" && externalSpent !== spentTarget) {
      setSpentTarget(externalSpent);
    }
  }, [externalSpent, spentTarget]);

  useEffect(() => {
    if (typeof externalEarned === "number" && externalEarned !== earnedTarget) {
      setEarnedTarget(externalEarned);
    }
  }, [externalEarned, earnedTarget]);

  // Animate Spent counter in a rolling counter manner whenever spentTarget increases
  useEffect(() => {
    if (spentTarget === 0) return;

    if (reducedMotion) {
      setDisplaySpent(spentTarget);
      return;
    }

    gsap.to(spentCounterObj.current, {
      val: spentTarget,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        setDisplaySpent(Math.round(spentCounterObj.current.val));
      },
    });

    if (spentValueRef.current) {
      gsap.fromTo(
        spentValueRef.current,
        { scale: 1.24, y: -3 },
        {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.2, 0.4)",
        }
      );
    }
  }, [spentTarget, reducedMotion]);

  // Animate Earned counter in a rolling counter manner whenever earnedTarget increases
  useEffect(() => {
    if (earnedTarget === 0) return;

    if (reducedMotion) {
      setDisplayEarned(earnedTarget);
      return;
    }

    gsap.to(earnedCounterObj.current, {
      val: earnedTarget,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayEarned(+(earnedCounterObj.current.val).toFixed(2));
      },
    });

    if (earnedValueRef.current) {
      gsap.fromTo(
        earnedValueRef.current,
        { scale: 1.32, y: -4 },
        {
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.25, 0.35)",
        }
      );
    }
  }, [earnedTarget, reducedMotion]);

  // Distance-based mouse follow (closer buttons move faster) + Typewriter 3D tilt
  useEffect(() => {
    if (reducedMotion) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!stageRef.current) return;

      const orbs: {
        tier: OrbTier;
        wrap: HTMLDivElement | null;
        btn: HTMLButtonElement | null;
        maxPull: number;
      }[] = [
        { tier: 20, wrap: orb20WrapRef.current, btn: orb20BtnRef.current, maxPull: 26 },
        { tier: 50, wrap: orb50WrapRef.current, btn: orb50BtnRef.current, maxPull: 30 },
        { tier: 100, wrap: orb100WrapRef.current, btn: orb100BtnRef.current, maxPull: 34 },
      ];

      orbs.forEach(({ tier, wrap, btn, maxPull }) => {
        if (!wrap || !btn) return;
        if (hoveredOrbRef.current === tier) return;

        const rect = wrap.getBoundingClientRect();
        const orbCenterX = rect.left + rect.width / 2;
        const orbCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - orbCenterX;
        const dy = e.clientY - orbCenterY;
        const dist = Math.hypot(dx, dy);

        const proximity = Math.max(0.12, Math.min(1, 1 - dist / 650));
        const angle = Math.atan2(dy, dx);
        const pullDistance = Math.min(dist * 0.17, maxPull) * proximity;
        const targetX = Math.cos(angle) * pullDistance;
        const targetY = Math.sin(angle) * pullDistance;

        const dynamicDuration = 0.14 + Math.pow(1 - proximity, 1.4) * 0.82;

        gsap.to(wrap, {
          x: targetX,
          y: targetY,
          duration: dynamicDuration,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      // Tilt the typewriter monolith toward cursor
      if (typewriterTiltRef.current && typewriterGroupRef.current) {
        const twRect = typewriterGroupRef.current.getBoundingClientRect();
        const twCenterX = twRect.left + twRect.width / 2;
        const twCenterY = twRect.top + twRect.height / 2;

        const normX = Math.max(
          -1,
          Math.min(1, (e.clientX - twCenterX) / (window.innerWidth * 0.45))
        );
        const normY = Math.max(
          -1,
          Math.min(1, (e.clientY - twCenterY) / (window.innerHeight * 0.45))
        );

        gsap.to(typewriterTiltRef.current, {
          rotateY: normX * 1.4,
          rotateX: -normY * 1.1,
          rotation: normX * 0.3,
          x: normX * 1.75,
          y: normY * 1,
          transformPerspective: 1200,
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [reducedMotion]);

  // Scroll handoff from Section 1 (Hero) into Section 2 (Dashboard):
  // The SAME typewriter slides right & down so ~35% is cropped by the right edge,
  // and the SAME 3 cards ($20, $50, $100) form a vertical stack to the left of the typewriter,
  // still connected by their live wires into the left side of the typewriter.
  useEffect(() => {
    if (reducedMotion || !handoffTriggerRef?.current || !stageRef.current) {
      return;
    }

    const triggerEl = handoffTriggerRef.current;

    const ctx = gsap.context(() => {
      const targetScale = 0.62;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
            setInDashboardMode(self.progress > 0.5);
            const inMotion = self.progress > 0.04 && self.progress < 0.92;
            onTransitionLockChange?.(inMotion);
          },
          onLeave: () => {
            scrollProgressRef.current = 1;
            setInDashboardMode(true);
            onTransitionLockChange?.(false);
          },
          onEnterBack: () => {
            onTransitionLockChange?.(false);
          },
          onLeaveBack: () => {
            scrollProgressRef.current = 0;
            setInDashboardMode(false);
            onTransitionLockChange?.(false);
          },
        },
      });

      // 1. Move the 3 buttons from their arch above the typewriter into a vertical stack on the left of the typewriter
      if (orb20PosRef.current) {
        tl.to(
          orb20PosRef.current,
          {
            left: "0%",
            top: "46%",
            scale: 0.86,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );
      }

      if (orb50PosRef.current) {
        tl.to(
          orb50PosRef.current,
          {
            left: "0%",
            top: "65%",
            scale: 0.86,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );
      }

      if (orb100PosRef.current) {
        tl.to(
          orb100PosRef.current,
          {
            left: "0%",
            top: "84%",
            right: "auto",
            scale: 0.86,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 2. Scale down the SAME typewriter and align its right edge flush with the right edge of the text block above it
      if (typewriterGroupRef.current) {
        tl.to(
          typewriterGroupRef.current,
          {
            x: () => {
              const stageW = stageRef.current?.clientWidth ?? 680;
              const twW = typewriterGroupRef.current?.offsetWidth ?? 630;
              return Math.round((stageW - twW * targetScale) / 2 - 6);
            },
            y: 94,
            scale: targetScale,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 3. Fade out the bottom Hero Spent/Earned row (since Spent/Earned are in the Dashboard top-right in Section 2)
      if (heroCountersRef.current) {
        tl.to(
          heroCountersRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.45,
            ease: "power2.out",
          },
          0
        );
      }

      ScrollTrigger.refresh();
    }, stageRef);

    return () => ctx.revert();
  }, [reducedMotion, handoffTriggerRef, onTransitionLockChange]);

  // Flexible spring-physics wires connected to each button and the typewriter
  useEffect(() => {
    let rafId = 0;

    const wire20Spring: WireSpringNode = {
      cx: 185,
      cy: 335,
      vx: 0,
      vy: 0,
      prevStartX: 110,
      prevStartY: 190,
    };
    const wire50Spring: WireSpringNode = {
      cx: 375,
      cy: 225,
      vx: 0,
      vy: 0,
      prevStartX: 365,
      prevStartY: 115,
    };
    const wire100Spring: WireSpringNode = {
      cx: 625,
      cy: 335,
      vx: 0,
      vy: 0,
      prevStartX: 685,
      prevStartY: 195,
    };

    const getElementCenterInSvg = (
      el: HTMLElement | null,
      stageRect: DOMRect,
      fallbackX: number,
      fallbackY: number
    ) => {
      if (!el || stageRect.width === 0 || stageRect.height === 0) {
        return { x: fallbackX, y: fallbackY };
      }
      const r = el.getBoundingClientRect();
      const cx = ((r.left + r.width / 2 - stageRect.left) / stageRect.width) * 800;
      const cy = ((r.top + r.height / 2 - stageRect.top) / stageRect.height) * 540;
      return { x: cx, y: cy };
    };

    const stepWirePhysics = (
      spring: WireSpringNode,
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      sagX: number,
      sagY: number
    ) => {
      const orbVx = startX - spring.prevStartX;
      const orbVy = startY - spring.prevStartY;
      spring.prevStartX = startX;
      spring.prevStartY = startY;

      const restCx = (startX + endX) * 0.5 + sagX;
      const restCy = (startY + endY) * 0.5 + sagY;

      const stiffness = 0.085;
      const damping = 0.78;

      spring.vx += (restCx - spring.cx) * stiffness - orbVx * 0.45;
      spring.vy += (restCy - spring.cy) * stiffness - orbVy * 0.45;

      spring.vx *= damping;
      spring.vy *= damping;

      spring.cx += spring.vx;
      spring.cy += spring.vy;

      return `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${spring.cx.toFixed(
        1
      )} ${spring.cy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    };

    const updateWires = () => {
      rafId = requestAnimationFrame(updateWires);
      if (!stageRef.current) return;

      const stageRect = stageRef.current.getBoundingClientRect();
      const p = scrollProgressRef.current;

      const p20 = getElementCenterInSvg(
        socket20Ref.current || orb20BtnRef.current,
        stageRect,
        110,
        190
      );
      const p50 = getElementCenterInSvg(
        socket50Ref.current || orb50BtnRef.current,
        stageRect,
        365,
        115
      );
      const p100 = getElementCenterInSvg(
        socket100Ref.current || orb100BtnRef.current,
        stageRect,
        685,
        195
      );

      const twCenter = getElementCenterInSvg(
        typewriterGroupRef.current,
        stageRect,
        400,
        380
      );

      let twLeftX = twCenter.x - 190;
      if (typewriterGroupRef.current && stageRect.width > 0) {
        const twRect = typewriterGroupRef.current.getBoundingClientRect();
        twLeftX = ((twRect.left - stageRect.left) / stageRect.width) * 800;
      }

      // Interpolate typewriter wire endpoints from Section 1 (back of typewriter) to Section 2 (left edge of typewriter)
      const end20X = (twCenter.x - 105) * (1 - p) + (twLeftX + 38) * p;
      const end20Y = (twCenter.y + 15) * (1 - p) + (twCenter.y - 8) * p;

      const end50X = twCenter.x * (1 - p) + (twLeftX + 14) * p;
      const end50Y = (twCenter.y - 40) * (1 - p) + (twCenter.y + 42) * p;

      const end100X = (twCenter.x + 105) * (1 - p) + (twLeftX + 14) * p;
      const end100Y = (twCenter.y + 15) * (1 - p) + (twCenter.y + 98) * p;

      const path20 = stepWirePhysics(
        wire20Spring,
        p20.x,
        p20.y,
        end20X,
        end20Y,
        -45 * (1 - p) + 12 * p,
        82 * (1 - p) + 18 * p
      );
      const path50 = stepWirePhysics(
        wire50Spring,
        p50.x,
        p50.y,
        end50X,
        end50Y,
        -20 * (1 - p) + 8 * p,
        35 * (1 - p) + 6 * p
      );
      const path100 = stepWirePhysics(
        wire100Spring,
        p100.x,
        p100.y,
        end100X,
        end100Y,
        48 * (1 - p) + 8 * p,
        88 * (1 - p) - 6 * p
      );

      if (wire20BaseRef.current) wire20BaseRef.current.setAttribute("d", path20);
      if (wire20FlowRef.current) wire20FlowRef.current.setAttribute("d", path20);
      if (wire20GlowRef.current) wire20GlowRef.current.setAttribute("d", path20);

      if (wire50BaseRef.current) wire50BaseRef.current.setAttribute("d", path50);
      if (wire50FlowRef.current) wire50FlowRef.current.setAttribute("d", path50);
      if (wire50GlowRef.current) wire50GlowRef.current.setAttribute("d", path50);

      if (wire100BaseRef.current) wire100BaseRef.current.setAttribute("d", path100);
      if (wire100FlowRef.current) wire100FlowRef.current.setAttribute("d", path100);
      if (wire100GlowRef.current) wire100GlowRef.current.setAttribute("d", path100);

      // Update traveling circle position along the active clicked wire path
      if (pulseStateRef.current.active && pulseDotGroupRef.current) {
        const activeTier = pulseStateRef.current.tier;
        const activePathEl =
          activeTier === 20
            ? wire20GlowRef.current
            : activeTier === 50
            ? wire50GlowRef.current
            : wire100GlowRef.current;

        if (activePathEl) {
          const totalLen = activePathEl.getTotalLength();
          if (totalLen > 0) {
            const pt = activePathEl.getPointAtLength(
              pulseStateRef.current.progress * totalLen
            );
            pulseDotGroupRef.current.setAttribute(
              "transform",
              `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`
            );
          }
        }
      }
    };

    rafId = requestAnimationFrame(updateWires);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Sticky magnetic hover & rubbery snap-back
  const handleOrbMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    tier: OrbTier,
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (reducedMotion || !btnRef.current) return;
    hoveredOrbRef.current = tier;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const pullX = dx * 0.54;
    const pullY = dy * 0.54;
    const dist = Math.min(Math.hypot(dx, dy), 60);
    const stretch = 1 + (dist / 60) * 0.08;
    const squash = 1 - (dist / 60) * 0.04;

    gsap.to(btnRef.current, {
      x: pullX,
      y: pullY,
      scaleX: Math.abs(dx) > Math.abs(dy) ? stretch : squash,
      scaleY: Math.abs(dy) > Math.abs(dx) ? stretch : squash,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleOrbMouseLeave = (
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    hoveredOrbRef.current = null;
    if (reducedMotion || !btnRef.current) return;

    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 1.1,
      ease: "elastic.out(1.4, 0.25)",
      overwrite: "auto",
    });
  };

  // Auto-scroll typewriter terminal log to bottom
  useEffect(() => {
    if (!terminalScrollRef.current) return;
    terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
  }, [terminalLogs]);

  // Launch a completed 100% bill that flies slowly down to the Earned counter
  const launchFlyingBillToEarned = useCallback(() => {
    if (reducedMotion) {
      setHasCompletedPayoff(true);
      return;
    }

    const billId = ++uniqueIdRef.current;
    setFlyingBills((prev) => [...prev, { id: billId }]);

    const landTimer = setTimeout(() => {
      setFlyingBills((prev) => prev.filter((b) => b.id !== billId));
      setHasCompletedPayoff(true);
    }, 1250);

    sequenceTimeoutsRef.current.push(landTimer);
  }, [reducedMotion]);

  // Handle clicking $20, $50, or $100 node
  const handleOrbClick = (
    tier: OrbTier,
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (isTransitionLocked) return;
    resetIdleBegTimer();

    // Generate random return: $20 -> $1–$5, $50 -> $5–$20, $100 -> $20–$40
    const earnedDelta =
      tier === 20
        ? Math.floor(Math.random() * 5) + 1
        : tier === 50
        ? Math.floor(Math.random() * 16) + 5
        : Math.floor(Math.random() * 21) + 20;

    onSpend?.(tier, earnedDelta);

    // Animate a glowing circle traveling along the solid wire from the button to the typewriter
    if (!reducedMotion) {
      gsap.killTweensOf(pulseStateRef.current);
      pulseStateRef.current.active = true;
      pulseStateRef.current.tier = tier;
      pulseStateRef.current.progress = 0;

      if (pulseDotGroupRef.current) {
        gsap.killTweensOf(pulseDotGroupRef.current);
        gsap.set(pulseDotGroupRef.current, { opacity: 1 });
      }

      gsap.to(pulseStateRef.current, {
        progress: 1,
        duration: 0.52,
        ease: "power2.inOut",
        onComplete: () => {
          if (pulseDotGroupRef.current) {
            gsap.to(pulseDotGroupRef.current, {
              opacity: 0,
              duration: 0.16,
              onComplete: () => {
                pulseStateRef.current.active = false;
              },
            });
          } else {
            pulseStateRef.current.active = false;
          }
        },
      });
    }

    // Stream terminal log sequence for this click
    const pool = TERMINAL_SEQUENCES[tier];
    const seqIndex = seqCursorRef.current[tier] % pool.length;
    seqCursorRef.current[tier] += 1;
    const chosenSeq = pool[seqIndex];
    const dynamicSteps = chosenSeq.steps.map((s) =>
      s.includes("yielding 1.00 USD return")
        ? `yielding ${earnedDelta}.00 USD return...`
        : s
    );

    if (reducedMotion) {
      setTerminalLogs((prev) => [
        ...prev.slice(-8),
        ...dynamicSteps.map((s) => ({
          id: ++uniqueIdRef.current,
          text: s,
          tier,
        })),
        {
          id: ++uniqueIdRef.current,
          text: chosenSeq.summary,
          isSummary: true,
          tier,
        },
      ]);
    } else {
      dynamicSteps.forEach((stepText, idx) => {
        const stepTimer = setTimeout(() => {
          setTerminalLogs((prev) => [
            ...prev.slice(-10),
            {
              id: ++uniqueIdRef.current,
              text: stepText,
              tier,
            },
          ]);
        }, idx * 170);
        sequenceTimeoutsRef.current.push(stepTimer);
      });

      const summaryTimer = setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev.slice(-10),
          {
            id: ++uniqueIdRef.current,
            text: chosenSeq.summary,
            isSummary: true,
            tier,
          },
        ]);
      }, dynamicSteps.length * 170 + 110);
      sequenceTimeoutsRef.current.push(summaryTimer);
    }

    // 1. Add to Spent & Earned with animated counter rollout + floating delta badges
    setSpentTarget((prev) => prev + tier);
    setEarnedTarget((prev) => +(prev + earnedDelta).toFixed(2));
    const spentDeltaId = ++uniqueIdRef.current;
    const earnedDeltaId = ++uniqueIdRef.current;
    setSpentDeltas((prev) => [
      ...prev,
      { id: spentDeltaId, text: `+$${tier}` },
    ]);
    setEarnedDeltas((prev) => [
      ...prev,
      { id: earnedDeltaId, text: `+$${earnedDelta}` },
    ]);
    setTimeout(() => {
      setSpentDeltas((prev) => prev.filter((d) => d.id !== spentDeltaId));
      setEarnedDeltas((prev) => prev.filter((d) => d.id !== earnedDeltaId));
    }, 950);

    // 2. Spawn floating score popup directly above the clicked button at z-50
    if (!reducedMotion && stageRef.current && btnRef.current) {
      const stageRect = stageRef.current.getBoundingClientRect();
      const btnRect = btnRef.current.getBoundingClientRect();
      const popupId = ++uniqueIdRef.current;
      const x = btnRect.left + btnRect.width / 2 - stageRect.left;
      const y = btnRect.top - stageRect.top;

      setOrbPopups((prev) => [...prev, { id: popupId, tier, x, y }]);
      const removePopupTimer = setTimeout(() => {
        setOrbPopups((prev) => prev.filter((p) => p.id !== popupId));
      }, 850);
      sequenceTimeoutsRef.current.push(removePopupTimer);
    }

    // 3. Calculate bill printing progress (30% initial + carryover math)
    const currentP = billPercentRef.current;

    const animateCarriageHandle = (isFullPrint: boolean) => {
      if (reducedMotion || !carriageHandleRef.current) return;
      gsap.killTweensOf(carriageHandleRef.current);

      if (isFullPrint) {
        const tl = gsap.timeline();
        tl.to(carriageHandleRef.current, {
          rotation: -36,
          x: -12,
          y: 3,
          duration: 0.2,
          ease: "power2.inOut",
        })
          .to(carriageHandleRef.current, {
            rotation: 32,
            x: 4,
            y: -1,
            duration: 0.15,
            ease: "power3.in",
          })
          .to(carriageHandleRef.current, {
            rotation: -24,
            x: -8,
            y: 2,
            duration: 0.16,
            ease: "power2.out",
          })
          .to(carriageHandleRef.current, {
            rotation: 0,
            x: 0,
            y: 0,
            duration: 0.65,
            ease: "elastic.out(1.2, 0.35)",
          });
      } else {
        const tl = gsap.timeline();
        tl.to(carriageHandleRef.current, {
          rotation: -26,
          x: -8,
          y: 2,
          duration: 0.16,
          ease: "power2.out",
        })
          .to(carriageHandleRef.current, {
            rotation: 16,
            x: 2,
            y: -1,
            duration: 0.14,
            ease: "power2.inOut",
          })
          .to(carriageHandleRef.current, {
            rotation: 0,
            x: 0,
            y: 0,
            duration: 0.55,
            ease: "elastic.out(1.2, 0.35)",
          });
      }
    };

    if (tier === 20 || tier === 50) {
      const targetSurge: PowerState = tier === 20 ? "surge20" : "surge50";
      setPowerState(targetSurge);

      if (!reducedMotion && typewriterTiltRef.current) {
        gsap.fromTo(
          typewriterTiltRef.current,
          { x: -1.5, y: 0.6 },
          {
            x: 1.5,
            y: -0.6,
            duration: 0.06,
            repeat: 9,
            yoyo: true,
            ease: "none",
            onComplete: () => {
              gsap.set(typewriterTiltRef.current, { x: 0, y: 0 });
            },
          }
        );
      }

      const rawTotal = currentP + tier;
      animateCarriageHandle(rawTotal >= 100);

      if (rawTotal < 100) {
        billPercentRef.current = rawTotal;
        setBillPercent(rawTotal);
        setStatusAnnouncement(
          `Spent $${tier}. Bill is now ${rawTotal}% printed.`
        );
      } else {
        const remainder = rawTotal - 100;
        const nextBillPercent = Math.min(95, 30 + remainder);

        billPercentRef.current = 100;
        setBillPercent(100);
        setStatusAnnouncement(
          `Spent $${tier}. Current 1 dollar bill finished printing and is flying to Earned. Next bill starts at ${nextBillPercent}%.`
        );

        const detachTimer = setTimeout(() => {
          launchFlyingBillToEarned();
          billPercentRef.current = nextBillPercent;
          setBillPercent(nextBillPercent);
        }, 380);
        sequenceTimeoutsRef.current.push(detachTimer);
      }

      const endSurgeTimer = setTimeout(() => {
        setPowerState("idle");
        resetIdleBegTimer();
      }, 950);
      sequenceTimeoutsRef.current.push(endSurgeTimer);
    } else if (tier === 100) {
      const nextBillPercent = currentP;

      setPowerState("surge100");
      animateCarriageHandle(true);
      billPercentRef.current = 100;
      setBillPercent(100);
      setStatusAnnouncement(
        `Spent $100. Printed a whole 1 dollar bill which is flying to Earned.`
      );

      if (!reducedMotion && typewriterTiltRef.current) {
        gsap.fromTo(
          typewriterTiltRef.current,
          { x: -4, y: 1.8, rotation: -0.5 },
          {
            x: 4,
            y: -1.8,
            rotation: 0.5,
            duration: 0.05,
            repeat: 16,
            yoyo: true,
            ease: "none",
            onComplete: () => {
              gsap.set(typewriterTiltRef.current, {
                x: 0,
                y: 0,
                rotation: 0,
              });
            },
          }
        );
      }

      const detachTimer = setTimeout(() => {
        launchFlyingBillToEarned();
        billPercentRef.current = nextBillPercent;
        setBillPercent(nextBillPercent);
      }, 750);

      const endSurgeTimer = setTimeout(() => {
        setPowerState("idle");
        resetIdleBegTimer();
      }, 1050);

      sequenceTimeoutsRef.current.push(detachTimer, endSurgeTimer);
    }
  };

  const is20Lit = powerState === "surge20";
  const is50Lit = powerState === "surge50";
  const is100Lit = powerState === "surge100";

  const hiddenFraction = Math.max(0, Math.min(70, 100 - billPercent));

  return (
    <div className="relative flex w-full flex-col items-center select-none">
      {/* Screen-reader live status announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusAnnouncement}
      </div>

      {/* Minimalist Full-Bleed Typewriter & Nodes Stage */}
      <div
        ref={stageRef}
        className="relative h-[510px] w-full sm:h-[600px] lg:h-[650px]"
      >
        {/* Subtle ambient backlight */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500 ${
            powerState === "surge100"
              ? "bg-[#e89b3c]/25 opacity-100"
              : powerState === "surge20" || powerState === "surge50"
              ? "bg-[#f4f0ea]/12 opacity-100"
              : "bg-[#e89b3c]/[0.05] opacity-60"
          }`}
        />

        {/* LAYER 1: ANIMATED DOTTED POWER STREAMS AT IDLE -> SOLID THICK LINE + TRAVELING CIRCLE ON CLICK */}
        <svg
          ref={wiresSvgRef}
          aria-hidden="true"
          viewBox="0 0 800 540"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        >
          {/* Base animated dotted lines flowing continuously into the typewriter (hidden while that wire turns solid on click) */}
          <path
            ref={wire20BaseRef}
            d="M 110 190 Q 185 335 295 355"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="2.25"
            strokeLinecap="round"
            className={`wire-energy-flow transition-opacity duration-150 ${
              is20Lit ? "opacity-0" : "opacity-100"
            }`}
          />
          <path
            ref={wire50BaseRef}
            d="M 365 115 Q 375 225 400 300"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="2.25"
            strokeLinecap="round"
            className={`wire-energy-flow transition-opacity duration-150 ${
              is50Lit ? "opacity-0" : "opacity-100"
            }`}
          />
          <path
            ref={wire100BaseRef}
            d="M 685 195 Q 625 335 505 355"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`wire-energy-flow transition-opacity duration-150 ${
              is100Lit ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Solid thick wire overlays on click */}
          <path
            ref={wire20GlowRef}
            d="M 110 190 Q 185 335 295 355"
            fill="none"
            stroke={isLight ? "#d97706" : "#e89b3c"}
            strokeWidth="3.5"
            strokeLinecap="round"
            className={`transition-opacity duration-150 ${
              is20Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is20Lit
                ? isLight
                  ? "drop-shadow(0 0 8px rgba(217,119,6,0.65))"
                  : "drop-shadow(0 0 10px rgba(232,155,60,0.8))"
                : "none",
            }}
          />

          <path
            ref={wire50GlowRef}
            d="M 365 115 Q 375 225 400 300"
            fill="none"
            stroke={isLight ? "#d97706" : "#e89b3c"}
            strokeWidth="3.5"
            strokeLinecap="round"
            className={`transition-opacity duration-150 ${
              is50Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is50Lit
                ? isLight
                  ? "drop-shadow(0 0 8px rgba(217,119,6,0.65))"
                  : "drop-shadow(0 0 10px rgba(232,155,60,0.8))"
                : "none",
            }}
          />

          <path
            ref={wire100GlowRef}
            d="M 685 195 Q 625 335 505 355"
            fill="none"
            stroke="#e89b3c"
            strokeWidth="4"
            strokeLinecap="round"
            className={`transition-opacity duration-150 ${
              is100Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is100Lit
                ? "drop-shadow(0 0 14px rgba(232,155,60,0.95))"
                : "none",
            }}
          />

          {/* Traveling Energy Circle that shoots from the clicked button to the typewriter */}
          <g
            ref={pulseDotGroupRef}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 10px rgba(232,155,60,0.95))",
            }}
          >
            <circle r="10" fill="#e89b3c" opacity="0.32" />
            <circle
              r="5.5"
              fill={isLight ? "#ffffff" : "#f4f0ea"}
              stroke="#e89b3c"
              strokeWidth="2.5"
            />
          </g>
        </svg>

        {/* LAYER 2: SMOKE & SPARKS CANVAS */}
        <SmokeSparksCanvas
          powerState={powerState}
          thickerSmoke={hasCompletedPayoff}
          reducedMotion={reducedMotion}
        />

        {/* LAYER 3: THREE CAPITAL POWER INJECTOR NODES */}
        {/* NODE 1: +$20 (TOOLS & SUBS) */}
        <div
          ref={orb20PosRef}
          className="pointer-events-auto absolute left-[0%] top-[6%] z-30 sm:left-[1%] sm:top-[7%]"
        >
          <div ref={orb20WrapRef}>
            <button
              ref={orb20BtnRef}
              type="button"
              onClick={() => handleOrbClick(20, orb20BtnRef)}
              onMouseMove={(e) => handleOrbMouseMove(e, 20, orb20BtnRef)}
              onMouseLeave={() => handleOrbMouseLeave(orb20BtnRef)}
              aria-label="Inject $20 into your business machine"
              className={`group relative flex h-[80px] w-[112px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[88px] sm:w-[126px] sm:p-3 ${
                powerState === "surge20"
                  ? isLight
                    ? "bg-[#e89b3c] text-[#08080a] shadow-[0_0_28px_rgba(232,155,60,0.5)]"
                    : "bg-[#f4f0ea] text-[#08080a] shadow-[0_0_30px_rgba(244,240,234,0.45)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-black/12 shadow-[0_12px_28px_rgba(20,20,19,0.08),0_2px_6px_rgba(20,20,19,0.04)] hover:bg-[#e89b3c] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-white/[0.09] shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:bg-[#f4f0ea] hover:text-[#08080a]"
              } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
            >
              <div className="pointer-events-none flex w-full items-center justify-between">
                <span className="font-mono-label text-[8px] font-medium uppercase tracking-[0.16em] opacity-65 sm:text-[9px]">
                  TOOLS &amp; SUBS
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    powerState === "surge20"
                      ? "bg-[#08080a]"
                      : "bg-[#e89b3c] shadow-[0_0_6px_#e89b3c] group-hover:bg-[#08080a]"
                  }`}
                />
              </div>

              <span className="pointer-events-none font-mono-label text-xl font-semibold tracking-tight sm:text-2xl">
                +$20
              </span>

              <div className="pointer-events-none flex w-full items-center justify-between border-t border-current/10 pt-1">
                <span className="font-mono-label text-[8px] uppercase tracking-[0.16em] opacity-65">
                  ⚡ Feed cash
                </span>
                <span className="font-mono-label text-[9px] opacity-75 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              {/* Power-Plug Connector Collar where power conduit attaches */}
              <span
                ref={socket20Ref}
                aria-hidden="true"
                className={`pointer-events-none absolute flex items-center justify-center rounded-xs border transition-all duration-300 ${
                  inDashboardMode
                    ? "-right-2 top-1/2 h-4 w-2 -translate-y-1/2"
                    : "-bottom-2 left-1/2 h-2 w-4 -translate-x-1/2"
                } ${
                  isLight
                    ? "border-black/30 bg-[#262522]"
                    : "border-white/25 bg-[#1b1b22]"
                }`}
              >
                <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
              </span>
            </button>
          </div>
        </div>

        {/* NODE 2: +$50 (ADS & GROWTH) */}
        <div
          ref={orb50PosRef}
          className="pointer-events-auto absolute left-[36%] -top-[3%] z-30 sm:left-[37%] sm:-top-[2%]"
        >
          <div ref={orb50WrapRef}>
            <button
              ref={orb50BtnRef}
              type="button"
              onClick={() => handleOrbClick(50, orb50BtnRef)}
              onMouseMove={(e) => handleOrbMouseMove(e, 50, orb50BtnRef)}
              onMouseLeave={() => handleOrbMouseLeave(orb50BtnRef)}
              aria-label="Inject $50 into your business machine"
              className={`group relative flex h-[84px] w-[120px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[92px] sm:w-[134px] sm:p-3 ${
                powerState === "surge50"
                  ? isLight
                    ? "bg-[#e89b3c] text-[#08080a] shadow-[0_0_32px_rgba(232,155,60,0.5)]"
                    : "bg-[#f4f0ea] text-[#08080a] shadow-[0_0_34px_rgba(244,240,234,0.45)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-black/12 shadow-[0_12px_28px_rgba(20,20,19,0.08),0_2px_6px_rgba(20,20,19,0.04)] hover:bg-[#e89b3c] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-white/[0.09] shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:bg-[#f4f0ea] hover:text-[#08080a]"
              } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
              style={{ animationDelay: "0.35s" }}
            >
              <div className="pointer-events-none flex w-full items-center justify-between">
                <span className="font-mono-label text-[8px] font-medium uppercase tracking-[0.16em] opacity-65 sm:text-[9px]">
                  ADS &amp; GROWTH
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    powerState === "surge50"
                      ? "bg-[#08080a]"
                      : "bg-[#e89b3c] shadow-[0_0_6px_#e89b3c] group-hover:bg-[#08080a]"
                  }`}
                />
              </div>

              <span className="pointer-events-none font-mono-label text-2xl font-semibold tracking-tight sm:text-[26px]">
                +$50
              </span>

              <div className="pointer-events-none flex w-full items-center justify-between border-t border-current/10 pt-1">
                <span className="font-mono-label text-[8px] uppercase tracking-[0.16em] opacity-65">
                  ⚡ Feed cash
                </span>
                <span className="font-mono-label text-[9px] opacity-75 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              {/* Power-Plug Connector Collar where power conduit attaches */}
              <span
                ref={socket50Ref}
                aria-hidden="true"
                className={`pointer-events-none absolute flex items-center justify-center rounded-xs border transition-all duration-300 ${
                  inDashboardMode
                    ? "-right-2 top-1/2 h-4 w-2 -translate-y-1/2"
                    : "-bottom-2 left-1/2 h-2 w-4 -translate-x-1/2"
                } ${
                  isLight
                    ? "border-black/30 bg-[#262522]"
                    : "border-white/25 bg-[#1b1b22]"
                }`}
              >
                <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
              </span>
            </button>
          </div>
        </div>

        {/* NODE 3: +$100 (DEVS & REBUILD) */}
        <div
          ref={orb100PosRef}
          className="pointer-events-auto absolute left-[72%] top-[4%] z-30 sm:left-[73%] sm:top-[5%]"
        >
          <div ref={orb100WrapRef}>
            <button
              ref={orb100BtnRef}
              type="button"
              onClick={() => handleOrbClick(100, orb100BtnRef)}
              onMouseMove={(e) => handleOrbMouseMove(e, 100, orb100BtnRef)}
              onMouseLeave={() => handleOrbMouseLeave(orb100BtnRef)}
              aria-label="Inject $100 into your business machine"
              className={`group relative flex h-[92px] w-[132px] cursor-pointer flex-col justify-between rounded-xl p-3 text-left transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[100px] sm:w-[148px] sm:p-3.5 ${
                powerState === "surge100"
                  ? "bg-[#e89b3c] text-[#08080a] shadow-[0_0_45px_rgba(232,155,60,0.75)]"
                  : isLight
                  ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-[#e89b3c]/45 shadow-[0_14px_32px_rgba(20,20,19,0.10),0_2px_6px_rgba(20,20,19,0.05)] hover:bg-[#e89b3c] hover:text-[#08080a]"
                  : "bg-[#111116] text-[#f4f0ea] ring-1 ring-[#e89b3c]/30 shadow-[0_18px_42px_rgba(0,0,0,0.8)] hover:bg-[#e89b3c] hover:text-[#08080a]"
              } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
              style={{ animationDelay: "0.7s" }}
            >
              <div className="pointer-events-none flex w-full items-center justify-between">
                <span
                  className={`font-mono-label text-[8px] font-semibold uppercase tracking-[0.15em] sm:text-[9px] ${
                    powerState === "surge100"
                      ? "text-[#08080a]"
                      : isLight
                      ? "text-[#b86409] group-hover:text-[#08080a]"
                      : "text-[#e89b3c] group-hover:text-[#08080a]"
                  }`}
                >
                  DEVS &amp; REBUILD
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    powerState === "surge100"
                      ? "bg-[#08080a]"
                      : "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c] group-hover:bg-[#08080a]"
                  }`}
                />
              </div>

              <span className="pointer-events-none font-mono-label text-2xl font-semibold tracking-tight sm:text-3xl">
                +$100
              </span>

              <div className="pointer-events-none flex w-full items-center justify-between border-t border-current/15 pt-1">
                <span className="font-mono-label text-[8px] uppercase tracking-[0.16em] opacity-75">
                  ⚡ Max inject
                </span>
                <span className="font-mono-label text-[9px] opacity-80 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              {/* Power-Plug Connector Collar where power conduit attaches */}
              <span
                ref={socket100Ref}
                aria-hidden="true"
                className={`pointer-events-none absolute flex items-center justify-center rounded-xs border border-[#e89b3c]/70 transition-all duration-300 ${
                  inDashboardMode
                    ? "-right-2 top-1/2 h-4 w-2 -translate-y-1/2"
                    : "-bottom-2 left-1/2 h-2 w-4 -translate-x-1/2"
                } ${isLight ? "bg-[#262522]" : "bg-[#1b1b22]"}`}
              >
                <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
              </span>
            </button>
          </div>
        </div>

        {/* LAYER 4: AUTHENTIC VINTAGE MECHANICAL TYPEWRITER */}
        <div
          ref={typewriterGroupRef}
          style={{ perspective: "1200px" }}
          className="pointer-events-auto absolute bottom-1 left-1/2 z-20 flex w-[360px] -translate-x-1/2 flex-col items-center sm:w-[510px] lg:w-[590px] xl:w-[630px]"
        >
          <div
            ref={typewriterTiltRef}
            style={{ transformStyle: "preserve-3d" }}
            className="flex w-full flex-col items-center will-change-transform"
          >
            {/* PLATEN PAPER SLOT VIEWPORT (Backpanel removed so wires route cleanly behind the typewriter) */}
            <div className="relative z-20 -mb-3.5 flex w-full flex-col items-center">
              {/* Emerging $1 Bill */}
              <div className="relative z-10 flex h-[126px] w-[280px] items-end justify-center overflow-hidden sm:h-[158px] sm:w-[376px] lg:h-[172px] lg:w-[428px] xl:h-[180px] xl:w-[454px]">
                <div
                  data-testid="dollar-bill"
                  style={{
                    transform: `translateY(${hiddenFraction}%) rotate(-1.1deg)`,
                  }}
                  className="relative h-[126px] w-[280px] transition-transform duration-500 ease-out sm:h-[158px] sm:w-[376px] lg:h-[172px] lg:w-[428px] xl:h-[180px] xl:w-[454px]"
                >
                  <DollarBillGraphic idPrefix="active-bill" />
                </div>
              </div>
            </div>

            {/* VINTAGE TYPEWRITER CARRIAGE & STEPPED CAST-IRON / ENAMEL CHASSIS */}
            <div className="relative z-30 flex w-full flex-col items-center">
              {/* 1. VINTAGE CARRIAGE PLATEN ROLLER + KNURLED CHROME THUMB WHEELS */}
              <div className="mx-auto flex w-[96%] items-center justify-center">
                {/* Left Knurled Chrome Platen Knob + Axle */}
                <div className="flex shrink-0 items-center">
                  <div
                    className={`flex h-7 w-3.5 flex-col justify-between rounded-l-sm border-y border-l py-0.5 sm:h-9 sm:w-4.5 ${
                      isLight
                        ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                        : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                    }`}
                  >
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                  </div>
                  <div className="h-2.5 w-2 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952] sm:h-3 sm:w-2.5" />
                </div>

                {/* Ribbed Rubber Platen Roller Cylinder + Chrome Paper Bail */}
                <div className="relative flex h-9 flex-1 flex-col items-center justify-start rounded-sm border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12] shadow-[0_6px_14px_rgba(0,0,0,0.55),inset_0_2px_4px_rgba(255,255,255,0.12)] sm:h-11">
                  {/* Dark paper slot throat matched to exact bill width */}
                  <div className="h-2 w-[282px] rounded-b-full bg-black shadow-[inset_0_2px_5px_rgba(0,0,0,1)] sm:h-2.5 sm:w-[378px] lg:w-[430px] xl:w-[456px]" />

                  {/* Chrome Paper Bail Rod with Twin Rubber Rollers */}
                  <div className="mt-1.5 flex w-[282px] items-center justify-between border-t-2 border-[#d8d4cc]/80 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:w-[378px] sm:px-8 lg:w-[430px] xl:w-[456px]">
                    <span className="-mt-1.5 h-3 w-4 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a] sm:h-3.5 sm:w-5" />
                    <span className="-mt-1.5 h-3 w-4 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a] sm:h-3.5 sm:w-5" />
                  </div>

                  {/* Red/White Graduated Carriage Margin Scale */}
                  <div className="mt-auto flex h-2 w-[88%] items-center justify-between border-t border-white/15 bg-[#121216] px-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-px ${
                          i === 12
                            ? "h-2 bg-[#e89b3c]"
                            : i % 4 === 0
                            ? "h-1.5 bg-[#d8d4cc]/70"
                            : "h-1 bg-[#d8d4cc]/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Knurled Chrome Platen Knob + Vintage Curved Return Lever */}
                <div className="relative flex shrink-0 items-center">
                  <div className="h-2.5 w-2 bg-gradient-to-b from-[#d4d0c8] to-[#5c5952] sm:h-3 sm:w-2.5" />
                  <div
                    className={`flex h-7 w-3.5 flex-col justify-between rounded-r-sm border-y border-r py-0.5 sm:h-9 sm:w-4.5 ${
                      isLight
                        ? "border-black/30 bg-gradient-to-b from-[#f4f1ea] via-[#b8b3a8] to-[#78746a]"
                        : "border-white/20 bg-gradient-to-b from-[#d8d4cc] via-[#7e7b74] to-[#3a3936]"
                    }`}
                  >
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                    <span className="h-px w-full bg-black/35" />
                  </div>

                  {/* Pivoting Vintage Chrome Carriage Return Lever */}
                  <div
                    ref={carriageHandleRef}
                    style={{ transformOrigin: "bottom left" }}
                    className="pointer-events-none absolute bottom-2 left-full -ml-1 flex flex-col items-end will-change-transform"
                  >
                    {/* Brass/Amber curved finger paddle */}
                    <div className="h-3.5 w-7 -rotate-12 rounded-full border border-black/30 bg-gradient-to-r from-[#f3b15c] via-[#e89b3c] to-[#b36a14] shadow-[0_2px_10px_rgba(232,155,60,0.5)] sm:h-4 sm:w-8" />
                    {/* Curved chrome arm */}
                    <div className="-mt-1 mr-2 h-11 w-2.5 rotate-25 rounded-full border border-black/25 bg-gradient-to-b from-[#f4f0ea] via-[#a8a49c] to-[#52504a] shadow-md sm:h-13 sm:w-3" />
                  </div>
                </div>
              </div>

              {/* 2. UPPER RIBBON SPOOL HOOD & TYPEBAR BASKET (Narrower Stepped Upper Tier) */}
              <div
                className={`relative -mt-1 flex w-[88%] flex-col items-center rounded-t-[28px] border-x border-t px-4 pt-3 pb-2 transition-colors duration-300 sm:px-6 sm:pt-3.5 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#f5f0e4] to-[#e5decb] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9)]"
                    : "border-white/15 bg-gradient-to-b from-[#2a2a33] to-[#1c1c23] shadow-[inset_0_2px_4px_rgba(255,255,255,0.12)]"
                }`}
              >
                {/* Bichrome Red/Black Ink Ribbon stretched between spools */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-6 right-14 left-14 flex flex-col"
                >
                  <div className="h-1 w-full bg-[#18181b] opacity-80" />
                  <div className="h-0.5 w-full bg-[#b93829] opacity-85" />
                </div>

                {/* Twin Exposed Vintage Spoked Ribbon Spools + Fanned Typebar Basket */}
                <div className="relative z-10 flex w-full items-center justify-between">
                  {/* Left Vintage Metal Spool */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-inner sm:h-12 sm:w-12 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    } ${
                      powerState !== "idle" && powerState !== "silence100"
                        ? "animate-spin"
                        : ""
                    }`}
                  >
                    <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                    <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                    <div className="z-10 h-4 w-4 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c] sm:h-5 sm:w-5" />
                  </div>

                  {/* Center Open Typebar Basket + Brass V-Striker Guide + Riveted Nameplate */}
                  <div className="flex flex-col items-center">
                    {/* Semi-circular mechanical typebar basket well */}
                    <div className="relative mb-1.5 flex h-7 w-36 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e] shadow-inner sm:h-8 sm:w-48">
                      {/* Fanned radial steel typebars */}
                      {[-52, -38, -24, -12, 0, 12, 24, 38, 52].map((deg) => (
                        <span
                          key={deg}
                          style={{
                            transform: `rotate(${deg}deg)`,
                            transformOrigin: "top center",
                          }}
                          className="absolute top-0 h-8 w-0.5 bg-gradient-to-b from-[#c8c4bc] to-[#4a4842] opacity-75"
                        />
                      ))}
                      {/* Center V-shaped type guide striker */}
                      <div className="z-10 h-3 w-4 rounded-b-xs border-x border-b border-[#e89b3c]/80 bg-[#2a2825]" />
                    </div>

                    {/* Riveted Vintage Brass Plaque: YOUR BUSINESS */}
                    <div className="flex items-center gap-2 rounded-sm border border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] px-3 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                      <span className="font-mono-label text-[10px] font-bold uppercase tracking-[0.26em] text-[#f3b15c] sm:text-xs">
                        YOUR BUSINESS
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
                    </div>
                  </div>

                  {/* Right Vintage Metal Spool */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-inner sm:h-12 sm:w-12 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    } ${
                      powerState !== "idle" && powerState !== "silence100"
                        ? "animate-spin"
                        : ""
                    }`}
                  >
                    <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                    <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                    <div className="z-10 h-4 w-4 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c] sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>

              {/* 3. WIDER SLOPED LOWER KEYBED HOUSING TERMINAL & VINTAGE SPACEBAR */}
              <div
                className={`relative -mt-0.5 w-full rounded-t-2xl rounded-b-3xl border px-4 pt-3.5 pb-4 transition-all duration-300 sm:px-6 sm:pt-4 sm:pb-5 ${
                  isLight
                    ? "border-black/20 bg-gradient-to-b from-[#ede6d6] via-[#e2dac8] to-[#d2c9b4] shadow-[0_26px_55px_rgba(20,20,19,0.18),inset_0_2px_2px_rgba(255,255,255,0.8)]"
                    : "border-white/12 bg-gradient-to-b from-[#22222b] via-[#15151b] to-[#0c0c10] shadow-[0_30px_65px_rgba(0,0,0,0.82),inset_0_2px_3px_rgba(255,255,255,0.08)]"
                } ${
                  powerState === "surge100"
                    ? "ring-2 ring-[#e89b3c]/70 shadow-[0_24px_65px_rgba(232,155,60,0.32)]"
                    : ""
                }`}
              >
                {/* Live Capital Fuel / Power Gauge Bar on Bezel */}
                <div className="mx-auto mb-2.5 flex w-[96%] items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        powerState !== "idle" && powerState !== "silence100"
                          ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                          : "animate-pulse bg-[#e89b3c]/80"
                      }`}
                    />
                    <span
                      className={`font-mono-label text-[9px] uppercase tracking-[0.18em] ${
                        powerState !== "idle" && powerState !== "silence100"
                          ? isLight
                            ? "font-semibold text-[#b86409]"
                            : "font-semibold text-[#e89b3c]"
                          : isLight
                          ? "text-[#6e6a62]"
                          : "text-[#8e8a80]"
                      }`}
                    >
                      {powerState === "surge20"
                        ? "⚡ BURNING +$20 FUEL..."
                        : powerState === "surge50"
                        ? "⚡ BURNING +$50 FUEL..."
                        : powerState === "surge100"
                        ? "⚡ BURNING +$100 FUEL..."
                        : "⚡ FUEL: LOW — FEED $ TO RUN"}
                    </span>
                  </div>

                  {/* 6-Segment Capital Fuel Meter */}
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4, 5].map((segIdx) => {
                      const activeCount =
                        powerState === "surge100"
                          ? 6
                          : powerState === "surge50"
                          ? 4
                          : powerState === "surge20"
                          ? 3
                          : 1;
                      const isLitSeg = segIdx < activeCount;
                      return (
                        <span
                          key={segIdx}
                          className={`h-2 w-2.5 rounded-[1px] transition-all duration-150 sm:w-3 ${
                            isLitSeg
                              ? powerState !== "idle"
                                ? "bg-[#e89b3c] shadow-[0_0_6px_rgba(232,155,60,0.85)]"
                                : "animate-pulse bg-[#e89b3c]/75"
                              : isLight
                              ? "bg-black/15"
                              : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Recessed Typewriter Keybed Terminal Screen */}
                <div
                  className={`rounded-xl border p-3 shadow-inner sm:p-4 ${
                    isLight
                      ? "border-black/15 bg-[#f7f3eb] shadow-[inset_0_2px_8px_rgba(20,20,19,0.1)]"
                      : "border-white/10 bg-[#07070a] shadow-[inset_0_3px_12px_rgba(0,0,0,0.95)]"
                  }`}
                >
                  {/* Terminal Status Bar */}
                  <div
                    className={`mb-2 flex items-center justify-between border-b pb-1.5 ${
                      isLight ? "border-black/10" : "border-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isLight ? "bg-[#c8c2b4]" : "bg-[#3a3a46]"
                        }`}
                      />
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isLight ? "bg-[#c8c2b4]" : "bg-[#3a3a46]"
                        }`}
                      />
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${
                          powerState !== "idle" && powerState !== "silence100"
                            ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                            : isLight
                            ? "bg-[#b0aa9c]"
                            : "bg-[#3a3a46]"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-mono-label text-[9px] uppercase tracking-[0.2em] ${
                        isLight ? "text-[#6e6a62]" : "text-[#7a7770]"
                      }`}
                    >
                      tty://spend.log
                    </span>
                    <span
                      className={`font-mono-label text-[9px] uppercase tracking-[0.18em] ${
                        powerState !== "idle" && powerState !== "silence100"
                          ? "font-semibold text-[#e89b3c]"
                          : isLight
                          ? "text-[#8a857c]"
                          : "text-[#5c5954]"
                      }`}
                    >
                      {powerState !== "idle" && powerState !== "silence100"
                        ? "TYPING"
                        : "READY"}
                    </span>
                  </div>

                  {/* Scrolling Terminal Log */}
                  <div
                    ref={terminalScrollRef}
                    data-testid="typewriter-terminal"
                    className="flex h-[84px] flex-col justify-end space-y-1 overflow-y-auto text-left font-mono-label text-[11px] leading-snug sm:h-[98px] sm:text-xs"
                  >
                    {terminalLogs.slice(-4).map((entry, idx, arr) => {
                      const isLast = idx === arr.length - 1;
                      const highlightLastSummary = isLast && entry.isSummary;

                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-2 rounded px-2 py-0.5 transition-all duration-200 ${
                            highlightLastSummary
                              ? isLight
                                ? "border-l-2 border-[#b86409] bg-[#e89b3c]/20 font-semibold text-[#8a4600]"
                                : "border-l-2 border-[#e89b3c] bg-[#e89b3c]/20 font-semibold text-[#f4f0ea]"
                              : entry.isSummary
                              ? isLight
                                ? "text-[#3d3a35]"
                                : "text-[#b8b4ac]"
                              : isLight
                              ? "text-[#78746c]"
                              : "text-[#6e6b64]"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={
                              highlightLastSummary
                                ? isLight
                                  ? "text-[#b86409]"
                                  : "text-[#e89b3c]"
                                : isLight
                                ? "text-[#a09b90]"
                                : "text-[#4e4c46]"
                            }
                          >
                            {highlightLastSummary ? "▸" : ">"}
                          </span>
                          <span className="truncate">{entry.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Classic Vintage Typewriter Bottom Row: Round Chrome-Ringed Glass Shift Keys + Spacebar */}
                <div
                  aria-hidden="true"
                  className="mt-3 flex items-center justify-center gap-3 px-2 sm:gap-4"
                >
                  {/* Left Round Chrome-Ringed Glass Key */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-md sm:h-8 sm:w-8 ${
                      isLight
                        ? "border-[#9e988c] bg-[#262522] text-[#f4f0ea]"
                        : "border-[#b8b3a8] bg-[#18181d] text-[#dcd8ce]"
                    }`}
                  >
                    <span className="font-mono-label text-[7px] font-bold tracking-tighter">
                      SHIFT
                    </span>
                  </div>

                  {/* Classic Bakelite Spacebar mounted on chrome levers */}
                  <div className="flex flex-1 flex-col items-center">
                    <div className="flex w-[70%] justify-between px-4">
                      <span className="h-1.5 w-1 bg-[#9e9a90]" />
                      <span className="h-1.5 w-1 bg-[#9e9a90]" />
                    </div>
                    <div
                      className={`h-4 w-full max-w-[260px] rounded-md border shadow-md sm:h-5 sm:max-w-[320px] ${
                        isLight
                          ? "border-black/40 bg-gradient-to-b from-[#33312d] to-[#181715]"
                          : "border-white/15 bg-gradient-to-b from-[#32323d] to-[#14141a]"
                      }`}
                    />
                  </div>

                  {/* Right Round Chrome-Ringed Glass Key */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-md sm:h-8 sm:w-8 ${
                      isLight
                        ? "border-[#9e988c] bg-[#262522] text-[#f4f0ea]"
                        : "border-[#b8b3a8] bg-[#18181d] text-[#dcd8ce]"
                    }`}
                  >
                    <span className="font-mono-label text-[7px] font-bold tracking-tighter">
                      LOCK
                    </span>
                  </div>
                </div>
              </div>

              {/* Heavy Vintage Rubber Desk Feet */}
              <div
                aria-hidden="true"
                className="mx-auto flex w-[84%] justify-between px-6"
              >
                <div className="h-2 w-10 rounded-b-md bg-[#141416] shadow-md sm:w-14" />
                <div className="h-2 w-10 rounded-b-md bg-[#141416] shadow-md sm:w-14" />
              </div>
            </div>
          </div>
        </div>

        {/* LAYER 5 (Z-50): Floating Score Popups from Buttons */}
        {orbPopups.map((popup) => (
          <OrbScoreBadge key={popup.id} popup={popup} />
        ))}

        {/* LAYER 6 (Z-50): Completed 100% Bills Flying Slowly to Earned */}
        {flyingBills.map((fb) => (
          <FlyingBillItem key={fb.id} id={fb.id} />
        ))}
      </div>

      {/* MINIMALIST EDITORIAL SPENT & EARNED COUNTER BELOW TYPEWRITER */}
      <div
        ref={heroCountersRef}
        className={`relative z-50 mt-6 flex flex-col items-center justify-center ${
          inDashboardMode ? "pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center gap-16 sm:gap-24">
          {/* SPENT */}
          <div className="relative flex items-baseline gap-3">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Spent
            </span>
            <span
              ref={spentValueRef}
              data-testid="spent-counter"
              className={`inline-block font-mono-label text-2xl font-medium tabular-nums tracking-tight transition-colors sm:text-3xl ${
                displaySpent > 0
                  ? "text-[#e89b3c]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              ${displaySpent}
            </span>

            {spentDeltas.map((d) => (
              <CounterScoreBadge key={d.id} text={d.text} variant="spent" />
            ))}
          </div>

          {/* EARNED */}
          <div className="relative flex items-baseline gap-3">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Earned
            </span>
            <span
              ref={earnedValueRef}
              data-testid="earned-counter"
              className={`inline-block font-mono-label text-2xl font-medium tabular-nums tracking-tight transition-colors sm:text-3xl ${
                displayEarned > 0
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              $
              {displayEarned === 0
                ? "0"
                : displayEarned % 1 === 0
                ? displayEarned.toFixed(0)
                : displayEarned.toFixed(2)}
            </span>

            {earnedDeltas.map((d) => (
              <CounterScoreBadge key={d.id} text={d.text} variant="earned" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrbScoreBadge({ popup }: { popup: OrbScorePopup }) {
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { y: 0, scale: 0.85, opacity: 1 },
      {
        y: -38,
        scale: 1.05,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div
      ref={badgeRef}
      aria-hidden="true"
      style={{ left: popup.x, top: popup.y }}
      className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="inline-block rounded-full bg-[#e89b3c] px-2.5 py-0.5 font-mono-label text-[11px] font-semibold text-[#08080a]">
        +${popup.tier}
      </span>
    </div>
  );
}

function CounterScoreBadge({
  text,
  variant,
}: {
  text: string;
  variant: "spent" | "earned";
}) {
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    gsap.fromTo(
      elRef.current,
      { y: 4, x: 2, scale: 0.85, opacity: 1 },
      {
        y: -20,
        x: 10,
        scale: 1.05,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <span
      ref={elRef}
      aria-hidden="true"
      className={`pointer-events-none absolute -right-11 -top-2 z-50 rounded-full px-2 py-0.5 font-mono-label text-[11px] font-semibold ${
        variant === "earned"
          ? "bg-[#e89b3c] text-[#08080a]"
          : "bg-[#16161c] text-[#e89b3c] ring-1 ring-[#e89b3c]/40"
      }`}
    >
      {text}
    </span>
  );
}

function FlyingBillItem({ id }: { id: number }) {
  const flyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!flyRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      flyRef.current,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
      },
      {
        x: 42,
        y: -34,
        scale: 1.04,
        rotation: -5,
        duration: 0.38,
        ease: "power2.out",
      }
    ).to(flyRef.current, {
      x: 92,
      y: 250,
      scale: 0.28,
      rotation: 10,
      opacity: 0.12,
      duration: 0.87,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={flyRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[225px] left-1/2 z-50 h-[146px] w-[280px] -translate-x-1/2 shadow-[0_20px_50px_rgba(0,0,0,0.65)] sm:bottom-[265px] sm:h-[192px] sm:w-[376px] lg:h-[218px] lg:w-[428px] xl:h-[230px] xl:w-[454px]"
    >
      <DollarBillGraphic idPrefix={`flying-bill-${id}`} />
    </div>
  );
}
