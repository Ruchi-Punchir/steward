"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const ATTRIBUTION_STORAGE_KEY = "st_attribution";
export const VISITOR_ID_STORAGE_KEY = "st_visitor_id";
export const JOURNEY_STORAGE_KEY = "st_journey";

export interface StewardAttributionPayload {
  visitor_id: string;
  gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_adgroup: string;
  utm_term: string;
  utm_matchtype: string;
  utm_device: string;
  landing_page: string;
  referrer: string;
  first_seen: string;
  pages_visited: string[];
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    clarity?: (command: string, ...args: string[]) => void;
  }
}

function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = window.sessionStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (!vid) {
      vid = generateVisitorId();
      window.sessionStorage.setItem(VISITOR_ID_STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return generateVisitorId();
  }
}

export function trackStewardAttribution(currentPathname?: string): StewardAttributionPayload {
  const empty: StewardAttributionPayload = {
    visitor_id: "",
    gclid: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_adgroup: "",
    utm_term: "",
    utm_matchtype: "",
    utm_device: "",
    landing_page: "",
    referrer: "direct",
    first_seen: "",
    pages_visited: [],
  };

  if (typeof window === "undefined") return empty;

  try {
    const visitorId = getOrCreateVisitorId();
    const pathname = currentPathname || window.location.pathname || "/";
    const params = new URLSearchParams(window.location.search);
    const incomingGclid = params.get("gclid")?.trim() ?? "";

    // 1. Capture or update session attribution (overwrite only if a new gclid is present)
    let stored: Omit<StewardAttributionPayload, "visitor_id" | "pages_visited"> | null = null;
    const rawStored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (rawStored) {
      try {
        stored = JSON.parse(rawStored);
      } catch {
        stored = null;
      }
    }

    const shouldCaptureFresh =
      !stored || (Boolean(incomingGclid) && incomingGclid !== stored.gclid);

    if (shouldCaptureFresh) {
      stored = {
        gclid: incomingGclid || stored?.gclid || "",
        utm_source: params.get("utm_source")?.trim() || stored?.utm_source || "",
        utm_medium: params.get("utm_medium")?.trim() || stored?.utm_medium || "",
        utm_campaign: params.get("utm_campaign")?.trim() || stored?.utm_campaign || "",
        utm_adgroup: params.get("utm_adgroup")?.trim() || stored?.utm_adgroup || "",
        utm_term: params.get("utm_term")?.trim() || stored?.utm_term || "",
        utm_matchtype: params.get("utm_matchtype")?.trim() || stored?.utm_matchtype || "",
        utm_device: params.get("utm_device")?.trim() || stored?.utm_device || "",
        landing_page: stored?.landing_page || pathname,
        referrer: stored?.referrer || document.referrer?.trim() || "direct",
        first_seen: stored?.first_seen || new Date().toISOString(),
      };
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(stored));

      // Keep backward-compatible session key in sync for existing forms
      window.sessionStorage.setItem(
        "steward_first_landing_attribution",
        JSON.stringify({
          utm_source: stored.utm_source,
          utm_medium: stored.utm_medium,
          utm_campaign: stored.utm_campaign,
          referrer: stored.referrer,
        }),
      );
    }

    // 2. Append visited pathname to st_journey (deduplicating consecutive identical paths)
    let journey: string[] = [];
    const rawJourney = window.sessionStorage.getItem(JOURNEY_STORAGE_KEY);
    if (rawJourney) {
      try {
        const parsedJourney = JSON.parse(rawJourney);
        if (Array.isArray(parsedJourney)) {
          journey = parsedJourney.filter((p): p is string => typeof p === "string");
        }
      } catch {
        journey = [];
      }
    }

    if (journey[journey.length - 1] !== pathname) {
      journey.push(pathname);
      window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(journey));
    }

    // 3. Microsoft Clarity integration if present
    if (typeof window.clarity === "function") {
      try {
        window.clarity("identify", visitorId);
        if (stored?.utm_campaign) {
          window.clarity("set", "campaign", stored.utm_campaign);
        }
      } catch {
        // Ignore clarity errors
      }
    }

    return {
      visitor_id: visitorId,
      gclid: stored?.gclid ?? "",
      utm_source: stored?.utm_source ?? "",
      utm_medium: stored?.utm_medium ?? "",
      utm_campaign: stored?.utm_campaign ?? "",
      utm_adgroup: stored?.utm_adgroup ?? "",
      utm_term: stored?.utm_term ?? "",
      utm_matchtype: stored?.utm_matchtype ?? "",
      utm_device: stored?.utm_device ?? "",
      landing_page: stored?.landing_page || pathname,
      referrer: stored?.referrer || "direct",
      first_seen: stored?.first_seen || new Date().toISOString(),
      pages_visited: journey,
    };
  } catch {
    return empty;
  }
}

export function getStewardAttributionSnapshot(): StewardAttributionPayload {
  return trackStewardAttribution();
}

/**
 * Global site-wide tracker mounted in RootLayout so UTMs, gclid, visitor_id,
 * and st_journey persist across any navigation between ad landing pages and `/`.
 */
export function SiteAttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackStewardAttribution(pathname || undefined);
  }, [pathname]);

  return null;
}
