"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onAuditClick?: () => void;
}

export default function Navbar({ onAuditClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-nav)" }}
    >
      <nav
        aria-label="Primary Navigation"
        className="flex w-full items-center justify-between px-6 py-5 sm:px-10 lg:px-16 xl:px-24"
      >
        {/* Minimalist Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-[0.26em] text-[var(--text-primary)] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#e89b3c]"
          />
          <span>STEWARD</span>
        </a>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <a
              href="#projects"
              className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#insights"
              className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Insights
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right Controls: Mobile Links + Minimal Sliding Theme Switch + Free Audit CTA */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="#projects"
              className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Projects
            </a>
            <a
              href="#insights"
              className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Insights
            </a>
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
            onClick={onAuditClick}
            className="cursor-pointer rounded-full bg-[var(--text-primary)] px-4.5 py-2 font-mono-label text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--bg-stage)] transition-all duration-200 hover:bg-[#e89b3c] hover:text-[#08080a] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            Free Audit
          </button>
        </div>
      </nav>
    </header>
  );
}
