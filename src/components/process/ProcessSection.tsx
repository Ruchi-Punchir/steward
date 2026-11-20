"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/ThemeContext";
import ExplodedTypewriter3D, { PRODUCT_UNITS } from "./ExplodedTypewriter3D";
import TestSolutionStage from "./TestSolutionStage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROCESS_STEPS = [
  {
    id: "understand",
    number: "1.",
    label: "Understand the problem",
    shortLabel: "1. Understand",
  },
  {
    id: "fix",
    number: "2.",
    label: "Build a solution",
    shortLabel: "2. Build",
  },
  {
    id: "test",
    number: "3.",
    label: "Test the solution",
    shortLabel: "3. Test",
  },
  {
    id: "launch",
    number: "4.",
    label: "Launch and measure",
    shortLabel: "4. Launch",
  },
  {
    id: "iterate",
    number: "5.",
    label: "Iterate and scale",
    shortLabel: "5. Scale",
  },
];

interface ProcessSectionProps {
  onAuditClick?: (sourceButton?: string) => void;
  onStepSelect?: (stepIndex: number) => void;
}

export default function ProcessSection({
  onAuditClick,
  onStepSelect,
}: ProcessSectionProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sectionRef = useRef<HTMLElement | null>(null);
  const topRightHeaderRef = useRef<HTMLDivElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const understandLeftColRef = useRef<HTMLDivElement | null>(null);
  const explodedStageWrapRef = useRef<HTMLDivElement | null>(null);
  const explodedStageShiftRef = useRef<HTMLDivElement | null>(null);

  const understandProgressFillRef = useRef<HTMLDivElement | null>(null);
  const fixProgressFillRef = useRef<HTMLDivElement | null>(null);
  const testProgressFillRef = useRef<HTMLDivElement | null>(null);
  const launchProgressFillRef = useRef<HTMLDivElement | null>(null);
  const iterateProgressFillRef = useRef<HTMLDivElement | null>(null);

  // Refs for the Section 3 -> Section 4 ("04 / WHO WE WORK WITH") -> Section 5 ("05 / LET'S START") transition overlays
  const processStageBlurRef = useRef<HTMLDivElement | null>(null);
  const transitionVignetteRef = useRef<HTMLDivElement | null>(null);
  const whoBlockRef = useRef<HTMLDivElement | null>(null);
  const whoEyebrowRef = useRef<HTMLDivElement | null>(null);
  const whoHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const whoLineRef = useRef<HTMLParagraphElement | null>(null);
  const whoBoundaryLineRef = useRef<HTMLParagraphElement | null>(null);

  const startBlockRef = useRef<HTMLDivElement | null>(null);
  const startEyebrowRef = useRef<HTMLDivElement | null>(null);
  const startHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const startSublineRef = useRef<HTMLParagraphElement | null>(null);
  const startActionsRef = useRef<HTMLDivElement | null>(null);
  const startFootnoteRef = useRef<HTMLParagraphElement | null>(null);

  const [isStartSectionActive, setIsStartSectionActive] =
    useState<boolean>(false);

  const [explosionProgress, setExplosionProgress] = useState<number>(0);
  const [fixProgress, setFixProgress] = useState<number>(0);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [launchProgress, setLaunchProgress] = useState<number>(0);
  const [iterateProgress, setIterateProgress] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const activeStageRef = useRef<0 | 1 | 2 | 3 | 4 | 5>(0);

  const [testTriggerCount, setTestTriggerCount] = useState<number>(0);
  const [isStage3Testing, setIsStage3Testing] = useState<boolean>(false);
  const [hasStage3Tested, setHasStage3Tested] = useState<boolean>(false);

  const handleTestStateChange = useCallback(
    (testing: boolean, tested: boolean) => {
      setIsStage3Testing((prev) => (prev === testing ? prev : testing));
      setHasStage3Tested((prev) => (prev === tested ? prev : tested));
    },
    [],
  );

  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(1);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Periodic diagnostic scanner: cycles through the 5 product units every 2.5s when Stage 1 ("Understand the problem") is active
  useEffect(() => {
    if (activeStage !== 1 || isUserPaused) return;

    const interval = setInterval(() => {
      setActiveUnitIndex((prev) => (prev + 1) % PRODUCT_UNITS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeStage, isUserPaused]);

  const handleManualSelectUnit = (index: number) => {
    setActiveUnitIndex(index);
    setIsUserPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsUserPaused(false);
    }, 5500);
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setExplosionProgress(1);
      setActiveStage(1);
      return;
    }

    const ctx = gsap.context(() => {
      // 1) Entry animation as Section 3 scrolls into view (Beat 3 -> Beat 4: 2.6 vh -> 3.6 vh)
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 85%",
          end: "top top",
          scrub: true,
        },
      });

      if (topRightHeaderRef.current) {
        entryTl.fromTo(
          topRightHeaderRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0,
        );
      }

      if (bottomBarRef.current) {
        entryTl.fromTo(
          bottomBarRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0.1,
        );
      }

      if (explodedStageWrapRef.current) {
        entryTl.fromTo(
          explodedStageWrapRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          0.5,
        );
      }

      // 2) Pinned progression across 6.6 viewports:
      //    Stage 1 (0.02 -> 0.10, dwell -> 0.195): 1. Understand the problem
      //    Stage 2 (0.195 -> 0.28, dwell -> 0.35): 2. Build a solution
      //    Stage 3 (0.35 -> 0.435, dwell -> 0.49): 3. Test the solution
      //    Stage 4 (0.49 -> 0.57, dwell -> 0.60): 4. Launch and measure
      //    Stage 5 (0.60 -> 0.675, dwell -> 0.71): 5. Iterate and scale
      //    Transition to 04 (0.71 -> 0.84): 04 / WHO WE WORK WITH — We own the outcome.
      //    Transition 04 -> 05 (0.86 -> 0.99): 04 disappears, 05 / LET’S START appears in place.
      const stepTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${window.innerHeight * 6.6}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Explosion progress (0 -> 1 during Stage 1)
            const exp = Math.max(0, Math.min(1, (p - 0.02) / 0.085));
            setExplosionProgress(exp);

            // Stage 2 ("Build a solution") progress
            const fixP = Math.max(0, Math.min(1, (p - 0.195) / 0.085));
            setFixProgress(fixP);

            // Stage 3 ("Test the solution") progress
            const testP = Math.max(0, Math.min(1, (p - 0.35) / 0.085));
            setTestProgress(testP);

            // Stage 4 ("Launch and measure") progress
            const launchP = Math.max(0, Math.min(1, (p - 0.49) / 0.085));
            setLaunchProgress(launchP);

            // Stage 5 ("Iterate and scale") progress
            const iterateP = Math.max(0, Math.min(1, (p - 0.595) / 0.075));
            setIterateProgress(iterateP);

            setIsStartSectionActive(p >= 0.91);

            const nextStage: 0 | 1 | 2 | 3 | 4 | 5 =
              p >= 0.635
                ? 5
                : p >= 0.535
                  ? 4
                  : p >= 0.39
                    ? 3
                    : p >= 0.235
                      ? 2
                      : p >= 0.045
                        ? 1
                        : 0;

            if (nextStage !== activeStageRef.current) {
              activeStageRef.current = nextStage;
              setActiveStage(nextStage);
            }
          },
        },
      });

      // Shift the inner 3D typewriter stage rightward in Stage 1 to make room for the left editorial panel,
      // then bring it back to dead-center in Stage 2 ("Build a solution")
      if (explodedStageShiftRef.current) {
        stepTl.fromTo(
          explodedStageShiftRef.current,
          { x: 0 },
          {
            x: () =>
              window.innerWidth >= 1280
                ? 90
                : window.innerWidth >= 1024
                  ? 96
                  : 0,
            duration: 0.085,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.025,
        );

        stepTl.to(
          explodedStageShiftRef.current,
          {
            x: 0,
            duration: 0.085,
            ease: "power2.inOut",
          },
          0.195,
        );
      }

      // Slide & fade in the left column
      if (understandLeftColRef.current) {
        stepTl.fromTo(
          understandLeftColRef.current,
          {
            opacity: 0,
            x: -36,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.08,
            ease: "power2.out",
            immediateRender: false,
          },
          0.035,
        );
      }

      // Continuous scroll-linked orange progress fill across all 5 bottom tab underlines
      // Step 1 progress bar fill: Understand the problem (0.00 -> 0.195)
      if (understandProgressFillRef.current) {
        stepTl.fromTo(
          understandProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.195,
            ease: "none",
            immediateRender: false,
          },
          0.0,
        );
      }

      // Step 2 progress bar fill: Build a solution (0.195 -> 0.35)
      if (fixProgressFillRef.current) {
        stepTl.fromTo(
          fixProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.155,
            ease: "none",
            immediateRender: false,
          },
          0.195,
        );
      }

      // Step 3 progress bar fill: Test the solution (0.35 -> 0.49)
      if (testProgressFillRef.current) {
        stepTl.fromTo(
          testProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.14,
            ease: "none",
            immediateRender: false,
          },
          0.35,
        );
      }

      // Step 4 progress bar fill: Launch and measure (0.49 -> 0.60)
      if (launchProgressFillRef.current) {
        stepTl.fromTo(
          launchProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.11,
            ease: "none",
            immediateRender: false,
          },
          0.49,
        );
      }

      // Step 5 progress bar fill: Iterate and scale (0.60 -> 0.70)
      if (iterateProgressFillRef.current) {
        stepTl.fromTo(
          iterateProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.1,
            ease: "none",
            immediateRender: false,
          },
          0.6,
        );
      }

      // -----------------------------------------------------------------
      // TRANSITION BETWEEN SECTION 3 & SECTION 4 (0.71 -> 0.83):
      // Background stage scales & dims, radial vignette veil fades in,
      // and centered "04 / WHO WE WORK WITH — We own the outcome." locks in.
      // -----------------------------------------------------------------
      if (processStageBlurRef.current) {
        stepTl.to(
          processStageBlurRef.current,
          {
            opacity: 0.08,
            scale: 0.96,
            duration: 0.1,
            ease: "power2.inOut",
          },
          0.71,
        );
      }

      if (transitionVignetteRef.current) {
        stepTl.to(
          transitionVignetteRef.current,
          {
            opacity: 1,
            duration: 0.1,
            ease: "power2.inOut",
          },
          0.71,
        );
      }

      if (whoEyebrowRef.current) {
        stepTl.fromTo(
          whoEyebrowRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.075,
            ease: "power2.out",
          },
          0.735,
        );
      }

      if (whoHeadlineRef.current) {
        stepTl.fromTo(
          whoHeadlineRef.current,
          { opacity: 0, y: 26, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.085,
            ease: "power2.out",
          },
          0.745,
        );
      }

      if (whoLineRef.current) {
        stepTl.fromTo(
          whoLineRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.085,
            ease: "power2.out",
          },
          0.76,
        );
      }

      if (whoBoundaryLineRef.current) {
        stepTl.fromTo(
          whoBoundaryLineRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.075,
            ease: "power2.out",
          },
          0.775,
        );
      }

      // -----------------------------------------------------------------
      // TRANSITION BETWEEN SECTION 4 ("04 / WHO WE WORK WITH") &
      // SECTION 5 ("05 / LET’S START") (0.86 -> 0.99):
      // 04 disappears in place and 05 appears in place!
      // -----------------------------------------------------------------
      if (whoBlockRef.current) {
        stepTl.fromTo(
          whoBlockRef.current,
          { opacity: 1, y: 0, scale: 1 },
          {
            opacity: 0,
            y: -24,
            scale: 0.96,
            duration: 0.065,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.86,
        );
      }

      if (processStageBlurRef.current) {
        stepTl.to(
          processStageBlurRef.current,
          {
            opacity: 0.03,
            scale: 0.94,
            duration: 0.08,
            ease: "power2.inOut",
          },
          0.86,
        );
      }

      if (startEyebrowRef.current) {
        stepTl.fromTo(
          startEyebrowRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.065,
            ease: "power2.out",
          },
          0.91,
        );
      }

      if (startHeadlineRef.current) {
        stepTl.fromTo(
          startHeadlineRef.current,
          { opacity: 0, y: 26, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.075,
            ease: "power2.out",
          },
          0.92,
        );
      }

      if (startSublineRef.current) {
        stepTl.fromTo(
          startSublineRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.075,
            ease: "power2.out",
          },
          0.935,
        );
      }

      if (startActionsRef.current) {
        stepTl.fromTo(
          startActionsRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.07,
            ease: "power2.out",
          },
          0.948,
        );
      }

      if (startFootnoteRef.current) {
        stepTl.fromTo(
          startFootnoteRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.065,
            ease: "power2.out",
          },
          0.96,
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const currentUnit = PRODUCT_UNITS[activeUnitIndex] ?? PRODUCT_UNITS[0];

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className="relative z-40 h-[760vh] w-full"
    >
      {/* Anchor for #contact at the bottom of the pinned stage */}
      <div
        id="contact"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[100vh] left-0 h-px w-full"
      />

      {/* Sticky Full-Screen Stage: Intro -> 1..5 -> 04 / WHO WE WORK WITH -> 05 / LET’S START */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden pt-18 pb-6 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-12 [@media(max-height:800px)]:lg:pt-20 [@media(max-height:800px)]:lg:pb-7 [@media(max-height:740px)]:lg:pt-16 [@media(max-height:740px)]:lg:pb-4">
        <div
          ref={processStageBlurRef}
          className="relative flex h-full w-full flex-col justify-between will-change-[opacity,transform]"
        >
          {/* TOP ROW: Left Editorial Column + Right "03 How we work together" Header */}
          <div className="pointer-events-none relative z-50 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-4 px-4 sm:gap-8 sm:px-10 lg:grid-cols-12 lg:px-16 xl:px-24">
            {/* LEFT COLUMN: 5 Stage Editorials */}
            <div
              ref={understandLeftColRef}
              className={`pointer-events-auto relative z-50 flex-col items-start text-left opacity-0 will-change-[opacity,transform] lg:col-span-4 lg:flex ${
                activeStage === 0 ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Mobile/Tablet compact section eyebrow so "03 / How we work together" stays visible without colliding with the center stage */}
              <div className="mb-1.5 inline-flex items-center gap-2 lg:hidden">
                <span className="font-mono-label text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                  03
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-[var(--text-muted)] opacity-45"
                />
                <span className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  How we work together
                </span>
              </div>

              {/* Stage 1: Understand the problem */}
              <div
                className={`w-full ${
                  activeStage <= 1 ? "block" : "hidden pointer-events-none"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <div className="relative inline-flex flex-col items-start">
                    <span className="font-mono-label text-3xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-5xl lg:text-6xl [@media(max-height:800px)]:lg:text-4xl [@media(max-height:740px)]:lg:text-3xl">
                      1.
                    </span>
                    <span className="mt-0.5 h-[2.5px] w-7 rounded-full bg-[#e89b3c] sm:mt-1 sm:h-[3px] sm:w-11 [@media(max-height:800px)]:lg:w-8 [@media(max-height:740px)]:lg:w-7" />
                  </div>
                  <h3 className="-ml-1.5 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:-ml-2 sm:text-3xl xl:text-[2.25rem] [@media(max-height:800px)]:lg:text-2xl [@media(max-height:740px)]:lg:text-xl">
                    Understand the problem
                  </h3>
                </div>

                <p className="mt-1.5 max-w-[380px] text-xs font-normal leading-[1.5] text-[var(--text-secondary)] sm:mt-4 sm:text-[16px] sm:leading-[1.68] [@media(max-height:800px)]:lg:mt-2 [@media(max-height:800px)]:lg:max-w-[265px] [@media(max-height:800px)]:lg:text-[13px] [@media(max-height:800px)]:lg:leading-[1.5] [@media(max-height:740px)]:lg:mt-1.5 [@media(max-height:740px)]:lg:max-w-[280px] [@media(max-height:740px)]:lg:text-xs [@media(max-height:740px)]:lg:leading-[1.45]">
                  Before writing a single line of code or running another ad, we
                  scan your numbers, product, and funnel to pinpoint the exact
                  bottlenecks costing you sales.
                </p>

                {/* Live Periodic Diagnostic Scanner Card */}
                <div
                  className={`mt-2.5 w-full max-w-[370px] rounded-xl border p-2.5 transition-colors duration-300 sm:mt-6 sm:p-4 [@media(max-height:800px)]:lg:mt-3 [@media(max-height:800px)]:lg:max-w-[255px] [@media(max-height:800px)]:lg:p-3 [@media(max-height:740px)]:lg:mt-2 [@media(max-height:740px)]:lg:max-w-[255px] [@media(max-height:740px)]:lg:p-2.5 ${
                    isLight
                      ? "border-black/10 bg-[#eae5dc]/90 shadow-sm"
                      : "border-white/[0.08] bg-[#111116]/90 shadow-[0_18px_40px_rgba(0,0,0,0.65)]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-current/10 pb-1.5 sm:pb-2.5 [@media(max-height:740px)]:lg:pb-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e89b3c] shadow-[0_0_8px_#e89b3c] sm:h-2 sm:w-2" />
                      <span className="font-mono-label text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e89b3c] sm:text-[10px] sm:tracking-[0.18em] [@media(max-height:740px)]:lg:text-[9px]">
                        Inspecting Unit {currentUnit.code}/05
                      </span>
                    </div>
                    {/* 5 Quick Unit Selector Dots */}
                    <div className="flex items-center gap-1.5">
                      {PRODUCT_UNITS.map((u, idx) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleManualSelectUnit(idx)}
                          aria-label={`Inspect ${u.name}`}
                          className={`h-1.5 cursor-pointer rounded-full transition-all duration-200 sm:h-2 ${
                            activeUnitIndex === idx
                              ? "w-4 bg-[#e89b3c] sm:w-5"
                              : "w-1.5 bg-[var(--text-muted)]/40 hover:bg-[var(--text-secondary)] sm:w-2"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Big Part Title & Diagnostic Activity */}
                  <div className="mt-1.5 sm:mt-3 [@media(max-height:740px)]:lg:mt-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[-0.01em] text-[var(--text-primary)] sm:text-base [@media(max-height:740px)]:lg:text-xs">
                        {currentUnit.name}
                      </span>
                      <span className="font-mono-label text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-[9px]">
                        #{currentUnit.code}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--text-secondary)] sm:mt-1 sm:line-clamp-none sm:text-xs sm:leading-relaxed [@media(max-height:740px)]:lg:line-clamp-2 [@media(max-height:740px)]:lg:text-[11px]">
                      {currentUnit.finding}
                    </p>
                  </div>

                  {/* Smaller Related Sub-Parts Pills (Hidden on compact mobile & short viewports so 3D typewriter below is unobstructed) */}
                  <div className="mt-3 hidden border-t border-current/10 pt-2.5 sm:block [@media(max-height:800px)]:!hidden">
                    <span className="block font-mono-label text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Tags:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {currentUnit.subParts.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#e89b3c]/40 bg-[#e89b3c]/12 px-2 py-0.5 font-mono-label text-[9.5px] font-medium text-[var(--text-primary)]"
                        >
                          <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                          {sub.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 2: Build a solution */}
              <div
                className={`w-full ${
                  activeStage === 2 ? "block" : "hidden pointer-events-none"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <div className="relative inline-flex flex-col items-start">
                    <span className="font-mono-label text-3xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-5xl lg:text-6xl [@media(max-height:740px)]:lg:text-3xl">
                      2.
                    </span>
                    <span className="mt-0.5 h-[2.5px] w-7 rounded-full bg-[#10b981] sm:mt-1 sm:h-[3px] sm:w-11 [@media(max-height:740px)]:lg:w-7" />
                  </div>
                  <h3 className="-ml-1.5 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:-ml-2 sm:text-3xl xl:text-[2.25rem] [@media(max-height:740px)]:lg:text-xl">
                    Build a solution
                  </h3>
                </div>

                <p className="mt-1.5 max-w-[380px] text-xs font-normal leading-[1.5] text-[var(--text-secondary)] sm:mt-4 sm:text-[16px] sm:leading-[1.68] [@media(max-height:740px)]:lg:mt-1.5 [@media(max-height:740px)]:lg:max-w-[280px] [@media(max-height:740px)]:lg:text-xs [@media(max-height:740px)]:lg:leading-[1.45]">
                  We fix what’s costing you sales, starting with the biggest
                  leak. And if something’s missing, we build it.
                </p>
              </div>

              {/* Stage 3: Test the solution */}
              <div
                className={`w-full ${
                  activeStage === 3 ? "block" : "hidden pointer-events-none"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <div className="relative inline-flex flex-col items-start">
                    <span className="font-mono-label text-3xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-5xl lg:text-6xl [@media(max-height:740px)]:lg:text-3xl">
                      3.
                    </span>
                    <span className="mt-0.5 h-[2.5px] w-7 rounded-full bg-[#e89b3c] sm:mt-1 sm:h-[3px] sm:w-11 [@media(max-height:740px)]:lg:w-7" />
                  </div>
                  <h3 className="-ml-1.5 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:-ml-2 sm:text-3xl xl:text-[2.25rem] [@media(max-height:740px)]:lg:text-xl">
                    Test the solution
                  </h3>
                </div>

                <p className="mt-1.5 max-w-[380px] text-xs font-normal leading-[1.5] text-[var(--text-secondary)] sm:mt-4 sm:text-[16px] sm:leading-[1.68] [@media(max-height:740px)]:lg:mt-1.5 [@media(max-height:740px)]:lg:max-w-[265px] [@media(max-height:740px)]:lg:text-xs [@media(max-height:740px)]:lg:leading-[1.45]">
                  Before going wide, we put it in front of real people and watch
                  what they actually do. We prove it works before you spend
                  another dime on ads or development.
                </p>

                <div className="mt-3 sm:mt-6 [@media(max-height:740px)]:lg:mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isStage3Testing) {
                        setTestTriggerCount((c) => c + 1);
                      }
                    }}
                    disabled={isStage3Testing}
                    className={`group relative inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#e89b3c] px-5 py-2 font-mono-label text-[11px] font-semibold uppercase tracking-[0.16em] text-[#08080a] shadow-[0_0_24px_rgba(232,155,60,0.45)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] disabled:cursor-wait sm:gap-3 sm:px-8 sm:py-3.5 sm:text-xs [@media(max-height:740px)]:lg:px-5 [@media(max-height:740px)]:lg:py-2 [@media(max-height:740px)]:lg:text-[11px] ${
                      !hasStage3Tested && !isStage3Testing ? "orb-begging" : ""
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors sm:h-2 sm:w-2 ${
                        isStage3Testing
                          ? "animate-ping bg-current"
                          : "bg-current"
                      }`}
                    />
                    <span>{isStage3Testing ? "Testing..." : "Test"}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </button>
                </div>
              </div>

              {/* Stage 4: Launch and measure */}
              <div
                className={`w-full ${
                  activeStage === 4 ? "block" : "hidden pointer-events-none"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <div className="relative inline-flex flex-col items-start">
                    <span className="font-mono-label text-3xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-5xl lg:text-6xl [@media(max-height:740px)]:lg:text-3xl">
                      4.
                    </span>
                    <span className="mt-0.5 h-[2.5px] w-7 rounded-full bg-[#10b981] sm:mt-1 sm:h-[3px] sm:w-11 [@media(max-height:740px)]:lg:w-7" />
                  </div>
                  <h3 className="-ml-1.5 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:-ml-2 sm:text-3xl xl:text-[2.25rem] [@media(max-height:740px)]:lg:text-xl">
                    Launch and measure
                  </h3>
                </div>

                <p className="mt-1.5 max-w-[380px] text-xs font-normal leading-[1.5] text-[var(--text-secondary)] sm:mt-4 sm:text-[16px] sm:leading-[1.68] [@media(max-height:740px)]:lg:mt-1.5 [@media(max-height:740px)]:lg:max-w-[275px] [@media(max-height:740px)]:lg:text-xs [@media(max-height:740px)]:lg:leading-[1.45]">
                  Same budget. Completely different outcome. We ship the winning
                  fix fast and track one number: net revenue. No vanity clicks
                  or guesswork. You see every dollar come back with profit.
                </p>
              </div>

              {/* Stage 5: Iterate and scale */}
              <div
                className={`w-full ${
                  activeStage === 5 ? "block" : "hidden pointer-events-none"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <div className="relative inline-flex flex-col items-start">
                    <span className="font-mono-label text-3xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-5xl lg:text-6xl [@media(max-height:740px)]:lg:text-3xl">
                      5.
                    </span>
                    <span className="mt-0.5 h-[2.5px] w-7 rounded-full bg-[#e89b3c] sm:mt-1 sm:h-[3px] sm:w-11 [@media(max-height:740px)]:lg:w-7" />
                  </div>
                  <h3 className="-ml-1.5 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:-ml-2 sm:text-3xl xl:text-[2.25rem] [@media(max-height:740px)]:lg:text-xl">
                    Iterate and scale
                  </h3>
                </div>

                <p className="mt-1.5 max-w-[380px] text-xs font-normal leading-[1.5] text-[var(--text-secondary)] sm:mt-4 sm:text-[16px] sm:leading-[1.68] [@media(max-height:740px)]:lg:mt-1.5 [@media(max-height:740px)]:lg:max-w-[280px] [@media(max-height:740px)]:lg:text-xs [@media(max-height:740px)]:lg:leading-[1.45]">
                  We stay, adjust, and keep pushing that number up, quarter
                  after quarter.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: "03 — Revenue is the only metric / How we work together"
                (Shown at intro activeStage === 0 on mobile, and always on Desktop lg+) */}
            <div
              ref={topRightHeaderRef}
              className={`pointer-events-none flex-col items-start text-left will-change-[opacity,transform] lg:col-span-5 lg:col-start-8 lg:ml-auto lg:flex lg:items-end lg:text-right ${
                activeStage >= 1 ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className="mb-3 inline-flex items-center gap-3 [@media(max-height:740px)]:lg:mb-1">
                <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[#e89b3c] [@media(max-height:740px)]:lg:text-[9.5px]">
                  03
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[var(--text-muted)] opacity-45 [@media(max-height:740px)]:lg:w-5"
                />
                <span className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] [@media(max-height:740px)]:lg:text-[9.5px]">
                  Revenue is the only metric
                </span>
              </div>

              <h2
                id="process-heading"
                className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl xl:text-[3.5rem] [@media(max-height:740px)]:lg:text-[1.85rem]"
              >
                How we work
                <span className="font-serif-editorial mt-1 block font-normal italic tracking-[-0.015em] text-[#e89b3c] [@media(max-height:740px)]:lg:mt-0.5">
                  together
                </span>
              </h2>
            </div>
          </div>

          {/* CENTER STAGE: 3D ISOMETRIC EXPLODED TYPEWRITER (Stages 1 & 2) */}
          <div
            ref={explodedStageWrapRef}
            className="pointer-events-none absolute inset-x-0 top-[63%] z-40 mx-auto flex h-[540px] w-full max-w-[1040px] -translate-y-1/2 items-center justify-center px-4 will-change-[opacity,transform] sm:top-[58%] lg:top-[52%] [@media(max-height:800px)]:lg:top-[54%] [@media(max-height:740px)]:lg:top-[55%]"
          >
            <div
              ref={explodedStageShiftRef}
              className="pointer-events-none relative flex h-full w-full items-center justify-center will-change-transform"
            >
              {/* 3D Isometric Exploded Typewriter: Explodes in Stage 1, Repairs in Stage 2, Re-assembles (with no labels) into Stage 3 */}
              <div
                style={{
                  opacity: Math.max(
                    0,
                    1 - Math.max(0, (testProgress - 0.42) / 0.32),
                  ),
                  pointerEvents: testProgress > 0.55 ? "none" : "auto",
                }}
                className="pointer-events-none flex h-full w-full scale-[0.72] items-center justify-center sm:scale-[0.88] lg:scale-[0.76] xl:scale-[0.9] 2xl:scale-100 [@media(max-height:800px)]:lg:scale-[0.62] [@media(max-height:740px)]:lg:!scale-[0.58]"
              >
                <ExplodedTypewriter3D
                  explosionProgress={explosionProgress}
                  fixProgress={fixProgress}
                  testProgress={testProgress}
                  launchProgress={launchProgress}
                  activeUnitIndex={activeUnitIndex}
                  onSelectUnit={handleManualSelectUnit}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>

          {/* UNIFIED STAGES 3, 4 & 5 ("Test the solution" -> "Launch and measure" -> "Iterate and scale"):
            Uses ONE single front-view typewriter across all three stages */}
          <div
            style={{
              top: "165px",
              bottom: "68px",
            }}
            className="pointer-events-none absolute inset-x-0 z-40 mx-auto flex w-full max-w-[1560px] items-center justify-center px-4 sm:px-10 lg:bottom-[88px] lg:px-16 xl:px-24 [@media(max-height:800px)]:!top-[146px] [@media(max-height:800px)]:!bottom-[62px] [@media(max-height:740px)]:!top-[128px] [@media(max-height:740px)]:!bottom-[46px]"
          >
            <TestSolutionStage
              testProgress={testProgress}
              launchProgress={launchProgress}
              iterateProgress={iterateProgress}
              isLight={isLight}
              externalTestTrigger={testTriggerCount}
              onTestStateChange={handleTestStateChange}
            />
          </div>

          {/* BOTTOM 5-STAGE PROCESS BAR */}
          <div
            ref={bottomBarRef}
            className="pointer-events-auto relative z-50 mx-auto w-full max-w-[1560px] px-4 sm:px-10 lg:px-16 xl:px-24"
          >
            <div className="grid grid-cols-5 gap-1.5 sm:gap-6 lg:gap-8">
              {PROCESS_STEPS.map((step, idx) => {
                const stageNum = (idx + 1) as 1 | 2 | 3 | 4 | 5;
                const isCurrentStage = activeStage === stageNum;
                const isCompletedStage = activeStage > stageNum;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => onStepSelect?.(idx)}
                    className="group flex cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
                  >
                    <span
                      className={`mb-1.5 truncate font-mono-label text-[8.5px] tracking-[0.02em] transition-colors duration-300 group-hover:text-[#e89b3c] sm:mb-2.5 sm:text-sm sm:tracking-[0.04em] ${
                        isCurrentStage
                          ? "font-semibold text-[var(--text-primary)]"
                          : isCompletedStage
                            ? "font-medium text-[var(--text-secondary)]"
                            : "font-normal text-[var(--text-secondary)]"
                      }`}
                    >
                      <span className="sm:hidden">{step.shortLabel}</span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </span>

                    {/* Step Bottom Progress Track (thin underline that fills with orange on scroll) */}
                    <div
                      className={`relative h-[1.5px] w-full overflow-hidden rounded-full transition-colors duration-200 ${
                        isLight
                          ? "bg-black/15 group-hover:bg-black/30"
                          : "bg-white/20 group-hover:bg-white/35"
                      }`}
                    >
                      {idx === 0 && (
                        <div
                          ref={understandProgressFillRef}
                          style={{ transformOrigin: "left center" }}
                          className="h-full w-full scale-x-0 bg-[#e89b3c] will-change-transform"
                        />
                      )}
                      {idx === 1 && (
                        <div
                          ref={fixProgressFillRef}
                          style={{ transformOrigin: "left center" }}
                          className="h-full w-full scale-x-0 bg-[#e89b3c] will-change-transform"
                        />
                      )}
                      {idx === 2 && (
                        <div
                          ref={testProgressFillRef}
                          style={{ transformOrigin: "left center" }}
                          className="h-full w-full scale-x-0 bg-[#e89b3c] will-change-transform"
                        />
                      )}
                      {idx === 3 && (
                        <div
                          ref={launchProgressFillRef}
                          style={{ transformOrigin: "left center" }}
                          className="h-full w-full scale-x-0 bg-[#e89b3c] will-change-transform"
                        />
                      )}
                      {idx === 4 && (
                        <div
                          ref={iterateProgressFillRef}
                          style={{ transformOrigin: "left center" }}
                          className="h-full w-full scale-x-0 bg-[#e89b3c] will-change-transform"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================
            TRANSITION OVERLAY: SECTION 3 -> SECTION 4 ("04 / WHO WE WORK WITH")
            Mirrors the Section 2 -> Section 3 transition with radial vignette
            veil and centered editorial lockup.
        =================================================================== */}
        <div
          ref={transitionVignetteRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-50 opacity-0 will-change-[opacity] ${
            isLight
              ? "bg-[radial-gradient(circle_at_center,rgba(245,242,235,0.88)_0%,rgba(245,242,235,0.98)_100%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(8,8,10,0.88)_0%,rgba(8,8,10,0.98)_100%)]"
          }`}
        />

        {/* SECTION 04 OVERLAY: 04 / WHO WE WORK WITH */}
        <div
          ref={whoBlockRef}
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center will-change-[opacity,transform] sm:px-10"
        >
          {/* Eyebrow: 04 / WHO WE WORK WITH */}
          <div
            ref={whoEyebrowRef}
            className="mb-5 inline-flex items-center gap-2.5 opacity-0 will-change-[opacity,transform]"
          >
            <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c] sm:text-xs">
              04
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] sm:text-xs">
              /
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)] sm:text-xs">
              WHO WE WORK WITH
            </span>
          </div>

          {/* Headline: We own the outcome. */}
          <h2
            ref={whoHeadlineRef}
            className="text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] opacity-0 will-change-[opacity,transform] sm:text-5xl xl:text-[3.75rem]"
          >
            We own the{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] drop-shadow-[0_0_24px_rgba(232,155,60,0.3)]">
              outcome.
            </span>
          </h2>

          {/* Line */}
          <p
            ref={whoLineRef}
            className="mt-6 max-w-[680px] text-lg font-normal leading-[1.6] tracking-[-0.015em] text-[var(--text-primary)]/90 opacity-0 will-change-[opacity,transform] sm:text-xl lg:text-[1.35rem]"
          >
            You’ve built the product. We take on everything between it and your
            next paying customer: finding what’s in the way, fixing it, and
            tracking whether it worked.
          </p>

          {/* Boundary line (smaller) */}
          <p
            ref={whoBoundaryLineRef}
            className="mt-5 max-w-[560px] text-sm font-normal leading-[1.65] text-[var(--text-secondary)] opacity-0 will-change-[opacity,transform] sm:text-base"
          >
            You keep the vision and the decisions. We agree on one number up
            front, and we answer for it.
          </p>
        </div>

        {/* SECTION 05 OVERLAY: 05 / LET’S START (Appears in place as 04 disappears) */}
        <div
          ref={startBlockRef}
          style={{ pointerEvents: isStartSectionActive ? "auto" : "none" }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center will-change-[opacity,transform] sm:px-10"
        >
          {/* Eyebrow: 05 / LET’S START */}
          <div
            ref={startEyebrowRef}
            className="mb-5 inline-flex items-center gap-2.5 opacity-0 will-change-[opacity,transform]"
          >
            <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c] sm:text-xs">
              05
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] sm:text-xs">
              /
            </span>
            <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)] sm:text-xs">
              LET’S START
            </span>
          </div>

          {/* Headline: Revenue is the only metric we care about. */}
          <h2
            ref={startHeadlineRef}
            style={{ textWrap: "balance" }}
            className="max-w-[18ch] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] opacity-0 will-change-[opacity,transform] sm:text-5xl xl:text-[3.75rem]"
          >
            Let’s find what’s costing{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] drop-shadow-[0_0_24px_rgba(232,155,60,0.3)]">
              you revenue.
            </span>
          </h2>

          {/* Subline */}
          <p
            ref={startSublineRef}
            className="mt-6 max-w-[600px] text-base font-normal leading-[1.68] text-[var(--text-secondary)] opacity-0 will-change-[opacity,transform] sm:text-lg"
          >
            Clear diagnosis. Prioritized fixes. Zero guesswork.
          </p>

          {/* Primary button & Secondary email link */}
          <div
            ref={startActionsRef}
            className="mt-9 flex flex-col items-center justify-center gap-4 opacity-0 will-change-[opacity,transform] sm:flex-row sm:gap-6"
          >
            <Link
              href="/audit?source=close-section"
              target="_blank"
              rel="noopener noreferrer"
              data-cta-source="close-section"
              className="cursor-pointer rounded-full bg-[#e89b3c] px-8 py-3.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[#08080a] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Get a free audit
            </Link>

            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span>Or just say hello,</span>
              <a
                href="mailto:connect@hellosteward.agency"
                className="font-mono-label text-xs font-medium tracking-[0.06em] text-[var(--text-primary)] underline decoration-[#e89b3c] decoration-1 underline-offset-4 transition-colors hover:text-[#e89b3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
              >
                connect@hellosteward.agency
              </a>
            </div>
          </div>

          {/* Small line under the buttons */}
          <p
            ref={startFootnoteRef}
            className="mt-5 font-mono-label text-[11px] tracking-[0.06em] text-[var(--text-muted)] opacity-0 will-change-[opacity,transform] sm:text-xs"
          >
            No cost, no strings. You keep everything we find.
          </p>
        </div>
      </div>
    </section>
  );
}
