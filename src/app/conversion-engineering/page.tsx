import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";
import { AD_LANDING_PAGES } from "@/data/adLandingPages";

const pageConfig = AD_LANDING_PAGES["conversion-engineering"];

export const metadata: Metadata = {
  title: pageConfig.seoTitle,
  description: pageConfig.seoDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConversionEngineeringPage() {
  return <AdLandingPage slug="conversion-engineering" />;
}
