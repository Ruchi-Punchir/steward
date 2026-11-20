import type { Metadata } from "next";
import AdLandingPage from "@/components/ads/AdLandingPage";
import { AD_LANDING_PAGES } from "@/data/adLandingPages";

const pageConfig = AD_LANDING_PAGES["mvp-rescue"];

export const metadata: Metadata = {
  title: pageConfig.seoTitle,
  description: pageConfig.seoDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default function MvpRescuePage() {
  return <AdLandingPage slug="mvp-rescue" />;
}
