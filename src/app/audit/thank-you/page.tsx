import type { Metadata } from "next";
import React from "react";
import { AuditThankYouPageClient } from "@/components/leads/ThankYouPages";

export const metadata: Metadata = {
  title: "Audit Request Received | Hello Steward",
  description:
    "Thank you for requesting a free product and funnel audit from Hello Steward. We’ve queued your product for a 5-unit teardown.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuditThankYouPage() {
  return <AuditThankYouPageClient />;
}
