"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { LEAD_COPY, type LeadStage } from "@/config/leadCopy";
import {
  submitLeadAction,
  type SubmitLeadResult,
} from "@/app/actions/submitLead";
import {
  captureFirstLandingAttribution,
  type FirstLandingAttribution,
} from "@/components/leads/LeadCaptureModal";

const AUDIT_UNITS = [
  {
    code: "01",
    name: "Monetization & Pricing",
    desc: "Paywall friction, tier architecture & willingness-to-pay gaps",
  },
  {
    code: "02",
    name: "Acquisition & Funnel",
    desc: "Ad-to-page message match, traffic quality & landing conversion",
  },
  {
    code: "03",
    name: "Positioning & Clarity",
    desc: "5-second value proposition test & buyer differentiation",
  },
  {
    code: "04",
    name: "Product & Core UX",
    desc: "Workflow friction, feature adoption & dead-end screens",
  },
  {
    code: "05",
    name: "Onboarding & Retention",
    desc: "First-session 'aha' moment, activation drop-offs & churn leaks",
  },
] as const;

const STAGE_CARDS: {
  value: LeadStage;
  title: string;
  tag: string;
  desc: string;
}[] = [
  {
    value: "Live product",
    title: "Live Product",
    tag: "Most Common",
    desc: "Users are visiting or signing up, but conversion or revenue is flat.",
  },
  {
    value: "Idea",
    title: "Pre-Launch / MVP",
    tag: "Early Stage",
    desc: "Building or preparing to launch and want the funnel right from day one.",
  },
  {
    value: "Not sure",
    title: "In Transition / Scaling",
    tag: "Pivoting",
    desc: "Rethinking positioning, pricing, or growth channels after initial traction.",
  },
];

const CONVERSATION_TOPICS = [
  "Full Growth & Product Partnership",
  "Conversion & Funnel Overhaul",
  "Positioning & Pricing Strategy",
  "Product Engineering & UX",
  "General Inquiry",
] as const;

/**
 * =============================================================================
 * 1. DEDICATED FREE AUDIT PAGE (/audit & /contact?intent=audit)
 * Architectural split-screen diagnostic blueprint + interactive builder.
 * =============================================================================
 */
