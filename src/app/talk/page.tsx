import type { Metadata } from "next";
import React from "react";
import { DedicatedTalkPage } from "@/components/leads/DedicatedLeadPages";

export const metadata: Metadata = {
  title: "Talk Directly to Senior Product & Growth Engineers | Hello Steward",
  description:
    "No account managers. Speak directly with Hello Steward's product, growth, and engineering partners about fixing your SaaS funnel or codebase.",
  alternates: {
    canonical: "https://www.hellosteward.agency/talk",
  },
  openGraph: {
    title: "Talk Directly to Senior Product & Growth Engineers | Hello Steward",
    description:
      "No account managers. Speak directly with Hello Steward's product, growth, and engineering partners about fixing your SaaS funnel or codebase.",
    url: "https://www.hellosteward.agency/talk",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default async function TalkPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const sourceButton = params.source?.trim() || "talk-page";

  return <DedicatedTalkPage sourceButton={sourceButton} />;
}
