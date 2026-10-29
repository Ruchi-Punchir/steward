"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";

export default function HomePage() {
  const [activeDialog, setActiveDialog] = useState<
    "audit" | "conversation" | null
  >(null);

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar onAuditClick={() => setActiveDialog("audit")} />

      <main>
        <HeroSection
          onAuditClick={() => setActiveDialog("audit")}
          onConversationClick={() => setActiveDialog("conversation")}
        />
      </main>

      {/* Accessible lightweight dialog for Free Audit / Start the conversation CTA clicks */}
      {activeDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cta-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[var(--bg-panel)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-label text-xs uppercase tracking-widest text-[#e89b3c]">
                {activeDialog === "audit" ? "Free Audit" : "Direct Line"}
              </span>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                aria-label="Close dialog"
                className="cursor-pointer rounded bg-[var(--btn-secondary-bg)] px-2.5 py-1 font-mono-label text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[#e89b3c]"
              >
                ESC
              </button>
            </div>

            <h2
              id="cta-dialog-title"
              className="mt-3 text-2xl font-bold text-[var(--text-primary)]"
            >
              {activeDialog === "audit"
                ? "Let's see why it isn't selling."
                : "Tell us what you're building."}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {activeDialog === "audit"
                ? "Send us your URL or repo. Two founders will look through your funnel, onboarding, and pricing and tell you where the leak is."
                : "No account managers and no handoffs. You talk directly to the two people who do the work."}
            </p>

            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setActiveDialog(null);
              }}
            >
              <div>
                <label
                  htmlFor="founder-email"
                  className="block font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Your email
                </label>
                <input
                  id="founder-email"
                  type="email"
                  required
                  placeholder="you@product.com"
                  className="mt-1 w-full rounded-lg bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-2 focus:outline-[#e89b3c]"
                />
              </div>
              <div>
                <label
                  htmlFor="product-url"
                  className="block font-mono-label text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Product link or one-line summary
                </label>
                <input
                  id="product-url"
                  type="text"
                  required
                  placeholder="https://yourapp.com"
                  className="mt-1 w-full rounded-lg bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-2 focus:outline-[#e89b3c]"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-full bg-[#e89b3c] py-2.5 font-mono-label text-xs font-semibold uppercase tracking-wider text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
              >
                {activeDialog === "audit"
                  ? "Request free audit"
                  : "Send message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
