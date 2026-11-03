"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactSectionProps {
  onAuditClick?: () => void;
}

export default function ContactSection({ onAuditClick }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const footnoteRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 82%",
          end: "top 15%",
          scrub: true,
        },
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          0.08
        );
      }

      if (sublineRef.current) {
        tl.fromTo(
          sublineRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.18
        );
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.28
        );
      }

      if (footnoteRef.current) {
        tl.fromTo(
          footnoteRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.36
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-40 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-10 lg:px-16"
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.08)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center">
        {/* Eyebrow: 05 / LET’S START */}
        <div
          ref={eyebrowRef}
          className="mb-5 inline-flex items-center gap-2.5 will-change-[opacity,transform]"
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
          ref={headlineRef}
          id="contact-heading"
          style={{ textWrap: "balance" }}
          className="max-w-[18ch] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--text-primary)] will-change-[opacity,transform] sm:text-5xl xl:text-[3.75rem]"
        >
          Revenue is the only metric{" "}
          <span className="font-serif-editorial text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] drop-shadow-[0_0_24px_rgba(232,155,60,0.28)]">
            we care about.
          </span>
        </h2>

        {/* Subline */}
        <p
          ref={sublineRef}
          className="mt-6 max-w-[600px] text-base font-normal leading-[1.68] text-[var(--text-secondary)] will-change-[opacity,transform] sm:text-lg"
        >
          Start with a free audit. Send us your product and your numbers, and
          we’ll show you where the biggest leak is.
        </p>

        {/* Primary button & Secondary email link */}
        <div
          ref={actionsRef}
          className="mt-9 flex flex-col items-center justify-center gap-4 will-change-[opacity,transform] sm:flex-row sm:gap-6"
        >
          <button
            type="button"
            onClick={onAuditClick}
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
          ref={footnoteRef}
          className="mt-5 font-mono-label text-[11px] tracking-[0.06em] text-[var(--text-muted)] will-change-[opacity,transform] sm:text-xs"
        >
          No cost, no strings. You keep everything we find.
        </p>
      </div>
    </section>
  );
}
