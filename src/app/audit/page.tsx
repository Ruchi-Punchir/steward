import type { Metadata } from "next";
import React from "react";
import { DedicatedAuditPage } from "@/components/leads/DedicatedLeadPages";

export const metadata: Metadata = {
  title: "Free B2B SaaS Funnel, UX & Conversion Audit | Hello Steward",
  description:
    "Request a free 5-unit SaaS diagnostic teardown covering monetization, acquisition funnel, positioning, core UX, and onboarding activation.",
  alternates: {
    canonical: "https://www.hellosteward.agency/audit",
  },
  openGraph: {
    title: "Free B2B SaaS Funnel, UX & Conversion Audit | Hello Steward",
    description:
      "Request a free 5-unit SaaS diagnostic teardown covering monetization, acquisition funnel, positioning, core UX, and onboarding activation.",
    url: "https://www.hellosteward.agency/audit",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const sourceButton = params.source?.trim() || "audit-page";

  return <DedicatedAuditPage sourceButton={sourceButton} />;
}
