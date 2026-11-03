"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdminAction } from "@/app/admin/actions";
import type { AuthenticatedAdmin } from "@/lib/admin/auth";

interface AdminShellProps {
  admin: AuthenticatedAdmin;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f4f0ea]">
      {/* Simple, clean top navigation bar — works on mobile and desktop */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0c0c10]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          {/* Left: Brand + Two Nav Items (Leads, Blog) */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 text-[#f4f0ea]"
            >
              <span className="h-2 w-2 rounded-full bg-[#e89b3c]" />
              <span className="flex flex-col leading-none">
                <span className="font-mono-label text-[8px] font-medium uppercase tracking-[0.32em] text-[#e89b3c]">
                  Hello
                </span>
                <span className="mt-0.5 font-mono-label text-xs font-semibold tracking-[0.22em] text-[#f4f0ea]">
                  STEWARD
                </span>
              </span>
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
                        ? "bg-[#e89b3c] font-semibold text-[#08080a]"
                        : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Active Admin Identity + Sign out / Sign out everywhere */}
          <div className="flex items-center gap-3 sm:gap-4">
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
