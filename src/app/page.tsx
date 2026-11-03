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
import Footer from "@/components/Footer";
import HomeLoader from "@/components/HomeLoader";
import LeadCaptureModal, {
  captureFirstLandingAttribution,
} from "@/components/leads/LeadCaptureModal";
import type { LeadIntent } from "@/config/leadCopy";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [activeDialog, setActiveDialog] = useState<{
    intent: LeadIntent;
    sourceButton: string;
  } | null>(null);
  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(true);
  const snapToBeatRef = useRef<((beat: number) => void) | null>(null);

  const handleLoaderComplete = useCallback(() => {
    window.scrollTo(0, 0);
    // Buffer so trackpad inertia from the loader dismissal scroll never skips Section 1
    setTimeout(() => {
      setIsLoaderActive(false);
    }, 320);
  }, []);

  useEffect(() => {
    captureFirstLandingAttribution();
  }, []);

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

    type BeatIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const MAX_BEAT: BeatIndex = 12;
    let isAnimating = false;
    let minDwellUntil = performance.now() + 450;
    let programmaticScrollGuardUntil = 0;
    let gestureLocked = false;
    let lockedDirection = 0;
    let lastWheelEventTime = 0;
    let prevAbsDelta = 0;
    let minAbsDeltaDuringLock = Infinity;
    let touchStartY = 0;
    let touchGestureConsumed = false;
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

    const getFooterStop = (fallbackMin: number) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(fallbackMin + 100, maxScroll);
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
      number,
      number,
      number,
      number
    ] => {
      const s2Top = getSection2Top();
      const s3Top = getSection3Top();
      const vh = window.innerHeight;
      const beat11 = Math.round(s3Top + vh * 6.55);
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
        Math.round(s3Top + vh * 5.55),    // Beat 10: "04 / WHO WE WORK WITH — We own the outcome."
        beat11,                           // Beat 11: "05 / LET’S START — Revenue is the only metric we care about."
        getFooterStop(beat11),            // Beat 12: Footer
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
        Math.abs(targetBeat - prevBeat) > 1
          ? 1.05
          : prevBeat >= 5 && targetBeat >= 5
          ? 0.92
          : (prevBeat === 4 && targetBeat === 5) ||
            (prevBeat === 5 && targetBeat === 4)
          ? 0.9
          : (prevBeat === 3 && targetBeat === 4) ||
            (prevBeat === 4 && targetBeat === 3)
          ? 0.88
          : (prevBeat === 2 && targetBeat === 3) ||
            (prevBeat === 3 && targetBeat === 2)
          ? 0.92
          : (prevBeat === 1 && targetBeat === 2) ||
            (prevBeat === 2 && targetBeat === 1)
          ? 0.62
          : 0.78;

      const now = performance.now();
      // Mandatory post-arrival dwell (520ms) so the user always sees each story beat before advancing
      minDwellUntil = now + duration * 1000 + 520;
      programmaticScrollGuardUntil = now + duration * 1000 + 400;

      gsap.to(scrollTweenObj, {
        y: targetY,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
          programmaticScrollGuardUntil = performance.now() + 350;
          window.scrollTo(0, Math.round(scrollTweenObj.y));
          ScrollTrigger.update();
          syncFixedStage();
        },
        onComplete: () => {
          programmaticScrollGuardUntil = performance.now() + 400;
          window.scrollTo(0, targetY);
          ScrollTrigger.update();
          syncFixedStage();
          isAnimating = false;
        },
      });
    };

    snapToBeatRef.current = (beat: number) => {
      const clamped = Math.max(0, Math.min(MAX_BEAT, Math.round(beat))) as BeatIndex;
      gestureLocked = true;
      minAbsDeltaDuringLock = Infinity;
      snapToBeat(clamped);
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeDialog || isLoaderActive) return;

      const stops = getBeatStops();
      const maxBeatY = stops[MAX_BEAT];
      if (window.scrollY <= maxBeatY + 10) {
        e.preventDefault();
      }

      const now = performance.now();
      const absDelta = Math.abs(e.deltaY);
      const dir = Math.sign(e.deltaY);
      const timeSinceLastWheel = now - lastWheelEventTime;
      lastWheelEventTime = now;

      // Ignore tiny trackpad micro-jitter
      if (absDelta < 7) {
        prevAbsDelta = absDelta;
        return;
      }

      // If currently animating or inside the mandatory story-beat dwell window:
      // keep gestureLocked = true so any swipe made mid-transition (and its inertia tail)
      // cannot auto-fire when the dwell window finishes.
      if (isAnimating || now < minDwellUntil) {
        gestureLocked = true;
        lockedDirection = dir;
        prevAbsDelta = absDelta;
        minAbsDeltaDuringLock = Math.min(minAbsDeltaDuringLock, absDelta);
        return;
      }

      // Check if an existing trackpad inertia lock can be released:
      if (gestureLocked) {
        minAbsDeltaDuringLock = Math.min(minAbsDeltaDuringLock, absDelta);

        const isNewGestureAfterSilence = timeSinceLastWheel >= 135;
        const isDirectionReversal = dir !== 0 && dir !== lockedDirection && absDelta >= 15;
        // A deliberate fresh finger flick after inertia had already decayed
        const isFreshAccelerationSpike =
          minAbsDeltaDuringLock <= 20 &&
          absDelta >= 26 &&
          absDelta > prevAbsDelta * 1.55;

        if (
          isNewGestureAfterSilence ||
          isDirectionReversal ||
          isFreshAccelerationSpike
        ) {
          gestureLocked = false;
        } else {
          prevAbsDelta = absDelta;
          return;
        }
      }

      prevAbsDelta = absDelta;

      if (e.deltaY > 0 && currentBeat < MAX_BEAT) {
        gestureLocked = true;
        lockedDirection = 1;
        minAbsDeltaDuringLock = absDelta;
        snapToBeat((currentBeat + 1) as BeatIndex);
      } else if (e.deltaY < 0 && currentBeat > 0) {
        gestureLocked = true;
        lockedDirection = -1;
        minAbsDeltaDuringLock = absDelta;
        snapToBeat((currentBeat - 1) as BeatIndex);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialog || isLoaderActive) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const now = performance.now();
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (currentBeat < MAX_BEAT) {
          e.preventDefault();
          if (!isAnimating && now >= minDwellUntil) {
            snapToBeat((currentBeat + 1) as BeatIndex);
          }
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentBeat > 0) {
          e.preventDefault();
          if (!isAnimating && now >= minDwellUntil) {
            snapToBeat((currentBeat - 1) as BeatIndex);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchGestureConsumed = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (activeDialog || isLoaderActive || e.touches.length === 0) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 28) return;

      e.preventDefault();
      const now = performance.now();
      if (isAnimating || now < minDwellUntil || touchGestureConsumed) return;

      if (deltaY > 0 && currentBeat < MAX_BEAT) {
        touchGestureConsumed = true;
        touchStartY = e.touches[0].clientY;
        snapToBeat((currentBeat + 1) as BeatIndex);
      } else if (deltaY < 0 && currentBeat > 0) {
        touchGestureConsumed = true;
        touchStartY = e.touches[0].clientY;
        snapToBeat((currentBeat - 1) as BeatIndex);
      }
    };

    // Fallback ONLY if user manually drags the browser scrollbar thumb and releases between beats
    const handleNativeScroll = () => {
      syncFixedStage();
      const now = performance.now();
      if (
        isAnimating ||
        isLoaderActive ||
        now < programmaticScrollGuardUntil
      ) {
        return;
      }
      if (scrollbarSnapTimer) clearTimeout(scrollbarSnapTimer);
      scrollbarSnapTimer = setTimeout(() => {
        if (
          isAnimating ||
          isLoaderActive ||
          performance.now() < programmaticScrollGuardUntil
        ) {
          return;
        }
        const stops = getBeatStops();
        const y = window.scrollY;
        const nearest = getNearestBeat(y);
        // Only snap if the user manually dragged the scrollbar significantly off the current beat stop
        if (
          Math.abs(y - stops[currentBeat]) > 45 &&
          Math.abs(y - stops[nearest]) > 8 &&
          y <= stops[MAX_BEAT] + 20
        ) {
          snapToBeat(nearest);
        } else {
          currentBeat = nearest;
        }
      }, 180);
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
  }, [activeDialog, isLoaderActive, syncFixedStage]);

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
      <HomeLoader onComplete={handleLoaderComplete} />

      <Navbar
        onAuditClick={(sourceButton = "nav") =>
          setActiveDialog({ intent: "audit", sourceButton })
        }
      />

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
            onAuditClick={(sourceButton = "hero") =>
              setActiveDialog({ intent: "audit", sourceButton })
            }
            onConversationClick={(sourceButton = "hero") =>
              setActiveDialog({ intent: "conversation", sourceButton })
            }
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

        <ProcessSection
          onAuditClick={(sourceButton = "close-section") =>
            setActiveDialog({ intent: "audit", sourceButton })
          }
          onStepSelect={(stepIndex) => {
            snapToBeatRef.current?.(5 + stepIndex);
          }}
        />
      </main>

      <Footer
        onAuditClick={(sourceButton = "footer") =>
          setActiveDialog({ intent: "audit", sourceButton })
        }
      />

      <LeadCaptureModal
        intent={activeDialog?.intent ?? null}
        sourceButton={activeDialog?.sourceButton ?? "modal"}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  );
}
