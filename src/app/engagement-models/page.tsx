import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title: "Outcome-Based SaaS Product & Growth Agency Pricing | Hello Steward",
  description:
    "Transparent B2B SaaS engineering & growth pricing: $60/hr fixed execution or $100/hr outcome-backed partnership with 40% of our fee at risk.",
  alternates: {
    canonical: "https://www.hellosteward.agency/engagement-models",
  },
  openGraph: {
    title: "Outcome-Based SaaS Product & Growth Agency Pricing | Hello Steward",
    description:
      "Transparent B2B SaaS engineering & growth pricing: $60/hr fixed execution or $100/hr outcome-backed partnership with 40% of our fee at risk.",
    url: "https://www.hellosteward.agency/engagement-models",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function EngagementModelsPage() {
  return <AdLandingPage slug="engagement-models" />;
}
