import type { Metadata } from "next";
import React from "react";
import { DedicatedTalkPage } from "@/components/leads/DedicatedLeadPages";

export const metadata: Metadata = {
  title: "Talk to Us | Steward",
  description:
    "Start a conversation with Steward about growing your product and revenue.",
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
