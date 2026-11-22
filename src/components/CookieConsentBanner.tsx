"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { trackStewardAttribution } from "@/lib/attribution";

export const COOKIE_CONSENT_STORAGE_KEY = "steward_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "steward:open-cookie-settings";
const GTM_CONTAINER_ID = "GTM-TTPBBWPC";
const GTM_SCRIPT_ELEMENT_ID = "steward-gtm-script";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Returns true only if the visitor has explicitly accepted analytics/marketing cookies.
 */
export function hasStewardMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "granted"
    );
  } catch {
    return false;
  }
}

/**
 * Programmatically re-open the cookie consent preferences banner from anywhere
 * (e.g. Footer "Cookie Preferences" button or Privacy Policy page).
 */
export function openStewardCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}

/**
 * Dynamically loads Google Tag Manager only AFTER explicit user consent is granted,
 * preventing any pre-consent network requests or IP transmission to Google servers.
 */
function ensureGtmLoaded() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (document.getElementById(GTM_SCRIPT_ELEMENT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ELEMENT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}

/**
 * Best-effort cleanup of first-party analytics/advertising cookies if user revokes consent.
 */
function clearAnalyticsCookies() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const cookiePrefixes = ["_ga", "_gid", "_gat", "_gcl_", "_clck", "_clsk"];
  const rawCookies = document.cookie ? document.cookie.split(";") : [];
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  const rootDomain =
    domainParts.length >= 2 ? `.${domainParts.slice(-2).join(".")}` : hostname;

  for (const entry of rawCookies) {
    const eqIdx = entry.indexOf("=");
    const name = (eqIdx > -1 ? entry.slice(0, eqIdx) : entry).trim();
    if (cookiePrefixes.some((prefix) => name.startsWith(prefix))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${rootDomain};`;
    }
  }
}

function applyGtagConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  const state = choice === "granted" ? "granted" : "denied";
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  } else {
    window.dataLayer.push({
      event: "gtm_consent_update",
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }

  if (choice === "granted") {
    ensureGtmLoaded();
    trackStewardAttribution(window.location.pathname || undefined);
  } else {
    clearAnalyticsCookies();
  }

  window.dataLayer.push({
    event: "steward_consent_updated",
    consent_status: state,
  });
}

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const isAdminRoute = Boolean(pathname?.startsWith("/admin"));
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isVisible, setIsVisible] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<ConsentChoice | null>(
    null,
  );

  useEffect(() => {
    if (isAdminRoute) return;
    try {
      const saved = window.localStorage.getItem(
        COOKIE_CONSENT_STORAGE_KEY,
      ) as ConsentChoice | null;
      if (saved === "granted" || saved === "denied") {
        setCurrentChoice(saved);
        applyGtagConsent(saved);
      } else {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }

    const handleOpenSettings = () => {
      setIsVisible(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => {
      window.removeEventListener(
        OPEN_COOKIE_SETTINGS_EVENT,
        handleOpenSettings,
      );
    };
  }, [isAdminRoute]);

  const handleSelectChoice = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore storage errors in private browsing
    }

    // If user revokes or declines consent, purge all non-essential session attribution data
    if (choice === "denied" && typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem("st_visitor_id");
        window.sessionStorage.removeItem("st_attribution");
        window.sessionStorage.removeItem("st_journey");
        window.sessionStorage.removeItem("steward_first_landing_attribution");
        window.sessionStorage.removeItem("steward_last_audit_submission");
        window.sessionStorage.removeItem("steward_last_talk_submission");
      } catch {
        // Ignore sessionStorage errors
      }
    }

    setCurrentChoice(choice);
    applyGtagConsent(choice);
    setIsVisible(false);
  };

  if (isAdminRoute || !isVisible) return null;

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-[680px] sm:bottom-6 sm:left-6 sm:right-6"
    >
      <div
        className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 backdrop-blur-xl transition-colors duration-300 sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-4 ${
          isLight
            ? "border-black/12 bg-[#f6f3ec]/95 text-[#121216] shadow-[0_18px_45px_rgba(20,20,19,0.14)]"
            : "border-white/12 bg-[#101015]/95 text-[#f4f0ea] shadow-[0_22px_55px_rgba(0,0,0,0.82)]"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e89b3c]" />
            <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e89b3c]">
              Privacy &amp; Cookies
            </span>
            {currentChoice && (
              <span className="font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                · Current:{" "}
                {currentChoice === "granted" ? "Accepted" : "Essential Only"}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            We use essential storage to run this site and, only with your
            explicit consent, analytics &amp; attribution tags (Google Tag
            Manager) to measure what works. See our{" "}
            <Link
              href="/privacy"
              className="underline decoration-[#e89b3c]/70 underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectChoice("denied")}
            className={`cursor-pointer rounded-full border px-3.5 py-2 font-mono-label text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
              isLight
                ? "border-black/15 text-[#121216]/80 hover:border-black/35 hover:text-[#121216]"
                : "border-white/15 text-[#f4f0ea]/80 hover:border-white/35 hover:text-[#f4f0ea]"
            }`}
          >
            Essential Only
          </button>

          <button
            type="button"
            onClick={() => handleSelectChoice("granted")}
            className="cursor-pointer rounded-full bg-[#e89b3c] px-4 py-2 font-mono-label text-[10px] font-semibold uppercase tracking-[0.16em] text-[#08080a] transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--bg-stage)]"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
