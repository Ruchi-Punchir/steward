"use client";

import React, { useEffect, useRef, useState } from "react";
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
  },
  {
    id: "fix",
    number: "2.",
    label: "Build a solution",
  },
  {
    id: "test",
    number: "3.",
    label: "Test the solution",
  },
  {
    id: "launch",
    number: "4.",
    label: "Launch and measure",
  },
  {
    id: "iterate",
    number: "5.",
    label: "Iterate and scale",
  },
];

interface ProcessSectionProps {
  onAuditClick?: (sourceButton?: string) => void;
}

export default function ProcessSection({ onAuditClick }: ProcessSectionProps) {
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
          0
        );
      }

      if (bottomBarRef.current) {
        entryTl.fromTo(
          bottomBarRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0.1
        );
      }

      if (explodedStageWrapRef.current) {
        entryTl.fromTo(
          explodedStageWrapRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          0.5
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
              p >= 0.615
                ? 5
                : p >= 0.5
                ? 4
                : p >= 0.36
                ? 3
                : p >= 0.21
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

      // Shift the inner 3D typewriter stage rightward to make room for the left editorial panel
      if (explodedStageShiftRef.current) {
        stepTl.fromTo(
          explodedStageShiftRef.current,
          { x: 0 },
          {
            x: () => (window.innerWidth >= 1024 ? 90 : 0),
            duration: 0.085,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.025
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
          0.035
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
          0.0
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
          0.195
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
          0.35
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
          0.49
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
          0.6
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
          0.71
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
          0.71
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
          0.735
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
          0.745
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
          0.76
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
          0.775
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
          0.86
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
          0.86
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
          0.91
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
          0.92
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
          0.935
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
          0.948
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
          0.96
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
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div
          ref={processStageBlurRef}
          className="relative flex h-full w-full flex-col justify-between will-change-[opacity,transform]"
        >
        {/* TOP ROW: Left Editorial Column + Right "03 How we work together" Header */}
        <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-8 px-6 sm:px-10 lg:grid-cols-12 lg:px-16 xl:px-24">
          {/* LEFT COLUMN: 4 Stage Editorials */}
          <div
            ref={understandLeftColRef}
            className="pointer-events-auto relative z-30 flex flex-col items-start text-left opacity-0 will-change-[opacity,transform] lg:col-span-4"
          >
            {/* Stage 1: Understand the problem */}
            <div
              className={`w-full transition-all duration-300 ${
                activeStage <= 1
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <div className="relative inline-flex flex-col items-start">
                  <span className="font-mono-label text-5xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-6xl">
                    1.
                  </span>
                  <span className="mt-1 h-[3px] w-11 rounded-full bg-[#e89b3c]" />
                </div>
                <h3 className="-ml-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl xl:text-[2.25rem]">
                  Understand the problem
                </h3>
              </div>

              <p className="mt-4 max-w-[380px] text-sm font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[16px]">
                We start with your numbers and your story, and find what’s
                actually holding growth back before anything gets built.
              </p>

              {/* Live Periodic Diagnostic Scanner Card */}
              <div
                className={`mt-6 w-full max-w-[370px] rounded-xl border p-4 transition-colors duration-300 ${
                  isLight
                    ? "border-black/10 bg-[#eae5dc]/90 shadow-sm"
                    : "border-white/[0.08] bg-[#111116]/90 shadow-[0_18px_40px_rgba(0,0,0,0.65)]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-current/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]" />
                    <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c]">
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
                        className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                          activeUnitIndex === idx
                            ? "w-5 bg-[#e89b3c]"
                            : "w-2 bg-[var(--text-muted)]/40 hover:bg-[var(--text-secondary)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Big Part Title & Diagnostic Activity */}
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                      {currentUnit.name}
                    </span>
                    <span className="font-mono-label text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      Big Part #{currentUnit.code}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {currentUnit.finding}
                  </p>
                </div>

                {/* Smaller Related Sub-Parts Pills */}
                <div className="mt-3 pt-2.5 border-t border-current/10">
                  <span className="block font-mono-label text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Related Sub-Components:
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
              className={`w-full transition-all duration-300 ${
                activeStage === 2
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <div className="relative inline-flex flex-col items-start">
                  <span className="font-mono-label text-5xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-6xl">
                    2.
                  </span>
                  <span className="mt-1 h-[3px] w-11 rounded-full bg-[#10b981]" />
                </div>
                <h3 className="-ml-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl xl:text-[2.25rem]">
                  Build a solution
                </h3>
              </div>

              <p className="mt-4 max-w-[380px] text-sm font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[16px]">
                We fix what’s costing you sales, starting with the biggest leak.
                And if something’s missing, we build it.
              </p>
            </div>

            {/* Stage 3: Test the solution */}
            <div
              className={`w-full transition-all duration-300 ${
                activeStage === 3
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <div className="relative inline-flex flex-col items-start">
                  <span className="font-mono-label text-5xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-6xl">
                    3.
                  </span>
                  <span className="mt-1 h-[3px] w-11 rounded-full bg-[#e89b3c]" />
                </div>
                <h3 className="-ml-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl xl:text-[2.25rem]">
                  Test the solution
                </h3>
              </div>

              <p className="mt-4 max-w-[380px] text-sm font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[16px]">
                Before going wide, we put it in front of real people and watch
                what they actually do.
              </p>
            </div>

            {/* Stage 4: Launch and measure */}
            <div
              className={`w-full transition-all duration-300 ${
                activeStage === 4
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <div className="relative inline-flex flex-col items-start">
                  <span className="font-mono-label text-5xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-6xl">
                    4.
                  </span>
                  <span className="mt-1 h-[3px] w-11 rounded-full bg-[#10b981]" />
                </div>
                <h3 className="-ml-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl xl:text-[2.25rem]">
                  Launch and measure
                </h3>
              </div>

              <p className="mt-4 max-w-[380px] text-sm font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[16px]">
                We ship fast, then track what’s working and what isn’t. No
                guessing, no vanity metrics, just real signal, judged by one
                number: revenue.
              </p>
            </div>

            {/* Stage 5: Iterate and scale */}
            <div
              className={`w-full transition-all duration-300 ${
                activeStage === 5
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <div className="relative inline-flex flex-col items-start">
                  <span className="font-mono-label text-5xl font-light leading-none tracking-tight text-[var(--text-primary)]/18 sm:text-6xl">
                    5.
                  </span>
                  <span className="mt-1 h-[3px] w-11 rounded-full bg-[#e89b3c]" />
                </div>
                <h3 className="-ml-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl xl:text-[2.25rem]">
                  Iterate and scale
                </h3>
              </div>

              <p className="mt-4 max-w-[380px] text-sm font-normal leading-[1.68] text-[var(--text-secondary)] sm:text-[16px]">
                We stay, adjust, and keep pushing that number up, quarter after
                quarter.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: "03 — Revenue is the only metric / How we work together" */}
          <div
            ref={topRightHeaderRef}
            className="pointer-events-none flex flex-col items-start text-left will-change-[opacity,transform] lg:col-span-5 lg:col-start-8 lg:ml-auto lg:items-end lg:text-right"
          >
            <div className="mb-3 inline-flex items-center gap-3">
              <span className="font-mono-label text-[11px] uppercase tracking-[0.22em] text-[#e89b3c]">
                03
              </span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[var(--text-muted)] opacity-45"
              />
              <span className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Revenue is the only metric
              </span>
            </div>

            <h2
              id="process-heading"
              className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl xl:text-[3.5rem]"
            >
              How we work
              <span className="font-serif-editorial mt-1 block font-normal italic tracking-[-0.015em] text-[#e89b3c]">
                together
              </span>
            </h2>
          </div>
        </div>

        {/* CENTER STAGE: 3D ISOMETRIC EXPLODED TYPEWRITER (Stages 1 & 2) */}
        <div
          ref={explodedStageWrapRef}
          style={{
            top: "52%",
            transform: "translateY(-50%)",
          }}
          className="pointer-events-auto absolute inset-x-0 z-40 mx-auto flex h-[540px] w-full max-w-[1040px] items-center justify-center px-4 will-change-[opacity,transform]"
        >
          <div
            ref={explodedStageShiftRef}
            className="relative flex h-full w-full items-center justify-center will-change-transform"
          >
            {/* 3D Isometric Exploded Typewriter: Explodes in Stage 1, Repairs in Stage 2, Re-assembles (with no labels) into Stage 3 */}
            <div
              style={{
                opacity: Math.max(0, 1 - Math.max(0, (testProgress - 0.42) / 0.32)),
                pointerEvents: testProgress > 0.55 ? "none" : "auto",
              }}
              className="flex h-full w-full items-center justify-center"
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
            top: "235px",
            bottom: "88px",
            pointerEvents: testProgress > 0.55 ? "auto" : "none",
          }}
          className="pointer-events-none absolute inset-x-0 z-40 mx-auto flex w-full max-w-[1560px] items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24"
        >
          <TestSolutionStage
            testProgress={testProgress}
            launchProgress={launchProgress}
            iterateProgress={iterateProgress}
            isLight={isLight}
          />
        </div>

        {/* BOTTOM 5-STAGE PROCESS BAR */}
        <div
          ref={bottomBarRef}
          className="pointer-events-none relative z-20 mx-auto w-full max-w-[1560px] px-6 sm:px-10 lg:px-16 xl:px-24"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6 lg:gap-8">
            {PROCESS_STEPS.map((step, idx) => {
              const stageNum = (idx + 1) as 1 | 2 | 3 | 4 | 5;
              const isCurrentStage = activeStage === stageNum;
              const isCompletedStage = activeStage > stageNum;

              return (
                <div key={step.id} className="flex flex-col">
                  <span
                    className={`mb-2.5 font-mono-label text-xs tracking-[0.04em] transition-colors duration-300 sm:text-sm ${
                      isCurrentStage
                        ? "font-semibold text-[var(--text-primary)]"
                        : isCompletedStage
                        ? "font-medium text-[var(--text-secondary)]"
                        : "font-normal text-[var(--text-secondary)]"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Step Bottom Progress Track (thin underline that fills with orange on scroll) */}
                  <div
                    className={`relative h-[1.5px] w-full overflow-hidden rounded-full ${
                      isLight ? "bg-black/15" : "bg-white/20"
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
                </div>
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
            For founders and product leaders who’ve built something with real
            potential. You’re solving a real problem for real people. Now let’s
            get you profitable.
          </p>

          {/* Boundary line (smaller) */}
          <p
            ref={whoBoundaryLineRef}
            className="mt-5 max-w-[560px] text-sm font-normal leading-[1.65] text-[var(--text-secondary)] opacity-0 will-change-[opacity,transform] sm:text-base"
          >
            You keep the vision and the decisions. We own the work, and the
            result we agree on up front.
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
            Revenue is the only metric{" "}
            <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] drop-shadow-[0_0_24px_rgba(232,155,60,0.3)]">
              we care about.
            </span>
          </h2>

          {/* Subline */}
          <p
            ref={startSublineRef}
            className="mt-6 max-w-[600px] text-base font-normal leading-[1.68] text-[var(--text-secondary)] opacity-0 will-change-[opacity,transform] sm:text-lg"
          >
            Start with a free audit. Send us your product and your numbers, and
            we’ll show you where the biggest leak is.
          </p>

          {/* Primary button & Secondary email link */}
          <div
            ref={startActionsRef}
            className="mt-9 flex flex-col items-center justify-center gap-4 opacity-0 will-change-[opacity,transform] sm:flex-row sm:gap-6"
          >
            <button
              type="button"
              data-cta-source="close-section"
              onClick={(e) =>
                onAuditClick?.(
                  e.currentTarget.getAttribute("data-cta-source") ??
                    "close-section"
                )
              }
              className="cursor-pointer rounded-full bg-[#e89b3c] px-8 py-3.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[#08080a] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Get a free audit
            </button>

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
