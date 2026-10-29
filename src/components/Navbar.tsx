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
        className="flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-14 xl:px-20"
      >
        {/* Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-[0.18em] text-[var(--text-primary)] transition-colors hover:text-[#e89b3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
          />
          <span>STEWARD</span>
        </a>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-9 md:flex">
          <li>
            <a
              href="#projects"
              className="font-mono-label text-xs uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#insights"
              className="font-mono-label text-xs uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Insights
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-mono-label text-xs uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right Controls: Mobile Links + Light/Dark Sliding Switch + Free Audit CTA */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="#projects"
              className="font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[#e89b3c]"
            >
              Projects
            </a>
            <a
              href="#insights"
              className="font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[#e89b3c]"
            >
              Insights
            </a>
          </div>

          {/* Light / Dark Mode Sliding Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light and dark theme"
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] ${
              isLight
                ? "bg-[#dcd6c8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]"
                : "bg-[#1c1c24] shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`ml-1 flex h-5 w-5 items-center justify-center transition-opacity duration-200 ${
                isLight ? "opacity-45 text-[#5c584f]" : "opacity-0"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>

            <span
              aria-hidden="true"
              className={`ml-auto mr-1 flex h-5 w-5 items-center justify-center transition-opacity duration-200 ${
                isLight ? "opacity-0" : "opacity-55 text-[#e89b3c]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
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
              className={`pointer-events-none absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 ease-out ${
                isLight
                  ? "translate-x-8 bg-[#e89b3c] text-[#0a0a0d] shadow-[0_2px_8px_rgba(212,122,18,0.5)]"
                  : "translate-x-0 bg-[#2e2e3a] text-[#f4f0ea] shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              }`}
            >
              {isLight ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
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
                  className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onAuditClick}
            className="cursor-pointer rounded-full bg-[#e89b3c] px-4 py-2 font-mono-label text-xs font-semibold uppercase tracking-wider text-[#0a0a0d] shadow-[0_0_20px_rgba(232,155,60,0.28)] transition-all hover:bg-[#f2aa4c] hover:shadow-[0_0_26px_rgba(232,155,60,0.5)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            Free Audit
          </button>
        </div>
      </nav>
    </header>
  );
}
