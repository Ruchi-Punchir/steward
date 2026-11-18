"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { captureFirstLandingAttribution } from "@/components/leads/LeadCaptureModal";

interface InsightsShellProps {
  children: React.ReactNode;
  hasPublishedPosts?: boolean;
}

export default function InsightsShell({
  children,
  hasPublishedPosts = true,
}: InsightsShellProps) {
  useEffect(() => {
    captureFirstLandingAttribution();
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300"
    >
      <Navbar showInsights={hasPublishedPosts} />

      <main className="pt-24 sm:pt-28">{children}</main>

      <Footer />
    </div>
  );
}
