import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title: "SaaS Pricing Strategy & Monetization Consultant | Hello Steward",
  description:
    "Fix B2B SaaS tier confusion, passive paywalls, and Stripe upgrade friction. Senior product & growth partners offering $60/hr sprints or 40% fee-at-risk partnerships.",
  alternates: {
    canonical: "https://www.hellosteward.agency/pricing-strategy",
  },
  openGraph: {
    title: "SaaS Pricing Strategy & Monetization Consultant | Hello Steward",
    description:
      "Fix B2B SaaS tier confusion, passive paywalls, and Stripe upgrade friction. Senior product & growth partners offering $60/hr sprints or 40% fee-at-risk partnerships.",
    url: "https://www.hellosteward.agency/pricing-strategy",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function PricingStrategyPage() {
  return <AdLandingPage slug="pricing-strategy" />;
}
