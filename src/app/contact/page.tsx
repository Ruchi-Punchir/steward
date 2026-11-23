import type { Metadata } from "next";
import React from "react";
import type { LeadIntent } from "@/config/leadCopy";
import {
  DedicatedAuditPage,
  DedicatedTalkPage,
} from "@/components/leads/DedicatedLeadPages";

export const metadata: Metadata = {
  title: "Contact & Free Audit | Hello Steward",
  description:
    "Request a free product and revenue audit or start a conversation with Hello Steward.",
  alternates: {
    canonical: "https://www.hellosteward.agency/contact",
  },
  openGraph: {
    title: "Contact & Free Audit | Hello Steward",
    description:
      "Request a free product and revenue audit or start a conversation with Hello Steward.",
    url: "https://www.hellosteward.agency/contact",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; source?: string }>;
}) {
  const params = await searchParams;
  const intent: LeadIntent =
    params.intent === "conversation" ? "conversation" : "audit";
  const sourceButton = params.source?.trim() || `contact-page-${intent}`;

  if (intent === "conversation") {
    return <DedicatedTalkPage sourceButton={sourceButton} />;
  }

  return <DedicatedAuditPage sourceButton={sourceButton} />;
}
