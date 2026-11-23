import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title:
    "SaaS Conversion Engineering & CRO Agency | Hello Steward",
  description:
    "We fix B2B SaaS signup, pricing, and onboarding leaks—with 40% of our fee at risk on your conversion lift. Get a free 5-minute Loom funnel teardown.",
  alternates: {
    canonical: "https://www.hellosteward.agency/conversion-engineering",
  },
  openGraph: {
    title: "SaaS Conversion Engineering & CRO Agency | Hello Steward",
    description:
      "We fix B2B SaaS signup, pricing, and onboarding leaks—with 40% of our fee at risk on your conversion lift. Get a free 5-minute Loom funnel teardown.",
    url: "https://www.hellosteward.agency/conversion-engineering",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function ConversionEngineeringPage() {
  return <AdLandingPage slug="conversion-engineering" />;
}
