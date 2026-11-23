"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import MobileStaticHome from "@/components/MobileStaticHome";
import Footer from "@/components/Footer";
import HomeLoader from "@/components/HomeLoader";
import { captureFirstLandingAttribution } from "@/components/leads/LeadCaptureModal";
import type { LeadIntent } from "@/config/leadCopy";

const TypewriterStage = dynamic(
  () => import("@/components/hero/TypewriterStage"),
  {
    ssr: false,
  }
);

const DashboardSection = dynamic(
  () => import("@/components/dashboard/DashboardSection"),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden="true" className="relative h-[260vh] w-full" />
    ),
  }
);

const ProcessSection = dynamic(
  () => import("@/components/process/ProcessSection"),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden="true" className="relative z-40 h-[760vh] w-full" />
    ),
  }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HOMEPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.hellosteward.agency/#organization",
      name: "Hello Steward",
      url: "https://www.hellosteward.agency",
      logo: "https://www.hellosteward.agency/logo-dark.png",
      email: "connect@hellosteward.agency",
      areaServed: ["US", "GB", "EU"],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.hellosteward.agency/#professional-service",
      name: "Hello Steward",
      url: "https://www.hellosteward.agency",
      logo: "https://www.hellosteward.agency/logo-dark.png",
      image: "https://www.hellosteward.agency/logo-dark.png",
      email: "connect@hellosteward.agency",
      description:
        "Product and growth partners for Seed to Series A B2B SaaS startups in the US and Europe. Outcome-backed conversion engineering, MVP rescue, and sub-1.5s speed audits.",
      areaServed: ["US", "GB", "EU"],
      priceRange: "$60/hr - $100/hr (40% at risk on outcome)",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "B2B SaaS Product, Growth & Conversion Engineering Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS Conversion Engineering & CRO",
              url: "https://www.hellosteward.agency/conversion-engineering",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS MVP Rescue & Next.js Refactoring",
              url: "https://www.hellosteward.agency/mvp-rescue",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "React & Next.js Speed Optimization & Core Web Vitals Audits",
              url: "https://www.hellosteward.agency/speed-audit",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS Pricing Strategy & Monetization Engineering",
              url: "https://www.hellosteward.agency/pricing-strategy",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS Onboarding Optimization & Activation Engineering",
              url: "https://www.hellosteward.agency/onboarding-retention",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Outcome-Based SaaS Product & Growth Engagement Models",
              url: "https://www.hellosteward.agency/engagement-models",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Free 5-Unit B2B SaaS Funnel, UX & Conversion Audit",
              url: "https://www.hellosteward.agency/audit",
            },
          },
        ],
      },
    },
  ],
};

