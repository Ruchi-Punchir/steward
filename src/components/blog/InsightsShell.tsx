"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadCaptureModal, {
  captureFirstLandingAttribution,
} from "@/components/leads/LeadCaptureModal";
import type { LeadIntent } from "@/config/leadCopy";

interface InsightsShellProps {
  children: React.ReactNode;
  hasPublishedPosts?: boolean;
}

export default function InsightsShell({
  children,
  hasPublishedPosts = true,
}: InsightsShellProps) {
  const [activeDialog, setActiveDialog] = useState<{
    intent: LeadIntent;
    sourceButton: string;
  } | null>(null);

  useEffect(() => {
    captureFirstLandingAttribution();

    // Listen for clicks on any element with data-open-audit-modal="true"
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "[data-open-audit-modal='true']"
      ) as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      const src =
        target.getAttribute("data-cta-source") ?? "insights-post";
      setActiveDialog({ intent: "audit", sourceButton: src });
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] transition-colors duration-300"
    >
      <Navbar
        showInsights={hasPublishedPosts}
        onAuditClick={(sourceButton = "nav") =>
          setActiveDialog({ intent: "audit", sourceButton })
        }
      />

      <main className="pt-24 sm:pt-28">{children}</main>

      <Footer
        onAuditClick={(sourceButton = "footer") =>
          setActiveDialog({ intent: "audit", sourceButton })
        }
      />

      <LeadCaptureModal
        intent={activeDialog?.intent ?? null}
        sourceButton={activeDialog?.sourceButton ?? "insights"}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  );
}
