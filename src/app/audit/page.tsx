import type { Metadata } from "next";
import React from "react";
import { DedicatedAuditPage } from "@/components/leads/DedicatedLeadPages";

export const metadata: Metadata = {
  title: "Free Product & Revenue Audit | Steward",
  description:
    "Send us your product and where conversions feel stuck. We’ll review your product and funnel and reach out if we need anything else.",
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
