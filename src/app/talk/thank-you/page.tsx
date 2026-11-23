import type { Metadata } from "next";
import React from "react";
import { TalkThankYouPageClient } from "@/components/leads/ThankYouPages";

export const metadata: Metadata = {
  title: "Message Received | Hello Steward",
  description:
    "Thank you for reaching out to Hello Steward. Our core product and growth team has received your note and will reply shortly.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function TalkThankYouPage() {
  return <TalkThankYouPageClient />;
}
