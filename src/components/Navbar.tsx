"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import StewardLogo from "@/components/StewardLogo";

interface NavbarProps {
  onAuditClick?: (sourceButton?: string) => void;
  showInsights?: boolean;
}

export default function Navbar({ showInsights }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [hasPublishedPosts, setHasPublishedPosts] = useState<boolean>(
    showInsights ?? false,
  );

  useEffect(() => {
    if (typeof showInsights === "boolean") {
      setHasPublishedPosts(showInsights);
      return;
    }
    let cancelled = false;
    fetch("/api/insights/status")
      .then((r) => (r.ok ? r.json() : { hasPublished: false }))
      .then((data: { hasPublished?: boolean }) => {
        if (!cancelled) {
          setHasPublishedPosts(Boolean(data?.hasPublished));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [showInsights]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-nav)" }}
    >
      <nav
        aria-label="Primary Navigation"
        className="relative flex w-full items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4 lg:px-16 xl:px-24"
      >
        {/* Steward Brand Logo */}
        <Link
          href="/"
          aria-label="Steward Home"
          className="group flex shrink-0 items-center text-[var(--text-primary)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
        >
          <StewardLogo className="h-5 w-auto sm:h-6 lg:h-7" />
        </Link>

        {/* Navigation Links (Centered horizontally on Desktop lg+, normal flow on Tablet md so it never collides with controls) */}
        <ul className="hidden items-center md:flex md:gap-6 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:gap-10">
          {hasPublishedPosts && (
            <li>
              <Link
                href="/insights"
                className="whitespace-nowrap font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
              >
                Insights
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/talk?source=navbar"
              className="whitespace-nowrap font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Controls: Minimal Sliding Theme Switch + Simple CTAs */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3.5 lg:gap-5">
          {/* Minimalist Sliding Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light and dark theme"
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] sm:h-7 sm:w-14 ${
              isLight
                ? "bg-black/10 ring-1 ring-black/10"
                : "bg-white/[0.07] ring-1 ring-white/10"
            }`}
          >
            <span
              aria-hidden="true"
              className={`ml-1 flex h-3.5 w-3.5 items-center justify-center transition-opacity duration-200 sm:ml-1.5 sm:h-4 sm:w-4 ${
                isLight ? "opacity-45 text-[#121216]" : "opacity-0"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-2.5 w-2.5 fill-none stroke-current stroke-2 sm:h-3 sm:w-3"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>

            <span
              aria-hidden="true"
              className={`ml-auto mr-1 flex h-3.5 w-3.5 items-center justify-center transition-opacity duration-200 sm:mr-1.5 sm:h-4 sm:w-4 ${
                isLight ? "opacity-0" : "opacity-50 text-[#f4f0ea]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-2.5 w-2.5 fill-none stroke-current stroke-2 sm:h-3 sm:w-3"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300 ease-out sm:h-6 sm:w-6 ${
                isLight
                  ? "translate-x-5 bg-[#121216] text-[#f5f2eb] sm:translate-x-7"
                  : "translate-x-0 bg-[#f4f0ea] text-[#08080a]"
              }`}
            >
              {isLight ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5 fill-none stroke-current stroke-2 sm:h-3 sm:w-3"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5 fill-none stroke-current stroke-2 sm:h-3 sm:w-3"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
          </button>

          {/* Simple Navbar CTAs */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 lg:gap-3">
            <Link
              href="/talk?source=navbar"
              target="_blank"
              rel="noopener noreferrer"
              className={`whitespace-nowrap rounded-full border px-2.5 py-1.5 font-mono-label text-[9px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:px-3.5 sm:py-1.5 sm:text-[10px] sm:tracking-[0.16em] lg:px-4 lg:py-2 lg:text-[10.5px] ${
                isLight
                  ? "border-black/15 text-[#141413]/80 hover:border-black/35 hover:text-[#141413]"
                  : "border-white/15 text-[#f4f0ea]/80 hover:border-white/35 hover:text-[#f4f0ea]"
              }`}
            >
              Talk to us
            </Link>

            <Link
              href="/audit?source=navbar"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full bg-[#e89b3c] px-2.5 py-1.5 font-mono-label text-[9px] font-medium uppercase tracking-[0.12em] text-[#08080a] transition-colors duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c] sm:px-3.5 sm:py-1.5 sm:text-[10px] sm:tracking-[0.16em] lg:px-4 lg:py-2 lg:text-[10.5px]"
            >
              Free Audit
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