export default function HomePage() {
  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isTypewriterMounted, setIsTypewriterMounted] =
    useState<boolean>(false);
  const [isDashboardMounted, setIsDashboardMounted] = useState<boolean>(false);
  const [isProcessMounted, setIsProcessMounted] = useState<boolean>(false);
  const snapToBeatRef = useRef<((beat: number) => void) | null>(null);
  const belowFoldTriggeredRef = useRef<boolean>(false);

  const activateBelowFoldSections = useCallback(() => {
    if (belowFoldTriggeredRef.current) return;
    belowFoldTriggeredRef.current = true;
    setIsTypewriterMounted(true);
    setIsDashboardMounted(true);
    setTimeout(() => {
      setIsProcessMounted(true);
    }, 64);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const updateViewport = () => {
      const matchesDesktop = mq.matches;
      setIsDesktop(matchesDesktop);

      if (matchesDesktop) {
        // Mount the fixed Hero TypewriterStage in an idle slice after initial hydration
        // so HomeLoader's handoff target is ready without blocking initial hydration.
        idleTimer = setTimeout(() => {
          setIsTypewriterMounted(true);
        }, 120);

        if (window.scrollY > 10 || window.location.hash) {
          activateBelowFoldSections();
        }
      }
    };

    updateViewport();
    mq.addEventListener("change", updateViewport);

    const onFirstInteraction = () => {
      if (mq.matches) {
        activateBelowFoldSections();
      }
    };

    window.addEventListener("wheel", onFirstInteraction, {
      passive: true,
      capture: true,
      once: true,
    });
    window.addEventListener("touchstart", onFirstInteraction, {
      passive: true,
      capture: true,
      once: true,
    });
    window.addEventListener("keydown", onFirstInteraction, {
      passive: true,
      capture: true,
      once: true,
    });
    window.addEventListener("pointerdown", onFirstInteraction, {
      passive: true,
      capture: true,
      once: true,
    });
    window.addEventListener("mousemove", onFirstInteraction, {
      passive: true,
      once: true,
    });
    window.addEventListener("scroll", onFirstInteraction, {
      passive: true,
      once: true,
    });

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      mq.removeEventListener("change", updateViewport);
      window.removeEventListener("wheel", onFirstInteraction, true);
      window.removeEventListener("touchstart", onFirstInteraction, true);
      window.removeEventListener("keydown", onFirstInteraction, true);
      window.removeEventListener("pointerdown", onFirstInteraction, true);
      window.removeEventListener("mousemove", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };
  }, [activateBelowFoldSections]);

  const openCtaPageInNewTab = useCallback(
    (intent: LeadIntent, sourceButton: string) => {
      if (typeof window !== "undefined") {
        const path = intent === "conversation" ? "/talk" : "/audit";
        window.location.href = `${path}?source=${encodeURIComponent(
          sourceButton
        )}`;
      }
    },
    []
  );

  const handleLoaderComplete = useCallback(() => {
    activateBelowFoldSections();
    window.scrollTo(0, 0);
    // Buffer so trackpad inertia from the loader dismissal scroll never skips Section 1
    setTimeout(() => {
      setIsLoaderActive(false);
    }, 320);
  }, [activateBelowFoldSections]);

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

    // Once Section 2's typewriter stage has fully faded out into "Let's fix it together" (> 2.5 * vh), hide the Section 1/2 fixed stage
    if (window.scrollY > window.innerHeight * 2.5) {
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
    if (!isDesktop) return;

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

    const getBeatStops = () => {
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

    snapToBeatRef.current = (beat: number) => {
      const stops = getBeatStops();
      const clamped = Math.max(0, Math.min(stops.length - 1, Math.round(beat)));
      window.scrollTo({
        top: stops[clamped],
        behavior: "smooth",
      });
    };

    syncFixedStage();
    window.addEventListener("scroll", syncFixedStage, { passive: true });
    window.addEventListener("resize", syncFixedStage);

    return () => {
      window.removeEventListener("scroll", syncFixedStage);
      window.removeEventListener("resize", syncFixedStage);
    };
  }, [syncFixedStage, isDesktop]);

  const handleSpend = useCallback(
    (tier: 20 | 5000 | 10000, customEarnedDelta?: number) => {
      const minEarned = Math.round(tier * 0.2);
      const maxEarned = Math.round(tier * 0.5);
      const rawRand =
        Math.floor(Math.random() * (maxEarned - minEarned + 1)) + minEarned;
      const fallbackEarned =
        tier >= 5000 ? Math.round(rawRand / 50) * 50 : rawRand;
      const earnedDelta =
        typeof customEarnedDelta === "number"
          ? customEarnedDelta
          : fallbackEarned;

      setSpent((prevSpent) => prevSpent + tier);
      setEarned((prevEarned) => +(prevEarned + earnedDelta).toFixed(2));

      if (tier === 10000) {
        setHundredClickCount((prev) => prev + 1);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_JSON_LD) }}
      />
      <HomeLoader
        onDismissStart={activateBelowFoldSections}
        onComplete={handleLoaderComplete}
      />

      <Navbar
        onAuditClick={(sourceButton = "nav") =>
          openCtaPageInNewTab("audit", sourceButton)
        }
      />

      <main className="min-h-screen">
        {/* Static Mobile-Only View (< 1024px): Renders lightweight Section 01 Hero in SSR for 0 Mobile CLS, while below-the-fold sections load lazily on mobile */}
        {!isDesktop && (
          <div className="min-h-[340vh] lg:hidden">
            <MobileStaticHome />
          </div>
        )}

        {/* Animated Desktop View (>= 1024px): Always renders the structural desktop container & height-matched placeholders during SSR so initial paint and hydrated layout match 1:1 with zero CLS on #footer */}
        <div className="hidden min-h-[1120vh] lg:block">
          {/* Shared Section 1 + Section 2 Stage Wrapper:
              Keeps the exact same TypewriterStage instance alive across both sections
              so the typewriter and $20/$50/$100 buttons smoothly transition into Section 2. */}
          <div
            ref={handoffWrapperRef}
            className="relative min-h-[360vh] w-full overflow-x-clip"
          >
            {/* Desktop Fixed Shared Typewriter Stage (spans Section 1 & Section 2 so the exact same typewriter stays in view and transitions on scroll) */}
            {isDesktop && isTypewriterMounted && (
              <div
                ref={desktopFixedStageRef}
                className="pointer-events-none hidden lg:fixed lg:inset-x-0 lg:top-0 lg:z-30 lg:flex lg:h-screen lg:w-full lg:items-center lg:overflow-hidden [@media(max-height:800px)]:lg:pt-11"
              >
                <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 items-center gap-8 px-6 sm:px-10 lg:gap-10 lg:px-16 xl:px-24">
                  <div className="col-span-6 col-start-7 w-full">
                    <TypewriterStage
                      externalSpent={spent}
                      externalEarned={earned}
                      onSpend={handleSpend}
                      isTransitionLocked={isTransitionLocked}
                      isLoaderActive={isLoaderActive}
                      isScrollHandoffReady={isDashboardMounted}
                      handoffTriggerRef={handoffWrapperRef}
                      onTransitionLockChange={setIsTransitionLocked}
                    />
                  </div>
                </div>
              </div>
            )}

            <HeroSection
              onAuditClick={(sourceButton = "hero") =>
                openCtaPageInNewTab("audit", sourceButton)
              }
              onConversationClick={(sourceButton = "hero") =>
                openCtaPageInNewTab("conversation", sourceButton)
              }
              externalSpent={spent}
              externalEarned={earned}
              onSpend={handleSpend}
              isTransitionLocked={isTransitionLocked}
            />

            {isDesktop && isDashboardMounted ? (
              <DashboardSection
                spent={spent}
                earned={earned}
                hundredClickCount={hundredClickCount}
                onSpend={handleSpend}
                isTransitionLocked={isTransitionLocked}
              />
            ) : (
              <div
                aria-hidden="true"
                className="relative h-[260vh] w-full"
              />
            )}
          </div>

          {isDesktop && isProcessMounted ? (
            <ProcessSection
              onAuditClick={(sourceButton = "close-section") =>
                openCtaPageInNewTab("audit", sourceButton)
              }
              onStepSelect={(stepIndex) => {
                snapToBeatRef.current?.(5 + stepIndex);
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="relative z-40 h-[760vh] w-full"
            />
          )}
        </div>
      </main>

      <Footer
        onAuditClick={(sourceButton = "footer") =>
          openCtaPageInNewTab("audit", sourceButton)
        }
      />
    </div>
  );
}
