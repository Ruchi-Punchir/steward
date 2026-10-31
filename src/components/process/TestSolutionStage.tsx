"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { DollarBillGraphic } from "@/components/hero/TypewriterStage";

/**
 * Pristine, Brand-New, Crisp US $1 Federal Reserve Note
 * Produced after Steward fixes the leaks and tests the solution:
 * - Razor-sharp intact rectangular edges (zero tears, zero platen bites)
 * - Uncreased, bright mint-cream & emerald cotton-linen paper (zero stains or fold cracks)
 * - Crisp emerald intaglio engraving & "✓ VERIFIED" seal (replacing "#ERR-FEED")
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

interface TestSolutionStageProps {
  /** 0..1 progress of Stage 3 ("Test the solution") */
  testProgress: number;
  isLight: boolean;
}

export default function TestSolutionStage({
  testProgress,
  isLight,
}: TestSolutionStageProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [hasTested, setHasTested] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [platenUsesNewBill, setPlatenUsesNewBill] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "all 5 units assembled & aligned",
    "ready for live user test...",
  ]);

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const typewriterChassisRef = useRef<HTMLDivElement | null>(null);
  const carriageHandleRef = useRef<HTMLDivElement | null>(null);
  const platenBillWrapRef = useRef<HTMLDivElement | null>(null);
  const platenSlotAnchorRef = useRef<HTMLDivElement | null>(null);
  const newBillSlotRef = useRef<HTMLDivElement | null>(null);
  const flyingBillRef = useRef<HTMLDivElement | null>(null);
  const newBillCardContentRef = useRef<HTMLDivElement | null>(null);

  // Reveal opacity as the 3D isometric typewriter finishes assembling (testProgress: 0.42 -> 0.82)
  const stageOpacity = Math.max(0, Math.min(1, (testProgress - 0.42) / 0.38));
  const stageScale = 0.94 + 0.06 * stageOpacity;
  const isInteractive = stageOpacity > 0.6;

  const handleRunTest = () => {
    if (isTesting || !isInteractive) return;

    setIsTesting(true);
    setPlatenUsesNewBill(true);
    const nextRun = testCount + 1;
    setTestCount(nextRun);

    setTerminalLines([
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
        setTerminalLines([
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

    // Wait for flight to finish before triggering masterTl.onComplete
    masterTl.to({}, { duration: 0.74 });
  };

  return (
    <div
      ref={stageContainerRef}
      style={{
        opacity: stageOpacity,
        transform: `scale(${stageScale.toFixed(3)})`,
        pointerEvents: isInteractive ? "auto" : "none",
      }}
      className="relative flex h-full w-full items-center justify-center select-none"
    >
      {/* Flying Crisp New $1 Bill (animates from Typewriter Platen -> Right "New bill" Comparison Slot) */}
      <div
        ref={flyingBillRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute z-50 h-[132px] w-[256px] sm:h-[148px] sm:w-[288px]"
      >
        <CrispDollarBillGraphic idPrefix="flying-test-new-bill" />
      </div>

      {/* Main Layout: Front-View Typewriter + "Test" Button on Left/Center, Bill Comparison Column on Right */}
      <div className="flex w-full max-w-[940px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-14">
        {/* ===================================================================
            LEFT / CENTER: ASSEMBLED FRONT-VIEW VINTAGE TYPEWRITER + "TEST" BUTTON
            (Exact same front-view typewriter as Section 1 & Section 2, with NO labels)
        =================================================================== */}
        <div className="flex flex-col items-center">
          <div
            ref={typewriterChassisRef}
            className="flex w-[300px] flex-col items-center sm:w-[350px] lg:w-[380px] xl:w-[405px]"
          >
            {/* PLATEN PAPER SLOT VIEWPORT */}
            <div
              ref={platenSlotAnchorRef}
              className="relative z-20 -mb-2.5 flex w-full flex-col items-center"
            >
              <div className="relative z-10 flex h-[92px] w-[200px] items-end justify-center overflow-hidden sm:h-[104px] sm:w-[236px] lg:h-[112px] lg:w-[258px]">
                <div
                  ref={platenBillWrapRef}
                  style={{
                    transform: "translateY(40%) rotate(-1.1deg)",
                  }}
                  className="relative h-full w-full"
                >
                  {platenUsesNewBill ? (
                    <CrispDollarBillGraphic idPrefix="test-platen-new-bill" />
                  ) : (
                    <DollarBillGraphic idPrefix="test-platen-old-bill" />
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
                    } ${isTesting ? "animate-spin" : ""}`}
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
                      <div className="z-10 h-2 w-3 rounded-b-xs border-x border-b border-[#e89b3c]/80 bg-[#2a2825]" />
                    </div>

                    <div className="flex items-center gap-1.5 rounded-sm border border-[#e89b3c]/60 bg-gradient-to-b from-[#24201a] to-[#14120e] px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                      <span className="font-mono-label text-[8px] font-bold uppercase tracking-[0.22em] text-[#f3b15c] sm:text-[9px]">
                        YOUR BUSINESS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                    </div>
                  </div>

                  {/* Right Vintage Metal Spool */}
                  <div
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-inner sm:h-8 sm:w-8 ${
                      isLight
                        ? "border-[#8c867a] bg-[#22211f]"
                        : "border-[#5a5852] bg-[#0c0c10]"
                    } ${isTesting ? "animate-spin" : ""}`}
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
                  isTesting
                    ? "ring-2 ring-[#10b981]/70 shadow-[0_20px_50px_rgba(16,185,129,0.28)]"
                    : ""
                }`}
              >
                {/* Live Fuel / Test Status Bar */}
                <div className="mx-auto mb-2 flex w-[96%] items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isTesting || hasTested
                          ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                          : "bg-[#e89b3c]"
                      }`}
                    />
                    <span
                      className={`font-mono-label text-[7.5px] uppercase tracking-[0.16em] sm:text-[8px] ${
                        isTesting || hasTested
                          ? "font-semibold text-[#10b981]"
                          : isLight
                          ? "text-[#6e6a62]"
                          : "text-[#8e8a80]"
                      }`}
                    >
                      {isTesting
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
                          isTesting || hasTested
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
                          isTesting || hasTested
                            ? "bg-[#10b981]"
                            : "bg-[#e89b3c]"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-mono-label text-[7.5px] uppercase tracking-[0.18em] ${
                        isLight ? "text-[#6e6a62]" : "text-[#7a7770]"
                      }`}
                    >
                      tty://spend.log
                    </span>
                    <span
                      className={`font-mono-label text-[7.5px] uppercase tracking-[0.16em] ${
                        isTesting
                          ? "font-semibold text-[#10b981]"
                          : isLight
                          ? "text-[#8a857c]"
                          : "text-[#5c5954]"
                      }`}
                    >
                      {isTesting ? "TESTING" : "READY"}
                    </span>
                  </div>

                  <div className="flex h-[46px] flex-col justify-end space-y-1 font-mono-label text-[9.5px] leading-snug sm:text-[10px]">
                    <div
                      className={`truncate px-1 ${
                        isLight ? "text-[#6e6a62]" : "text-[#8e8a80]"
                      }`}
                    >
                      &gt; {terminalLines[0]}
                    </div>
                    <div
                      className={`truncate rounded px-1.5 py-0.5 font-semibold ${
                        isTesting || hasTested
                          ? isLight
                            ? "border-l-2 border-[#059669] bg-[#10b981]/15 text-[#065f46]"
                            : "border-l-2 border-[#10b981] bg-[#10b981]/15 text-[#ecfdf5]"
                          : isLight
                          ? "border-l-2 border-[#b86409] bg-[#e89b3c]/15 text-[#8a4600]"
                          : "border-l-2 border-[#e89b3c] bg-[#e89b3c]/15 text-[#f4f0ea]"
                      }`}
                    >
                      ▸ {terminalLines[1]}
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

          {/* =================================================================
              "TEST" BUTTON DIRECTLY BELOW THE TYPEWRITER
              (Styled consistently with the website's tactile obsidian & amber controls)
          ================================================================= */}
          <button
            type="button"
            onClick={handleRunTest}
            disabled={isTesting}
            className={`group relative mt-4 inline-flex h-[36px] w-[132px] cursor-pointer items-center justify-between rounded-lg px-3.5 transition-all duration-200 active:scale-[0.97] disabled:cursor-wait sm:w-[144px] ${
              isTesting
                ? "bg-[#e89b3c] text-[#08080a] ring-1 ring-[#e89b3c] shadow-[0_0_24px_rgba(232,155,60,0.5)]"
                : isLight
                ? "bg-[#fbf9f5] text-[#141413] ring-1 ring-[#e89b3c]/45 shadow-[0_10px_22px_rgba(20,20,19,0.09),0_2px_5px_rgba(20,20,19,0.04)] hover:bg-[#e89b3c] hover:text-[#08080a] hover:ring-[#e89b3c] hover:shadow-[0_0_24px_rgba(232,155,60,0.4)]"
                : "bg-[#111116] text-[#f4f0ea] ring-1 ring-[#e89b3c]/35 shadow-[0_12px_28px_rgba(0,0,0,0.7)] hover:bg-[#e89b3c] hover:text-[#08080a] hover:ring-[#e89b3c] hover:shadow-[0_0_26px_rgba(232,155,60,0.45)]"
            } ${!hasTested && !isTesting ? "orb-begging" : ""}`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  isTesting
                    ? "animate-ping bg-[#08080a]"
                    : "bg-[#e89b3c] shadow-[0_0_6px_#e89b3c] group-hover:bg-[#08080a] group-hover:shadow-none"
                }`}
              />
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.2em]">
                {isTesting ? "Testing..." : "Test"}
              </span>
            </span>

            <span className="font-mono-label text-[10.5px] opacity-80 transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>

        {/* ===================================================================
            RIGHT OF TYPEWRITER: OLD BILL vs. NEW BILL COMPARISON STACK
            - Top Box: Old bill filling 100% of placeholder (zero text)
            - Bottom Box: Empty dashed placeholder before clicking "Test", then
              filled 100% with the crisp New bill (zero text)
        =================================================================== */}
        <div className="flex flex-col items-center gap-5 sm:gap-6">
          {/* TOP PLACEHOLDER: OLD BILL (Fills 100% of box, no text) */}
          <div className="relative h-[132px] w-[256px] overflow-hidden rounded-md sm:h-[148px] sm:w-[288px]">
            <DollarBillGraphic idPrefix="comparison-old-bill" />
          </div>

          {/* BOTTOM PLACEHOLDER: NEW BILL (Empty dashed slot -> Fills 100% of box when tested, no text) */}
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
