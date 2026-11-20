"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  AD_LANDING_PAGES,
  type AdLandingPageConfig,
  type AdRouteSlug,
} from "@/data/adLandingPages";
import {
  getStewardAttributionSnapshot,
  type StewardAttributionPayload,
} from "@/lib/attribution";

interface AdLandingPageProps {
  slug: AdRouteSlug;
}

export default function AdLandingPage({ slug }: AdLandingPageProps) {
  const config: AdLandingPageConfig = AD_LANDING_PAGES[slug];
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Form states
  const [email, setEmail] = useState("");
  const [productLink, setProductLink] = useState("");
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const sf of config.formSection.selectFields) {
      initial[sf.name] = sf.options[0] ?? "";
    }
    return initial;
  });
  const [textareaValue, setTextareaValue] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const scrollToForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById("lead-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      nextErrors.email = "Please enter a valid work email address.";
    }

    if (config.formSection.urlField.required && !productLink.trim()) {
      nextErrors.product_link = "Please enter your website or app URL.";
    }

    for (const sf of config.formSection.selectFields) {
      if (sf.required && !selectValues[sf.name]?.trim()) {
        nextErrors[sf.name] = `Please select ${sf.label.toLowerCase()}.`;
      }
    }

    if (
      config.formSection.textareaField?.required &&
      !textareaValue.trim()
    ) {
      nextErrors[config.formSection.textareaField.name] =
        "Please share a brief note on what is breaking.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const attributionPayload: StewardAttributionPayload =
        getStewardAttributionSnapshot();

      const formFields: Record<string, string> = {
        email: email.trim(),
        product_link: productLink.trim(),
        ...selectValues,
      };

      if (config.formSection.textareaField) {
        formFields[config.formSection.textareaField.name] = textareaValue.trim();
      }

      const postPayload = {
        ...formFields,
        ...attributionPayload,
        lead_type: slug,
        honeypot,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postPayload),
      });

      const responseData = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        id?: string;
        lead_id?: string;
        error?: string;
      };

      if (res.status !== 200 || !res.ok || !responseData.success) {
        setGeneralError(
          responseData.error ||
            "Something went wrong on our end. Please try again or email connect@hellosteward.agency.",
        );
        setIsSubmitting(false);
        return;
      }

      // Only on HTTP 200 OK, push conversion event to window.dataLayer
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "steward_lead_submitted",
          lead_id:
            responseData.lead_id ||
            responseData.id ||
            (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : `lead-${Date.now()}`),
          lead_type: slug,
          user_data: {
            email: formFields.email.trim().toLowerCase(),
          },
        });
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setGeneralError(
        "Something went wrong on our end. Please try again or email connect@hellosteward.agency.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      {/* =====================================================================
          1. MINIMAL AD HEADER
          Steward logo + theme toggle + 1 primary CTA button (scrolls to #lead-form).
          Zero standard navbar links so paid traffic stays focused.
      ===================================================================== */}
      <header
        className="sticky top-0 z-50 w-full border-b border-[var(--border-hairline)] backdrop-blur-md transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-nav)" }}
      >
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 px-4 py-3.5 sm:px-8 lg:px-14">
          {/* Non-distracting Wordmark */}
          <div className="flex shrink-0 items-center select-none">
            <span className="flex flex-col items-start leading-none">
              <span className="font-mono-label text-[7.5px] font-medium uppercase tracking-[0.3em] text-[#e89b3c] sm:text-[8.5px] sm:tracking-[0.32em]">
                Hello
              </span>
              <span className="mt-0.5 text-xs font-semibold tracking-[0.22em] text-[var(--text-primary)] sm:text-sm sm:tracking-[0.26em]">
                STEWARD
              </span>
            </span>
          </div>

          {/* Right Controls: Theme Toggle + Single Primary CTA */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
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

            <a
              href="#lead-form"
              onClick={scrollToForm}
              className="whitespace-nowrap rounded-full bg-[#e89b3c] px-3.5 py-2 font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] text-[#08080a] transition-colors duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.16em]"
            >
              {config.headerCtaLabel} →
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ===================================================================
            2. HERO SECTION
            Eyebrow, H1, Subheadline, Primary CTA, Micro-copy + Lightweight Diagnostic Card
        =================================================================== */}
        <section className="relative overflow-hidden border-b border-[var(--border-hairline)] py-12 sm:py-16 lg:py-24">
          <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-14">
            {/* Left 7 Cols: High-Intent Value Proposition */}
            <div className="flex flex-col items-start text-left lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#e89b3c]" />
                <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c] sm:text-[11px] sm:tracking-[0.22em]">
                  {config.eyebrow}
                </span>
              </div>

              <h1 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.35rem] xl:text-[3.65rem]">
                {config.h1}{" "}
                <span className="font-serif-editorial mt-1 block text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c]">
                  {config.h1Accent}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-[1.65] text-[var(--text-secondary)] sm:text-[17px]">
                {config.subheadline}
              </p>

              <div className="mt-8 flex w-full flex-col items-start gap-3 sm:w-auto">
                <a
                  href="#lead-form"
                  onClick={scrollToForm}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#e89b3c] px-7 py-4 text-center font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#08080a] shadow-[0_10px_28px_rgba(232,155,60,0.3)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] sm:w-auto sm:px-9"
                >
                  <span>{config.primaryCta}</span>
                  <span aria-hidden="true">→</span>
                </a>

                <p className="font-mono-label text-[11px] leading-relaxed tracking-[0.04em] text-[var(--text-muted)]">
                  {config.microCopy}
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Lightweight Static Visual Diagnostic Card (0 CLS, instant render) */}
            <div className="w-full lg:col-span-5">
              <div
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isLight
                    ? "border-black/10 bg-[#eae5dc] shadow-[0_20px_50px_rgba(20,20,19,0.07)]"
                    : "border-white/[0.08] bg-[#101015] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3.5">
                  <span className="font-mono-label text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:text-[10px]">
                    {config.diagnosticCard.headerLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-2.5 py-0.5 font-mono-label text-[9px] font-semibold uppercase tracking-[0.14em] text-[#10b981]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    {config.diagnosticCard.liveBadge}
                  </span>
                </div>

                <div className="mt-4">
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-lg">
                    {config.diagnosticCard.title}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {config.diagnosticCard.subtitle}
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  {config.diagnosticCard.metrics.map((m) => (
                    <div
                      key={m.label}
                      className={`rounded-xl border p-3.5 ${
                        isLight
                          ? "border-black/10 bg-[#fbf9f5]"
                          : "border-white/[0.07] bg-[#16161d]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[var(--text-primary)] sm:text-sm">
                          {m.label}
                        </span>
                        <span className="shrink-0 rounded bg-[#10b981]/15 px-2 py-0.5 font-mono-label text-[9px] font-semibold uppercase tracking-[0.12em] text-[#10b981]">
                          {m.statusTag}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2 sm:gap-2">
                        <div className="flex items-start gap-1.5 text-[var(--text-muted)]">
                          <span className="font-mono-label text-[10px] uppercase text-[#ff383c]">
                            Before:
                          </span>
                          <span className="leading-snug">{m.before}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[var(--text-primary)]">
                          <span className="font-mono-label text-[10px] uppercase text-[#10b981]">
                            After:
                          </span>
                          <span className="font-medium leading-snug">
                            {m.after}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border-hairline)] pt-3">
                  <span className="font-mono-label text-[10px] tracking-[0.04em] text-[var(--text-secondary)]">
                    {config.diagnosticCard.footerNote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. THE COMMERCIAL REALITY CHECK (3 High-Impact Pain Points)
        =================================================================== */}
        <section className="border-b border-[var(--border-hairline)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14">
            <div className="max-w-2xl">
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                {config.realitySection.eyebrow}
              </span>
              <h2 className="mt-2.5 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
                {config.realitySection.headline}{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  {config.realitySection.headlineAccent}
                </span>
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 sm:mt-10 sm:gap-6">
              {config.realitySection.bullets.map((bullet, idx) => (
                <div
                  key={bullet.title}
                  className={`flex flex-col justify-between rounded-2xl border p-5 sm:p-6 ${
                    isLight
                      ? "border-black/10 bg-[#f6f3ec]"
                      : "border-white/[0.08] bg-[#101015]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                        0{idx + 1} / Bottleneck
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff383c]" />
                    </div>

                    <h3 className="mt-3.5 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                      {bullet.title}
                    </h3>

                    <p className="mt-2 text-sm leading-[1.65] text-[var(--text-secondary)]">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. WHAT WE FIX / ENGINEER / OPTIMIZE (4 Concrete Deliverable Cards)
        =================================================================== */}
        <section className="border-b border-[var(--border-hairline)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14">
            <div className="max-w-2xl">
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                {config.deliverablesSection.eyebrow}
              </span>
              <h2 className="mt-2.5 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
                {config.deliverablesSection.headline}{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  {config.deliverablesSection.headlineAccent}
                </span>
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
              {config.deliverablesSection.cards.map((card) => (
                <div
                  key={card.code}
                  className={`flex flex-col justify-between rounded-2xl border p-5 sm:p-7 ${
                    isLight
                      ? "border-black/10 bg-[#fbf9f5]"
                      : "border-white/[0.08] bg-[#111116]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                      <span className="font-mono-label text-xs font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
                        Unit {card.code}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-sm leading-[1.65] text-[var(--text-secondary)]">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[var(--border-hairline)] pt-3.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#e89b3c]/35 bg-[#e89b3c]/10 px-2.5 py-0.5 font-mono-label text-[10px] font-medium text-[var(--text-primary)]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#e89b3c]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. HOW IT WORKS (3 Numbered Steps)
        =================================================================== */}
        <section className="border-b border-[var(--border-hairline)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14">
            <div className="max-w-2xl">
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                {config.howItWorksSection.eyebrow}
              </span>
              <h2 className="mt-2.5 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
                {config.howItWorksSection.headline}{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  {config.howItWorksSection.headlineAccent}
                </span>
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 sm:mt-10 sm:gap-6">
              {config.howItWorksSection.steps.map((st) => (
                <div
                  key={st.step}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 sm:p-6 ${
                    isLight
                      ? "border-black/10 bg-[#f6f3ec]"
                      : "border-white/[0.08] bg-[#101015]"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono-label text-3xl font-light leading-none text-[#e89b3c]">
                        {st.step}.
                      </span>
                      <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                        {st.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-[1.65] text-[var(--text-secondary)]">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. PRICING COMPARISON TABLE (id="pricing")
            Founder-perspective copy ("We're responsible for", "We stay").
            Zero horizontal overflow on 375px mobile viewports.
        =================================================================== */}
        <section
          id="pricing"
          className="border-b border-[var(--border-hairline)] py-14 sm:py-20"
        >
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14">
            <div className="max-w-2xl">
              <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                {config.pricingSection.eyebrow}
              </span>
              <h2 className="mt-2.5 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
                {config.pricingSection.headline}{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  {config.pricingSection.headlineAccent}
                </span>
              </h2>
              <p className="mt-3 text-sm leading-[1.65] text-[var(--text-secondary)] sm:text-base">
                {config.pricingSection.subline}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 sm:mt-10">
              {config.pricingSection.columns.map((col) => {
                const isHighlighted = Boolean(col.highlighted);
                return (
                  <div
                    key={col.key}
                    className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors sm:p-7 ${
                      isHighlighted
                        ? isLight
                          ? "border-[#e89b3c] bg-[#fbf9f5] ring-1 ring-[#e89b3c]/40 shadow-[0_18px_45px_rgba(232,155,60,0.12)]"
                          : "border-[#e89b3c]/70 bg-[#121218] ring-1 ring-[#e89b3c]/30 shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
                        : isLight
                          ? "border-black/10 bg-[#f6f3ec]"
                          : "border-white/[0.08] bg-[#0e0e13]"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono-label text-[9.5px] font-semibold uppercase tracking-[0.16em] ${
                            isHighlighted
                              ? "bg-[#e89b3c] text-[#08080a]"
                              : isLight
                                ? "bg-black/[0.06] text-[var(--text-secondary)]"
                                : "bg-white/[0.06] text-[var(--text-secondary)]"
                          }`}
                        >
                          {col.badge}
                        </span>
                        <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          {col.key === "project"
                            ? "100% Guaranteed"
                            : "60% Base / 40% At Risk"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-hairline)] pb-5">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-3xl">
                            {col.title}
                          </h3>
                          <p className="mt-1 font-mono-label text-[11px] text-[var(--text-secondary)]">
                            {col.rateSub}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-mono-label text-3xl font-semibold tracking-tight text-[#e89b3c] sm:text-4xl">
                            {col.rate}
                          </span>
                        </div>
                      </div>

                      <dl className="mt-5 divide-y divide-[var(--border-hairline)]">
                        {col.rows.map((row) => (
                          <div key={row.label} className="py-3.5 first:pt-0 last:pb-0">
                            <dt className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c]">
                              {row.label}
                            </dt>
                            <dd className="mt-1 text-sm leading-[1.6] text-[var(--text-primary)]">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="mt-6 border-t border-[var(--border-hairline)] pt-5">
                      <a
                        href="#lead-form"
                        onClick={scrollToForm}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                          isHighlighted
                            ? "bg-[#e89b3c] text-[#08080a] hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
                            : isLight
                              ? "border border-black/20 bg-transparent text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                              : "border border-white/15 bg-transparent text-[var(--text-primary)] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                        }`}
                      >
                        <span>{config.primaryCta}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            7. LEAD CAPTURE SECTION (id="lead-form")
            Route-specific form wired to /api/leads + GTM conversion push on 200 OK
        =================================================================== */}
        <section id="lead-form" className="scroll-mt-16 py-14 sm:py-24">
          <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-14">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left 5 Cols: Reassurance & Direct Engineering Process */}
              <div className="lg:col-span-5">
                <span className="font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                  {config.formSection.eyebrow}
                </span>
                <h2 className="mt-2.5 text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
                  {config.formSection.headline}{" "}
                  <span className="font-serif-editorial block font-normal italic text-[#e89b3c]">
                    {config.formSection.headlineAccent}
                  </span>
                </h2>
                <p className="mt-3.5 text-sm leading-[1.65] text-[var(--text-secondary)] sm:text-base">
                  {config.formSection.subline}
                </p>

                <div
                  className={`mt-6 rounded-2xl border p-5 ${
                    isLight
                      ? "border-black/10 bg-[#f6f3ec]"
                      : "border-white/[0.08] bg-[#101015]"
                  }`}
                >
                  <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10b981]">
                    ● Direct Engineering Review
                  </span>
                  <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e89b3c]" />
                      <span>
                        Reviewed directly by senior product engineers—never Junior account reps.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e89b3c]" />
                      <span>
                        Clear written findings and next steps within 24 hours.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e89b3c]" />
                      <span>
                        No cost, no obligation. You keep everything we find.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right 7 Cols: Route-Specific Form Card */}
              <div className="lg:col-span-7">
                <div
                  className={`rounded-2xl border p-5 sm:p-8 ${
                    isLight
                      ? "border-black/10 bg-[#fbf9f5] shadow-[0_20px_50px_rgba(20,20,19,0.06)]"
                      : "border-white/[0.09] bg-[#111116] shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
                  }`}
                >
                  {isSuccess ? (
                    <div className="py-6">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-3.5 py-1">
                        <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                        <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10b981]">
                          Request Confirmed
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-3xl">
                        {config.formSection.successHeadline}
                      </h3>

                      <p className="mt-3 text-sm leading-[1.65] text-[var(--text-secondary)] sm:text-base">
                        {config.formSection.successMessage}
                      </p>

                      <div className="mt-6 border-t border-[var(--border-hairline)] pt-5">
                        <p className="font-mono-label text-xs text-[var(--text-muted)]">
                          Confirmation sent to{" "}
                          <strong className="text-[var(--text-primary)]">
                            {email}
                          </strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      {/* Hidden Honeypot */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
                      >
                        <input
                          id="steward_bot_trap_field"
                          name="steward_bot_trap_field"
                          type="text"
                          tabIndex={-1}
                          autoComplete="new-password"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>

                      {generalError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-red-500/45 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400 sm:text-sm"
                        >
                          {generalError}
                        </div>
                      )}

                      {/* Work Email + Product/Website URL */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="ad-lead-email"
                            className="block font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                          >
                            Work Email *
                          </label>
                          <input
                            id="ad-lead-email"
                            name="email"
                            type="email"
                            required
                            maxLength={200}
                            disabled={isSubmitting}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) {
                                setErrors((prev) => ({ ...prev, email: "" }));
                              }
                            }}
                            placeholder="founder@yourcompany.com"
                            className={`mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 transition-colors focus:border-[#e89b3c] focus:outline-none ${
                              isLight
                                ? "border-black/15 bg-white"
                                : "border-white/12 bg-[#0a0a0e]"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="ad-lead-url"
                            className="block font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                          >
                            {config.formSection.urlField.label}
                          </label>
                          <input
                            id="ad-lead-url"
                            name="product_link"
                            type="text"
                            required={config.formSection.urlField.required}
                            maxLength={500}
                            disabled={isSubmitting}
                            value={productLink}
                            onChange={(e) => {
                              setProductLink(e.target.value);
                              if (errors.product_link) {
                                setErrors((prev) => ({
                                  ...prev,
                                  product_link: "",
                                }));
                              }
                            }}
                            placeholder={config.formSection.urlField.placeholder}
                            className={`mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 transition-colors focus:border-[#e89b3c] focus:outline-none ${
                              isLight
                                ? "border-black/15 bg-white"
                                : "border-white/12 bg-[#0a0a0e]"
                            }`}
                          />
                          {errors.product_link && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors.product_link}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Route-Specific Select Pill/Dropdown Fields */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {config.formSection.selectFields.map((sf) => (
                          <div key={sf.name}>
                            <label
                              htmlFor={`ad-field-${sf.name}`}
                              className="block font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                            >
                              {sf.label} {sf.required ? "*" : ""}
                            </label>
                            <select
                              id={`ad-field-${sf.name}`}
                              name={sf.name}
                              disabled={isSubmitting}
                              value={selectValues[sf.name] ?? ""}
                              onChange={(e) =>
                                setSelectValues((prev) => ({
                                  ...prev,
                                  [sf.name]: e.target.value,
                                }))
                              }
                              className={`mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm text-[var(--text-primary)] transition-colors focus:border-[#e89b3c] focus:outline-none ${
                                isLight
                                  ? "border-black/15 bg-white"
                                  : "border-white/12 bg-[#0a0a0e]"
                              }`}
                            >
                              {sf.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            {errors[sf.name] && (
                              <p className="mt-1 text-xs text-red-400">
                                {errors[sf.name]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Optional Textarea Field (e.g. /mvp-rescue "What is breaking right now?") */}
                      {config.formSection.textareaField && (
                        <div>
                          <label
                            htmlFor={`ad-field-${config.formSection.textareaField.name}`}
                            className="block font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                          >
                            {config.formSection.textareaField.label}{" "}
                            {config.formSection.textareaField.required ? "*" : ""}
                          </label>
                          <textarea
                            id={`ad-field-${config.formSection.textareaField.name}`}
                            name={config.formSection.textareaField.name}
                            rows={3}
                            maxLength={1000}
                            disabled={isSubmitting}
                            value={textareaValue}
                            onChange={(e) => {
                              setTextareaValue(e.target.value);
                              const fieldName =
                                config.formSection.textareaField?.name;
                              if (fieldName && errors[fieldName]) {
                                setErrors((prev) => ({
                                  ...prev,
                                  [fieldName]: "",
                                }));
                              }
                            }}
                            placeholder={
                              config.formSection.textareaField.placeholder
                            }
                            className={`mt-1.5 w-full resize-y rounded-xl border px-3.5 py-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 transition-colors focus:border-[#e89b3c] focus:outline-none ${
                              isLight
                                ? "border-black/15 bg-white"
                                : "border-white/12 bg-[#0a0a0e]"
                            }`}
                          />
                          {errors[config.formSection.textareaField.name] && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors[config.formSection.textareaField.name]}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#e89b3c] px-8 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] shadow-[0_10px_28px_rgba(232,155,60,0.3)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] disabled:cursor-wait disabled:opacity-60"
                        >
                          <span>
                            {isSubmitting
                              ? "Sending..."
                              : config.formSection.submitButton}
                          </span>
                          <span aria-hidden="true">→</span>
                        </button>

                        <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
                          By submitting, you agree to our{" "}
                          <Link
                            href="/privacy"
                            className="underline decoration-[#e89b3c]/70 underline-offset-4 hover:text-[var(--text-primary)]"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          8. MINIMAL FOOTER
          Copyright © 2026 HELLO STEWARD + Privacy Policy link only.
      ===================================================================== */}
      <footer className="border-t border-[var(--border-hairline)] py-6">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-8 lg:px-14">
          <p className="font-mono-label text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            © 2026 HELLO STEWARD · ALL RIGHTS RESERVED
          </p>
          <Link
            href="/privacy"
            className="font-mono-label text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c]"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
