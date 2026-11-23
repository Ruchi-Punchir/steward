import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title: "SaaS MVP Rescue & Next.js Refactoring Agency | Hello Steward",
  description:
    "Turn fragile AI or freelancer prototypes into production-grade React & Next.js SaaS in 14 days. Straight $60/hr senior product engineering, zero lock-in.",
  alternates: {
    canonical: "https://www.hellosteward.agency/mvp-rescue",
  },
  openGraph: {
    title: "SaaS MVP Rescue & Next.js Refactoring Agency | Hello Steward",
    description:
      "Turn fragile AI or freelancer prototypes into production-grade React & Next.js SaaS in 14 days. Straight $60/hr senior product engineering, zero lock-in.",
    url: "https://www.hellosteward.agency/mvp-rescue",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function MvpRescuePage() {
  return <AdLandingPage slug="mvp-rescue" />;
}
