"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import TypewriterStage from "@/components/hero/TypewriterStage";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ProcessSection from "@/components/process/ProcessSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [activeDialog, setActiveDialog] = useState<
    "audit" | "conversation" | null
  >(null);

  // Shared Hero <-> Dashboard state (Return is always 1% of spend: Earned = Spent * 0.01)
  const [spent, setSpent] = useState<number>(0);
  const [earned, setEarned] = useState<number>(0);
  const [hundredClickCount, setHundredClickCount] = useState<number>(0);
  const [isTransitionLocked, setIsTransitionLocked] = useState<boolean>(false);

  // Shared wrapper ref for the continuous Section 1 -> Section 2 camera handoff
  const handoffWrapperRef = useRef<HTMLDivElement | null>(null);
  const desktopFixedStageRef = useRef<HTMLDivElement | null>(null);

  const syncFixedStage = useCallback(() => {
    const fixedEl = desktopFixedStageRef.current;
    if (!fixedEl) return;

    // Once Section 2 fades into "Let's fix it together" (> 2.15 * vh), hide the Section 1/2 fixed stage
    if (window.scrollY > window.innerHeight * 2.15) {
      if (fixedEl.style.visibility !== "hidden") {
        fixedEl.style.visibility = "hidden";
      }
    } else {
      if (fixedEl.style.visibility !== "visible") {
        fixedEl.style.visibility = "visible";
      }
    }
  }, []);

  // Guided multi-beat scroll choreography:
  // Beat 0 (0): Section 1 Hero
  // Beat 1 (1.0 * vh): Section 2 Dashboard
  // Beat 2 (1.6 * vh): "together" turns italic & orange (#e89b3c)
  // Beat 3 (2.6 * vh): "Let's fix it together" glides to center, Typewriter + Steward lockup
  // Beat 4 (3.6 * vh): "How we work together" (assembled typewriter centered, 4 process steps at bottom)
  // Beat 5: "1. Understand the problem" active + 3D Exploded View
  // Beat 6: "2. Build a solution" active (Only Units 02 & 04 visible with traveling green repair light)
  // Beat 7: "3. Test the solution" active (All 5 units brought together for live user testing)
  // Beat 8: "4. Launch and measure" active
  // Beat 9: "5. Iterate and scale" active
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    type BeatIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const MAX_BEAT: BeatIndex = 9;
    let isAnimating = false;
    let wheelCooldownUntil = 0;
    let touchStartY = 0;
    let scrollbarSnapTimer: ReturnType<typeof setTimeout> | null = null;
    const scrollTweenObj = { y: window.scrollY };

    const getSection2Top = () => {
      const el = document.getElementById("dashboard");
      return el ? el.offsetTop : window.innerHeight;
    };

    const getSection3Top = () => {
      const el = document.getElementById("process");
      return el ? el.offsetTop : window.innerHeight * 3.6;
    };

    const getBeatStops = (): [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ] => {
      const s2Top = getSection2Top();
      const s3Top = getSection3Top();
      const vh = window.innerHeight;
      return [
        0,                                // Beat 0: Hero
        s2Top,                            // Beat 1: Dashboard
        Math.round(s2Top + vh * 0.6),     // Beat 2: "together" italic orange
        Math.round(s2Top + vh * 1.6),     // Beat 3: "Let's fix it together" + Steward lockup
        s3Top,                            // Beat 4: "How we work together"
        Math.round(s3Top + vh * 0.85),    // Beat 5: "1. Understand the problem"
        Math.round(s3Top + vh * 1.95),    // Beat 6: "2. Build a solution"
        Math.round(s3Top + vh * 2.95),    // Beat 7: "3. Test the solution"
        Math.round(s3Top + vh * 3.85),    // Beat 8: "4. Launch and measure"
        Math.round(s3Top + vh * 4.55),    // Beat 9: "5. Iterate and scale"
      ];
    };

    const getNearestBeat = (y: number): BeatIndex => {
      const stops = getBeatStops();
      let bestIdx: BeatIndex = 0;
      let bestDist = Math.abs(y - stops[0]);
      for (let i = 1; i < stops.length; i++) {
        const d = Math.abs(y - stops[i]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i as BeatIndex;
        }
      }
      return bestIdx;
    };

    let currentBeat: BeatIndex = getNearestBeat(window.scrollY);

    const snapToBeat = (targetBeat: BeatIndex) => {
      const stops = getBeatStops();
      const targetY = stops[targetBeat];

      if (Math.abs(window.scrollY - targetY) < 2 && currentBeat === targetBeat) {
        return;
      }

      const prevBeat = currentBeat;
      isAnimating = true;
      currentBeat = targetBeat;

      gsap.killTweensOf(scrollTweenObj);
      scrollTweenObj.y = window.scrollY;

      // Custom pacing per story beat
      const duration =
        (prevBeat >= 5 && targetBeat >= 5)
          ? 1.15
          : (prevBeat === 4 && targetBeat === 5) ||
            (prevBeat === 5 && targetBeat === 4)
          ? 1.1
          : (prevBeat === 3 && targetBeat === 4) ||
            (prevBeat === 4 && targetBeat === 3)
          ? 0.95
          : (prevBeat === 2 && targetBeat === 3) ||
            (prevBeat === 3 && targetBeat === 2)
          ? 1.05
          : (prevBeat === 1 && targetBeat === 2) ||
            (prevBeat === 2 && targetBeat === 1)
          ? 0.58
          : 0.8;

      gsap.to(scrollTweenObj, {
        y: targetY,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo(0, Math.round(scrollTweenObj.y));
          ScrollTrigger.update();
          syncFixedStage();
        },
        onComplete: () => {
          window.scrollTo(0, targetY);
          ScrollTrigger.update();
          syncFixedStage();
          isAnimating = false;
          // Brief cooldown so trackpad inertia tail doesn't immediately skip a beat
          wheelCooldownUntil = performance.now() + 220;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeDialog) return;

      const stops = getBeatStops();
      const maxBeatY = stops[MAX_BEAT];
      if (window.scrollY <= maxBeatY + 10) {
        e.preventDefault();
      }

      const now = performance.now();
      if (isAnimating || now < wheelCooldownUntil) return;

      // Ignore tiny trackpad jitter
      if (Math.abs(e.deltaY) < 6) return;

      if (e.deltaY > 0 && currentBeat < MAX_BEAT) {
        snapToBeat((currentBeat + 1) as BeatIndex);
      } else if (e.deltaY < 0 && currentBeat > 0) {
        snapToBeat((currentBeat - 1) as BeatIndex);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialog) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (currentBeat < MAX_BEAT) {
          e.preventDefault();
          if (!isAnimating) snapToBeat((currentBeat + 1) as BeatIndex);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentBeat > 0) {
          e.preventDefault();
          if (!isAnimating) snapToBeat((currentBeat - 1) as BeatIndex);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (activeDialog || e.touches.length === 0) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 24) return;

      e.preventDefault();
      if (isAnimating) return;

      if (deltaY > 0 && currentBeat < MAX_BEAT) {
        touchStartY = e.touches[0].clientY;
        snapToBeat((currentBeat + 1) as BeatIndex);
      } else if (deltaY < 0 && currentBeat > 0) {
        touchStartY = e.touches[0].clientY;
        snapToBeat((currentBeat - 1) as BeatIndex);
      }
    };

    // Fallback if user drags the browser scrollbar directly and releases between beats
    const handleNativeScroll = () => {
      syncFixedStage();
      if (isAnimating) return;
      if (scrollbarSnapTimer) clearTimeout(scrollbarSnapTimer);
      scrollbarSnapTimer = setTimeout(() => {
        if (isAnimating) return;
        const stops = getBeatStops();
        const y = window.scrollY;
        const nearest = getNearestBeat(y);
        if (Math.abs(y - stops[nearest]) > 6 && y <= stops[MAX_BEAT] + 20) {
          snapToBeat(nearest);
        } else {
          currentBeat = nearest;
        }
      }, 110);
    };

    syncFixedStage();
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("resize", syncFixedStage);

    return () => {
      if (scrollbarSnapTimer) clearTimeout(scrollbarSnapTimer);
      gsap.killTweensOf(scrollTweenObj);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("resize", syncFixedStage);
    };
  }, [activeDialog, syncFixedStage]);

  const handleSpend = useCallback(
    (tier: 20 | 50 | 100, customEarnedDelta?: number) => {
      const earnedDelta =
        typeof customEarnedDelta === "number"
          ? customEarnedDelta
          : tier === 20
          ? Math.floor(Math.random() * 5) + 1 // 1 - 5 USD
          : tier === 50
          ? Math.floor(Math.random() * 16) + 5 // 5 - 20 USD
          : Math.floor(Math.random() * 21) + 20; // 20 - 40 USD

      setSpent((prevSpent) => prevSpent + tier);
      setEarned((prevEarned) => +(prevEarned + earnedDelta).toFixed(2));

      if (tier === 100) {
        setHundredClickCount((prev) => prev + 1);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar onAuditClick={() => setActiveDialog("audit")} />

      <main>
        {/* Shared Section 1 + Section 2 Stage Wrapper:
            Keeps the exact same TypewriterStage instance alive across both sections
            so the typewriter and $20/$50/$100 buttons smoothly transition into Section 2. */}
        <div
          ref={handoffWrapperRef}
          className="relative w-full overflow-x-clip"
        >
          {/* Desktop Fixed Shared Typewriter Stage (spans Section 1 & Section 2 so the exact same typewriter stays in view and transitions on scroll) */}
          <div
            ref={desktopFixedStageRef}
            className="pointer-events-none hidden lg:fixed lg:inset-x-0 lg:top-0 lg:z-30 lg:flex lg:h-screen lg:w-full lg:items-center lg:overflow-hidden"
          >
            <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 items-center gap-8 px-6 sm:px-10 lg:gap-10 lg:px-16 xl:px-24">
              <div className="col-span-6 col-start-7 w-full">
                <TypewriterStage
                  externalSpent={spent}
                  externalEarned={earned}
                  onSpend={handleSpend}
                  isTransitionLocked={isTransitionLocked}
                  handoffTriggerRef={handoffWrapperRef}
                  onTransitionLockChange={setIsTransitionLocked}
                />
              </div>
            </div>
          </div>

          <HeroSection
            onAuditClick={() => setActiveDialog("audit")}
            onConversationClick={() => setActiveDialog("conversation")}
            externalSpent={spent}
            externalEarned={earned}
            onSpend={handleSpend}
            isTransitionLocked={isTransitionLocked}
          />

          <DashboardSection
            spent={spent}
            earned={earned}
            hundredClickCount={hundredClickCount}
            onSpend={handleSpend}
            isTransitionLocked={isTransitionLocked}
          />
        </div>

        <ProcessSection />
      </main>

      {/* Accessible lightweight dialog for Free Audit / Start the conversation CTA clicks */}
      {activeDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cta-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[var(--bg-panel)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-label text-xs uppercase tracking-widest text-[#e89b3c]">
                {activeDialog === "audit" ? "Free Audit" : "Direct Line"}
              </span>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                aria-label="Close dialog"
                className="cursor-pointer rounded bg-[var(--btn-secondary-bg)] px-2.5 py-1 font-mono-label text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[#e89b3c]"
              >
                ESC
              </button>
            </div>

            <h2
              id="cta-dialog-title"
              className="mt-3 text-2xl font-bold text-[var(--text-primary)]"
            >
              {activeDialog === "audit"
                ? "Let's see why it isn't selling."
                : "Tell us what you're building."}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {activeDialog === "audit"
                ? "Send us your URL or repo. Two founders will look through your funnel, onboarding, and pricing and tell you where the leak is."
                : "No account managers and no handoffs. You talk directly to the two people who do the work."}
            </p>

            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setActiveDialog(null);
              }}
            >
              <div>
                <label
                  htmlFor="founder-email"
                  className="block font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Your email
                </label>
                <input
                  id="founder-email"
                  type="email"
                  required
                  placeholder="you@product.com"
                  className="mt-1 w-full rounded-lg bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-2 focus:outline-[#e89b3c]"
                />
              </div>
              <div>
                <label
                  htmlFor="product-url"
                  className="block font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Product link or one-line summary
                </label>
                <input
                  id="product-url"
                  type="text"
                  required
                  placeholder="https://yourapp.com"
                  className="mt-1 w-full rounded-lg bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-2 focus:outline-[#e89b3c]"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-full bg-[#e89b3c] py-2.5 font-mono-label text-xs font-semibold uppercase tracking-wider text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
              >
                {activeDialog === "audit"
                  ? "Request free audit"
                  : "Send message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
