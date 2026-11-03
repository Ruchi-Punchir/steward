"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme } from "@/context/ThemeContext";
import { DollarBillGraphic } from "@/components/hero/TypewriterStage";

interface HomeLoaderProps {
  onComplete?: () => void;
}

const LOADER_TERMINAL_LOGS = [
  { id: 1, text: "business.sys ready", isSummary: false },
  { id: 2, text: "awaiting spend...", isSummary: false },
];

export default function HomeLoader({ onComplete }: HomeLoaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [progress, setProgress] = useState(0);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  const touchStartYRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLParagraphElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const loaderTypewriterRef = useRef<HTMLDivElement | null>(null);

  // Get initial responsive scale for the loader typewriter
  const getInitialScale = useCallback(() => {
    if (typeof window === "undefined") return 0.48;
    if (window.innerWidth >= 1024) return 0.5;
    if (window.innerWidth >= 640) return 0.47;
    return 0.44;
  }, []);

  // Keep Section 1's underlying typewriter hidden while the loader typewriter is on stage
  useEffect(() => {
    if (isUnmounted) return;

    const setHeroTypewritersOpacity = (val: string) => {
      const nodes = document.querySelectorAll<HTMLElement>(
        '[data-typewriter-hero="true"]'
      );
      nodes.forEach((node) => {
        node.style.opacity = val;
      });
    };

    setHeroTypewritersOpacity("0");

    if (loaderTypewriterRef.current) {
      gsap.set(loaderTypewriterRef.current, {
        x: 0,
        y: 0,
        scale: getInitialScale(),
        transformOrigin: "center center",
      });
    }

    const handleResize = () => {
      if (!hasTriggeredRef.current && loaderTypewriterRef.current) {
        gsap.set(loaderTypewriterRef.current, {
          x: 0,
          y: 0,
          scale: getInitialScale(),
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      setHeroTypewritersOpacity("1");
    };
  }, [isUnmounted, getInitialScale]);

  // 1) Animate bottom progress bar from 0% -> 100%, then reveal "Scroll to begin"
  useEffect(() => {
    const startTime = performance.now();
    const totalDuration = 2100; // 2.1s smooth progress fill
    let rafId: number;
    let readyTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / totalDuration);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        readyTimer = setTimeout(() => {
          setIsReadyToScroll(true);
        }, 200);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (readyTimer) clearTimeout(readyTimer);
    };
  }, []);

  // 2) Smoothly move & scale the exact typewriter from its Loader position to Section 1's position
  const triggerDismiss = useCallback(() => {
    if (!isReadyToScroll || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    window.scrollTo(0, 0);

    const loaderTw = loaderTypewriterRef.current;
    const heroNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-typewriter-hero="true"]')
    );
    const activeHeroTw =
      heroNodes.find((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }) ?? null;

    // Reset any mouse-parallax tilt on Section 1's typewriter so coordinates match 1:1
    if (activeHeroTw) {
      const tiltEl = activeHeroTw.querySelector<HTMLElement>(
        '[data-typewriter-tilt="true"]'
      );
      if (tiltEl) {
        gsap.set(tiltEl, { x: 0, y: 0 });
      }
    }

    if (loaderTw && activeHeroTw) {
      const loaderRect = loaderTw.getBoundingClientRect();
      const targetRect = activeHeroTw.getBoundingClientRect();

      const loaderCenterX = loaderRect.left + loaderRect.width / 2;
      const loaderCenterY = loaderRect.top + loaderRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const dx = targetCenterX - loaderCenterX;
      const dy = targetCenterY - loaderCenterY;
      const unscaledWidth = loaderTw.offsetWidth || targetRect.width;
      const targetScale = targetRect.width / unscaledWidth;

      const tl = gsap.timeline({
        onComplete: () => {
          heroNodes.forEach((node) => {
            node.style.opacity = "1";
          });
          setIsUnmounted(true);
          onComplete?.();
        },
      });

      // Fade out loader UI chrome (top bar, headline, scroll indicator)
      tl.to(
        [topBarRef.current, headlineRef.current, bottomBarRef.current],
        {
          opacity: 0,
          y: -14,
          duration: 0.42,
          ease: "power2.inOut",
          stagger: 0.04,
        },
        0
      );

      // Dissolve loader backdrop so Section 1 reveals around the moving typewriter
      tl.to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.72,
          ease: "power2.inOut",
        },
        0.14
      );

      // Glide and scale the typewriter directly into its Section 1 home
      tl.to(
        loaderTw,
        {
          x: dx,
          y: dy,
          scale: targetScale,
          duration: 1.05,
          ease: "expo.inOut",
        },
        0
      );
    } else {
      // Fallback if target is not found
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          heroNodes.forEach((node) => {
            node.style.opacity = "1";
          });
          setIsUnmounted(true);
          onComplete?.();
        },
      });
    }
  }, [isReadyToScroll, onComplete]);

  // 3) Intercept scroll-down while loader is active; once 100% is reached, scrolling down triggers the handoff
  useEffect(() => {
    if (isUnmounted) return;

    window.scrollTo(0, 0);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isReadyToScroll && e.deltaY > 8) {
        triggerDismiss();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null || e.touches.length === 0) return;
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      e.preventDefault();
      e.stopPropagation();
      if (isReadyToScroll && deltaY > 18) {
        triggerDismiss();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (isReadyToScroll) {
          triggerDismiss();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      window.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isUnmounted, isReadyToScroll, triggerDismiss]);

  if (isUnmounted) return null;

  return (
    <div
      role="region"
      aria-label="Welcome to Hello Steward"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden px-6 py-7 select-none sm:px-12 sm:py-9"
    >
      {/* Loader Backdrop + Ambient Radial Glow (fades out as typewriter glides to Section 1) */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-colors duration-300 ${
          isLight ? "bg-[#f5f2eb]" : "bg-[#08080a]"
        }`}
      >
        <div className=" absolute left-1/2 top-1/2 h-[420px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.12)_0%,rgba(8,8,10,0)_70%)] blur-3xl" />
      </div>

      {/* TOP: Stacked Hello / STEWARD Brand Lockup */}
      <div
        ref={topBarRef}
        className="relative z-10 flex w-full max-w-[1560px] items-center justify-between"
      >
        <div className="inline-flex flex-col items-start leading-none">
          <span className="font-mono-label text-[9px] font-medium uppercase tracking-[0.32em] text-[#e89b3c]">
            Hello
          </span>
          <span className="mt-0.5 text-sm font-semibold tracking-[0.26em] text-[var(--text-primary)]">
            STEWARD
          </span>
        </div>

        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Product &amp; Growth Partners
        </span>
      </div>

      {/* CENTER: Section 1 Vintage Mechanical Typewriter + Larger Editorial Headline */}
      <div className="relative z-20 my-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* Compact wrapper holding the typewriter that glides into Section 1 */}
        <div className="relative -my-24 flex w-full items-center justify-center sm:-my-28 lg:-my-28">
          <div
            ref={loaderTypewriterRef}
            style={{
              transform: "scale(0.48)",
              transformOrigin: "center center",
            }}
            className="pointer-events-none flex w-[340px] flex-col items-center will-change-transform sm:w-[460px] lg:w-[510px] xl:w-[550px] 2xl:w-[610px]"
          >
            {/* PLATEN PAPER SLOT VIEWPORT + Emerging $1 Bill (matches Section 1 1:1) */}
            <div className="relative z-20 -mb-3.5 flex w-full flex-col items-center">
              <div className="relative z-10 flex h-[118px] w-[264px] items-end justify-center overflow-hidden sm:h-[144px] sm:w-[344px] lg:h-[156px] lg:w-[376px] xl:h-[166px] xl:w-[404px] 2xl:h-[178px] 2xl:w-[444px]">
                <div
                  style={{
                    transform: `translateY(${
                      70 + (1 - progress / 100) * 22
                    }%) rotate(-1.1deg)`,
                  }}
                  className="relative h-[118px] w-[264px] transition-transform duration-300 ease-out sm:h-[144px] sm:w-[344px] lg:h-[156px] lg:w-[376px] xl:h-[166px] xl:w-[404px] 2xl:h-[178px] 2xl:w-[444px]"
                >
                  <DollarBillGraphic idPrefix="loader-bill" />
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
                  <div className="h-2 w-[266px] rounded-b-full bg-black shadow-[inset_0_2px_5px_rgba(0,0,0,1)] sm:h-2.5 sm:w-[346px] lg:w-[378px] xl:w-[406px] 2xl:w-[446px]" />

                  {/* Chrome Paper Bail Rod with Twin Rubber Rollers */}
                  <div className="mt-1.5 flex w-[266px] items-center justify-between border-t-2 border-[#d8d4cc]/80 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:w-[346px] sm:px-8 lg:w-[378px] xl:w-[406px] 2xl:w-[446px]">
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
                    style={{ transformOrigin: "bottom left" }}
                    className="pointer-events-none absolute bottom-2 left-full -ml-1 flex flex-col items-end"
                  >
                    <div className="h-3.5 w-7 -rotate-12 rounded-full border border-black/30 bg-gradient-to-r from-[#f3b15c] via-[#e89b3c] to-[#b36a14] shadow-[0_2px_10px_rgba(232,155,60,0.5)] sm:h-4 sm:w-8" />
                    <div className="-mt-1 mr-2 h-11 w-2.5 rotate-25 rounded-full border border-black/25 bg-gradient-to-b from-[#f4f0ea] via-[#a8a49c] to-[#52504a] shadow-md sm:h-13 sm:w-3" />
                  </div>
                </div>
              </div>

              {/* 2. UPPER RIBBON SPOOL HOOD & TYPEBAR BASKET */}
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
                    }`}
                  >
                    <span className="absolute h-full w-0.5 bg-[#9e9a90]/50" />
                    <span className="absolute h-0.5 w-full bg-[#9e9a90]/50" />
                    <div className="z-10 h-4 w-4 rounded-full border border-black/50 bg-gradient-to-b from-[#e4e0d8] to-[#8a867c] sm:h-5 sm:w-5" />
                  </div>

                  {/* Center Open Typebar Basket + Brass V-Striker Guide + Riveted Nameplate */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-1.5 flex h-7 w-36 items-start justify-center overflow-hidden rounded-b-full border border-black/50 bg-[#0b0b0e] shadow-inner sm:h-8 sm:w-48">
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
                }`}
              >
                {/* Live Capital Fuel / Power Gauge Bar on Bezel */}
                <div className="mx-auto mb-2.5 flex w-[96%] items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e89b3c]/80" />
                    <span
                      className={`font-mono-label text-[9px] uppercase tracking-[0.18em] ${
                        isLight ? "text-[#6e6a62]" : "text-[#8e8a80]"
                      }`}
                    >
                      ⚡ FUEL: LOW — FEED $ TO RUN
                    </span>
                  </div>

                  {/* 6-Segment Capital Fuel Meter */}
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4, 5].map((segIdx) => (
                      <span
                        key={segIdx}
                        className={`h-2 w-2.5 rounded-[1px] sm:w-3 ${
                          segIdx === 0
                            ? "animate-pulse bg-[#e89b3c]/75"
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
                        className={`h-2 w-2 rounded-full ${
                          isLight ? "bg-[#b0aa9c]" : "bg-[#3a3a46]"
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
                        isLight ? "text-[#8a857c]" : "text-[#5c5954]"
                      }`}
                    >
                      READY
                    </span>
                  </div>

                  {/* Terminal Log (exact height & entries as Section 1) */}
                  <div className="flex h-[84px] flex-col justify-end space-y-1 overflow-y-auto text-left font-mono-label text-[11px] leading-snug sm:h-[98px] sm:text-xs">
                    {LOADER_TERMINAL_LOGS.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-2 rounded px-2 py-0.5 ${
                          isLight ? "text-[#78746c]" : "text-[#6e6b64]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={
                            isLight ? "text-[#a09b90]" : "text-[#4e4c46]"
                          }
                        >
                          &gt;
                        </span>
                        <span className="truncate">{entry.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classic Vintage Typewriter Bottom Row: Round Chrome-Ringed Glass Shift Keys + Spacebar */}
                <div
                  aria-hidden="true"
                  className="mt-3 flex items-center justify-center gap-3 px-2 sm:gap-4"
                >
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

        {/* Larger Editorial Premise with Consistent Site Typography */}
        <p
          ref={headlineRef}
          style={{ textWrap: "balance" }}
          className="mt-2 max-w-[20ch] text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl xl:text-[3.35rem]"
        >
          Imagine this represent{" "}
          <span className="font-serif-editorial text-[1.08em] font-normal italic tracking-[-0.01em] text-[#e89b3c]">
            your business
          </span>
        </p>
      </div>

      {/* BOTTOM: Progress Bar (0% -> 100%), then replaced by Slowly-Pulsating "Scroll to begin" */}
      <div
        ref={bottomBarRef}
        className="relative z-10 flex h-24 w-full max-w-md flex-col items-center justify-end"
      >
        {!isReadyToScroll ? (
          <div className="flex w-full flex-col items-center gap-2.5 transition-opacity duration-300">
            <div className="flex w-full items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span>Initializing stage</span>
              <span className="tabular-nums text-[#e89b3c]">{progress}%</span>
            </div>

            <div className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className="h-full bg-[#e89b3c] transition-[width] duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerDismiss}
            aria-label="Scroll down to enter site"
            className="group relative flex animate-[fadeIn_500ms_ease-out] cursor-pointer flex-col items-center gap-2.5 focus:outline-none"
          >
            <span className="font-mono-label text-[9px] uppercase tracking-[0.28em] text-[var(--text-muted)] transition-colors duration-300 group-hover:text-[#e89b3c]">
              Scroll to begin
            </span>

            {/* Sleek Architectural Capsule with Slow Ambient Pulse Halo & Gliding Chevron */}
            <div className="relative flex h-14 w-9 items-center justify-center">
              {/* Slow breathing outer halo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-[#e89b3c]/35 animate-[ping_3.4s_cubic-bezier(0,0,0.2,1)_infinite]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1.5 rounded-full bg-[#e89b3c]/10 blur-md animate-[pulse_3.4s_ease-in-out_infinite]"
              />

              {/* Main glassmorphic pill capsule */}
              <div
                className={`relative flex h-14 w-9 flex-col items-center justify-between rounded-full border py-2.5 transition-all duration-300 group-hover:border-[#e89b3c] group-hover:shadow-[0_0_24px_rgba(232,155,60,0.3)] ${
                  isLight
                    ? "border-black/15 bg-white/70 shadow-[0_8px_24px_rgba(18,18,22,0.08)]"
                    : "border-white/15 bg-[#121218]/85 shadow-[0_10px_28px_rgba(0,0,0,0.65)]"
                }`}
              >
                {/* Luminous scroll wheel bead + vertical guide track */}
                <div className="relative flex h-5 w-1 flex-col items-center overflow-hidden rounded-full bg-[#e89b3c]/20">
                  <span className="h-2 w-1 rounded-full bg-[#e89b3c] shadow-[0_0_8px_#e89b3c] animate-[pulse_2.6s_ease-in-out_infinite]" />
                </div>

                {/* Slowly pulsating double chevron */}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[#e89b3c] transition-transform duration-300 group-hover:translate-y-0.5 animate-[pulse_2.8s_ease-in-out_infinite]"
                >
                  <path
                    d="M3.5 5.5L8 10L12.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 9.5L8 12.5L11 9.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
