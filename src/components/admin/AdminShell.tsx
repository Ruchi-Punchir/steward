"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdminAction } from "@/app/admin/actions";
import type { AuthenticatedAdmin } from "@/lib/admin/auth";
import { useTheme } from "@/context/ThemeContext";
import StewardLogo from "@/components/StewardLogo";

interface AdminShellProps {
  admin: AuthenticatedAdmin;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/campaigns", label: "Ad Campaigns" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="admin-theme-root min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Simple, clean top navigation bar — works on mobile and desktop */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0c0c10]/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          {/* Left: Brand + Nav Items (Leads, Ad Campaigns, Blog) */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2.5 text-[#f4f0ea]"
            >
              <StewardLogo className="h-5 w-auto sm:h-6" />
              <span className="font-mono-label text-xs text-[#66635c]">/</span>
              <span className="font-mono-label text-xs tracking-[0.22em] text-[#a09c94]">
                ADMIN
              </span>
            </Link>

            <nav aria-label="Admin navigation" className="flex items-center gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 font-mono-label text-xs uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? "bg-[#e89b3c] font-semibold !text-[#08080a]"
                        : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Theme Switch + Active Admin Identity + Sign out / Sign out everywhere */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Light / Dark Mode Switch */}
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
                    ? "translate-x-5 bg-[#121216] !text-[#f5f2eb] sm:translate-x-7"
                    : "translate-x-0 bg-[#f4f0ea] !text-[#08080a]"
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

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              <span className="font-mono-label text-[11px] text-[#a09c94]">
                {admin.name}
              </span>
            </div>

            <form action={signOutAdminAction} className="inline">
              <input type="hidden" name="scope" value="local" />
              <button
                type="submit"
                className="cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-white/25 hover:bg-white/[0.08]"
              >
                Sign out
              </button>
            </form>

            <form action={signOutAdminAction} className="inline">
              <input type="hidden" name="scope" value="global" />
              <button
                type="submit"
                title="Revoke all active 7-day sessions across all devices"
                className="cursor-pointer font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c] transition-colors hover:text-red-300"
              >
                Sign out everywhere
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
