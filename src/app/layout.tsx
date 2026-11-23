import type { Metadata } from "next";
import Script from "next/script";
import {
  Plus_Jakarta_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
// @ts-ignore Next.js handles CSS imports with its global type declarations.
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteAttributionTracker } from "@/lib/attribution";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hellosteward.agency"),
  title: "Hello Steward | B2B SaaS Product & Conversion Engineering Agency",
  description:
    "Product and growth partners for Seed to Series A B2B SaaS startups in the US and Europe. Outcome-backed conversion engineering, MVP rescue, and sub-1.5s speed audits.",
  alternates: {
    canonical: "https://www.hellosteward.agency/",
  },
  openGraph: {
    title: "Hello Steward | B2B SaaS Product & Conversion Engineering Agency",
    description:
      "Product and growth partners for Seed to Series A B2B SaaS startups in the US and Europe. Outcome-backed conversion engineering, MVP rescue, and sub-1.5s speed audits.",
    url: "https://www.hellosteward.agency/",
    siteName: "Hello Steward",
    type: "website",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${plusJakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="google-consent-mode-v2" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            var savedConsent = null;
            try {
              savedConsent = window.localStorage.getItem('steward_cookie_consent');
            } catch (e) {}

            var defaultState = savedConsent === 'granted' ? 'granted' : 'denied';
            gtag('consent', 'default', {
              ad_storage: defaultState,
              analytics_storage: defaultState,
              ad_user_data: defaultState,
              ad_personalization: defaultState,
              wait_for_update: 500
            });
            gtag('js', new Date());
          `}
        </Script>
      </head>
      <body className="min-h-screen selection:bg-[#e89b3c] selection:text-[#0a0a0d]">
        <SiteAttributionTracker />
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