export function DedicatedAuditPage({
  sourceButton = "audit-page",
}: {
  sourceButton?: string;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productLink, setProductLink] = useState("");
  const [stage, setStage] = useState<LeadStage>("Live product");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([
    "Acquisition & Funnel",
    "Onboarding & Retention",
  ]);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<SubmitLeadResult["fieldErrors"]>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [attribution, setAttribution] = useState<FirstLandingAttribution>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referrer: "",
  });
  const [sourcePage, setSourcePage] = useState("/audit");

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const showTurnstileWidget =
    Boolean(turnstileSiteKey) &&
    turnstileSiteKey !== "1x00000000000000000000AA";

  useEffect(() => {
    setAttribution(captureFirstLandingAttribution());
    if (typeof window !== "undefined") {
      setSourcePage(window.location.pathname + window.location.search);
    }
  }, []);

  const toggleUnit = (unitName: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitName)
        ? prev.filter((u) => u !== unitName)
        : [...prev, unitName],
    );
  };

  const validateClient = (): boolean => {
    const errors: NonNullable<SubmitLeadResult["fieldErrors"]> = {};
    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!stage) {
      errors.stage = "Please select your current stage.";
    }
    if (!message.trim()) {
      errors.message = "Please share a short note about what feels stuck.";
    } else if (message.trim().length > 900) {
      errors.message = "Please keep your note under 900 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClient()) return;

    setIsSubmitting(true);
    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const focusPrefix =
        selectedUnits.length > 0
          ? `[Focus Areas: ${selectedUnits.join(", ")}]\n`
          : "";
      const combinedMessage = `${focusPrefix}${message.trim()}`.slice(0, 1000);

      formData.set("intent", "audit");
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("product_link", productLink.trim());
      formData.set("stage", stage);
      formData.set("message", combinedMessage);
      formData.set("source_button", sourceButton || "audit-page");
      formData.set("source_page", sourcePage || "/audit");
      formData.set("utm_source", attribution.utm_source);
      formData.set("utm_medium", attribution.utm_medium);
      formData.set("utm_campaign", attribution.utm_campaign);
      formData.set("referrer", attribution.referrer);
      formData.set("steward_bot_trap_field", honeypot);

      const res = await submitLeadAction(formData);
      if (!res.success) {
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        setGeneralError(res.error ?? LEAD_COPY.common.genericError);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setGeneralError(LEAD_COPY.common.genericError);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      {showTurnstileWidget && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <Navbar />

      <main className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-24 lg:pt-36 lg:pb-32">
        {/* Subtle Architectural Background Glow & Grid Lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[15%] top-24 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.08)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] bottom-16 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 sm:px-8 lg:px-16 xl:px-24">
          {/* Top Breadcrumb + Mode Switcher */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3 sm:mb-6 sm:pb-4 lg:mb-12 lg:gap-4 lg:pb-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]" />
              <span className="font-mono-label text-[9.5px] uppercase tracking-[0.2em] text-[#e89b3c] sm:text-[10.5px] lg:text-[11px] lg:tracking-[0.24em]">
                01 / Diagnostic Teardown
              </span>
              <span className="hidden text-[var(--text-muted)] sm:inline">·</span>
              <span className="hidden font-mono-label text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:inline lg:text-[11px]">
                Free Product &amp; Funnel Audit
              </span>
            </div>

            <Link
              href="/talk"
              className="group inline-flex items-center gap-1.5 font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c] sm:text-[10.5px] lg:gap-2 lg:text-[11px] lg:tracking-[0.18em]"
            >
              <span className="sm:hidden">Talk to us</span>
              <span className="hidden sm:inline">
                Want to skip straight to a conversation? Talk to us
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {isSuccess ? (
            /* ===============================================================
               MODERN FULL-BLEED CONFIRMATION EXPERIENCE
            =============================================================== */
            <div className="py-12 lg:py-20">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-4 py-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
                <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#10b981]">
                  Diagnostic Queued · #{name.slice(0, 3).toUpperCase() || "STW"}
                  -05
                </span>
              </div>

              <h1 className="mt-6 max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                {LEAD_COPY.audit.successHeadline}
              </h1>

              <p className="mt-6 max-w-[580px] text-base leading-[1.7] text-[var(--text-secondary)] sm:text-lg">
                {LEAD_COPY.audit.successMessage}
              </p>

              <div className="mt-12 grid max-w-3xl grid-cols-1 gap-6 border-t border-[var(--border-hairline)] pt-8 sm:grid-cols-3">
                <div>
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
                    Step 01
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
                    Funnel &amp; UX Inspection
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    We review your product and acquisition flow to spot
                    conversion bottlenecks.
                  </p>
                </div>
                <div>
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
                    Step 02
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
                    Prioritized Leak Breakdown
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    You get a clear breakdown of what is costing you conversions
                    and how to fix it.
                  </p>
                </div>
                <div>
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#10b981]">
                    Step 03
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
                    Next Steps
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    We’ll reach out to you if we need anything else along the
                    way.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 rounded-full bg-[#e89b3c] px-8 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] transition-all hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
                >
                  <span>← Back to Steward</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ===============================================================
               SPLIT ARCHITECTURAL LAYOUT:
               LEFT (5 Cols): Editorial Teardown Scope & 5-Unit Spec
               RIGHT (7 Cols): Interactive Step-by-Step Diagnostic Composer
            =============================================================== */
            <div className="grid grid-cols-1 items-start gap-5 sm:gap-7 lg:grid-cols-12 lg:gap-12 xl:gap-20">
              {/* LEFT COLUMN: Editorial Context & 5-Unit Teardown Blueprint */}
              <div className="lg:sticky lg:top-32 lg:col-span-5">
                <h1 className="text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-3xl lg:text-5xl lg:leading-[1.04] xl:text-[3.65rem]">
                  Let’s see where the{" "}
                  <span className="font-serif-editorial inline text-[1.06em] font-normal italic tracking-[-0.015em] text-[#e89b3c] lg:block">
                    biggest leak is.
                  </span>
                </h1>

                <p className="mt-2 text-xs leading-[1.55] text-[var(--text-secondary)] sm:text-sm lg:mt-6 lg:text-[17px] lg:leading-[1.7]">
                  Send us your product and where things feel stuck. We’ll review
                  your funnel, positioning, and onboarding to send back a clear,
                  prioritized breakdown and we will reach out to you if we need
                  anything else.
                </p>

                {/* 5-Unit Diagnostic Scope Ledger (Hidden on mobile & tablet so form is immediately visible above the fold; shown on Desktop lg+) */}
                <div className="mt-10 hidden lg:block">
                  <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                    <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e89b3c]">
                      What We Inspect (5-Unit Teardown)
                    </span>
                    <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Included Free
                    </span>
                  </div>

                  <div className="divide-y divide-[var(--border-hairline)]">
                    {AUDIT_UNITS.map((unit) => {
                      const isSelected = selectedUnits.includes(unit.name);
                      return (
                        <div
                          key={unit.code}
                          onClick={() => toggleUnit(unit.name)}
                          className="group flex cursor-pointer items-start justify-between gap-4 py-3.5 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            <span
                              className={`mt-0.5 font-mono-label text-xs font-semibold transition-colors ${
                                isSelected
                                  ? "text-[#e89b3c]"
                                  : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                              }`}
                            >
                              {unit.code}
                            </span>
                            <div>
                              <h2 className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)] group-hover:text-[#e89b3c]">
                                {unit.name}
                              </h2>
                              <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                                {unit.desc}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`mt-1 inline-flex h-5 items-center rounded-full border px-2 font-mono-label text-[9px] uppercase tracking-[0.14em] transition-all ${
                              isSelected
                                ? "border-[#e89b3c] bg-[#e89b3c]/15 text-[#e89b3c]"
                                : "border-[var(--border-hairline)] text-[var(--text-muted)] opacity-60 group-hover:opacity-100"
                            }`}
                          >
                            {isSelected ? "Selected" : "+ Focus"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Note Strip (Desktop lg+) */}
                <div className="mt-8 hidden border-t border-[var(--border-hairline)] pt-5 lg:block">
                  <p className="font-mono-label text-[11px] leading-relaxed tracking-[0.04em] text-[var(--text-muted)]">
                    No cost, no strings. You keep everything we find.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Modern Interactive Diagnostic Composer (Zero Modal Box) */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5 sm:space-y-7 lg:space-y-12"
                >
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
                      className="rounded-xl border border-red-500/45 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400"
                    >
                      {generalError}
                    </div>
                  )}

                  {/* =========================================================
                      SECTION 01: PRODUCT STAGE (Interactive Tactile Cards)
                  ========================================================= */}
                  <div>
                    <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-2 lg:pb-3">
                      <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c] lg:text-xs lg:tracking-[0.2em]">
                        01 / Where is your product today? *
                      </span>
                      <span className="font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-muted)] lg:text-[10px]">
                        Select One
                      </span>
                    </div>

                    <input type="hidden" name="stage" value={stage} />

                    <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3.5 lg:mt-5">
                      {STAGE_CARDS.map((card) => {
                        const active = stage === card.value;
                        return (
                          <button
                            key={card.value}
                            type="button"
                            onClick={() => {
                              setStage(card.value);
                              if (fieldErrors.stage) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  stage: undefined,
                                }));
                              }
                            }}
                            className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-2.5 text-left transition-all duration-200 sm:rounded-2xl sm:p-3.5 lg:p-4 ${
                              active
                                ? isLight
                                  ? "border-[#e89b3c] bg-[#e89b3c]/12 shadow-[0_10px_25px_rgba(232,155,60,0.14)]"
                                  : "border-[#e89b3c] bg-[#e89b3c]/[0.09] shadow-[0_12px_30px_rgba(232,155,60,0.12)]"
                                : isLight
                                  ? "border-black/10 bg-black/[0.02] hover:border-black/25"
                                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                            }`}
                          >
                            <div className="flex w-full items-center justify-between gap-1 sm:gap-2">
                              <span
                                className={`truncate font-mono-label text-[8px] uppercase tracking-[0.12em] sm:text-[9px] sm:tracking-[0.16em] ${
                                  active
                                    ? "font-semibold text-[#e89b3c]"
                                    : "text-[var(--text-muted)]"
                                }`}
                              >
                                {card.tag}
                              </span>
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all sm:h-2 sm:w-2 ${
                                  active
                                    ? "bg-[#e89b3c] shadow-[0_0_8px_#e89b3c]"
                                    : "bg-current/20"
                                }`}
                              />
                            </div>

                            <div className="mt-1.5 sm:mt-2.5 lg:mt-3">
                              <span className="block text-xs font-semibold leading-snug tracking-[-0.01em] text-[var(--text-primary)] sm:text-sm lg:text-base">
                                {card.title}
                              </span>
                              <p className="mt-1 hidden text-xs leading-relaxed text-[var(--text-secondary)] sm:block">
                                {card.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {fieldErrors.stage && (
                      <p className="mt-2 text-xs text-red-400">
                        {fieldErrors.stage}
                      </p>
                    )}
                  </div>

                  {/* =========================================================
                      SECTION 02: PRIORITY BOTTLENECKS (Interactive Chip Selector)
                  ========================================================= */}
                  <div>
                    <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-2 lg:pb-3">
                      <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c] lg:text-xs lg:tracking-[0.2em]">
                        02 / Which units should we inspect closest?
                      </span>
                      <span className="font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-muted)] lg:text-[10px]">
                        Optional · Multi-Select
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 lg:mt-5 lg:gap-2.5">
                      {AUDIT_UNITS.map((unit) => {
                        const active = selectedUnits.includes(unit.name);
                        return (
                          <button
                            key={unit.code}
                            type="button"
                            onClick={() => toggleUnit(unit.name)}
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono-label text-[10px] tracking-[0.06em] transition-all duration-200 sm:px-3.5 sm:py-1.5 lg:gap-2 lg:px-4 lg:py-2 lg:text-[11px] lg:tracking-[0.08em] ${
                              active
                                ? "border-[#e89b3c] bg-[#e89b3c] font-semibold text-[#08080a] shadow-[0_4px_16px_rgba(232,155,60,0.3)]"
                                : isLight
                                  ? "border-black/12 bg-black/[0.02] text-[var(--text-primary)] hover:border-[#e89b3c]"
                                  : "border-white/10 bg-white/[0.03] text-[var(--text-primary)] hover:border-[#e89b3c]"
                            }`}
                          >
                            <span className="opacity-65">#{unit.code}</span>
                            <span>{unit.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* =========================================================
                      SECTION 03: PRODUCT URL & FOUNDER DETAILS (Editorial Underline Inputs)
                  ========================================================= */}
                  <div>
                    <div className="flex items-baseline justify-between border-b border-[var(--border-hairline)] pb-2 lg:pb-3">
                      <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c] lg:text-xs lg:tracking-[0.2em]">
                        03 / Your Product &amp; Where to Send the Teardown
                      </span>
                    </div>

                    <div className="mt-4 space-y-4 sm:space-y-6 lg:mt-6 lg:space-y-8">
                      {/* Product URL — Big Architectural Underline Input */}
                      <div>
                        <label
                          htmlFor="audit-product-link"
                          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                        >
                          Product URL or App Link (Optional)
                        </label>
                        <input
                          id="audit-product-link"
                          name="product_link"
                          type="text"
                          maxLength={500}
                          disabled={isSubmitting}
                          value={productLink}
                          onChange={(e) => setProductLink(e.target.value)}
                          placeholder="https://yourproduct.com"
                          className="mt-1.5 w-full border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-base font-medium tracking-tight text-[var(--text-primary)] placeholder-[var(--text-muted)]/45 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-xl lg:mt-2 lg:pb-3 lg:text-2xl"
                        />
                        {fieldErrors.product_link && (
                          <p className="mt-1.5 text-xs text-red-400">
                            {fieldErrors.product_link}
                          </p>
                        )}
                      </div>

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        <div>
                          <label
                            htmlFor="audit-name"
                            className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                          >
                            Your Name *
                          </label>
                          <input
                            id="audit-name"
                            name="name"
                            type="text"
                            required
                            maxLength={120}
                            disabled={isSubmitting}
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (fieldErrors.name) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  name: undefined,
                                }));
                              }
                            }}
                            placeholder="Alex Rivera"
                            className="mt-1.5 w-full border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-base font-medium tracking-tight text-[var(--text-primary)] placeholder-[var(--text-muted)]/45 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-lg lg:mt-2 lg:pb-3 lg:text-xl"
                          />
                          {fieldErrors.name && (
                            <p className="mt-1.5 text-xs text-red-400">
                              {fieldErrors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="audit-email"
                            className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                          >
                            Work or Founder Email *
                          </label>
                          <input
                            id="audit-email"
                            name="email"
                            type="email"
                            required
                            maxLength={200}
                            disabled={isSubmitting}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (fieldErrors.email) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  email: undefined,
                                }));
                              }
                            }}
                            placeholder="alex@yourproduct.com"
                            className="mt-1.5 w-full border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-base font-medium tracking-tight text-[var(--text-primary)] placeholder-[var(--text-muted)]/45 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-lg lg:mt-2 lg:pb-3 lg:text-xl"
                          />
                          {fieldErrors.email && (
                            <p className="mt-1.5 text-xs text-red-400">
                              {fieldErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Context / What feels stuck */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="audit-message"
                            className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                          >
                            What feels stuck right now? *
                          </label>
                          <span className="font-mono-label text-[10px] text-[var(--text-muted)]">
                            {message.length}/900
                          </span>
                        </div>
                        <textarea
                          id="audit-message"
                          name="message"
                          required
                          rows={2}
                          maxLength={900}
                          disabled={isSubmitting}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (fieldErrors.message) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                message: undefined,
                              }));
                            }
                          }}
                          placeholder="Tell us what you’re building, how people find you today, and where signups or revenue feel stuck..."
                          className="mt-1.5 w-full resize-y border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-sm leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)]/45 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-base lg:mt-2 lg:pb-3 lg:text-lg"
                        />
                        {fieldErrors.message && (
                          <p className="mt-1.5 text-xs text-red-400">
                            {fieldErrors.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {showTurnstileWidget && (
                    <div
                      className="cf-turnstile pt-1"
                      data-sitekey={turnstileSiteKey}
                      data-theme={isLight ? "light" : "dark"}
                    />
                  )}

                  {/* Submit Action Bar */}
                  <div className="flex flex-col items-start justify-between gap-6 pt-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex cursor-pointer items-center gap-4 rounded-full bg-[#e89b3c] px-9 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] shadow-[0_10px_30px_rgba(232,155,60,0.35)] transition-all duration-200 hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                    >
                      <span>
                        {isSubmitting
                          ? LEAD_COPY.common.submittingLabel
                          : "Request Free Audit"}
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </button>

                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                      {LEAD_COPY.common.privacyNoticePrefix}
                      <Link
                        href={LEAD_COPY.common.privacyNoticeHref}
                        className="underline decoration-[#e89b3c]/70 underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
                      >
                        {LEAD_COPY.common.privacyNoticeLinkText}
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * =============================================================================
 * 2. DEDICATED "TALK TO US" PAGE (/talk & /contact?intent=conversation)
 * Editorial Direct Founder Line & Conversational Studio Brief (distinct from Audit!).
 * =============================================================================
 */
export function DedicatedTalkPage({
  sourceButton = "talk-page",
}: {
  sourceButton?: string;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>(
    CONVERSATION_TOPICS[0],
  );
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<SubmitLeadResult["fieldErrors"]>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [attribution, setAttribution] = useState<FirstLandingAttribution>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referrer: "",
  });
  const [sourcePage, setSourcePage] = useState("/talk");

  const nameRef = useRef<HTMLInputElement | null>(null);

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const showTurnstileWidget =
    Boolean(turnstileSiteKey) &&
    turnstileSiteKey !== "1x00000000000000000000AA";

  useEffect(() => {
    setAttribution(captureFirstLandingAttribution());
    if (typeof window !== "undefined") {
      setSourcePage(window.location.pathname + window.location.search);
    }
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("connect@hellosteward.agency")
        .catch(() => {});
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const validateClient = (): boolean => {
    const errors: NonNullable<SubmitLeadResult["fieldErrors"]> = {};
    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) {
      errors.message = "Please share a short note before sending.";
    } else if (message.trim().length > 900) {
      errors.message = "Please keep your message under 900 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClient()) return;

    setIsSubmitting(true);
    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const topicPrefix = selectedTopic ? `[Topic: ${selectedTopic}]\n` : "";
      const combinedMessage = `${topicPrefix}${message.trim()}`.slice(0, 1000);

      formData.set("intent", "conversation");
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("message", combinedMessage);
      formData.set("source_button", sourceButton || "talk-page");
      formData.set("source_page", sourcePage || "/talk");
      formData.set("utm_source", attribution.utm_source);
      formData.set("utm_medium", attribution.utm_medium);
      formData.set("utm_campaign", attribution.utm_campaign);
      formData.set("referrer", attribution.referrer);
      formData.set("steward_bot_trap_field", honeypot);

      const res = await submitLeadAction(formData);
      if (!res.success) {
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        setGeneralError(res.error ?? LEAD_COPY.common.genericError);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setGeneralError(LEAD_COPY.common.genericError);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300">
      {showTurnstileWidget && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <Navbar />

      <main className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-24 lg:pt-36 lg:pb-32">
        {/* Ambient Emerald + Warm Gold Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.07)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] bottom-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.06)_0%,rgba(8,8,10,0)_70%)] blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 sm:px-8 lg:px-16 xl:px-24">
          {/* Top Status Strip */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3 sm:mb-6 sm:pb-4 lg:mb-12 lg:gap-4 lg:pb-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <span className="font-mono-label text-[9.5px] uppercase tracking-[0.2em] text-[#10b981] sm:text-[10.5px] lg:text-[11px] lg:tracking-[0.24em]">
                Direct Line · Online
              </span>
              <span className="hidden text-[var(--text-muted)] sm:inline">·</span>
              <span className="hidden font-mono-label text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:inline lg:text-[11px]">
                Steward Team
              </span>
            </div>

            <Link
              href="/audit"
              className="group inline-flex items-center gap-1.5 font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:text-[#e89b3c] sm:text-[10.5px] lg:gap-2 lg:text-[11px] lg:tracking-[0.18em]"
            >
              <span className="sm:hidden">Free Audit</span>
              <span className="hidden sm:inline">
                Want a product teardown first? Request Free Audit
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {isSuccess ? (
            <div className="py-12 lg:py-20">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#10b981]/35 bg-[#10b981]/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#10b981]">
                  Message Sent
                </span>
              </div>

              <h1 className="mt-6 max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                {LEAD_COPY.conversation.successHeadline}
              </h1>

              <p className="mt-6 max-w-[540px] text-base leading-[1.7] text-[var(--text-secondary)] sm:text-lg">
                {LEAD_COPY.conversation.successMessage}
              </p>

              <div className="mt-12">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 rounded-full bg-[#e89b3c] px-8 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#08080a] transition-all hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
                >
                  <span>← Back to Steward</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-7 lg:space-y-16">
              {/* =============================================================
                  HERO HEADER: BIG EDITORIAL STATEMENT + DIRECT EMAIL PILL
              ============================================================= */}
              <div className="grid grid-cols-1 items-end gap-3 sm:gap-5 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-8">
                  <h1 className="text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-3xl lg:text-6xl lg:leading-[1.03] xl:text-[4.25rem]">
                    No account managers.{" "}
                    <span className="font-serif-editorial inline text-[1.05em] font-normal italic tracking-[-0.015em] text-[#e89b3c] lg:block">
                      Talk directly to the builders.
                    </span>
                  </h1>
                  <p className="mt-2 max-w-[640px] text-xs leading-[1.55] text-[var(--text-secondary)] sm:text-sm lg:mt-6 lg:text-lg lg:leading-[1.7]">
                    You’ve built the product. If conversions, onboarding, or
                    growth aren’t compounding yet, let’s talk about what it
                    takes to fix it together.
                  </p>
                </div>

                {/* Direct Copy-to-Clipboard Email Channel */}
                <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:flex-col lg:items-end lg:gap-0">
                  <span className="font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10px] lg:tracking-[0.22em]">
                    Prefer email?
                  </span>
                  <div className="flex items-center gap-2 lg:mt-2.5">
                    <a
                      href="mailto:connect@hellosteward.agency"
                      className="font-mono-label text-xs font-medium text-[var(--text-primary)] underline decoration-[#e89b3c] underline-offset-4 transition-colors hover:text-[#e89b3c] lg:text-sm"
                    >
                      connect@hellosteward.agency
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="cursor-pointer rounded-full border border-[var(--border-hairline)] px-2.5 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] lg:px-3 lg:py-1 lg:text-[10px]"
                    >
                      {copiedEmail ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* =============================================================
                  CONVERSATIONAL BRIEF COMPOSER (Mad-Libs / Editorial Style)
              ============================================================= */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border-t border-[var(--border-hairline)] pt-5 sm:pt-7 lg:pt-12"
              >
                {/* Hidden Honeypot */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
                >
                  <input
                    id="steward_bot_trap_field_talk"
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
                    className="mb-6 rounded-xl border border-red-500/45 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 lg:mb-8"
                  >
                    {generalError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-14">
                  {/* LEFT (4 Cols): Topic Selector + How We Partner */}
                  <div className="space-y-6 lg:col-span-4 lg:space-y-10">
                    <div>
                      <span className="block font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c] lg:text-[11px] lg:tracking-[0.2em]">
                        What’s on your mind?
                      </span>
                      <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2 lg:mt-4">
                        {CONVERSATION_TOPICS.map((topic) => {
                          const active = selectedTopic === topic;
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => setSelectedTopic(topic)}
                              className={`cursor-pointer rounded-full border px-3 py-1.5 text-left font-mono-label text-[10px] tracking-[0.05em] transition-all duration-200 lg:px-4 lg:py-2 lg:text-[11px] lg:tracking-[0.06em] ${
                                active
                                  ? "border-[#e89b3c] bg-[#e89b3c] font-semibold text-[#08080a] shadow-[0_4px_16px_rgba(232,155,60,0.3)]"
                                  : isLight
                                    ? "border-black/12 bg-black/[0.02] text-[var(--text-primary)] hover:border-[#e89b3c]"
                                    : "border-white/10 bg-white/[0.03] text-[var(--text-primary)] hover:border-[#e89b3c]"
                              }`}
                            >
                              {topic}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3 Architectural Pillars (Hidden on Mobile & Tablet so the form is immediately visible above the fold; shown on Desktop lg+) */}
                    <div className="hidden space-y-5 border-t border-[var(--border-hairline)] pt-8 lg:block">
                      <div>
                        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#10b981]">
                          01 · Direct Ownership
                        </span>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          We agree on one revenue metric up front and take full
                          responsibility for moving it.
                        </p>
                      </div>
                      <div>
                        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
                          02 · End-to-End Execution
                        </span>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Research, positioning, ads, UX design, and production
                          code—shipped by one team.
                        </p>
                      </div>
                      <div>
                        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          03 · Next Steps
                        </span>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          We’ll review your note and reach out to you if we need
                          anything else.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT (8 Cols): Conversational Statement Inputs */}
                  <div className="space-y-5 sm:space-y-7 lg:col-span-8 lg:space-y-10">
                    {/* Interactive Natural-Language / Architectural Line */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      <div>
                        <label
                          htmlFor="talk-name"
                          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                        >
                          01 / Your Name *
                        </label>
                        <input
                          ref={nameRef}
                          id="talk-name"
                          name="name"
                          type="text"
                          required
                          maxLength={120}
                          disabled={isSubmitting}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                name: undefined,
                              }));
                            }
                          }}
                          placeholder="Alex Rivera"
                          className="mt-1.5 w-full border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-base font-medium tracking-tight text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-xl lg:mt-2 lg:pb-3.5 lg:text-3xl"
                        />
                        {fieldErrors.name && (
                          <p className="mt-1.5 text-xs text-red-400">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="talk-email"
                          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                        >
                          02 / Your Email *
                        </label>
                        <input
                          id="talk-email"
                          name="email"
                          type="email"
                          required
                          maxLength={200}
                          disabled={isSubmitting}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                email: undefined,
                              }));
                            }
                          }}
                          placeholder="alex@yourproduct.com"
                          className="mt-1.5 w-full border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-base font-medium tracking-tight text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-xl lg:mt-2 lg:pb-3.5 lg:text-3xl"
                        />
                        {fieldErrors.email && (
                          <p className="mt-1.5 text-xs text-red-400">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Large Editorial Note Canvas */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="talk-message"
                          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:text-[10.5px] lg:tracking-[0.2em]"
                        >
                          03 / Tell us what you’re working on and aiming for *
                        </label>
                        <span className="font-mono-label text-[10px] text-[var(--text-muted)]">
                          {message.length}/900
                        </span>
                      </div>
                      <textarea
                        id="talk-message"
                        name="message"
                        required
                        rows={2}
                        maxLength={900}
                        disabled={isSubmitting}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (fieldErrors.message) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              message: undefined,
                            }));
                          }
                        }}
                        placeholder="Share your product link, what you’re aiming to achieve this quarter, or anything on your mind..."
                        className="mt-1.5 w-full resize-y border-b-2 border-[var(--border-hairline)] bg-transparent pb-2 text-sm leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 transition-colors focus:border-[#e89b3c] focus:outline-none sm:text-base lg:mt-3 lg:pb-4 lg:text-xl"
                      />
                      {fieldErrors.message && (
                        <p className="mt-1.5 text-xs text-red-400">
                          {fieldErrors.message}
                        </p>
                      )}
                    </div>

                    {showTurnstileWidget && (
                      <div
                        className="cf-turnstile pt-1"
                        data-sitekey={turnstileSiteKey}
                        data-theme={isLight ? "light" : "dark"}
                      />
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center lg:gap-6 lg:pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex cursor-pointer items-center gap-4 rounded-full bg-[var(--text-primary)] px-9 py-4 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bg-stage)] shadow-lg transition-all duration-200 hover:bg-[#e89b3c] hover:text-[#08080a] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                      >
                        <span>
                          {isSubmitting
                            ? LEAD_COPY.common.submittingLabel
                            : "Start the Conversation"}
                        </span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </button>

                      <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                        {LEAD_COPY.common.privacyNoticePrefix}
                        <Link
                          href={LEAD_COPY.common.privacyNoticeHref}
                          className="underline decoration-[#e89b3c]/70 underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
                        >
                          {LEAD_COPY.common.privacyNoticeLinkText}
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
