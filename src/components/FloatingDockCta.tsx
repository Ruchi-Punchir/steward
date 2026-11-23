"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

interface DockItemSpring {
  scale: number;
  y: number;
  iconScale: number;
  vScale: number;
  vY: number;
  vIconScale: number;
}

export default function FloatingDockCta() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const dockRef = useRef<HTMLDivElement | null>(null);
  const auditItemRef = useRef<HTMLAnchorElement | null>(null);
  const talkItemRef = useRef<HTMLAnchorElement | null>(null);
  const auditIconRef = useRef<HTMLSpanElement | null>(null);
  const talkIconRef = useRef<HTMLSpanElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const mouseXRef = useRef<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<"audit" | "talk" | null>(null);

  // Aceternity-style proximity magnification + spring lift physics
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let rafId = 0;

    const springs: Record<"audit" | "talk", DockItemSpring> = {
      audit: {
        scale: 1,
        y: 0,
        iconScale: 1,
        vScale: 0,
        vY: 0,
        vIconScale: 0,
      },
      talk: {
        scale: 1,
        y: 0,
        iconScale: 1,
        vScale: 0,
        vY: 0,
        vIconScale: 0,
      },
    };

    const stepSpring = (
      s: DockItemSpring,
      targetScale: number,
      targetY: number,
      targetIconScale: number
    ) => {
      const stiffness = 0.18;
      const damping = 0.72;

      s.vScale = (s.vScale + (targetScale - s.scale) * stiffness) * damping;
      s.scale += s.vScale;

      s.vY = (s.vY + (targetY - s.y) * stiffness) * damping;
      s.y += s.vY;

      s.vIconScale =
        (s.vIconScale + (targetIconScale - s.iconScale) * stiffness) * damping;
      s.iconScale += s.vIconScale;
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const mx = mouseXRef.current;
      const items: {
        key: "audit" | "talk";
        el: HTMLAnchorElement | null;
        iconEl: HTMLSpanElement | null;
      }[] = [
        {
          key: "audit",
          el: auditItemRef.current,
          iconEl: auditIconRef.current,
        },
        {
          key: "talk",
          el: talkItemRef.current,
          iconEl: talkIconRef.current,
        },
      ];

      items.forEach(({ key, el, iconEl }) => {
        if (!el) return;
        let targetScale = 1;
        let targetY = 0;
        let targetIconScale = 1;

        if (mx !== null) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const dist = Math.abs(mx - centerX);
          const maxDist = 175;
          if (dist < maxDist) {
            // Smooth cosine bell curve like macOS / Aceternity Floating Dock
            const proximity = Math.cos((dist / maxDist) * (Math.PI / 2));
            targetScale = 1 + proximity * 0.07;
            targetY = -proximity * 2;
            targetIconScale = 1 + proximity * 0.16;
          }
        }

        const sp = springs[key];
        stepSpring(sp, targetScale, targetY, targetIconScale);

        el.style.transform = `translate3d(0, ${sp.y.toFixed(2)}px, 0) scale(${sp.scale.toFixed(4)})`;
        if (iconEl) {
          iconEl.style.transform = `scale(${sp.iconScale.toFixed(4)})`;
        }
      });
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseXRef.current = e.clientX;
    if (dockRef.current && spotlightRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      spotlightRef.current.style.opacity = "1";
      spotlightRef.current.style.background = `radial-gradient(130px circle at ${relX}px 50%, rgba(232,155,60,0.22), transparent 80%)`;
    }
  };

  const handleMouseLeave = () => {
    mouseXRef.current = null;
    setHoveredItem(null);
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={dockRef}
      aria-label="Quick Actions Dock"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative flex items-center gap-1.5 rounded-full border p-1 backdrop-blur-2xl transition-colors duration-300 sm:gap-2 sm:px-1.5 sm:py-1 ${
        isLight
          ? "border-black/12 bg-[#f5f2eb]/90 shadow-[0_10px_28px_rgba(18,18,22,0.10),0_2px_6px_rgba(18,18,22,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
          : "border-white/[0.12] bg-[#0e0e14]/88 shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(232,155,60,0.08),inset_0_1px_0_rgba(255,255,255,0.14)]"
      }`}
    >
      {/* Interactive cursor-following radial glow inside the dock */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
      />

      {/* Bottom subtle dock shelf reflection line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-[#e89b3c]/55 to-transparent"
      />

      {/* DOCK ITEM 1: FREE AUDIT */}
      <Link
        ref={auditItemRef}
        href="/audit?source=nav-dock"
        data-cta-source="nav-dock-audit"
        onMouseEnter={() => setHoveredItem("audit")}
        onFocus={() => setHoveredItem("audit")}
        onBlur={() => setHoveredItem(null)}
        style={{ transformOrigin: "center center" }}
        className="group relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-[#e89b3c] px-3 py-1.5 text-[#08080a] shadow-[0_4px_14px_rgba(232,155,60,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors duration-200 hover:bg-[#f3a847] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] will-change-transform sm:gap-2 sm:px-3.5"
      >
        {/* Floating Aceternity-style Tooltip below item in Navbar */}
        <span
          role="tooltip"
          aria-hidden={hoveredItem !== "audit"}
          className={`pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono-label text-[9.5px] font-medium tracking-[0.08em] shadow-lg transition-all duration-200 ${
            hoveredItem === "audit"
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1.5 scale-90 opacity-0"
          } ${
            isLight
              ? "border-black/12 bg-[#121216] text-[#f5f2eb]"
              : "border-[#e89b3c]/40 bg-[#16161f] text-[#f4f0ea]"
          }`}
        >
          Get a free funnel &amp; product audit ↗
        </span>

        {/* Magnifying Dock Icon Badge */}
        <span
          ref={auditIconRef}
          aria-hidden="true"
          className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#08080a]/12 text-[#08080a] transition-transform will-change-transform sm:h-5 sm:w-5"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 fill-none stroke-current stroke-[2.2] sm:h-3 sm:w-3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>

        <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.15em] sm:text-[10.5px]">
          Free Audit
        </span>

        <span
          aria-hidden="true"
          className="font-mono-label text-[10px] opacity-75 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </Link>

      {/* CENTER DOCK DIVIDER: "or" */}
      <div
        aria-hidden="true"
        className="relative z-10 flex flex-col items-center justify-center px-0.5"
      >
        <span
          className={`font-mono-label text-[9.5px] lowercase tracking-[0.1em] ${
            isLight ? "text-[#6e6a62]" : "text-[#8e8a80]"
          }`}
        >
          or
        </span>
      </div>

      {/* DOCK ITEM 2: TALK TO US */}
      <Link
        ref={talkItemRef}
        href="/talk?source=nav-dock"
        data-cta-source="nav-dock-talk"
        onMouseEnter={() => setHoveredItem("talk")}
        onFocus={() => setHoveredItem("talk")}
        onBlur={() => setHoveredItem(null)}
        style={{ transformOrigin: "center center" }}
        className={`group relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] will-change-transform sm:gap-2 sm:px-3.5 ${
          isLight
            ? "border-black/12 bg-white/80 text-[#121216] shadow-xs hover:border-[#e89b3c]/60 hover:bg-white"
            : "border-white/[0.1] bg-white/[0.05] text-[#f4f0ea] shadow-inner hover:border-[#e89b3c]/50 hover:bg-white/[0.1]"
        }`}
      >
        {/* Floating Aceternity-style Tooltip below item in Navbar */}
        <span
          role="tooltip"
          aria-hidden={hoveredItem !== "talk"}
          className={`pointer-events-none absolute -bottom-9 right-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono-label text-[9.5px] font-medium tracking-[0.08em] shadow-lg transition-all duration-200 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 ${
            hoveredItem === "talk"
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1.5 scale-90 opacity-0"
          } ${
            isLight
              ? "border-black/12 bg-[#121216] text-[#f5f2eb]"
              : "border-[#10b981]/40 bg-[#16161f] text-[#f4f0ea]"
          }`}
        >
          Start a conversation with us ↗
        </span>

        {/* Magnifying Dock Icon Badge with Live Online Dot */}
        <span
          ref={talkIconRef}
          aria-hidden="true"
          className={`relative flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-transform will-change-transform sm:h-5 sm:w-5 ${
            isLight
              ? "bg-black/[0.06] text-[#121216]"
              : "bg-white/[0.08] text-[#f4f0ea]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 fill-none stroke-current stroke-[2] sm:h-3 sm:w-3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#10b981] ring-2 ring-[var(--bg-stage)]" />
        </span>

        <span className="font-mono-label text-[10px] font-medium tracking-[0.08em] sm:text-[10.5px]">
          Talk to us
        </span>

        <span
          aria-hidden="true"
          className="font-mono-label text-[10px] opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e89b3c] group-hover:opacity-100"
        >
          ↗
        </span>
      </Link>
    </div>
  );
}
