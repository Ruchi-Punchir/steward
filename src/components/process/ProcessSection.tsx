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

export default function ProcessSection() {
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

  const [explosionProgress, setExplosionProgress] = useState<number>(0);
  const [fixProgress, setFixProgress] = useState<number>(0);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [launchProgress, setLaunchProgress] = useState<number>(0);
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

      // 2) Pinned progression inside Section 3 across 4.6 viewports:
      //    Stage 1 (0.04 -> 0.14, dwell -> 0.28): 1. Understand the problem
      //    Stage 2 (0.28 -> 0.40, dwell -> 0.50): 2. Build a solution
      //    Stage 3 (0.50 -> 0.62, dwell -> 0.70): 3. Test the solution
      //    Stage 4 (0.70 -> 0.82, dwell -> 0.86): 4. Launch and measure
      //    Stage 5 (0.86 -> 0.96, dwell -> 1.00): 5. Iterate and scale
      const stepTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.6}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Explosion progress (0 -> 1 during Stage 1)
            const exp = Math.max(0, Math.min(1, (p - 0.03) / 0.12));
            setExplosionProgress(exp);

            // Stage 2 ("Build a solution") progress
            const fixP = Math.max(0, Math.min(1, (p - 0.28) / 0.12));
            setFixProgress(fixP);

            // Stage 3 ("Test the solution") progress
            const testP = Math.max(0, Math.min(1, (p - 0.50) / 0.12));
            setTestProgress(testP);

            // Stage 4 ("Launch and measure") progress
            const launchP = Math.max(0, Math.min(1, (p - 0.70) / 0.12));
            setLaunchProgress(launchP);

            const nextStage: 0 | 1 | 2 | 3 | 4 | 5 =
              p >= 0.88
                ? 5
                : p >= 0.72
                ? 4
                : p >= 0.52
                ? 3
                : p >= 0.30
                ? 2
                : p >= 0.07
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
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.04
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
            duration: 0.11,
            ease: "power2.out",
            immediateRender: false,
          },
          0.05
        );
      }

      // Step 1 progress bar fill: Understand the problem (#e89b3c)
      if (understandProgressFillRef.current) {
        stepTl.fromTo(
          understandProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.05
        );
      }

      // Step 2 progress bar fill: Build a solution (#10b981)
      if (fixProgressFillRef.current) {
        stepTl.fromTo(
          fixProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.29
        );
      }

      // Step 3 progress bar fill: Test the solution (#e89b3c)
      if (testProgressFillRef.current) {
        stepTl.fromTo(
          testProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.51
        );
      }

      // Step 4 progress bar fill: Launch and measure (#10b981)
      if (launchProgressFillRef.current) {
        stepTl.fromTo(
          launchProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.71
        );
      }

      // Step 5 progress bar fill: Iterate and scale (#e89b3c)
      if (iterateProgressFillRef.current) {
        stepTl.fromTo(
          iterateProgressFillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0.87
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
      className="relative z-40 h-[560vh] w-full"
    >
      {/* Sticky Full-Screen Stage: Intro -> 1. Understand the problem -> 2. Build a solution -> 3. Test the solution -> 4. Launch and measure */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
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

        {/* CENTER STAGE: 3D ISOMETRIC EXPLODED TYPEWRITER (Stages 1 & 2) -> ASSEMBLED FRONT-VIEW TYPEWRITER & BILL COMPARISON (Stage 3) */}
        <div
          ref={explodedStageWrapRef}
          className="pointer-events-auto absolute inset-x-0 top-[53%] z-40 mx-auto flex h-[540px] w-full max-w-[1040px] -translate-y-1/2 items-center justify-center px-4 will-change-[opacity,transform]"
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

            {/* Stage 3 ("Test the solution"): Front-View Assembled Typewriter + "Test" Button + Old Bill vs. New Bill Comparison */}
            <div
              style={{
                pointerEvents: testProgress > 0.55 ? "auto" : "none",
              }}
              className="absolute inset-0 flex h-full w-full items-center justify-center"
            >
              <TestSolutionStage testProgress={testProgress} isLight={isLight} />
            </div>
          </div>
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

                  {/* Step Bottom Progress Track */}
                  <div
                    className={`relative h-[3px] w-full overflow-hidden rounded-full ${
                      isLight ? "bg-black/20" : "bg-white/70"
                    }`}
                  >
                    {idx === 0 && (
                      <div
                        ref={understandProgressFillRef}
                        style={{ transformOrigin: "left center" }}
                        className="h-full w-full scale-x-0 bg-[#e89b3c] shadow-[0_0_14px_rgba(232,155,60,0.85)] will-change-transform"
                      />
                    )}
                    {idx === 1 && (
                      <div
                        ref={fixProgressFillRef}
                        style={{ transformOrigin: "left center" }}
                        className="h-full w-full scale-x-0 bg-[#10b981] shadow-[0_0_14px_rgba(16,185,129,0.85)] will-change-transform"
                      />
                    )}
                    {idx === 2 && (
                      <div
                        ref={testProgressFillRef}
                        style={{ transformOrigin: "left center" }}
                        className="h-full w-full scale-x-0 bg-[#e89b3c] shadow-[0_0_14px_rgba(232,155,60,0.85)] will-change-transform"
                      />
                    )}
                    {idx === 3 && (
                      <div
                        ref={launchProgressFillRef}
                        style={{ transformOrigin: "left center" }}
                        className="h-full w-full scale-x-0 bg-[#10b981] shadow-[0_0_14px_rgba(16,185,129,0.85)] will-change-transform"
                      />
                    )}
                    {idx === 4 && (
                      <div
                        ref={iterateProgressFillRef}
                        style={{ transformOrigin: "left center" }}
                        className="h-full w-full scale-x-0 bg-[#e89b3c] shadow-[0_0_14px_rgba(232,155,60,0.85)] will-change-transform"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
