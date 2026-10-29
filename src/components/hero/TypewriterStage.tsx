"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import SmokeSparksCanvas from "./SmokeSparksCanvas";
import { useTheme } from "@/context/ThemeContext";

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
        "prompting AI code assistant...",
        "refactoring landing page hero...",
      ],
      summary: "20USD spent on AI dev credits.",
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
        "shipping AI chatbot widget...",
        "deploying dark mode v3...",
      ],
      summary: "50USD spent on dev features.",
    },
    {
      steps: [
        "publishing 30 AI blog posts...",
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
  ],
  100: [
    {
      steps: [
        "spawning autonomous dev agents...",
        "shipping 10,000 lines of code...",
        "yielding 1.00 USD return...",
      ],
      summary: "100USD spent on full-auto AI dev.",
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
  ],
};

/**
 * Detailed Monochrome Torn & Creased US $1 Federal Reserve Note Graphic
 */
function DollarBillGraphic({ idPrefix }: { idPrefix: string }) {
  return (
    <svg
      viewBox="0 0 320 165"
      className="h-full w-full"
      role="img"
      aria-label="Torn and creased greyscale 1 US Dollar bill"
    >
      <defs>
        <linearGradient
          id={`${idPrefix}-paper`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#d8d5ce" />
          <stop offset="38%" stopColor="#c5c2ba" />
          <stop offset="52%" stopColor="#b2afa7" />
          <stop offset="72%" stopColor="#cecbc4" />
          <stop offset="100%" stopColor="#b8b5ad" />
        </linearGradient>

        <pattern
          id={`${idPrefix}-guilloche`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
            stroke="#3a3935"
            strokeWidth="0.45"
            opacity="0.35"
          />
        </pattern>
      </defs>

      {/* Base cotton-linen paper */}
      <rect width="320" height="165" fill={`url(#${idPrefix}-paper)`} />

      {/* Outer ornate engraved frame */}
      <rect
        x="7"
        y="7"
        width="306"
        height="151"
        fill={`url(#${idPrefix}-guilloche)`}
        stroke="#2c2b28"
        strokeWidth="2.2"
      />
      <rect
        x="12"
        y="12"
        width="296"
        height="141"
        fill="#cbc8c0"
        stroke="#3a3935"
        strokeWidth="1.2"
      />
      <rect
        x="15"
        y="15"
        width="290"
        height="135"
        fill="none"
        stroke="#4a4843"
        strokeWidth="0.7"
        strokeDasharray="3 1.5"
      />

      {/* Four Corner "1" Rosettes */}
      <g transform="translate(28, 28)">
        <ellipse
          cx="0"
          cy="0"
          rx="15"
          ry="13"
          fill="#232220"
          stroke="#eceae4"
          strokeWidth="1"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="12"
          ry="10"
          fill="none"
          stroke="#9e9b93"
          strokeWidth="0.7"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#f4f0ea"
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
          fill="#232220"
          stroke="#eceae4"
          strokeWidth="1"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="12"
          ry="10"
          fill="none"
          stroke="#9e9b93"
          strokeWidth="0.7"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#f4f0ea"
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
          fill="#232220"
          stroke="#eceae4"
          strokeWidth="1"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#f4f0ea"
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
          fill="#232220"
          stroke="#eceae4"
          strokeWidth="1"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#f4f0ea"
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
        fill="#2b2a27"
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
        fill="#161614"
        fontSize="9.5"
        fontWeight="900"
        letterSpacing="1.4"
        fontFamily="serif"
      >
        THE UNITED STATES OF AMERICA
      </text>

      {/* Left Federal Reserve Seal + Serial */}
      <g transform="translate(68, 78)">
        <circle
          cx="0"
          cy="0"
          r="17"
          fill="none"
          stroke="#2f2e2b"
          strokeWidth="1.4"
          strokeDasharray="2 1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="13"
          fill="none"
          stroke="#2f2e2b"
          strokeWidth="0.8"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="#232220"
          fontSize="12"
          fontWeight="800"
          fontFamily="serif"
        >
          L
        </text>
      </g>
      <text
        x="48"
        y="54"
        fill="#232220"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.8"
        fontFamily="monospace"
      >
        L00000001A
      </text>

      {/* Right Treasury Seal + Serial */}
      <g transform="translate(252, 78)">
        <circle
          cx="0"
          cy="0"
          r="17"
          fill="none"
          stroke="#3a3935"
          strokeWidth="1.4"
          strokeDasharray="2 1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="13"
          fill="none"
          stroke="#3a3935"
          strokeWidth="0.8"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="#232220"
          fontSize="11"
          fontWeight="900"
          fontFamily="serif"
        >
          $1
        </text>
      </g>
      <text
        x="220"
        y="112"
        fill="#232220"
        fontSize="7"
        fontWeight="700"
        letterSpacing="0.8"
        fontFamily="monospace"
      >
        L00000001A
      </text>

      {/* Center Portrait Oval (George Washington Engraving) */}
      <g transform="translate(160, 82)">
        <ellipse
          cx="0"
          cy="0"
          rx="34"
          ry="40"
          fill="#b5b2aa"
          stroke="#232220"
          strokeWidth="2.2"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="30"
          ry="36"
          fill={`url(#${idPrefix}-guilloche)`}
          stroke="#4a4843"
          strokeWidth="0.9"
        />
        <path
          d="M -21 32 C -18 15, -10 11, 0 11 C 10 11, 18 15, 21 32 Z"
          fill="#2c2b29"
        />
        <path d="M -5 12 L 0 25 L 5 12 Z" fill="#dcd9d0" />
        <path
          d="M -11 -14 C -15 -12, -16 -4, -14 2 C -12 5, -9 7, -9 10 L 9 10 C 9 7, 12 5, 14 2 C 16 -4, 15 -12, 11 -14 C 8 -20, -8 -20, -11 -14 Z"
          fill="#dcd9d0"
          stroke="#2c2b29"
          strokeWidth="1.2"
        />
        <ellipse
          cx="0"
          cy="-4"
          rx="9.5"
          ry="12"
          fill="#c4c1b8"
          stroke="#2c2b29"
          strokeWidth="1.1"
        />
        <line
          x1="-5"
          y1="-6"
          x2="-2"
          y2="-6"
          stroke="#232220"
          strokeWidth="1.3"
        />
        <line
          x1="2"
          y1="-6"
          x2="5"
          y2="-6"
          stroke="#232220"
          strokeWidth="1.3"
        />
        <path
          d="M 0 -6 L -1 0 L 1 0"
          fill="none"
          stroke="#232220"
          strokeWidth="1.1"
        />
        <path
          d="M -4 4 Q 0 1.5 4 4"
          fill="none"
          stroke="#232220"
          strokeWidth="1.2"
        />
      </g>

      {/* High-Contrast "ONE • 1 USD" Banner */}
      <rect
        x="92"
        y="122"
        width="136"
        height="24"
        rx="2"
        fill="#1c1b19"
        stroke="#e4e2dd"
        strokeWidth="1.2"
      />
      <text
        x="160"
        y="139"
        textAnchor="middle"
        fill="#f4f0ea"
        fontSize="16"
        fontWeight="900"
        letterSpacing="3"
        fontFamily="monospace"
      >
        ONE • 1 USD
      </text>

      {/* Creases & Folds */}
      <path
        d="M 35 0 L 155 165"
        stroke="#4a4843"
        strokeWidth="1.6"
        opacity="0.55"
      />
      <path
        d="M 37 0 L 157 165"
        stroke="#efede8"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 275 0 L 118 165"
        stroke="#4a4843"
        strokeWidth="1.3"
        opacity="0.45"
      />
      <path
        d="M 0 74 L 320 88"
        stroke="#3f3e39"
        strokeWidth="1.4"
        opacity="0.45"
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

export default function TypewriterStage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Actual targets vs animated display counters
  const [spentTarget, setSpentTarget] = useState<number>(0);
  const [displaySpent, setDisplaySpent] = useState<number>(0);
  const [earnedTarget, setEarnedTarget] = useState<number>(0);
  const [displayEarned, setDisplayEarned] = useState<number>(0);

  // Bill printing progress: starts at 30% emerging from the typewriter
  const [billPercent, setBillPercent] = useState<number>(30);
  const billPercentRef = useRef<number>(30);

  const [powerState, setPowerState] = useState<PowerState>("idle");
  const [hasCompletedPayoff, setHasCompletedPayoff] = useState<boolean>(false);
  const [isBegging, setIsBegging] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogEntry[]>([
    { id: 1, text: "ai-industry-os v4.2 initialized" },
    { id: 2, text: "awaiting subscription capital..." },
  ]);
  const [orbPopups, setOrbPopups] = useState<OrbScorePopup[]>([]);
  const [flyingBills, setFlyingBills] = useState<FlyingCompletedBill[]>([]);
  const [spentDeltas, setSpentDeltas] = useState<FloatingDelta[]>([]);
  const [earnedDeltas, setEarnedDeltas] = useState<FloatingDelta[]>([]);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>("");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const typewriterGroupRef = useRef<HTMLDivElement | null>(null);
  const carriageHandleRef = useRef<HTMLDivElement | null>(null);
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  const seqCursorRef = useRef<Record<OrbTier, number>>({ 20: 0, 50: 0, 100: 0 });
  const spentValueRef = useRef<HTMLSpanElement | null>(null);
  const earnedValueRef = useRef<HTMLSpanElement | null>(null);

  // Refs for the 3 magnetic/rubbery buttons and their bottom cable sockets
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

  // Refs for dynamic physics SVG wire paths
  const wire20BaseRef = useRef<SVGPathElement | null>(null);
  const wire20DashRef = useRef<SVGPathElement | null>(null);
  const wire20GlowRef = useRef<SVGPathElement | null>(null);

  const wire50BaseRef = useRef<SVGPathElement | null>(null);
  const wire50DashRef = useRef<SVGPathElement | null>(null);
  const wire50GlowRef = useRef<SVGPathElement | null>(null);

  const wire100BaseRef = useRef<SVGPathElement | null>(null);
  const wire100DashRef = useRef<SVGPathElement | null>(null);
  const wire100GlowRef = useRef<SVGPathElement | null>(null);

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
        { scale: 1.32, y: -4 },
        {
          scale: 1,
          y: 0,
          duration: 0.55,
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
        setDisplayEarned(Math.round(earnedCounterObj.current.val));
      },
    });

    if (earnedValueRef.current) {
      gsap.fromTo(
        earnedValueRef.current,
        { scale: 1.42, y: -5 },
        {
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1.25, 0.35)",
        }
      );
    }
  }, [earnedTarget, reducedMotion]);

  // 1. DISTANCE-BASED MOUSE FOLLOW:
  // Closer orbs move faster and respond more strongly than distant orbs!
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
        { tier: 20, wrap: orb20WrapRef.current, btn: orb20BtnRef.current, maxPull: 28 },
        { tier: 50, wrap: orb50WrapRef.current, btn: orb50BtnRef.current, maxPull: 32 },
        { tier: 100, wrap: orb100WrapRef.current, btn: orb100BtnRef.current, maxPull: 36 },
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

        // Proximity factor: 1.0 when right next to the mouse, tapering down toward 0.12 when far away
        const proximity = Math.max(0.12, Math.min(1, 1 - dist / 650));

        // Direction unit vector toward mouse
        const angle = Math.atan2(dy, dx);
        // Move amount proportional to proximity so closer button moves further
        const pullDistance = Math.min(dist * 0.18, maxPull) * proximity;
        const targetX = Math.cos(angle) * pullDistance;
        const targetY = Math.sin(angle) * pullDistance;

        // Speed: closer to mouse = much faster (0.14s); further away = slower, heavier lag (up to 0.95s)
        const dynamicDuration = 0.14 + Math.pow(1 - proximity, 1.4) * 0.82;

        gsap.to(wrap, {
          x: targetX,
          y: targetY,
          duration: dynamicDuration,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [reducedMotion]);

  // 4. REAL FLEXIBLE WIRE PHYSICS:
  // Wires attach to the live moving center of each orb and swing/sag/whip like real rubber cables!
  useEffect(() => {
    let rafId = 0;

    // Spring physics state for each of the 3 wires in 800x540 SVG space
    const wire20Spring: WireSpringNode = {
      cx: 185,
      cy: 335,
      vx: 0,
      vy: 0,
      prevStartX: 110,
      prevStartY: 160,
    };
    const wire50Spring: WireSpringNode = {
      cx: 375,
      cy: 225,
      vx: 0,
      vy: 0,
      prevStartX: 365,
      prevStartY: 85,
    };
    const wire100Spring: WireSpringNode = {
      cx: 625,
      cy: 335,
      vx: 0,
      vy: 0,
      prevStartX: 685,
      prevStartY: 155,
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
      // Velocity of the orb transfers whip momentum into the wire midpoint
      const orbVx = startX - spring.prevStartX;
      const orbVy = startY - spring.prevStartY;
      spring.prevStartX = startX;
      spring.prevStartY = startY;

      // Natural resting catenary control point with gravity sag
      const restCx = (startX + endX) * 0.5 + sagX;
      const restCy = (startY + endY) * 0.5 + sagY;

      // Spring stiffness + whip impulse from orb movement
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

      // Live bottom cable socket positions in 800x540 SVG coordinates (never behind the button!)
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

      // Live typewriter socket coordinates (including typewriter shake!)
      const twCenter = getElementCenterInSvg(
        typewriterGroupRef.current,
        stageRect,
        400,
        380
      );
      const end20X = twCenter.x - 95;
      const end20Y = twCenter.y + 15;

      const end50X = twCenter.x - 8;
      const end50Y = twCenter.y - 45;

      const end100X = twCenter.x + 95;
      const end100Y = twCenter.y + 15;

      // Compute flexible quadratic bezier paths with spring sag & whip
      const path20 = stepWirePhysics(
        wire20Spring,
        p20.x,
        p20.y,
        end20X,
        end20Y,
        -48,
        85
      );
      const path50 = stepWirePhysics(
        wire50Spring,
        p50.x,
        p50.y,
        end50X,
        end50Y,
        -24,
        38
      );
      const path100 = stepWirePhysics(
        wire100Spring,
        p100.x,
        p100.y,
        end100X,
        end100Y,
        52,
        92
      );

      if (wire20BaseRef.current) wire20BaseRef.current.setAttribute("d", path20);
      if (wire20DashRef.current) wire20DashRef.current.setAttribute("d", path20);
      if (wire20GlowRef.current) wire20GlowRef.current.setAttribute("d", path20);

      if (wire50BaseRef.current) wire50BaseRef.current.setAttribute("d", path50);
      if (wire50DashRef.current) wire50DashRef.current.setAttribute("d", path50);
      if (wire50GlowRef.current) wire50GlowRef.current.setAttribute("d", path50);

      if (wire100BaseRef.current) wire100BaseRef.current.setAttribute("d", path100);
      if (wire100DashRef.current) wire100DashRef.current.setAttribute("d", path100);
      if (wire100GlowRef.current) wire100GlowRef.current.setAttribute("d", path100);
    };

    rafId = requestAnimationFrame(updateWires);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Sticky magnetic hover & rubbery snap-back handlers for each orb button
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

    // Sticky pull toward cursor + subtle rubber stretch along pull axis
    const pullX = dx * 0.56;
    const pullY = dy * 0.56;
    const dist = Math.min(Math.hypot(dx, dy), 60);
    const stretch = 1 + (dist / 60) * 0.09;
    const squash = 1 - (dist / 60) * 0.045;

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

    // Rubbery elastic snap-back when dragging mouse out of the orb
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

  // Auto-scroll typewriter terminal log to bottom whenever new log entries arrive
  useEffect(() => {
    if (!terminalScrollRef.current) return;
    terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
  }, [terminalLogs]);

  // Launch a completed 100% bill that flies slowly down to the Earned counter
  const launchFlyingBillToEarned = useCallback(() => {
    if (reducedMotion) {
      setEarnedTarget((prev) => prev + 1);
      setHasCompletedPayoff(true);
      return;
    }

    const billId = ++uniqueIdRef.current;
    setFlyingBills((prev) => [...prev, { id: billId }]);

    const landTimer = setTimeout(() => {
      setFlyingBills((prev) => prev.filter((b) => b.id !== billId));
      setEarnedTarget((prev) => prev + 1);
      setHasCompletedPayoff(true);

      const deltaId = ++uniqueIdRef.current;
      setEarnedDeltas((prev) => [...prev, { id: deltaId, text: "+$1" }]);
      setTimeout(() => {
        setEarnedDeltas((prev) => prev.filter((d) => d.id !== deltaId));
      }, 950);
    }, 1250);

    sequenceTimeoutsRef.current.push(landTimer);
  }, [reducedMotion]);

  // Handle clicking $20, $50, or $100 orb
  const handleOrbClick = (
    tier: OrbTier,
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    resetIdleBegTimer();

    // Stream terminal log sequence for this click, ending with a highlighted summary line
    const pool = TERMINAL_SEQUENCES[tier];
    const seqIndex = seqCursorRef.current[tier] % pool.length;
    seqCursorRef.current[tier] += 1;
    const chosenSeq = pool[seqIndex];

    if (reducedMotion) {
      setTerminalLogs((prev) => [
        ...prev.slice(-8),
        ...chosenSeq.steps.map((s) => ({
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
      chosenSeq.steps.forEach((stepText, idx) => {
        const stepTimer = setTimeout(() => {
          setTerminalLogs((prev) => [
            ...prev.slice(-10),
            {
              id: ++uniqueIdRef.current,
              text: stepText,
              tier,
            },
          ]);
        }, idx * 180);
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
      }, chosenSeq.steps.length * 180 + 120);
      sequenceTimeoutsRef.current.push(summaryTimer);
    }

    // 1. Add to Spent counter with animated counter rollout + floating delta badge (never hidden!)
    setSpentTarget((prev) => prev + tier);
    const spentDeltaId = ++uniqueIdRef.current;
    setSpentDeltas((prev) => [
      ...prev,
      { id: spentDeltaId, text: `+$${tier}` },
    ]);
    setTimeout(() => {
      setSpentDeltas((prev) => prev.filter((d) => d.id !== spentDeltaId));
    }, 950);

    // 2. Spawn floating score popup directly above the clicked orb at z-50 (never behind typewriter!)
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

    // Helper to crank/move the typewriter carriage handle while printing
    const animateCarriageHandle = (isFullPrint: boolean) => {
      if (reducedMotion || !carriageHandleRef.current) return;
      gsap.killTweensOf(carriageHandleRef.current);

      if (isFullPrint) {
        // Full lever pull + carriage return slam + elastic spring back
        const tl = gsap.timeline();
        tl.to(carriageHandleRef.current, {
          rotation: -38,
          x: -14,
          y: 4,
          duration: 0.22,
          ease: "power2.inOut",
        })
          .to(carriageHandleRef.current, {
            rotation: 36,
            x: 4,
            y: -2,
            duration: 0.16,
            ease: "power3.in",
          })
          .to(carriageHandleRef.current, {
            rotation: -28,
            x: -10,
            y: 3,
            duration: 0.18,
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
        // Incremental line-feed lever crank
        const tl = gsap.timeline();
        tl.to(carriageHandleRef.current, {
          rotation: -30,
          x: -10,
          y: 3,
          duration: 0.18,
          ease: "power2.out",
        })
          .to(carriageHandleRef.current, {
            rotation: 18,
            x: 2,
            y: -1,
            duration: 0.15,
            ease: "power2.inOut",
          })
          .to(carriageHandleRef.current, {
            rotation: -20,
            x: -6,
            y: 2,
            duration: 0.15,
            ease: "power2.out",
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

      if (!reducedMotion && typewriterGroupRef.current) {
        gsap.fromTo(
          typewriterGroupRef.current,
          { x: -2, y: 0.8 },
          {
            x: 2,
            y: -0.8,
            duration: 0.06,
            repeat: 9,
            yoyo: true,
            ease: "none",
            onComplete: () => {
              gsap.set(typewriterGroupRef.current, { x: 0, y: 0 });
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

      if (!reducedMotion && typewriterGroupRef.current) {
        gsap.fromTo(
          typewriterGroupRef.current,
          { x: -5, y: 2.2, rotation: -0.8 },
          {
            x: 5,
            y: -2.2,
            rotation: 0.8,
            duration: 0.05,
            repeat: 16,
            yoyo: true,
            ease: "none",
            onComplete: () => {
              gsap.set(typewriterGroupRef.current, {
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

  // Translate the bill inside its platen clip slot so `billPercent`% is sticking out
  const hiddenFraction = Math.max(0, Math.min(70, 100 - billPercent));

  return (
    <div className="relative flex w-full flex-col items-center select-none">
      {/* Screen-reader live status announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusAnnouncement}
      </div>

      {/* Borderless Full-Bleed Typewriter & Orbs Scene */}
      <div
        ref={stageRef}
        className="relative h-[470px] w-full sm:h-[560px] lg:h-[620px]"
      >
        {/* Ambient radial backlight behind the machine */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300 ${
            powerState === "surge100"
              ? "bg-[#e89b3c]/35 opacity-100"
              : powerState === "surge20"
              ? "bg-[#8b7cf6]/25 opacity-100"
              : powerState === "surge50"
              ? "bg-[#4da8f0]/25 opacity-100"
              : "bg-[#e89b3c]/10 opacity-50"
          }`}
        />

        {/* LAYER 1: DYNAMIC FLEXIBLE WIRES SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 540"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        >
          <defs>
            <linearGradient id="cableGrad20" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a799ff" />
              <stop offset="100%" stopColor="#6c5ce7" />
            </linearGradient>
            <linearGradient id="cableGrad50" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7fd1ff" />
              <stop offset="100%" stopColor="#2e86de" />
            </linearGradient>
            <linearGradient id="cableGrad100" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd27d" />
              <stop offset="50%" stopColor="#e89b3c" />
              <stop offset="100%" stopColor="#d35400" />
            </linearGradient>
          </defs>

          {/* $20 Left Orb Wire */}
          <path
            ref={wire20BaseRef}
            d="M 110 160 Q 185 335 305 355"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            ref={wire20DashRef}
            d="M 110 160 Q 185 335 305 355"
            fill="none"
            stroke="var(--cable-dash)"
            strokeWidth="2"
            strokeDasharray="6 10"
            strokeLinecap="round"
          />

          {/* $50 Top Orb Wire */}
          <path
            ref={wire50BaseRef}
            d="M 365 85 Q 375 225 392 300"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            ref={wire50DashRef}
            d="M 365 85 Q 375 225 392 300"
            fill="none"
            stroke="var(--cable-dash)"
            strokeWidth="2"
            strokeDasharray="6 10"
            strokeLinecap="round"
          />

          {/* $100 Right Orb Wire */}
          <path
            ref={wire100BaseRef}
            d="M 685 155 Q 625 335 495 355"
            fill="none"
            stroke="var(--cable-base)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            ref={wire100DashRef}
            d="M 685 155 Q 625 335 495 355"
            fill="none"
            stroke="var(--cable-dash)"
            strokeWidth="2.5"
            strokeDasharray="8 12"
            strokeLinecap="round"
          />

          {/* Lit wire overlays */}
          <path
            ref={wire20GlowRef}
            d="M 110 160 Q 185 335 305 355"
            fill="none"
            stroke="url(#cableGrad20)"
            strokeWidth="7"
            strokeLinecap="round"
            className={`transition-opacity duration-200 ${
              is20Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is20Lit ? "drop-shadow(0 0 12px #8b7cf6)" : "none",
            }}
          />

          <path
            ref={wire50GlowRef}
            d="M 365 85 Q 375 225 392 300"
            fill="none"
            stroke="url(#cableGrad50)"
            strokeWidth="8"
            strokeLinecap="round"
            className={`transition-opacity duration-200 ${
              is50Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is50Lit ? "drop-shadow(0 0 14px #4da8f0)" : "none",
            }}
          />

          <path
            ref={wire100GlowRef}
            d="M 685 155 Q 625 335 495 355"
            fill="none"
            stroke="url(#cableGrad100)"
            strokeWidth="11"
            strokeLinecap="round"
            className={`transition-opacity duration-150 ${
              is100Lit ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: is100Lit ? "drop-shadow(0 0 20px #e89b3c)" : "none",
            }}
          />
        </svg>

        {/* LAYER 2: SMOKE & SPARKS CANVAS */}
        <SmokeSparksCanvas
          powerState={powerState}
          thickerSmoke={hasCompletedPayoff}
          reducedMotion={reducedMotion}
        />

        {/* LAYER 3: THREE MINIMALIST HARDWARE NODES (With bottom cable jack so wire connects cleanly) */}
        {/* NODE 1: $20 */}
        <div
          ref={orb20WrapRef}
          className="absolute left-[3%] top-[16%] z-30 sm:left-[6%] sm:top-[18%]"
        >
          <button
            ref={orb20BtnRef}
            type="button"
            onClick={() => handleOrbClick(20, orb20BtnRef)}
            onMouseMove={(e) => handleOrbMouseMove(e, 20, orb20BtnRef)}
            onMouseLeave={() => handleOrbMouseLeave(orb20BtnRef)}
            aria-label="Feed $20 subscription into the typewriter"
            className={`group relative flex h-[74px] w-[92px] cursor-pointer flex-col items-center justify-center rounded-2xl transition-colors duration-250 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[82px] sm:w-[104px] ${
              powerState === "surge20"
                ? "bg-[#6c5ce7] ring-2 ring-[#c5baff] shadow-[0_0_40px_rgba(139,124,246,0.85)]"
                : isLight
                ? "bg-[#1b1b22] ring-1 ring-black/20 shadow-[0_14px_28px_rgba(20,20,28,0.28)] hover:bg-[#6c5ce7] hover:ring-[#6c5ce7] hover:shadow-[0_16px_36px_rgba(108,92,231,0.55)]"
                : "bg-[#121218]/95 ring-1 ring-white/12 shadow-[0_14px_30px_rgba(0,0,0,0.75)] hover:bg-[#6c5ce7] hover:ring-[#a29bfe] hover:shadow-[0_0_36px_rgba(108,92,231,0.65)]"
            } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
          >
            {/* Minimalist top status LED + tier micro-label */}
            <div className="pointer-events-none mb-1 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  powerState === "surge20"
                    ? "bg-white shadow-[0_0_8px_#ffffff]"
                    : "bg-[#8b7cf6] group-hover:bg-white"
                }`}
              />
              <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-[#8f8b84] transition-colors group-hover:text-white/90">
                /MO
              </span>
            </div>

            {/* Clean Monospace Price */}
            <span className="pointer-events-none font-mono-label text-xl font-bold tracking-tight text-[#f4f0ea] transition-colors group-hover:text-white sm:text-2xl">
              $20
            </span>

            {/* Subtle bottom accent bar */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 h-[2px] w-7 rounded-full bg-[#8b7cf6]/60 transition-all group-hover:w-10 group-hover:bg-white"
            />

            {/* Physical Bottom Cable Jack / Socket where the wire connects */}
            <span
              ref={socket20Ref}
              aria-hidden="true"
              className={`pointer-events-none absolute -bottom-2.5 left-1/2 flex h-3 w-4 -translate-x-1/2 items-end justify-center rounded-b-sm transition-colors ${
                is20Lit
                  ? "bg-[#6c5ce7]"
                  : "bg-[#343440] group-hover:bg-[#5849c4]"
              }`}
            >
              <span className="h-1 w-2 rounded-full bg-black/50" />
            </span>
          </button>
        </div>

        {/* NODE 2: $50 */}
        <div
          ref={orb50WrapRef}
          className="absolute left-[36%] top-[2%] z-30 sm:left-[37%] sm:top-[3%]"
        >
          <button
            ref={orb50BtnRef}
            type="button"
            onClick={() => handleOrbClick(50, orb50BtnRef)}
            onMouseMove={(e) => handleOrbMouseMove(e, 50, orb50BtnRef)}
            onMouseLeave={() => handleOrbMouseLeave(orb50BtnRef)}
            aria-label="Feed $50 subscription into the typewriter"
            className={`group relative flex h-[82px] w-[104px] cursor-pointer flex-col items-center justify-center rounded-2xl transition-colors duration-250 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[90px] sm:w-[118px] ${
              powerState === "surge50"
                ? "bg-[#1e7fe0] ring-2 ring-[#99dcff] shadow-[0_0_42px_rgba(77,168,240,0.85)]"
                : isLight
                ? "bg-[#1b1b22] ring-1 ring-black/20 shadow-[0_14px_30px_rgba(20,20,28,0.28)] hover:bg-[#1e7fe0] hover:ring-[#1e7fe0] hover:shadow-[0_16px_38px_rgba(30,127,224,0.55)]"
                : "bg-[#121218]/95 ring-1 ring-white/12 shadow-[0_14px_32px_rgba(0,0,0,0.75)] hover:bg-[#1e7fe0] hover:ring-[#74c0fc] hover:shadow-[0_0_38px_rgba(30,127,224,0.65)]"
            } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
            style={{ animationDelay: "0.35s" }}
          >
            {/* Minimalist top status LED + tier micro-label */}
            <div className="pointer-events-none mb-1 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  powerState === "surge50"
                    ? "bg-white shadow-[0_0_8px_#ffffff]"
                    : "bg-[#4da8f0] group-hover:bg-white"
                }`}
              />
              <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-[#8f8b84] transition-colors group-hover:text-white/90">
                /MO
              </span>
            </div>

            {/* Clean Monospace Price */}
            <span className="pointer-events-none font-mono-label text-2xl font-bold tracking-tight text-[#f4f0ea] transition-colors group-hover:text-white sm:text-[26px]">
              $50
            </span>

            {/* Subtle bottom accent bar */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 h-[2px] w-8 rounded-full bg-[#4da8f0]/60 transition-all group-hover:w-12 group-hover:bg-white"
            />

            {/* Physical Bottom Cable Jack / Socket where the wire connects */}
            <span
              ref={socket50Ref}
              aria-hidden="true"
              className={`pointer-events-none absolute -bottom-2.5 left-1/2 flex h-3 w-4 -translate-x-1/2 items-end justify-center rounded-b-sm transition-colors ${
                is50Lit
                  ? "bg-[#1e7fe0]"
                  : "bg-[#343440] group-hover:bg-[#1864b0]"
              }`}
            >
              <span className="h-1 w-2 rounded-full bg-black/50" />
            </span>
          </button>
        </div>

        {/* NODE 3: $100 (Largest) */}
        <div
          ref={orb100WrapRef}
          className="absolute right-[2%] top-[10%] z-30 sm:right-[4%] sm:top-[11%]"
        >
          <button
            ref={orb100BtnRef}
            type="button"
            onClick={() => handleOrbClick(100, orb100BtnRef)}
            onMouseMove={(e) => handleOrbMouseMove(e, 100, orb100BtnRef)}
            onMouseLeave={() => handleOrbMouseLeave(orb100BtnRef)}
            aria-label="Feed $100 subscription into the typewriter"
            className={`group relative flex h-[92px] w-[118px] cursor-pointer flex-col items-center justify-center rounded-2xl transition-colors duration-250 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:h-[104px] sm:w-[136px] ${
              powerState === "surge100"
                ? "bg-[#e89b3c] ring-2 ring-[#ffe299] shadow-[0_0_55px_rgba(232,155,60,0.95)]"
                : isLight
                ? "bg-[#1b1b22] ring-1 ring-black/25 shadow-[0_16px_36px_rgba(20,20,28,0.32)] hover:bg-[#e89b3c] hover:ring-[#e89b3c] hover:shadow-[0_18px_42px_rgba(232,155,60,0.6)]"
                : "bg-[#121218]/95 ring-1 ring-[#e89b3c]/30 shadow-[0_16px_38px_rgba(0,0,0,0.8)] hover:bg-[#e89b3c] hover:ring-[#ffd27d] hover:shadow-[0_0_46px_rgba(232,155,60,0.75)]"
            } ${isBegging && powerState === "idle" ? "orb-begging" : ""}`}
            style={{ animationDelay: "0.7s" }}
          >
            {/* Minimalist top status LED + tier micro-label */}
            <div className="pointer-events-none mb-1 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  powerState === "surge100"
                    ? "bg-[#0a0a0d]"
                    : "bg-[#e89b3c] shadow-[0_0_6px_rgba(232,155,60,0.6)] group-hover:bg-[#0a0a0d] group-hover:shadow-none"
                }`}
              />
              <span
                className={`font-mono-label text-[9px] uppercase tracking-[0.2em] transition-colors ${
                  powerState === "surge100"
                    ? "text-[#0a0a0d]"
                    : "text-[#e89b3c] group-hover:text-[#0a0a0d]"
                }`}
              >
                MAX /MO
              </span>
            </div>

            {/* Clean Monospace Price */}
            <span
              className={`pointer-events-none font-mono-label text-2xl font-bold tracking-tight transition-colors sm:text-3xl ${
                powerState === "surge100"
                  ? "text-[#0a0a0d]"
                  : "text-[#f4f0ea] group-hover:text-[#0a0a0d]"
              }`}
            >
              $100
            </span>

            {/* Subtle bottom accent bar */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-1.5 h-[2px] w-10 rounded-full transition-all group-hover:w-14 ${
                powerState === "surge100"
                  ? "bg-[#0a0a0d]"
                  : "bg-[#e89b3c]/75 group-hover:bg-[#0a0a0d]"
              }`}
            />

            {/* Physical Bottom Cable Jack / Socket where the wire connects */}
            <span
              ref={socket100Ref}
              aria-hidden="true"
              className={`pointer-events-none absolute -bottom-3 left-1/2 flex h-3.5 w-5 -translate-x-1/2 items-end justify-center rounded-b-sm transition-colors ${
                is100Lit
                  ? "bg-[#e89b3c]"
                  : "bg-[#343440] group-hover:bg-[#c97e22]"
              }`}
            >
              <span className="h-1 w-2.5 rounded-full bg-black/50" />
            </span>
          </button>
        </div>

        {/* LAYER 4: VINTAGE TYPEWRITER + PROGRESSIVE PRINTING $1 BILL (Scaled Up) */}
        <div
          ref={typewriterGroupRef}
          className="absolute bottom-2 left-1/2 z-20 flex w-[340px] -translate-x-1/2 flex-col items-center sm:w-[460px] lg:w-[530px]"
        >
          {/* PLATEN PAPER SLOT VIEWPORT: Perfectly centered and aligned with the carriage slot */}
          <div className="relative z-20 -mb-4 flex w-full flex-col items-center">
            <div className="relative flex h-[136px] w-[258px] items-end justify-center overflow-hidden sm:h-[172px] sm:w-[340px] lg:h-[192px] lg:w-[380px]">
              <div
                data-testid="dollar-bill"
                style={{
                  transform: `translateY(${hiddenFraction}%)`,
                }}
                className="relative h-[136px] w-[258px] shadow-[0_14px_32px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out sm:h-[172px] sm:w-[340px] lg:h-[192px] lg:w-[380px]"
              >
                <DollarBillGraphic idPrefix="active-bill" />
              </div>
            </div>
          </div>

          {/* VINTAGE TYPEWRITER CHASSIS */}
          <div className="relative z-30 w-full">
            {/* Platen Roller & Symmetrical Knobs (Carriage handle is absolute so roller & bill stay 100% centered) */}
            <div className="mx-auto flex w-[92%] items-center justify-center">
              {/* Left carriage knob */}
              <div
                className={`h-6 w-4 shrink-0 rounded-l bg-gradient-to-b from-[#525260] to-[#2a2a33] sm:h-7 sm:w-5 ${
                  powerState !== "idle" && powerState !== "silence100"
                    ? "animate-pulse"
                    : ""
                }`}
              />

              {/* Roller cylinder with dark paper mouth matched exactly to the bill width */}
              <div className="relative flex h-8 flex-1 flex-col items-center rounded-sm bg-gradient-to-b from-[#2e2e36] via-[#19191f] to-[#0f0f14] shadow-inner sm:h-10">
                {/* Dark paper slot throat matching exact bill width (258px / 340px / 380px) */}
                <div className="h-2.5 w-[262px] rounded-b-full bg-black/95 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] sm:h-3 sm:w-[344px] lg:w-[384px]" />
                {/* Front chrome paper-bail bar & rubber feed rollers aligned with the bill edges */}
                <div className="mt-1.5 flex w-[262px] items-center justify-between border-t border-white/30 px-3 pt-0.5 sm:w-[344px] sm:px-5 lg:w-[384px]">
                  <span className="h-2.5 w-4 rounded-xs bg-[#8a867e] sm:h-3 sm:w-5" />
                  <span className="h-2.5 w-4 rounded-xs bg-[#8a867e] sm:h-3 sm:w-5" />
                </div>
              </div>

              {/* Right carriage knob + Absolutely Positioned Carriage Return Handle */}
              <div className="relative h-6 w-4 shrink-0 rounded-r bg-gradient-to-b from-[#525260] to-[#2a2a33] sm:h-7 sm:w-5">
                {/* Pivoting Carriage Return Lever / Handle */}
                <div
                  ref={carriageHandleRef}
                  style={{ transformOrigin: "bottom left" }}
                  className="pointer-events-none absolute bottom-1.5 left-full -ml-1 flex flex-col items-end will-change-transform"
                >
                  {/* Chrome lever arm + Amber/Brass grip tip */}
                  <div className="flex items-center">
                    <div className="h-3 w-6 -rotate-12 rounded-full bg-gradient-to-r from-[#e89b3c] to-[#b8731e] shadow-[0_0_10px_rgba(232,155,60,0.5)] sm:h-3.5 sm:w-7" />
                  </div>
                  <div className="-mt-1 mr-1.5 h-10 w-2.5 rotate-25 rounded-full bg-gradient-to-b from-[#d8d4cc] via-[#9a968e] to-[#4a4844] shadow-md sm:h-12 sm:w-3" />
                </div>
              </div>
            </div>

            {/* Cast-Iron Vintage Typewriter Body */}
            <div
              className={`relative -mt-1.5 rounded-3xl bg-gradient-to-b from-[#26262f] via-[#17171d] to-[#0d0d12] px-5 pb-5 pt-4 shadow-[0_28px_65px_rgba(0,0,0,0.58)] transition-shadow duration-200 sm:px-7 sm:pb-6 sm:pt-5 ${
                powerState === "surge100"
                  ? "shadow-[0_0_55px_rgba(232,155,60,0.48)]"
                  : ""
              }`}
            >
              {/* Dual Ribbon Spools + "AI INDUSTRY" Nameplate */}
              <div className="mb-3.5 flex items-center justify-between px-4">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#101015] shadow-inner sm:h-9 sm:w-9 ${
                    powerState !== "idle" && powerState !== "silence100"
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-[#7a7770] sm:h-3 sm:w-3" />
                </div>

                <div className="px-3 py-0.5 font-mono-label text-xs font-semibold uppercase tracking-[0.28em] text-[#e89b3c] sm:text-sm">
                  AI INDUSTRY
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#101015] shadow-inner sm:h-9 sm:w-9 ${
                    powerState !== "idle" && powerState !== "silence100"
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-[#7a7770] sm:h-3 sm:w-3" />
                </div>
              </div>

              {/* Embedded Typewriter Terminal Screen (Replaces Mechanical Keys) */}
              <div className=" overflow-hidden rounded-2xl bg-[#07070a] p-3 shadow-[inset_0_3px_12px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.07] sm:p-4">
                {/* Terminal Top Status Bar */}
                <div className="mb-2 flex items-center justify-between border-b border-white/[0.07] pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3a3a46]" />
                    <span className="h-2 w-2 rounded-full bg-[#3a3a46]" />
                    <span
                      className={`h-2 w-2 rounded-full transition-colors ${
                        powerState !== "idle" && powerState !== "silence100"
                          ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                          : "bg-[#3a3a46]"
                      }`}
                    />
                  </div>
                  <span className="font-mono-label text-[9px] uppercase tracking-widest text-[#7a7770]">
                    tty://spend.log
                  </span>
                  <span
                    className={`font-mono-label text-[9px] uppercase tracking-wider ${
                      powerState !== "idle" && powerState !== "silence100"
                        ? "text-[#e89b3c]"
                        : "text-[#5c5954]"
                    }`}
                  >
                    {powerState !== "idle" && powerState !== "silence100"
                      ? "EXEC"
                      : "IDLE"}
                  </span>
                </div>

                {/* Scrolling Log Output */}
                <div
                  ref={terminalScrollRef}
                  data-testid="typewriter-terminal"
                  className="flex h-[96px] flex-col justify-end space-y-1 overflow-y-auto text-left font-mono-label text-[11px] leading-snug sm:h-[112px] sm:text-xs"
                >
                  {terminalLogs.slice(-4).map((entry, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    const highlightLastSummary = isLast && entry.isSummary;

                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-2 rounded px-2 py-0.5 transition-all duration-200 ${
                          highlightLastSummary
                            ? "border-l-2 border-[#e89b3c] bg-[#e89b3c]/20 font-bold text-[#f4f0ea] shadow-[0_0_16px_rgba(232,155,60,0.2)]"
                            : entry.isSummary
                            ? "text-[#b8b4ac]"
                            : "text-[#7a7770]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={
                            highlightLastSummary
                              ? "text-[#e89b3c]"
                              : "text-[#5c5954]"
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
            </div>
          </div>
        </div>

        {/* LAYER 5 (Z-50, IN FRONT OF TYPEWRITER): Floating Score Popups from Orbs */}
        {orbPopups.map((popup) => (
          <OrbScoreBadge key={popup.id} popup={popup} />
        ))}

        {/* LAYER 6 (Z-50, IN FRONT OF TYPEWRITER): Completed 100% Bills Flying Slowly to Earned */}
        {flyingBills.map((fb) => (
          <FlyingBillItem key={fb.id} id={fb.id} />
        ))}
      </div>

      {/* SPENT & EARNED COUNTER AT THE BOTTOM OF THE TYPEWRITER (Z-50 so score popups never hide behind typewriter) */}
      <div className="relative z-50 mt-5 flex flex-col items-center justify-center">
        <div className="flex items-center gap-14 sm:gap-20">
          {/* SPENT */}
          <div className="relative flex items-baseline gap-2.5">
            <span className="font-mono-label text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Spent
            </span>
            <span
              ref={spentValueRef}
              data-testid="spent-counter"
              className={`inline-block font-mono-label text-2xl font-bold tabular-nums transition-colors sm:text-3xl ${
                displaySpent > 0
                  ? "text-[#e89b3c]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              ${displaySpent}
            </span>

            {/* Unobstructed Floating +$20 / +$50 / +$100 Score Badge in front (z-50) */}
            {spentDeltas.map((d) => (
              <CounterScoreBadge key={d.id} text={d.text} variant="spent" />
            ))}
          </div>

          {/* EARNED */}
          <div className="relative flex items-baseline gap-2.5">
            <span className="font-mono-label text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Earned
            </span>
            <span
              ref={earnedValueRef}
              data-testid="earned-counter"
              className={`inline-block font-mono-label text-2xl font-bold tabular-nums transition-colors sm:text-3xl ${
                displayEarned > 0
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              ${displayEarned}
            </span>

            {/* Unobstructed Floating +$1 Score Badge in front (z-50) */}
            {earnedDeltas.map((d) => (
              <CounterScoreBadge key={d.id} text={d.text} variant="earned" />
            ))}
          </div>
        </div>

        {/* Post-Payoff Punchline + Scroll Nudge */}
        <div
          aria-live="polite"
          className={`mt-3 flex min-h-[48px] flex-col items-center justify-center text-center transition-all duration-500 ${
            hasCompletedPayoff
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <p
            data-testid="payoff-line"
            className="text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg"
          >
            Still not a product.
          </p>
          <a
            href="#section-dashboard-anchor"
            className="mt-1 inline-flex items-center gap-2 font-mono-label text-xs uppercase tracking-widest text-[#e89b3c] transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
          >
            <span>Scroll to see where it lands</span>
            <span aria-hidden="true" className="inline-block animate-bounce">
              ↓
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * High-visibility GSAP score popup above the clicked orb (Z-50, never behind typewriter)
 */
function OrbScoreBadge({ popup }: { popup: OrbScorePopup }) {
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { y: 0, scale: 0.75, opacity: 1 },
      {
        y: -44,
        scale: 1.1,
        opacity: 0,
        duration: 0.8,
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
      <span className="inline-block rounded-full bg-[#e89b3c] px-3 py-1 font-mono-label text-xs font-extrabold text-[#0a0a0d] shadow-[0_6px_20px_rgba(232,155,60,0.7)]">
        +${popup.tier}
      </span>
    </div>
  );
}

/**
 * High-visibility GSAP score popup next to Spent / Earned counters (Z-50, never behind typewriter)
 */
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
      { y: 6, x: 4, scale: 0.8, opacity: 1 },
      {
        y: -22,
        x: 12,
        scale: 1.1,
        opacity: 0,
        duration: 0.88,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <span
      ref={elRef}
      aria-hidden="true"
      className={`pointer-events-none absolute -right-11 -top-2 z-50 rounded-full px-2.5 py-0.5 font-mono-label text-xs font-extrabold shadow-lg ${
        variant === "earned"
          ? "bg-[#e89b3c] text-[#0a0a0d] shadow-[0_0_16px_rgba(232,155,60,0.75)]"
          : "bg-[#1a1a22] text-[#e89b3c] ring-1 ring-[#e89b3c]/60"
      }`}
    >
      {text}
    </span>
  );
}

/**
 * Animated completed $1 bill that detaches from the platen and flies slowly down to the Earned counter (Z-50)
 */
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
        scale: 1.05,
        rotation: -6,
        duration: 0.38,
        ease: "power2.out",
      }
    ).to(flyRef.current, {
      x: 92,
      y: 250,
      scale: 0.28,
      rotation: 12,
      opacity: 0.15,
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
      className="pointer-events-none absolute bottom-[210px] left-1/2 z-50 h-[136px] w-[258px] -translate-x-1/2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:bottom-[250px] sm:h-[172px] sm:w-[340px] lg:h-[192px] lg:w-[380px]"
    >
      <DollarBillGraphic idPrefix={`flying-bill-${id}`} />
    </div>
  );
}
