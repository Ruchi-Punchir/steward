import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";

export const metadata: Metadata = {
  title:
    "React & Next.js Speed Optimization & Core Web Vitals Agency | Hello Steward",
  description:
    "We engineer sub-1.5s SaaS load times, 0.00 CLS, and <100ms INP to lower Google Ads CAC and lift trial conversions. Request a free 5-min speed audit.",
  alternates: {
    canonical: "https://www.hellosteward.agency/speed-audit",
  },
  openGraph: {
    title:
      "React & Next.js Speed Optimization & Core Web Vitals Agency | Hello Steward",
    description:
      "We engineer sub-1.5s SaaS load times, 0.00 CLS, and <100ms INP to lower Google Ads CAC and lift trial conversions. Request a free 5-min speed audit.",
    url: "https://www.hellosteward.agency/speed-audit",
    siteName: "Hello Steward",
    type: "website",
  },
};

export default function SpeedAuditPage() {
  return <AdLandingPage slug="speed-audit" />;
}
