"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onAuditClick?: (sourceButton?: string) => void;
  showInsights?: boolean;
}

export default function Navbar({ onAuditClick, showInsights }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isLight = theme === "light";

  const [hasPublishedPosts, setHasPublishedPosts] = useState<boolean>(
    showInsights ?? false
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

  const handleAuditButton = (source: string) => {
    if (onAuditClick) {
      onAuditClick(source);
    } else {
      router.push(`/contact?intent=audit&source=${encodeURIComponent(source)}`);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-nav)" }}
    >
      <nav
        aria-label="Primary Navigation"
        className="flex w-full items-center justify-between px-6 py-5 sm:px-10 lg:px-16 xl:px-24"
      >
        {/* Minimalist Wordmark: small HELLO on top (left-aligned), big STEWARD below, no dot */}
        <Link
          href="/"
          className="group flex items-center text-[var(--text-primary)] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="font-mono-label text-[8.5px] font-medium uppercase tracking-[0.32em] text-[#e89b3c]">
              Hello
            </span>
            <span className="mt-0.5 text-sm font-semibold tracking-[0.26em] text-[var(--text-primary)]">
              STEWARD
            </span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-10 md:flex">
          {hasPublishedPosts && (
            <li>
              <Link
                href="/insights"
                className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
              >
                Insights
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/#contact"
              className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Controls: Mobile Links + Minimal Sliding Theme Switch + Free Audit CTA */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex items-center gap-3 md:hidden">
            {hasPublishedPosts && (
              <Link
                href="/insights"
                className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Insights
              </Link>
            )}
          </div>

          {/* Minimalist Sliding Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light and dark theme"
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] ${
              isLight
                ? "bg-black/10 ring-1 ring-black/10"
                : "bg-white/[0.07] ring-1 ring-white/10"
            }`}
          >
            <span
              aria-hidden="true"
              className={`ml-1.5 flex h-4 w-4 items-center justify-center transition-opacity duration-200 ${
                isLight ? "opacity-45 text-[#121216]" : "opacity-0"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 fill-none stroke-current stroke-2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>

            <span
              aria-hidden="true"
              className={`ml-auto mr-1.5 flex h-4 w-4 items-center justify-center transition-opacity duration-200 ${
                isLight ? "opacity-0" : "opacity-50 text-[#f4f0ea]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 fill-none stroke-current stroke-2"
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
              className={`pointer-events-none absolute top-0.5 left-0.5 flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 ease-out ${
                isLight
                  ? "translate-x-7 bg-[#121216] text-[#f5f2eb]"
                  : "translate-x-0 bg-[#f4f0ea] text-[#08080a]"
              }`}
            >
              {isLight ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 fill-none stroke-current stroke-2"
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
                  className="h-3 w-3 fill-none stroke-current stroke-2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
          </button>

          <button
            type="button"
            data-cta-source="nav"
            onClick={(e) =>
              handleAuditButton(
                e.currentTarget.getAttribute("data-cta-source") ?? "nav"
              )
            }
            className="cursor-pointer rounded-full bg-[var(--text-primary)] px-4.5 py-2 font-mono-label text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--bg-stage)] transition-all duration-200 hover:bg-[#e89b3c] hover:text-[#08080a] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            Free Audit
          </button>
        </div>
      </nav>
    </header>
  );
}
