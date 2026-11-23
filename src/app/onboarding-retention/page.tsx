import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title:
    "SaaS Onboarding Optimization & Activation Engineering | Hello Steward",
  description:
    "Eliminate step-2 trial drop-offs and engineer under-90-second 'aha' moments. B2B SaaS onboarding, activation, and retention engineering.",
  alternates: {
    canonical: "https://www.hellosteward.agency/onboarding-retention",
  },
  openGraph: {
    title:
      "SaaS Onboarding Optimization & Activation Engineering | Hello Steward",
    description:
      "Eliminate step-2 trial drop-offs and engineer under-90-second 'aha' moments. B2B SaaS onboarding, activation, and retention engineering.",
    url: "https://www.hellosteward.agency/onboarding-retention",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function OnboardingRetentionPage() {
  return <AdLandingPage slug="onboarding-retention" />;
}
