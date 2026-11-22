"use client";

import React from "react";
import { openStewardCookiePreferences } from "@/components/CookieConsentBanner";

export default function PrivacyCookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openStewardCookiePreferences}
      className="cursor-pointer rounded-full border border-[#e89b3c]/60 bg-[#e89b3c]/10 px-4 py-2 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#e89b3c] transition-colors hover:bg-[#e89b3c] hover:text-[#08080a]"
    >
      Manage Cookie Preferences
    </button>
  );
}
