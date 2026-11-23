"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Disable Lenis smooth scrolling on mobile/tablet (< 1024px) to keep touch scrolling 100% native and lag-free
    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;

    if (prefersReducedMotion || isMobileViewport) {
      return;
    }

    let lenis: Lenis | null = null;
    let updateTicker: ((time: number) => void) | null = null;

    const startLenis = () => {
      if (lenis) return;
      window.removeEventListener("wheel", startLenis, true);
      window.removeEventListener("touchstart", startLenis, true);
      window.removeEventListener("keydown", startLenis, true);
      window.removeEventListener("pointerdown", startLenis, true);

      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      lenis.on("scroll", ScrollTrigger.update);

      updateTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);
    };

    window.addEventListener("wheel", startLenis, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchstart", startLenis, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", startLenis, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerdown", startLenis, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", startLenis, true);
      window.removeEventListener("touchstart", startLenis, true);
      window.removeEventListener("keydown", startLenis, true);
      window.removeEventListener("pointerdown", startLenis, true);
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
      }
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
