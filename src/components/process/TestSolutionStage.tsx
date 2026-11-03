"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DollarBillGraphic } from "@/components/hero/TypewriterStage";

/**
 * Pristine, Brand-New, Crisp US $1 Federal Reserve Note
 * Produced after Steward fixes the leaks and tests the solution:
 * - Razor-sharp intact rectangular edges (zero tears, zero platen bites)
 * - Uncreased, bright mint-cream & emerald cotton-linen paper (zero stains or fold cracks)
 * - Crisp emerald intaglio engraving & "✓ MINT-OK" seal (replacing "#ERR-FEED")
 */
export function CrispDollarBillGraphic({ idPrefix }: { idPrefix: string }) {
  return (
    <svg
      viewBox="0 0 320 165"
      className="h-full w-full drop-shadow-[0_10px_22px_rgba(16,185,129,0.22)]"
      role="img"
      aria-label="Crisp, brand-new 1 US Dollar bill"
    >
      <defs>
        {/* Fresh, uncreased mint-cream cotton-linen paper gradient */}
        <linearGradient
          id={`${idPrefix}-crisp-paper`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f3fbf5" />
          <stop offset="45%" stopColor="#e4f5ea" />
          <stop offset="100%" stopColor="#d1ecd9" />
        </linearGradient>

        {/* Subtle emerald security sheen */}
        <radialGradient
          id={`${idPrefix}-crisp-sheen`}
          cx="50%"
          cy="50%"
          r="65%"
        >
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
          <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.18" />
        </radialGradient>

        {/* Crisp emerald intaglio guilloche crosshatch pattern */}
        <pattern
          id={`${idPrefix}-crisp-guilloche`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
            stroke="#0d5c35"
            strokeWidth="0.6"
            opacity="0.45"
          />
          <path
            d="M 0 0 L 6 6 M -1 5 L 1 7 M 5 -1 L 7 1"
            stroke="#0d5c35"
            strokeWidth="0.45"
            opacity="0.28"
          />
        </pattern>
      </defs>

      {/* Razor-Sharp Intact Outer Bill Rectangle (No Tears or Rips) */}
      <g>
        <rect
          x="1"
          y="1"
          width="318"
          height="163"
          rx="3"
          fill={`url(#${idPrefix}-crisp-paper)`}
          stroke="#0f5132"
          strokeWidth="1.5"
        />
        <rect
          x="1"
          y="1"
          width="318"
          height="163"
          rx="3"
          fill={`url(#${idPrefix}-crisp-sheen)`}
        />

        {/* Outer ornate intaglio emerald frame */}
        <rect
          x="7"
          y="7"
          width="306"
          height="151"
          rx="2"
          fill={`url(#${idPrefix}-crisp-guilloche)`}
          stroke="#0d5430"
          strokeWidth="2.3"
        />
        <rect
          x="12"
          y="12"
          width="296"
          height="141"
          rx="1.5"
          fill="#e2f3e7"
          fillOpacity="0.92"
          stroke="#0f6338"
          strokeWidth="1.2"
        />
        <rect
          x="15"
          y="15"
          width="290"
          height="135"
          fill="none"
          stroke="#10b981"
          strokeWidth="0.85"
          strokeDasharray="3 1.5"
        />

        {/* Four Corner "1" Crisp Emerald Rosettes */}
        {[
          [28, 28],
          [292, 28],
          [28, 136],
          [292, 136],
        ].map(([cx, cy], idx) => (
          <g key={idx} transform={`translate(${cx}, ${cy})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="13"
              fill="#0b4627"
              stroke="#ecfdf5"
              strokeWidth="1.1"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="10"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.75"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="18"
              fontWeight="900"
              fontFamily="serif"
            >
              1
            </text>
          </g>
        ))}

        {/* Header Banner */}
        <text
          x="160"
          y="24"
          textAnchor="middle"
          fill="#0b4627"
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
          fill="#062e19"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1.4"
          fontFamily="serif"
        >
          THE UNITED STATES OF AMERICA
        </text>

        {/* Left Federal Reserve Seal + Bright Emerald Serial Number */}
        <g transform="translate(68, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#059669"
            fillOpacity="0.08"
            stroke="#0b4627"
            strokeWidth="1.4"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#0b4627"
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#062e19"
            fontSize="12"
            fontWeight="800"
            fontFamily="serif"
          >
            S
          </text>
        </g>
        <text
          x="44"
          y="54"
          fill="#059669"
          fontSize="7.4"
          fontWeight="800"
          letterSpacing="0.9"
          fontFamily="monospace"
        >
          S88888888A
        </text>

        {/* Right Emerald Treasury Seal + Serial Number */}
        <g transform="translate(252, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#10b981"
            fillOpacity="0.18"
            stroke="#059669"
            strokeWidth="1.6"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#059669"
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#047857"
            fontSize="11"
            fontWeight="900"
            fontFamily="serif"
          >
            $1
          </text>
        </g>
        <text
          x="216"
          y="112"
          fill="#059669"
          fontSize="7.4"
          fontWeight="800"
          letterSpacing="0.9"
          fontFamily="monospace"
        >
          S88888888A
        </text>

        {/* Center Portrait Oval (Crisp Engraving with Subtle Confident Smile) */}
        <g transform="translate(160, 82)">
          <ellipse
            cx="0"
            cy="0"
            rx="34"
            ry="40"
            fill="#c6e6d1"
            stroke="#0b4627"
            strokeWidth="2.2"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="30"
            ry="36"
            fill={`url(#${idPrefix}-crisp-guilloche)`}
            stroke="#059669"
            strokeWidth="0.9"
          />
          <path
            d="M -21 32 C -18 15, -10 11, 0 11 C 10 11, 18 15, 21 32 Z"
            fill="#0b4627"
          />
          <path d="M -5 12 L 0 25 L 5 12 Z" fill="#f3fbf5" />
          <path
            d="M -11 -14 C -15 -12, -16 -4, -14 2 C -12 5, -9 7, -9 10 L 9 10 C 9 7, 12 5, 14 2 C 16 -4, 15 -12, 11 -14 C 8 -20, -8 -20, -11 -14 Z"
            fill="#e6f6ec"
            stroke="#0b4627"
            strokeWidth="1.2"
          />
          <ellipse
            cx="0"
            cy="-4"
            rx="9.5"
            ry="12"
            fill="#d9f0e2"
            stroke="#0b4627"
            strokeWidth="1.1"
          />
          <line
            x1="-5"
            y1="-6"
            x2="-2"
            y2="-6"
            stroke="#062e19"
            strokeWidth="1.3"
          />
          <line
            x1="2"
            y1="-6"
            x2="5"
            y2="-6"
            stroke="#062e19"
            strokeWidth="1.3"
          />
          <path
            d="M 0 -6 L -1 0 L 1 0"
            fill="none"
            stroke="#062e19"
            strokeWidth="1.1"
          />
          {/* Subtle smile on the new verified bill */}
          <path
            d="M -4 2.2 Q 0 5.2 4 2.2"
            fill="none"
            stroke="#062e19"
            strokeWidth="1.25"
          />
        </g>

        {/* Crisp Emerald "ONE • 1 USD" Bottom Banner */}
        <rect
          x="92"
          y="122"
          width="136"
          height="24"
          rx="2"
          fill="#0b4627"
          stroke="#ecfdf5"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="139"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="900"
          letterSpacing="3"
          fontFamily="monospace"
        >
          ONE • 1 USD
        </text>

        {/* Clean Emerald Verification Stamp (contrasting with #ERR-FEED on Old Bill) */}
        <g transform="rotate(-3 200 58)">
          <rect
            x="175"
            y="49"
            width="54"
            height="12"
            rx="2"
            fill="#10b981"
            fillOpacity="0.16"
            stroke="#059669"
            strokeWidth="0.9"
          />
          <text
            x="202"
            y="57.5"
            textAnchor="middle"
            fill="#047857"
            fontSize="6.8"
            fontWeight="800"
            letterSpacing="1.2"
            fontFamily="monospace"
          >
            ✓ MINT-OK
          </text>
        </g>
      </g>
    </svg>
  );
}

type SpendTier = 20 | 50 | 100;

interface HistoryPoint {
  spent: number;
  revenue: number;
}

const INITIAL_HISTORY: HistoryPoint[] = [
  { spent: 0, revenue: 0 },
  { spent: 80, revenue: 180 },
  { spent: 160, revenue: 440 },
  { spent: 240, revenue: 790 },
  { spent: 320, revenue: 1210 },
  { spent: 400, revenue: 1684 },
];

const PROFITABLE_SNIPPETS: Record<SpendTier, string[]> = {
  20: [
    "allocated +$20.00 -> automated email flow...",
    "conversion lift: +$84.00 net revenue (+4.2x)",
  ],
  50: [
    "allocated +$50.00 -> high-intent acquisition...",
    "attributable sales: +$210.00 revenue (+4.2x)",
  ],
  100: [
    "allocated +$100.00 -> checkout & offer scale...",
    "verified revenue: +$420.00 collected (+4.2x)",
  ],
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

interface TestSolutionStageProps {
  /** 0..1 progress of Stage 3 ("Test the solution") */
  testProgress: number;
  /** 0..1 progress of Stage 4 ("Launch and measure") */
  launchProgress: number;
  /** 0..1 progress of Stage 5 ("Iterate and scale") */
  iterateProgress?: number;
  isLight: boolean;
}

export default function TestSolutionStage({
  testProgress,
  launchProgress,
  iterateProgress = 0,
  isLight,
}: TestSolutionStageProps) {
  // Stage 3 ("Test the solution") state
  const [isTesting, setIsTesting] = useState(false);
  const [hasTested, setHasTested] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [platenUsesNewBill, setPlatenUsesNewBill] = useState(false);
  const [testTerminalLines, setTestTerminalLines] = useState<string[]>([
    "all 5 units assembled & aligned",
    "ready for live user test...",
  ]);

  // Stage 4 ("Launch and measure") state
  const [spent, setSpent] = useState(400);
  const [earned, setEarned] = useState(1684);
  const [history, setHistory] = useState<HistoryPoint[]>(INITIAL_HISTORY);
  const [activeTier, setActiveTier] = useState<SpendTier | null>(null);
  const [billPercent, setBillPercent] = useState(76);
  const [launchTerminalLines, setLaunchTerminalLines] = useState<string[]>([
    "leaks sealed — unit economics positive",
    "every $1.00 spent returns $4.21 in revenue",
  ]);

  // Stage 5 ("Iterate and scale") state: Sequential 1..5 module lighting -> Continuous money printing
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isContinuousPrinting, setIsContinuousPrinting] = useState(false);
  const [litModuleCount, setLitModuleCount] = useState(0);

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const typewriterChassisRef = useRef<HTMLDivElement | null>(null);
  const carriageHandleRef = useRef<HTMLDivElement | null>(null);
  const platenBillWrapRef = useRef<HTMLDivElement | null>(null);
  const platenSlotAnchorRef = useRef<HTMLDivElement | null>(null);
  const newBillSlotRef = useRef<HTMLDivElement | null>(null);
  const flyingBillRef = useRef<HTMLDivElement | null>(null);
  const newBillCardContentRef = useRef<HTMLDivElement | null>(null);

  // Stage 5 ("Iterate and scale") 5 Outer Jetpower Armor Parts & continuous money stream refs
  const upgradeRingRef = useRef<HTMLDivElement | null>(null);
  const jetPart1Ref = useRef<HTMLDivElement | null>(null); // Part 1: Left Jet-Turbine Wing
  const jetPart2Ref = useRef<HTMLDivElement | null>(null); // Part 2: Right Jet-Turbine Wing
  const jetPart3Ref = useRef<HTMLDivElement | null>(null); // Part 3: Left Heavy Side-Armor Cannon Pod
  const jetPart4Ref = useRef<HTMLDivElement | null>(null); // Part 4: Right Heavy Side-Armor Cannon Pod
  const jetPart5Ref = useRef<HTMLDivElement | null>(null); // Part 5: Front Arc-Reactor Bumper & Stabilizer Base
  const streamBill1Ref = useRef<HTMLDivElement | null>(null);
  const streamBill2Ref = useRef<HTMLDivElement | null>(null);
  const streamBill3Ref = useRef<HTMLDivElement | null>(null);

  // Stage 4 wire refs
  const wire20PathRef = useRef<SVGPathElement | null>(null);
  const wire50PathRef = useRef<SVGPathElement | null>(null);
  const wire100PathRef = useRef<SVGPathElement | null>(null);
  const pulseDotGroupRef = useRef<SVGGElement | null>(null);

  // Reveal opacity as the 3D isometric typewriter finishes assembling (testProgress: 0.42 -> 0.80)
  const stageOpacity = clamp01((testProgress - 0.42) / 0.36);
  const stageScale = 0.95 + 0.05 * stageOpacity;
  const isStageVisible = stageOpacity > 0.55;

  // Transition progress from Stage 3 ("Test the solution") -> Stage 4 ("Launch and measure")
  const rawMove = clamp01((launchProgress - 0.04) / 0.78);
  const moveT = easeInOutCubic(rawMove);

  // Transition progress from Stage 4 ("Launch and measure") -> Stage 5 ("Iterate and scale")
  const rawIterateMove = clamp01((iterateProgress - 0.04) / 0.72);
  const iterateMoveT = easeInOutCubic(rawIterateMove);
  const isIterateModeActive = iterateProgress >= 0.58;

  // Stage 3 accessories (Test button + Version 1 / Version 1.1 bills) fade out as typewriter starts moving
  const testAccessoriesOpacity = 1 - clamp01((launchProgress - 0.02) / 0.36);
  const isTestModeInteractive = isStageVisible && launchProgress < 0.3;

  // Stage 4 accessories (Spend vs. Revenue Graph on left + 3 Arched Buttons & Wires above typewriter)
  // fade in during Stage 4, and fade OUT completely when entering Stage 5 ("Iterate and scale") so ONLY the typewriter is seen!
  const launchAccessoriesFadeIn = clamp01((launchProgress - 0.38) / 0.48);
  const launchAccessoriesFadeOut = 1 - clamp01((iterateProgress - 0.02) / 0.36);
  const launchAccessoriesOpacity =
    launchAccessoriesFadeIn * launchAccessoriesFadeOut;
  const isLaunchModeInteractive =
    isStageVisible && launchProgress > 0.55 && iterateProgress < 0.2;
  const isLaunchModeActive = launchProgress >= 0.45 && !isIterateModeActive;

  // Shared typewriter horizontal & vertical translation:
  // - Stage 3 (moveT = 0, iterateMoveT = 0): x = -115px (left of bills), y = -42px (raised to reduce top gap)
  // - Stage 4 (moveT = 1, iterateMoveT = 0): x = +245px (right of graph), y = +22px
  // - Stage 5 (moveT = 1, iterateMoveT = 1): x = +15px (centered alone on stage), y = +14px (room above for continuous money stream)
  const typewriterX = -115 + 360 * moveT - 230 * iterateMoveT;
  const typewriterY = -42 + 64 * moveT - 8 * iterateMoveT;

  // Stage 5 ("Iterate and scale"): 5-Part "Jetpower Optimus Prime" Mech-Armor Assembly -> Continuous Money Printing loop
  useEffect(() => {
    const chassisEl = typewriterChassisRef.current;
    const platenBillEl = platenBillWrapRef.current;
    const leverEl = carriageHandleRef.current;
    const ringEl = upgradeRingRef.current;
    const p1 = jetPart1Ref.current;
    const p2 = jetPart2Ref.current;
    const p3 = jetPart3Ref.current;
    const p4 = jetPart4Ref.current;
    const p5 = jetPart5Ref.current;
    const b1 = streamBill1Ref.current;
    const b2 = streamBill2Ref.current;
    const b3 = streamBill3Ref.current;

    const allArmorParts = [p1, p2, p3, p4, p5].filter(Boolean);

    if (!isIterateModeActive) {
      setIsUpgrading(false);
      setIsContinuousPrinting(false);
      setLitModuleCount(0);

      if (b1 && b2 && b3) {
        gsap.killTweensOf([b1, b2, b3]);
        gsap.set([b1, b2, b3], { opacity: 0, y: 0, x: 0, scale: 0.85 });
      }
      if (ringEl) {
        gsap.killTweensOf(ringEl);
        gsap.set(ringEl, { opacity: 0, scale: 0.8 });
      }
      if (allArmorParts.length > 0) {
        gsap.killTweensOf(allArmorParts);
        gsap.set(allArmorParts, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.75 });
      }
      if (chassisEl) {
        gsap.killTweensOf(chassisEl);
        gsap.set(chassisEl, { x: 0, y: 0, scale: 1 });
      }
      if (platenBillEl && !isTesting) {
        gsap.killTweensOf(platenBillEl);
        const hiddenFraction = isLaunchModeActive
          ? Math.max(0, Math.min(60, 100 - billPercent))
          : 40;
        gsap.to(platenBillEl, {
          yPercent: hiddenFraction,
          rotation: isLaunchModeActive ? -0.8 : -1.1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      return;
    }

    // =======================================================================
    // STEP 5 ACTIVE:
    // 1) DOCK 5 OUTER MODULES & LIGHT THEM UP SLOWLY ONE BY ONE (1 OF 5 -> 5 OF 5)
    // 2) CONTINUOUS MONEY PRINTING
    // =======================================================================
    setIsUpgrading(true);
    setIsContinuousPrinting(false);
    setLitModuleCount(1);

    const masterCtx = gsap.context(() => {
      const startContinuousPrinting = () => {
        setIsUpgrading(false);
        setIsContinuousPrinting(true);

        // Continuous Platen Bill Roller Feed
        if (platenBillEl) {
          gsap.fromTo(
            platenBillEl,
            { yPercent: 56, rotation: -0.6, opacity: 1 },
            {
              yPercent: 4,
              rotation: 0.6,
              duration: 0.5,
              repeat: -1,
              ease: "steps(6)",
            }
          );
        }

        // Continuous High-Speed Typewriter Mechanical Hum
        if (chassisEl) {
          gsap.to(chassisEl, {
            y: -2,
            scale: 1.035,
            duration: 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Periodic Carriage Return Lever Flick
        if (leverEl) {
          gsap.fromTo(
            leverEl,
            { rotation: 0, x: 0 },
            {
              rotation: -24,
              x: -6,
              duration: 0.15,
              repeat: -1,
              yoyo: true,
              repeatDelay: 0.35,
              ease: "power2.out",
            }
          );
        }

        // Continuous Stream of Crisp $1 Bills Ejecting Upward Out of Typewriter
        const launchBillStream = (
          el: HTMLDivElement | null,
          delay: number,
          driftX: number,
          rot: number
        ) => {
          if (!el) return;
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 18,
              x: 0,
              scale: 0.84,
              rotation: 0,
            },
            {
              keyframes: [
                {
                  opacity: 1,
                  y: -30,
                  x: driftX * 0.35,
                  scale: 0.94,
                  rotation: rot * 0.4,
                  duration: 0.3,
                  ease: "power2.out",
                },
                {
                  opacity: 1,
                  y: -98,
                  x: driftX * 0.8,
                  scale: 1.0,
                  rotation: rot * 0.85,
                  duration: 0.45,
                  ease: "none",
                },
                {
                  opacity: 0,
                  y: -152,
                  x: driftX,
                  scale: 1.04,
                  rotation: rot,
                  duration: 0.32,
                  ease: "power1.in",
                },
              ],
              repeat: -1,
              delay,
            }
          );
        };

        launchBillStream(b1, 0, -46, -10);
        launchBillStream(b2, 0.35, 6, 4);
        launchBillStream(b3, 0.7, 48, 11);
      };

      const upgradeTl = gsap.timeline();

      // Lift Typewriter into zero-gravity combination stance
      if (chassisEl) {
        upgradeTl.fromTo(
          chassisEl,
          { y: 0, scale: 1 },
          {
            y: -6,
            scale: 1.02,
            duration: 0.22,
            ease: "power2.out",
          },
          0
        );
      }

      // Dock all 5 modules + bottom bar into place so they can light up 1 -> 5 slowly
      if (p5) {
        upgradeTl.fromTo(
          p5,
          { opacity: 0, y: 65, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.28,
            ease: "back.out(2.0)",
          },
          0.02
        );
      }
      if (p1) {
        upgradeTl.fromTo(
          p1,
          { opacity: 0, x: -95, y: -35, rotation: -18, scale: 0.75 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.28,
            ease: "back.out(2.0)",
          },
          0.06
        );
      }
      if (p2) {
        upgradeTl.fromTo(
          p2,
          { opacity: 0, x: 95, y: -35, rotation: 18, scale: 0.75 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.28,
            ease: "back.out(2.0)",
          },
          0.1
        );
      }
      if (p3) {
        upgradeTl.fromTo(
          p3,
          { opacity: 0, x: -95, y: 12, scale: 0.75 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.28,
            ease: "back.out(2.0)",
          },
          0.14
        );
      }
      if (p4) {
        upgradeTl.fromTo(
          p4,
          { opacity: 0, x: 95, y: 12, scale: 0.75 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.28,
            ease: "back.out(2.0)",
          },
          0.18
        );
      }

      // Slowly light up modules 1 -> 2 -> 3 -> 4 -> 5 in order:
      // 1: PRICING (0.25s)
      // 2: MARKETING (0.95s)
      // 3: POSITIONING (1.65s)
      // 4: PRODUCT (2.35s)
      // 5: ONBOARDING (3.05s) -> then hold at UPGRADE 5 OF 5
      upgradeTl.call(() => setLitModuleCount(1), [], 0.25);
      upgradeTl.call(() => setLitModuleCount(2), [], 0.95);
      upgradeTl.call(() => setLitModuleCount(3), [], 1.65);
      upgradeTl.call(() => setLitModuleCount(4), [], 2.35);
      upgradeTl.call(() => setLitModuleCount(5), [], 3.05);

      // Start continuous money stream once the upgrade sequence kicks in
      upgradeTl.call(startContinuousPrinting, [], 1.15);

      // Full Ignition Shockwave when all 5 modules lock in at 3.05s
      if (ringEl) {
        upgradeTl.fromTo(
          ringEl,
          { opacity: 0.9, scale: 0.8 },
          {
            opacity: 0,
            scale: 1.45,
            duration: 0.55,
            ease: "power2.out",
          },
          3.05
        );
      }
    });

    return () => masterCtx.revert();
  }, [isIterateModeActive]);

  // Keep platen bill synced when transitioning between Stage 3 and Stage 4
  useEffect(() => {
    if (!platenBillWrapRef.current || isTesting || isIterateModeActive) return;
    if (isLaunchModeActive) {
      const hiddenFraction = Math.max(0, Math.min(60, 100 - billPercent));
      gsap.to(platenBillWrapRef.current, {
        yPercent: hiddenFraction,
        rotation: -0.8,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(platenBillWrapRef.current, {
        yPercent: 40,
        rotation: -1.1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [isLaunchModeActive, isIterateModeActive, billPercent, isTesting]);

  // =========================================================================
  // STAGE 3 HANDLER: Click "Test" button
  // =========================================================================
  const handleRunTest = () => {
    if (isTesting || !isTestModeInteractive) return;

    setIsTesting(true);
    setPlatenUsesNewBill(true);
    const nextRun = testCount + 1;
    setTestCount(nextRun);

    setTestTerminalLines([
      `running user test #0${nextRun}...`,
      "printing crisp $1.00 revenue bill...",
    ]);

    // 1. Flick the vintage carriage return lever
    if (carriageHandleRef.current) {
      gsap.killTweensOf(carriageHandleRef.current);
      const leverTl = gsap.timeline();
      leverTl
        .to(carriageHandleRef.current, {
          rotation: -28,
          x: -8,
          y: 2,
          duration: 0.14,
          ease: "power3.out",
        })
        .to(carriageHandleRef.current, {
          rotation: 7,
          x: 2,
          y: 0,
          duration: 0.18,
          ease: "back.out(2.2)",
        })
        .to(carriageHandleRef.current, {
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.22,
          ease: "elastic.out(1.1, 0.5)",
        });
    }

    // 2. Subtle mechanical chatter on the typewriter body while printing
    if (typewriterChassisRef.current) {
      gsap.fromTo(
        typewriterChassisRef.current,
        { x: -2.5, y: 1 },
        {
          x: 2.5,
          y: -1,
          duration: 0.045,
          repeat: 10,
          yoyo: true,
          ease: "none",
          onComplete: () => {
            gsap.set(typewriterChassisRef.current, { x: 0, y: 0 });
          },
        }
      );
    }

    // 3. Feed the brand-new $1 bill up out of the typewriter platen, then fly it to the right into the "New bill" comparison slot
    const stageEl = stageContainerRef.current;
    const platenEl = platenSlotAnchorRef.current;
    const targetEl = newBillSlotRef.current;
    const flyerEl = flyingBillRef.current;
    const platenBillEl = platenBillWrapRef.current;

    if (!stageEl || !platenEl || !targetEl || !flyerEl || !platenBillEl) {
      setHasTested(true);
      setIsTesting(false);
      return;
    }

    gsap.killTweensOf([platenBillEl, flyerEl]);

    const masterTl = gsap.timeline({
      onComplete: () => {
        setHasTested(true);
        setIsTesting(false);
        setTestTerminalLines([
          "real buyer flow verified (0 leaks)",
          "new crisp $1.00 bill compared →",
        ]);
        if (newBillCardContentRef.current) {
          gsap.fromTo(
            newBillCardContentRef.current,
            { scale: 0.94, opacity: 0.4 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
          );
        }
      },
    });

    // Step A: Print the new bill upward out of the typewriter roller
    masterTl.fromTo(
      platenBillEl,
      { yPercent: 68, rotation: -0.8, opacity: 1 },
      {
        yPercent: 4,
        rotation: 0,
        duration: 0.5,
        ease: "steps(6)",
      }
    );

    // Step B: Launch the printed new bill out of the platen and fly it right into the "New bill" box
    masterTl.add(() => {
      const stageRect = stageEl.getBoundingClientRect();
      const platenRect = platenEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const startX =
        platenRect.left - stageRect.left + platenRect.width / 2;
      const startY =
        platenRect.top - stageRect.top + platenRect.height / 2;

      const endX =
        targetRect.left - stageRect.left + targetRect.width / 2;
      const endY =
        targetRect.top - stageRect.top + targetRect.height / 2;

      const midX = startX + (endX - startX) * 0.48;
      const midY = Math.min(startY, endY) - 48;

      // Reset platen bill slightly downward while flyer takes off
      gsap.set(platenBillEl, { opacity: 0 });
      gsap.fromTo(
        platenBillEl,
        { yPercent: 54, opacity: 0 },
        {
          yPercent: 40,
          opacity: 1,
          duration: 0.45,
          delay: 0.35,
          ease: "power2.out",
        }
      );

      gsap.set(flyerEl, {
        left: startX,
        top: startY,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: 0.92,
        rotation: -2,
        opacity: 1,
      });

      const flyTl = gsap.timeline();
      flyTl
        .to(flyerEl, {
          left: midX,
          top: midY,
          scale: 1.04,
          rotation: -4,
          duration: 0.34,
          ease: "power2.out",
        })
        .to(flyerEl, {
          left: endX,
          top: endY,
          scale: 1,
          rotation: 0,
          duration: 0.38,
          ease: "power3.inOut",
        })
        .to(flyerEl, {
          opacity: 0,
          duration: 0.12,
          ease: "power1.out",
        });
    });

    masterTl.to({}, { duration: 0.74 });
  };

  // =========================================================================
  // STAGE 4 HANDLER: Click +$20 / +$50 / +$100 Arched Buttons
  // =========================================================================
  const handleInjectSpend = (amount: SpendTier) => {
    if (!isLaunchModeInteractive) return;
    setActiveTier(amount);

    const revenueGain = Math.round(amount * 4.2);
    const nextSpent = spent + amount;
    const nextEarned = earned + revenueGain;

    setSpent(nextSpent);
    setEarned(nextEarned);
    setHistory((prev) => [
      ...prev.slice(-8),
      { spent: nextSpent, revenue: nextEarned },
    ]);

    setLaunchTerminalLines(PROFITABLE_SNIPPETS[amount]);
    setBillPercent((prev) => (prev >= 94 ? 68 : Math.min(96, prev + 10)));

    // 1. Flick the carriage return lever
    if (carriageHandleRef.current) {
      gsap.killTweensOf(carriageHandleRef.current);
      gsap
        .timeline()
        .to(carriageHandleRef.current, {
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
          ease: "back.out(2)",
        })
        .to(carriageHandleRef.current, {
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.22,
          ease: "elastic.out(1.1, 0.5)",
        });
    }

    // 2. Travel energy pulse along the selected wire into the typewriter
    const pathEl =
      amount === 20
        ? wire20PathRef.current
        : amount === 50
        ? wire50PathRef.current
        : wire100PathRef.current;

    const pulseEl = pulseDotGroupRef.current;
    if (pathEl && pulseEl) {
      const totalLen = pathEl.getTotalLength();
      const proxy = { t: 0 };
      gsap.killTweensOf(proxy);
      gsap.set(pulseEl, { opacity: 1 });

      gsap.to(proxy, {
        t: 1,
        duration: 0.36,
        ease: "power2.in",
        onUpdate: () => {
          const pt = pathEl.getPointAtLength(proxy.t * totalLen);
          pulseEl.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
        },
        onComplete: () => {
          gsap.to(pulseEl, { opacity: 0, duration: 0.15 });
          if (typewriterChassisRef.current) {
            gsap.fromTo(
              typewriterChassisRef.current,
              { y: 4, scale: 0.992 },
              {
                y: 0,
                scale: 1,
                duration: 0.28,
                ease: "elastic.out(1.2, 0.4)",
              }
            );
          }
          setTimeout(() => setActiveTier(null), 180);
        },
      });
    } else {
      setTimeout(() => setActiveTier(null), 350);
    }
  };

  // =========================================================================
  // STAGE 4 CHART GEOMETRY (Spend < Revenue)
  // =========================================================================
  const plotLeft = 44;
  const plotRight = 562;
  const plotTop = 18;
  const plotBottom = 186;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const maxDataVal = Math.max(
    2000,
    ...history.map((h) => Math.max(h.spent, h.revenue))
  );
  const chartCeiling = Math.ceil((maxDataVal * 1.12) / 500) * 500;

  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((fraction) => {
    const val = Math.round(chartCeiling * fraction);
    const y = +(plotBottom - fraction * plotHeight).toFixed(1);
    const label =
      val === 0
        ? "$0"
        : val >= 1000
        ? `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`
        : `$${val}`;
    return { val, y, label };
  });

  const totalDataPoints = Math.max(2, history.length);
  const xLabels = [
    { ptIdx: 0, label: "WK 1" },
    { ptIdx: Math.floor((totalDataPoints - 1) * 0.33), label: "WK 2" },
    { ptIdx: Math.floor((totalDataPoints - 1) * 0.66), label: "WK 3" },
    { ptIdx: totalDataPoints - 1, label: "NOW" },
  ];

  const spendPoints = history.map((pt, idx) => {
    const x = +(
      plotLeft +
      (idx / (totalDataPoints - 1)) * plotWidth
    ).toFixed(1);
    const y = +(
      plotBottom -
      Math.min(1, pt.spent / chartCeiling) * plotHeight
    ).toFixed(1);
    return { x, y, val: pt.spent };
  });

  const revenuePoints = history.map((pt, idx) => {
    const x = +(
      plotLeft +
      (idx / (totalDataPoints - 1)) * plotWidth
    ).toFixed(1);
    const y = +(
      plotBottom -
      Math.min(1, pt.revenue / chartCeiling) * plotHeight
    ).toFixed(1);
    return { x, y, val: pt.revenue };
  });

  const buildPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const spendLinePath = buildPath(spendPoints);
  const spendAreaPath = `${spendLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const revenueLinePath = buildPath(revenuePoints);
  const revenueAreaPath = `${revenueLinePath} L ${plotRight} ${plotBottom} L ${plotLeft} ${plotBottom} Z`;

  const spendEndPt = spendPoints[spendPoints.length - 1];
  const revEndPt = revenuePoints[revenuePoints.length - 1];
  const netProfit = Math.max(0, earned - spent);

  const activeTerminalLines = isIterateModeActive
    ? [
        "found the next leak...",
        "fixed it. tested it. shipped it.",
        "revenue up again.",
      ]
    : isLaunchModeActive
    ? launchTerminalLines
    : testTerminalLines;
  const isEmeraldMode =
    isIterateModeActive || isLaunchModeActive || isTesting || hasTested;

  return (
    <div
      ref={stageContainerRef}
      style={{
        opacity: stageOpacity,
        transform: `scale(${stageScale.toFixed(3)})`,
        pointerEvents: isStageVisible ? "auto" : "none",
      }}
      className="relative flex h-full w-full items-center justify-center select-none"
    >
      {/* Flying Crisp New $1 Bill (animates from Typewriter Platen -> Right "New bill" Comparison Slot in Stage 3) */}
      <div
        ref={flyingBillRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute z-50 h-[132px] w-[256px] sm:h-[148px] sm:w-[288px]"
      >
        <CrispDollarBillGraphic idPrefix="flying-test-new-bill" />
      </div>

      {/* =====================================================================
          STAGE 4 LEFT PANEL: SPEND VS. REVENUE PROFITABILITY GRAPH
          (Appears to the left of the moving typewriter with a tight 36px gap)
      ===================================================================== */}
      <div
        style={{
          opacity: launchAccessoriesOpacity,
          transform: `translate(-226px, ${(-8 + (1 - launchAccessoriesOpacity) * 18).toFixed(1)}px)`,
          pointerEvents: isLaunchModeInteractive ? "auto" : "none",
        }}
        className=" absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`w-[340px] rounded-2xl border p-4 transition-colors duration-300 sm:w-[440px] sm:p-5 lg:w-[465px] xl:w-[485px] ${
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

            <div className="relative h-[180px] w-full sm:h-[195px]">
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
      </div>

      {/* =====================================================================
          THE SINGLE SHARED FRONT-VIEW VINTAGE TYPEWRITER
          - Used in BOTH "3. Test the solution" AND "4. Launch and measure"!
          - Smoothly slides from x = -115px (Stage 3) to x = +245px (Stage 4)
          - Never fades out between Stage 3 and Stage 4!
      ===================================================================== */}
      <div
        style={{
          transform: `translate(${typewriterX.toFixed(1)}px, ${typewriterY.toFixed(1)}px)`,
        }}
        className="relative z-30 flex flex-col items-center will-change-transform"
      >
        {/* ===================================================================
            STAGE 4 TOP ACCESSORIES: 3 ARCHED BUTTONS (+$20 / +$50 / +$100) &
            CONNECTING POWER WIRES DIRECTLY ABOVE THE SHARED TYPEWRITER
        =================================================================== */}
        <div
          style={{
            opacity: launchAccessoriesOpacity,
            transform: `translateY(${((1 - launchAccessoriesOpacity) * -12).toFixed(1)}px)`,
            pointerEvents: isLaunchModeInteractive ? "auto" : "none",
          }}
          className="pointer-events-none absolute -top-[128px] left-1/2 z-10 h-[220px] w-[420px] -translate-x-1/2 sm:w-[460px]"
        >
          {/* Connecting Power Wires */}
          <svg
            aria-hidden="true"
            viewBox="0 0 460 220"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          >
            <path
              ref={wire20PathRef}
              d="M 58 84 Q 108 165 172 198"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.18)" : "rgba(244,240,234,0.14)"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              ref={wire50PathRef}
              d="M 230 68 Q 230 140 230 192"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.18)" : "rgba(244,240,234,0.14)"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              ref={wire100PathRef}
              d="M 402 84 Q 352 165 288 198"
              fill="none"
              stroke={isLight ? "rgba(20,20,19,0.22)" : "rgba(232,155,60,0.22)"}
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Animated dotted energy streams */}
            <path
              d="M 58 84 Q 108 165 172 198"
              fill="none"
              stroke={activeTier === 20 ? "#10b981" : "#e89b3c"}
              strokeWidth={activeTier === 20 ? "3.2" : "2.2"}
              strokeLinecap="round"
              strokeDasharray={activeTier === 20 ? undefined : "3 10"}
              className={activeTier === 20 ? "" : "wire-energy-flow"}
            />
            <path
              d="M 230 68 Q 230 140 230 192"
              fill="none"
              stroke={activeTier === 50 ? "#10b981" : "#e89b3c"}
              strokeWidth={activeTier === 50 ? "3.2" : "2.2"}
              strokeLinecap="round"
              strokeDasharray={activeTier === 50 ? undefined : "3 10"}
              className={activeTier === 50 ? "" : "wire-energy-flow"}
            />
            <path
              d="M 402 84 Q 352 165 288 198"
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

          {/* NODE 1: +$20 (TOOLS & SUBS) */}
          <div className=" absolute left-[0%] top-[10px] z-30">
            <button
              type="button"
              onClick={() => handleInjectSpend(20)}
              className={`group relative flex h-[70px] w-[104px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[74px] sm:w-[114px] ${
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
          <div className=" absolute left-1/2 -top-[8px] z-30 -translate-x-1/2">
            <button
              type="button"
              onClick={() => handleInjectSpend(50)}
              className={`group relative flex h-[74px] w-[110px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[78px] sm:w-[120px] ${
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

          {/* NODE 3: +$100 (SCALE & SHIP) */}
          <div className=" absolute right-[0%] top-[6px] z-30">
            <button
              type="button"
              onClick={() => handleInjectSpend(100)}
              className={`group relative flex h-[76px] w-[116px] cursor-pointer flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.97] sm:h-[82px] sm:w-[126px] ${
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
        </div>

        {/* ===================================================================
            THE UNIFIED TYPEWRITER CHASSIS & PLATEN SLOT
        =================================================================== */}
        <div
          ref={typewriterChassisRef}
          className="relative z-20 flex w-[310px] flex-col items-center sm:w-[360px] lg:w-[390px]"
        >
          {/* STAGE 5 UPGRADE SHOCKWAVE RING & AMBIENT OVERDRIVE AURA */}
          <div
            ref={upgradeRingRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-[-28px] inset-y-[-18px] z-0 rounded-3xl border-2 border-[#10b981] shadow-[0_0_45px_rgba(16,185,129,0.75),inset_0_0_30px_rgba(232,155,60,0.45)]"
          />
          {isIterateModeActive && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 z-0 rounded-full bg-radial from-[#10b981]/18 via-[#e89b3c]/8 to-transparent blur-2xl transition-opacity duration-500"
            />
          )}

          {/* =================================================================
              STAGE 5: 5 OUTER MODULES (LIGHTING UP 1 -> 5 SLOWLY)
              1) PRICING (Upper-Left Shoulder)
              2) MARKETING (Upper-Right Shoulder)
              3) POSITIONING (Lower-Left Flank)
              4) PRODUCT (Lower-Right Flank)
              5) ONBOARDING + Bottom Bar ("UPGRADE 1 OF 5" -> "UPGRADE 5 OF 5")
          ================================================================= */}

          {/* MODULE 1: PRICING (Clamped Directly onto Upper-Left Carriage & Hood Shoulder) */}
          <div
            ref={jetPart1Ref}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute -left-[52px] top-[88px] z-25 flex items-center sm:-left-[62px] sm:top-[96px]"
          >
            {/* Swept-Back Outer Mech Wing Blade */}
            <div
              className={`relative z-20 flex h-[86px] w-[70px] -rotate-6 flex-col justify-between rounded-tl-2xl rounded-bl-lg border-y border-l-2 bg-gradient-to-br from-[#2d2d38] via-[#17171f] to-[#0a0a0e] p-2 transition-all duration-500 sm:h-[92px] sm:w-[78px] ${
                litModuleCount >= 1
                  ? "border-[#10b981] shadow-[-10px_8px_24px_rgba(0,0,0,0.85),0_0_22px_rgba(16,185,129,0.45)]"
                  : "border-white/15 opacity-55 shadow-[-6px_4px_16px_rgba(0,0,0,0.6)]"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`font-mono-label text-[6.5px] font-bold tracking-[0.1em] transition-colors duration-500 sm:text-[7px] ${
                    litModuleCount >= 1 ? "text-[#34d399]" : "text-white/40"
                  }`}
                >
                  PRICING
                </span>
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 1
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/20"
                  }`}
                />
              </div>

              {/* Spinning Emerald Jet-Turbine Intake Rotor */}
              <div
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  litModuleCount >= 1
                    ? "border-[#10b981] bg-[#071510] shadow-[0_0_16px_rgba(16,185,129,0.7),inset_0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-white/20 bg-[#0d0d12]"
                }`}
              >
                <div
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border ${
                    litModuleCount >= 1
                      ? "border-[#34d399]/70"
                      : "border-white/20"
                  } ${
                    litModuleCount >= 1 && isContinuousPrinting
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute h-full w-0.5 ${
                      litModuleCount >= 1 ? "bg-[#34d399]" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-full ${
                      litModuleCount >= 1 ? "bg-[#34d399]" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      litModuleCount >= 1
                        ? "bg-[#ffffff] shadow-[0_0_8px_#10b981]"
                        : "bg-white/30"
                    }`}
                  />
                </div>
              </div>

              {/* Exhaust Afterburner Vents */}
              <div className="flex items-center justify-center gap-1">
                <span
                  className={`h-1.5 w-3 rounded-xs transition-all duration-500 ${
                    litModuleCount >= 1
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/15"
                  }`}
                />
                <span
                  className={`h-1.5 w-3 rounded-xs transition-all duration-500 ${
                    litModuleCount >= 1
                      ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                      : "bg-white/15"
                  }`}
                />
              </div>
            </div>

            {/* Heavy Armored Shoulder Clamp Yoke & Dual Hydraulic Struts */}
            <div className="-ml-3 z-10 flex h-[64px] w-[38px] flex-col justify-between rounded-r-md border-y border-r-2 border-[#e89b3c]/80 bg-gradient-to-r from-[#262630] via-[#1b1b22] to-[#121217] py-1.5 pr-1 pl-2.5 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-full rounded-xs border border-black/60 bg-gradient-to-b from-[#e4e0d8] via-[#8a867c] to-[#3a3936]" />
                <span
                  className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 1
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/20"
                  }`}
                />
              </div>
              <div
                className={`h-2.5 w-full rounded-xs border transition-all duration-500 ${
                  litModuleCount >= 1
                    ? "border-[#10b981]/60 bg-[#10b981]/25 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-white/15 bg-white/5"
                }`}
              />
              <div className="flex items-center gap-1">
                <span className="h-2 w-full rounded-xs border border-black/60 bg-gradient-to-b from-[#e4e0d8] via-[#8a867c] to-[#3a3936]" />
                <span
                  className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 1
                      ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                      : "bg-white/20"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* MODULE 2: MARKETING (Clamped Directly onto Upper-Right Carriage & Hood Shoulder) */}
          <div
            ref={jetPart2Ref}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute -right-[52px] top-[88px] z-25 flex items-center sm:-right-[62px] sm:top-[96px]"
          >
            {/* Heavy Armored Shoulder Clamp Yoke & Dual Hydraulic Struts */}
            <div className="-mr-3 z-10 flex h-[64px] w-[38px] flex-col justify-between rounded-l-md border-y border-l-2 border-[#e89b3c]/80 bg-gradient-to-l from-[#262630] via-[#1b1b22] to-[#121217] py-1.5 pr-2.5 pl-1 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]">
              <div className="flex items-center gap-1">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 2
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/20"
                  }`}
                />
                <span className="h-2 w-full rounded-xs border border-black/60 bg-gradient-to-b from-[#e4e0d8] via-[#8a867c] to-[#3a3936]" />
              </div>
              <div
                className={`h-2.5 w-full rounded-xs border transition-all duration-500 ${
                  litModuleCount >= 2
                    ? "border-[#10b981]/60 bg-[#10b981]/25 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-white/15 bg-white/5"
                }`}
              />
              <div className="flex items-center gap-1">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 2
                      ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                      : "bg-white/20"
                  }`}
                />
                <span className="h-2 w-full rounded-xs border border-black/60 bg-gradient-to-b from-[#e4e0d8] via-[#8a867c] to-[#3a3936]" />
              </div>
            </div>

            {/* Swept-Back Outer Mech Wing Blade */}
            <div
              className={`relative z-20 flex h-[86px] w-[70px] rotate-6 flex-col justify-between rounded-tr-2xl rounded-br-lg border-y border-r-2 bg-gradient-to-bl from-[#2d2d38] via-[#17171f] to-[#0a0a0e] p-2 transition-all duration-500 sm:h-[92px] sm:w-[78px] ${
                litModuleCount >= 2
                  ? "border-[#10b981] shadow-[10px_8px_24px_rgba(0,0,0,0.85),0_0_22px_rgba(16,185,129,0.45)]"
                  : "border-white/15 opacity-55 shadow-[6px_4px_16px_rgba(0,0,0,0.6)]"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${
                    litModuleCount >= 2
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/20"
                  }`}
                />
                <span
                  className={`font-mono-label text-[6.5px] font-bold tracking-[0.08em] transition-colors duration-500 sm:text-[7px] ${
                    litModuleCount >= 2 ? "text-[#34d399]" : "text-white/40"
                  }`}
                >
                  MARKETING
                </span>
              </div>

              {/* Spinning Emerald Jet-Turbine Intake Rotor */}
              <div
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  litModuleCount >= 2
                    ? "border-[#10b981] bg-[#071510] shadow-[0_0_16px_rgba(16,185,129,0.7),inset_0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-white/20 bg-[#0d0d12]"
                }`}
              >
                <div
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border ${
                    litModuleCount >= 2
                      ? "border-[#34d399]/70"
                      : "border-white/20"
                  } ${
                    litModuleCount >= 2 && isContinuousPrinting
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute h-full w-0.5 ${
                      litModuleCount >= 2 ? "bg-[#34d399]" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-full ${
                      litModuleCount >= 2 ? "bg-[#34d399]" : "bg-white/25"
                    }`}
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      litModuleCount >= 2
                        ? "bg-[#ffffff] shadow-[0_0_8px_#10b981]"
                        : "bg-white/30"
                    }`}
                  />
                </div>
              </div>

              {/* Exhaust Afterburner Vents */}
              <div className="flex items-center justify-center gap-1">
                <span
                  className={`h-1.5 w-3 rounded-xs transition-all duration-500 ${
                    litModuleCount >= 2
                      ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                      : "bg-white/15"
                  }`}
                />
                <span
                  className={`h-1.5 w-3 rounded-xs transition-all duration-500 ${
                    litModuleCount >= 2
                      ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                      : "bg-white/15"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* MODULE 3: POSITIONING (Lower-Left Flank) */}
          <div
            ref={jetPart3Ref}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute -left-[68px] bottom-3 z-25 flex flex-col items-center sm:-left-[78px]"
          >
            {/* Top Cannon Barrel */}
            <div
              className={`h-3.5 w-2.5 rounded-t-sm border-x border-t transition-all duration-500 ${
                litModuleCount >= 3
                  ? "border-[#10b981] bg-[#10b981]/30 shadow-[0_-4px_12px_rgba(16,185,129,0.8)]"
                  : "border-white/20 bg-white/5"
              }`}
            />
            {/* Heavy Side Armor Pod */}
            <div
              className={`flex h-[118px] w-[72px] flex-col items-center justify-between rounded-l-xl border-y border-l-2 bg-gradient-to-b from-[#262632] via-[#15151c] to-[#09090d] py-2.5 px-1.5 transition-all duration-500 sm:w-[82px] ${
                litModuleCount >= 3
                  ? "border-[#10b981] shadow-[-10px_0_28px_rgba(16,185,129,0.45)]"
                  : "border-white/15 opacity-55 shadow-[-6px_0_16px_rgba(0,0,0,0.6)]"
              }`}
            >
              <span
                className={`font-mono-label text-[6px] font-bold tracking-[0.06em] transition-colors duration-500 sm:text-[6.5px] ${
                  litModuleCount >= 3 ? "text-[#34d399]" : "text-white/40"
                }`}
              >
                POSITIONING
              </span>
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2, 3].map((cell) => (
                  <span
                    key={cell}
                    className={`h-2.5 w-6 rounded-xs transition-all duration-500 ${
                      litModuleCount >= 3
                        ? "animate-pulse bg-[#10b981] shadow-[0_0_10px_#10b981]"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`h-2 w-6 rounded-xs transition-all duration-500 ${
                  litModuleCount >= 3
                    ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                    : "bg-white/15"
                }`}
              />
            </div>
          </div>

          {/* MODULE 4: PRODUCT (Lower-Right Flank) */}
          <div
            ref={jetPart4Ref}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute -right-[68px] bottom-3 z-25 flex flex-col items-center sm:-right-[78px]"
          >
            {/* Top Cannon Barrel */}
            <div
              className={`h-3.5 w-2.5 rounded-t-sm border-x border-t transition-all duration-500 ${
                litModuleCount >= 4
                  ? "border-[#10b981] bg-[#10b981]/30 shadow-[0_-4px_12px_rgba(16,185,129,0.8)]"
                  : "border-white/20 bg-white/5"
              }`}
            />
            {/* Heavy Side Armor Pod */}
            <div
              className={`flex h-[118px] w-[72px] flex-col items-center justify-between rounded-r-xl border-y border-r-2 bg-gradient-to-b from-[#262632] via-[#15151c] to-[#09090d] py-2.5 px-1.5 transition-all duration-500 sm:w-[82px] ${
                litModuleCount >= 4
                  ? "border-[#10b981] shadow-[10px_0_28px_rgba(16,185,129,0.45)]"
                  : "border-white/15 opacity-55 shadow-[6px_0_16px_rgba(0,0,0,0.6)]"
              }`}
            >
              <span
                className={`font-mono-label text-[6.5px] font-bold tracking-[0.1em] transition-colors duration-500 sm:text-[7px] ${
                  litModuleCount >= 4 ? "text-[#34d399]" : "text-white/40"
                }`}
              >
                PRODUCT
              </span>
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2, 3].map((cell) => (
                  <span
                    key={cell}
                    className={`h-2.5 w-6 rounded-xs transition-all duration-500 ${
                      litModuleCount >= 4
                        ? "animate-pulse bg-[#10b981] shadow-[0_0_10px_#10b981]"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`h-2 w-6 rounded-xs transition-all duration-500 ${
                  litModuleCount >= 4
                    ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                    : "bg-white/15"
                }`}
              />
            </div>
          </div>

          {/* MODULE 5 (ONBOARDING) & BOTTOM UPGRADE BAR ("UPGRADE 1 OF 5" -> "UPGRADE 5 OF 5") */}
          <div
            ref={jetPart5Ref}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className={`pointer-events-none absolute inset-x-0 -bottom-[28px] z-40 mx-auto flex w-[290px] items-center justify-between rounded-b-xl rounded-t-md border-2 bg-gradient-to-r from-[#181820] via-[#262420] to-[#181820] px-3 py-1.5 transition-all duration-500 sm:w-[336px] ${
              litModuleCount >= 5
                ? "border-[#10b981] shadow-[0_14px_32px_rgba(0,0,0,0.85),0_0_24px_rgba(16,185,129,0.45)]"
                : "border-[#e89b3c]/70 shadow-[0_14px_32px_rgba(0,0,0,0.85),0_0_18px_rgba(232,155,60,0.28)]"
            }`}
          >
            {/* 5th Module Label: ONBOARDING */}
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-xs transition-all duration-500 ${
                  litModuleCount >= 5
                    ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                    : "bg-white/20"
                }`}
              />
              <span
                className={`font-mono-label text-[7px] font-bold uppercase tracking-[0.14em] transition-colors duration-500 sm:text-[7.5px] ${
                  litModuleCount >= 5 ? "text-[#34d399]" : "text-white/40"
                }`}
              >
                ONBOARDING
              </span>
            </div>

            {/* Upgrade Progress Counter: "UPGRADE 1 OF 5" -> "UPGRADE 5 OF 5" */}
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-0.5 transition-all duration-500 ${
                litModuleCount >= 5
                  ? "border-[#10b981] bg-[#071812] shadow-[0_0_16px_rgba(16,185,129,0.75),inset_0_0_8px_rgba(16,185,129,0.45)]"
                  : "border-[#e89b3c]/70 bg-[#171410] shadow-[0_0_12px_rgba(232,155,60,0.3)]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  litModuleCount >= 5
                    ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                    : "animate-pulse bg-[#e89b3c] shadow-[0_0_6px_#e89b3c]"
                }`}
              />
              <span className="font-mono-label text-[7.5px] font-bold uppercase tracking-[0.16em] text-[#ecfdf5]">
                UPGRADE {Math.max(1, litModuleCount)} OF 5
              </span>
            </div>

            {/* 5 Module Status Pips */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <span
                  key={stepNum}
                  className={`h-2.5 w-1.5 rounded-xs transition-all duration-300 ${
                    litModuleCount >= stepNum
                      ? "bg-[#10b981] shadow-[0_0_6px_#10b981]"
                      : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STAGE 5 CONTINUOUS MONEY STREAM (3 Staggered Crisp $1 Bills Ejecting Upward) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 left-1/2 z-15 h-[110px] w-[254px] -translate-x-1/2"
          >
            <div
              ref={streamBill1Ref}
              style={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full"
            >
              <CrispDollarBillGraphic idPrefix="iterate-stream-bill-1" />
            </div>
            <div
              ref={streamBill2Ref}
              style={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full"
            >
              <CrispDollarBillGraphic idPrefix="iterate-stream-bill-2" />
            </div>
            <div
              ref={streamBill3Ref}
              style={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full"
            >
              <CrispDollarBillGraphic idPrefix="iterate-stream-bill-3" />
            </div>
          </div>

          {/* PLATEN PAPER SLOT VIEWPORT */}
          <div
            ref={platenSlotAnchorRef}
            className="relative z-20 -mb-2.5 flex w-full flex-col items-center"
          >
            <div className="relative z-10 flex h-[68px] w-[200px] items-end justify-center overflow-hidden sm:h-[78px] sm:w-[236px] lg:h-[84px] lg:w-[254px]">
              <div
                ref={platenBillWrapRef}
                style={{
                  transform: "translateY(40%) rotate(-1.1deg)",
                }}
                className="relative h-[92px] w-full sm:h-[104px] lg:h-[110px]"
              >
                {platenUsesNewBill || isLaunchModeActive || isIterateModeActive ? (
                  <CrispDollarBillGraphic idPrefix="shared-platen-new-bill" />
                ) : (
                  <DollarBillGraphic idPrefix="shared-platen-old-bill" />
                )}
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

              {/* Ribbed Rubber Platen Roller Cylinder + Chrome Paper Bail */}
              <div className="relative flex h-7 flex-1 flex-col items-center justify-start rounded-sm border-y border-black/60 bg-gradient-to-b from-[#34343c] via-[#1c1c22] to-[#0e0e12] shadow-[0_6px_14px_rgba(0,0,0,0.55),inset_0_2px_4px_rgba(255,255,255,0.12)] sm:h-8">
                <div className="h-1.5 w-[76%] rounded-b-full bg-black shadow-[inset_0_2px_5px_rgba(0,0,0,1)]" />
                <div className="mt-1 flex w-[76%] items-center justify-between border-t border-[#d8d4cc]/80 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  <span className="-mt-1 h-2.5 w-3 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a]" />
                  <span className="-mt-1 h-2.5 w-3 rounded-xs border border-black/60 bg-gradient-to-b from-[#4a4842] to-[#1e1d1a]" />
                </div>
                <div className="mt-auto flex h-1.5 w-[88%] items-center justify-between border-t border-white/15 bg-[#121216] px-2">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-px ${
                        i === 10
                          ? "h-1.5 bg-[#e89b3c]"
                          : i % 4 === 0
                          ? "h-1 bg-[#d8d4cc]/70"
                          : "h-0.5 bg-[#d8d4cc]/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Knurled Chrome Platen Knob + Vintage Curved Return Lever */}
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

                {/* Pivoting Vintage Chrome Carriage Return Lever */}
                <div
                  ref={carriageHandleRef}
                  style={{ transformOrigin: "bottom left" }}
                  className="pointer-events-none absolute bottom-1.5 left-full -ml-1 flex flex-col items-end"
                >
                  <div className="h-3 w-5 -rotate-12 rounded-full border border-black/30 bg-gradient-to-r from-[#f3b15c] via-[#e89b3c] to-[#b36a14] shadow-[0_2px_10px_rgba(232,155,60,0.5)]" />
                  <div className="-mt-1 mr-1.5 h-8 w-2 rotate-25 rounded-full border border-black/25 bg-gradient-to-b from-[#f4f0ea] via-[#a8a49c] to-[#52504a] shadow-md" />
                </div>
              </div>
            </div>

            {/* 2. UPPER RIBBON SPOOL HOOD & TYPEBAR BASKET */}
            <div
              className={`relative -mt-0.5 flex w-[88%] flex-col items-center rounded-t-[22px] border-x border-t px-3.5 pt-2.5 pb-1.5 ${
                isLight
                  ? "border-black/20 bg-gradient-to-b from-[#f5f0e4] to-[#e5decb] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9)]"
                  : "border-white/15 bg-gradient-to-b from-[#2a2a33] to-[#1c1c23] shadow-[inset_0_2px_4px_rgba(255,255,255,0.12)]"
              }`}
            >
              {/* Bichrome Red/Black Ink Ribbon stretched between spools */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-4.5 right-10 left-10 flex flex-col"
              >
                <div className="h-0.5 w-full bg-[#18181b] opacity-80" />
                <div className="h-0.5 w-full bg-[#b93829] opacity-85" />
              </div>

              <div className="relative z-10 flex w-full items-center justify-between">
                {/* Left Vintage Metal Spool */}
                <div
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-inner sm:h-8 sm:w-8 ${
                    isLight
                      ? "border-[#8c867a] bg-[#22211f]"
                      : "border-[#5a5852] bg-[#0c0c10]"
                  } ${
                    isTesting || activeTier !== null || isContinuousPrinting
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                  <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                  <div className="z-10 h-3 w-3 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c]" />
                </div>

                {/* Center Open Typebar Basket + Riveted Brass Plaque */}
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
                    <div
                      className={`z-10 h-2 w-3 rounded-b-xs border-x border-b bg-[#2a2825] ${
                        isIterateModeActive
                          ? "border-[#10b981]"
                          : "border-[#e89b3c]/80"
                      }`}
                    />
                  </div>

                  <div
                    className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 transition-all duration-300 ${
                      isIterateModeActive
                        ? "border-[#10b981] bg-gradient-to-b from-[#112820] to-[#0a1813] shadow-[0_0_14px_rgba(16,185,129,0.45)]"
                        : "border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${
                        isIterateModeActive
                          ? "bg-[#10b981] shadow-[0_0_6px_#10b981]"
                          : "bg-[#e89b3c]"
                      }`}
                    />
                    <span
                      className={`font-mono-label text-[8px] font-bold uppercase tracking-[0.22em] sm:text-[9px] ${
                        isIterateModeActive ? "text-[#34d399]" : "text-[#f3b15c]"
                      }`}
                    >
                      YOUR BUSINESS
                    </span>
                    <span
                      className={`h-1 w-1 rounded-full ${
                        isIterateModeActive
                          ? "bg-[#10b981] shadow-[0_0_6px_#10b981]"
                          : "bg-[#e89b3c]"
                      }`}
                    />
                  </div>
                </div>

                {/* Right Vintage Metal Spool */}
                <div
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-inner sm:h-8 sm:w-8 ${
                    isLight
                      ? "border-[#8c867a] bg-[#22211f]"
                      : "border-[#5a5852] bg-[#0c0c10]"
                  } ${
                    isTesting || activeTier !== null || isContinuousPrinting
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                  <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                  <div className="z-10 h-3 w-3 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c]" />
                </div>
              </div>
            </div>

            {/* 3. WIDER SLOPED LOWER KEYBED HOUSING TERMINAL & SPACEBAR */}
            <div
              className={`relative -mt-0.5 w-full rounded-t-xl rounded-b-2xl border px-3.5 pt-2.5 pb-3 transition-all duration-300 sm:px-4 sm:pt-3 sm:pb-3.5 ${
                isLight
                  ? "border-black/20 bg-gradient-to-b from-[#ede6d6] via-[#e2dac8] to-[#d2c9b4] shadow-[0_22px_48px_rgba(20,20,19,0.16),inset_0_2px_2px_rgba(255,255,255,0.8)]"
                  : "border-white/12 bg-gradient-to-b from-[#22222b] via-[#15151b] to-[#0c0c10] shadow-[0_26px_55px_rgba(0,0,0,0.82),inset_0_2px_3px_rgba(255,255,255,0.08)]"
              } ${
                isTesting || activeTier !== null || isIterateModeActive
                  ? "ring-2 ring-[#10b981]/75 shadow-[0_20px_55px_rgba(16,185,129,0.34)]"
                  : ""
              }`}
            >
              {/* Live Fuel / Status Bar */}
              <div className="mx-auto mb-2 flex w-[96%] items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isEmeraldMode
                        ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                        : "bg-[#e89b3c]"
                    }`}
                  />
                  <span
                    className={`font-mono-label text-[7.5px] uppercase tracking-[0.16em] sm:text-[8px] ${
                      isEmeraldMode
                        ? "font-semibold text-[#10b981]"
                        : isLight
                        ? "text-[#6e6a62]"
                        : "text-[#8e8a80]"
                    }`}
                  >
                    {isIterateModeActive
                      ? "POWERED BY STEWARD"
                      : isLaunchModeActive
                      ? "✓ HIGH-YIELD ENGINE — 4.2x RETURN"
                      : isTesting
                      ? "⚡ TESTING SOLUTION LIVE..."
                      : hasTested
                      ? "✓ TEST PASSED — HIGH YIELD"
                      : "⚡ ASSEMBLED — CLICK TEST BELOW"}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4, 5].map((segIdx) => (
                    <span
                      key={segIdx}
                      className={`h-1.5 w-2 rounded-[1px] transition-all duration-150 ${
                        isEmeraldMode
                          ? "bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.75)]"
                          : segIdx < 3
                          ? "bg-[#e89b3c]/80"
                          : isLight
                          ? "bg-black/15"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Recessed Typewriter Keybed Terminal Screen */}
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
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isLight ? "bg-[#c8c2b4]" : "bg-[#3a3a46]"
                      }`}
                    />
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isLight ? "bg-[#c8c2b4]" : "bg-[#3a3a46]"
                      }`}
                    />
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isEmeraldMode ? "bg-[#10b981]" : "bg-[#e89b3c]"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-mono-label text-[7.5px] uppercase tracking-[0.18em] ${
                      isLight ? "text-[#6e6a62]" : "text-[#7a7770]"
                    }`}
                  >
                    {isLaunchModeActive || isIterateModeActive
                      ? "tty://revenue.log"
                      : "tty://spend.log"}
                  </span>
                  <span
                    className={`font-mono-label text-[7.5px] uppercase tracking-[0.16em] ${
                      isEmeraldMode
                        ? "font-semibold text-[#10b981]"
                        : isLight
                        ? "text-[#8a857c]"
                        : "text-[#5c5954]"
                    }`}
                  >
                    {isLaunchModeActive || isIterateModeActive
                      ? "PROFITABLE"
                      : isTesting
                      ? "TESTING"
                      : "READY"}
                  </span>
                </div>

                <div
                  className={`flex flex-col justify-end space-y-1 font-mono-label text-[9.5px] leading-snug sm:text-[10px] ${
                    activeTerminalLines.length >= 3 ? "min-h-[60px]" : "h-[46px]"
                  }`}
                >
                  {activeTerminalLines.slice(0, -1).map((line, idx) => (
                    <div
                      key={idx}
                      className={`truncate px-1 ${
                        isLight ? "text-[#6e6a62]" : "text-[#8e8a80]"
                      }`}
                    >
                      &gt; {line}
                    </div>
                  ))}
                  <div
                    className={`truncate rounded px-1.5 py-0.5 font-semibold ${
                      isEmeraldMode
                        ? isLight
                          ? "border-l-2 border-[#059669] bg-[#10b981]/15 text-[#065f46]"
                          : "border-l-2 border-[#10b981] bg-[#10b981]/15 text-[#ecfdf5]"
                        : isLight
                        ? "border-l-2 border-[#b86409] bg-[#e89b3c]/15 text-[#8a4600]"
                        : "border-l-2 border-[#e89b3c] bg-[#e89b3c]/15 text-[#f4f0ea]"
                    }`}
                  >
                    ▸ {activeTerminalLines[activeTerminalLines.length - 1]}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Round Chrome-Ringed Glass Shift Keys + Spacebar */}
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
                  <div className="flex w-[70%] justify-between px-3">
                    <span className="h-1 w-0.5 bg-[#9e9a90]" />
                    <span className="h-1 w-0.5 bg-[#9e9a90]" />
                  </div>
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

            {/* Heavy Vintage Rubber Desk Feet */}
            <div
              aria-hidden="true"
              className="mx-auto flex w-[84%] justify-between px-5"
            >
              <div className="h-1.5 w-8 rounded-b-sm bg-[#141416] shadow-sm" />
              <div className="h-1.5 w-8 rounded-b-sm bg-[#141416] shadow-sm" />
            </div>
          </div>
        </div>

        {/* ===================================================================
            STAGE 3 BOTTOM ACCESSORY: "TEST" BUTTON DIRECTLY BELOW TYPEWRITER
        =================================================================== */}
        <div
          style={{
            opacity: testAccessoriesOpacity,
            transform: `translateY(${((1 - testAccessoriesOpacity) * 8).toFixed(1)}px)`,
            pointerEvents: isTestModeInteractive ? "auto" : "none",
          }}
          className="absolute -bottom-[52px] left-1/2 -translate-x-1/2"
        >
          <button
            type="button"
            onClick={handleRunTest}
            disabled={isTesting}
            className={`group relative inline-flex h-[36px] w-[132px] cursor-pointer items-center justify-between rounded-lg border border-[#f3b15c] bg-[#e89b3c] px-3.5 text-[#08080a] shadow-[0_0_24px_rgba(232,155,60,0.6),inset_0_0_10px_rgba(255,255,255,0.22)] transition-all duration-200 hover:border-[#e89b3c] hover:bg-[#111116] hover:text-[#f4f0ea] hover:shadow-[0_0_28px_rgba(232,155,60,0.45)] active:scale-[0.97] disabled:cursor-wait sm:w-[144px] ${
              !hasTested && !isTesting ? "orb-begging" : ""
            }`}
          >
            {/* Glowing border aura animation */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[1px] rounded-lg border border-[#e89b3c] shadow-[0_0_18px_rgba(232,155,60,0.75)] animate-pulse"
            />

            <span className="relative z-10 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  isTesting
                    ? "animate-ping bg-[#08080a] group-hover:bg-[#e89b3c]"
                    : "bg-[#08080a] group-hover:bg-[#e89b3c] group-hover:shadow-[0_0_6px_#e89b3c]"
                }`}
              />
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.2em]">
                {isTesting ? "Testing..." : "Test"}
              </span>
            </span>

            <span className="relative z-10 font-mono-label text-[10.5px] opacity-85 transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          STAGE 3 RIGHT PANEL: VERSION 1 (OLD BILL) vs. VERSION 1.1 (NEW BILL)
          (Sits 36px to the right of the Stage 3 typewriter position)
      ===================================================================== */}
      <div
        style={{
          opacity: testAccessoriesOpacity,
          transform: `translate(${(260 + (1 - testAccessoriesOpacity) * 24).toFixed(1)}px, -24px)`,
          pointerEvents: isTestModeInteractive ? "auto" : "none",
        }}
        className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-4 sm:gap-5"
      >
        {/* TOP PLACEHOLDER: VERSION 1 (OLD BILL) */}
        <div className="flex flex-col items-start gap-1.5">
          <span className="font-mono-label text-[9.5px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            Version 1
          </span>
          <div className="relative h-[132px] w-[256px] overflow-hidden rounded-md sm:h-[148px] sm:w-[288px]">
            <DollarBillGraphic idPrefix="comparison-old-bill" />
          </div>
        </div>

        {/* BOTTOM PLACEHOLDER: VERSION 1.1 - TEST {testCount} (NEW BILL) */}
        <div className="flex flex-col items-start gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                isTesting
                  ? "scale-125 bg-[#10b981] shadow-[0_0_12px_#10b981,0_0_20px_rgba(16,185,129,0.95)]"
                  : testCount > 0
                  ? "bg-[#10b981] shadow-[0_0_8px_#10b981,0_0_14px_rgba(16,185,129,0.75)]"
                  : isLight
                  ? "bg-black/30"
                  : "bg-white/30"
              }`}
            />
            <span
              className={`font-mono-label text-[9.5px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                testCount > 0 || isTesting
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Version 1.1 - Test {testCount}
            </span>
          </div>

          <div
            ref={newBillSlotRef}
            className={`relative h-[132px] w-[256px] overflow-hidden rounded-md transition-all duration-300 sm:h-[148px] sm:w-[288px] ${
              hasTested
                ? "shadow-[0_14px_34px_rgba(16,185,129,0.2)]"
                : isLight
                ? "border-2 border-dashed border-black/25 bg-black/[0.02]"
                : "border-2 border-dashed border-white/25 bg-white/[0.01]"
            }`}
          >
            {hasTested && (
              <div ref={newBillCardContentRef} className="h-full w-full">
                <CrispDollarBillGraphic idPrefix="comparison-new-bill" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
