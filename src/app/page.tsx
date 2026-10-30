"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import TypewriterStage from "@/components/hero/TypewriterStage";
import DashboardSection from "@/components/dashboard/DashboardSection";

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

  // Immediate full-section snap when scroll is hit (Section 1 <-> Section 2)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let isAnimating = false;
    let currentSection: 0 | 1 = window.scrollY > window.innerHeight * 0.5 ? 1 : 0;
    let wheelCooldownUntil = 0;
    let touchStartY = 0;
    let scrollbarSnapTimer: ReturnType<typeof setTimeout> | null = null;
    const scrollTweenObj = { y: window.scrollY };

    const getSection2Top = () => {
      const el = document.getElementById("dashboard");
      return el ? el.offsetTop : window.innerHeight;
    };

    const snapToSection = (targetSection: 0 | 1) => {
      const targetY = targetSection === 1 ? getSection2Top() : 0;

      if (Math.abs(window.scrollY - targetY) < 2 && currentSection === targetSection) {
        return;
      }

      isAnimating = true;
      currentSection = targetSection;
      setIsTransitionLocked(true);

      gsap.killTweensOf(scrollTweenObj);
      scrollTweenObj.y = window.scrollY;

      gsap.to(scrollTweenObj, {
        y: targetY,
        duration: 0.82,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollTweenObj.y);
          ScrollTrigger.update();
        },
        onComplete: () => {
          window.scrollTo(0, targetY);
          ScrollTrigger.update();
          isAnimating = false;
          setIsTransitionLocked(false);
          // Brief cooldown so trackpad inertia tail doesn't immediately re-trigger
          wheelCooldownUntil = performance.now() + 260;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeDialog) return;

      // Always prevent native free-scroll between Section 1 and Section 2 so it never stops in the middle
      const s2Top = getSection2Top();
      if (window.scrollY <= s2Top + 10) {
        e.preventDefault();
      }

      const now = performance.now();
      if (isAnimating || now < wheelCooldownUntil) return;

      // Ignore tiny trackpad jitter
      if (Math.abs(e.deltaY) < 6) return;

      if (e.deltaY > 0 && currentSection === 0) {
        snapToSection(1);
      } else if (e.deltaY < 0 && currentSection === 1) {
        snapToSection(0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialog) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (currentSection === 0) {
          e.preventDefault();
          if (!isAnimating) snapToSection(1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentSection === 1) {
          e.preventDefault();
          if (!isAnimating) snapToSection(0);
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

      if (deltaY > 0 && currentSection === 0) {
        snapToSection(1);
      } else if (deltaY < 0 && currentSection === 1) {
        snapToSection(0);
      }
    };

    // Fallback if user drags the browser scrollbar directly and releases in the middle
    const handleNativeScroll = () => {
      if (isAnimating) return;
      if (scrollbarSnapTimer) clearTimeout(scrollbarSnapTimer);
      scrollbarSnapTimer = setTimeout(() => {
        if (isAnimating) return;
        const s2Top = getSection2Top();
        const y = window.scrollY;
        if (y > 4 && y < s2Top - 4) {
          const target: 0 | 1 = y >= s2Top * 0.5 ? 1 : 0;
          snapToSection(target);
        } else if (y <= 4) {
          currentSection = 0;
        } else if (y >= s2Top - 4) {
          currentSection = 1;
        }
      }, 90);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      if (scrollbarSnapTimer) clearTimeout(scrollbarSnapTimer);
      gsap.killTweensOf(scrollTweenObj);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleNativeScroll);
    };
  }, [activeDialog]);

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
          <div className="pointer-events-none hidden lg:fixed lg:inset-x-0 lg:top-0 lg:z-30 lg:flex lg:h-screen lg:w-full lg:items-center lg:overflow-hidden">
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
