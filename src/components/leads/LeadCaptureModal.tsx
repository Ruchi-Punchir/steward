"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  LEAD_COPY,
  LEAD_STAGE_OPTIONS,
  type LeadIntent,
  type LeadStage,
} from "@/config/leadCopy";
import {
  submitLeadAction,
  type SubmitLeadResult,
} from "@/app/actions/submitLead";

const UTM_STORAGE_KEY = "steward_first_landing_attribution";

export interface FirstLandingAttribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
}

/**
 * Capture UTM parameters and document.referrer on first landing in browser storage.
 */
export function captureFirstLandingAttribution(): FirstLandingAttribution {
  if (typeof window === "undefined") {
    return { utm_source: "", utm_medium: "", utm_campaign: "", referrer: "" };
  }

  try {
    const existingRaw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (existingRaw) {
      return JSON.parse(existingRaw) as FirstLandingAttribution;
    }

    const params = new URLSearchParams(window.location.search);
    const data: FirstLandingAttribution = {
      utm_source: params.get("utm_source")?.trim() ?? "",
      utm_medium: params.get("utm_medium")?.trim() ?? "",
      utm_campaign: params.get("utm_campaign")?.trim() ?? "",
      referrer: document.referrer?.trim() ?? "",
    };

    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return { utm_source: "", utm_medium: "", utm_campaign: "", referrer: "" };
  }
}

interface LeadFormContentProps {
  intent: LeadIntent;
  sourceButton: string;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export function LeadFormContent({
  intent,
  sourceButton,
  onClose,
  isStandalonePage = false,
}: LeadFormContentProps) {
  const copy = intent === "audit" ? LEAD_COPY.audit : LEAD_COPY.conversation;
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productLink, setProductLink] = useState("");
  const [stage, setStage] = useState<LeadStage>("Live product");
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
  const [sourcePage, setSourcePage] = useState("");

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
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const validateClient = (): boolean => {
    const errors: NonNullable<SubmitLeadResult["fieldErrors"]> = {};
    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (intent === "audit" && !stage) {
      errors.stage = "Please select your current stage.";
    }
    if (!message.trim()) {
      errors.message = "Please share a short note before sending.";
    } else if (message.trim().length > 1000) {
      errors.message = "Please keep your message under 1,000 characters.";
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
      formData.set("intent", intent);
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      if (intent === "audit") {
        formData.set("product_link", productLink.trim());
        formData.set("stage", stage);
      }
      formData.set("message", message.trim());
      formData.set("source_button", sourceButton || intent);
      formData.set("source_page", sourcePage || "/");
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
    } catch {
      setGeneralError(LEAD_COPY.common.genericError);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-4 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10b981]">
            Sent
          </span>
        </div>

        <h2
          id="cta-dialog-title"
          className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {copy.successHeadline}
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {copy.successMessage}
        </p>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full cursor-pointer rounded-full border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] py-2.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-primary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
          >
            Done
          </button>
        ) : (
          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] py-2.5 font-mono-label text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-primary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
          >
            Return to Steward
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {showTurnstileWidget && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono-label text-xs uppercase tracking-widest text-[#e89b3c]">
          {copy.eyebrow}
        </span>

        {onClose && !isStandalonePage && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer rounded bg-[var(--btn-secondary-bg)] px-2.5 py-1 font-mono-label text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[#e89b3c]"
          >
            {LEAD_COPY.common.closeButtonLabel}
          </button>
        )}
      </div>

      <h2
        id="cta-dialog-title"
        className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)]"
      >
        {copy.headline}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        {copy.subline}
      </p>

      {generalError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/45 bg-red-500/15 px-3.5 py-2.5 text-xs font-medium text-red-700 dark:text-red-200"
        >
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3.5">
        {/* Hidden Honeypot Field for Spam Protection (named & tagged so browser autofill never touches it) */}
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
            data-1p-ignore="true"
            data-lpignore="true"
            data-form-type="other"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Name + Email Row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="lead-name"
              className="block font-mono-label text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]"
            >
              {copy.fields.nameLabel} *
            </label>
            <input
              ref={nameInputRef}
              id="lead-name"
              name="name"
              type="text"
              required
              maxLength={120}
              disabled={isSubmitting}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              placeholder={copy.fields.namePlaceholder}
              className="mt-1 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#e89b3c] focus:outline-none"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lead-email"
              className="block font-mono-label text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]"
            >
              {copy.fields.emailLabel} *
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              maxLength={200}
              disabled={isSubmitting}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder={copy.fields.emailPlaceholder}
              className="mt-1 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#e89b3c] focus:outline-none"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        {/* Audit-only fields: Product link (optional) + Stage (select) */}
        {intent === "audit" && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="lead-product-link"
                className="block font-mono-label text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                {LEAD_COPY.audit.fields.productLinkLabel}
              </label>
              <input
                id="lead-product-link"
                name="product_link"
                type="text"
                maxLength={500}
                disabled={isSubmitting}
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder={LEAD_COPY.audit.fields.productLinkPlaceholder}
                className="mt-1 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#e89b3c] focus:outline-none"
              />
              {fieldErrors.product_link && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.product_link}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-stage"
                className="block font-mono-label text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                {LEAD_COPY.audit.fields.stageLabel} *
              </label>
              <select
                id="lead-stage"
                name="stage"
                required
                disabled={isSubmitting}
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="mt-1 w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-panel)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[#e89b3c] focus:outline-none"
              >
                {LEAD_STAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {fieldErrors.stage && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.stage}</p>
              )}
            </div>
          </div>
        )}

        {/* Message / What feels stuck? (required, max 1000 characters) */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="lead-message"
              className="block font-mono-label text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]"
            >
              {copy.fields.messageLabel} *
            </label>
            <span className="font-mono-label text-[10px] text-[var(--text-muted)]">
              {message.length}/1000
            </span>
          </div>
          <textarea
            id="lead-message"
            name="message"
            required
            rows={4}
            maxLength={1000}
            disabled={isSubmitting}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) {
                setFieldErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            placeholder={copy.fields.messagePlaceholder}
            className="mt-1 w-full resize-y rounded-lg border border-[var(--border-hairline)] bg-[var(--btn-secondary-bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[#e89b3c] focus:outline-none"
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
          )}
        </div>

        {/* Cloudflare Turnstile Widget (when production site key is configured) */}
        {showTurnstileWidget && (
          <div
            className="cf-turnstile pt-1"
            data-sitekey={turnstileSiteKey}
            data-theme="dark"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-full bg-[#e89b3c] py-3 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? LEAD_COPY.common.submittingLabel : copy.submitButton}
        </button>

        <p className="pt-1 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
          {LEAD_COPY.common.privacyNoticePrefix}
          <Link
            href={LEAD_COPY.common.privacyNoticeHref}
            className="underline decoration-[#e89b3c]/70 underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
          >
            {LEAD_COPY.common.privacyNoticeLinkText}
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

interface LeadCaptureModalProps {
  intent: LeadIntent | null;
  sourceButton: string;
  onClose: () => void;
}

export default function LeadCaptureModal({
  intent,
  sourceButton,
  onClose,
}: LeadCaptureModalProps) {
  useEffect(() => {
    if (!intent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [intent, onClose]);

  if (!intent) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cta-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <LeadFormContent
          intent={intent}
          sourceButton={sourceButton}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
