export interface ProductUnitSpec {
  id: string;
  code: string;
  name: string;
  partTitle: string;
  finding: string;
  isProblem?: boolean;
  statusBadge?: string;
  subParts: {
    id: string;
    label: string;
    partNumber: string;
  }[];
}

export const PRODUCT_UNITS: ProductUnitSpec[] = [
  {
    id: "monetization",
    code: "01",
    name: "Monetization & Pricing",
    partTitle: "Output Platen & $1 Revenue Feed",
    finding: "Inspecting pricing tiers, paywall trigger & checkout drop-off.",
    isProblem: false,
    subParts: [
      { id: "pricing", label: "Pricing Model", partNumber: "#01-A" },
      { id: "checkout", label: "Checkout Flow", partNumber: "#01-B" },
      { id: "billing", label: "Paywall & Trials", partNumber: "#01-C" },
    ],
  },
  {
    id: "marketing",
    code: "02",
    name: "Acquisition & Growth",
    partTitle: "Knurled Drive Roller & Gear Train",
    finding:
      "Bringing in high-intent buyers through paid ads, content, and outbound; tracked directly to revenue.",
    isProblem: true,
    subParts: [
      { id: "ads", label: "Ad Campaigns", partNumber: "#02-A" },
      { id: "email", label: "Email Sequences", partNumber: "#02-B" },
      { id: "seo", label: "SEO & Content", partNumber: "#02-C" },
      { id: "outbound", label: "Channel ROI", partNumber: "#02-D" },
    ],
  },
  {
    id: "positioning",
    code: "03",
    name: "PMF & Positioning",
    partTitle: "Upper Ribbon Hood & Brand Plaque",
    finding:
      "Sharpening who your product is for and why it wins, so the right buyers recognize their fit in 5 seconds.",
    isProblem: false,
    subParts: [
      {
        id: "value-prop",
        label: "Clear Value Proposition",
        partNumber: "#03-A",
      },
      { id: "copy", label: "Ideal Buyer Fit", partNumber: "#03-B" },
      { id: "brand", label: "Brand Story", partNumber: "#03-C" },
    ],
  },
  {
    id: "development",
    code: "04",
    name: "Product & Development",
    partTitle: "Logic PCB, Flex Bus & Drive Motor",
    finding: "Profiling core architecture, load latency & feature friction.",
    isProblem: true,
    subParts: [
      { id: "arch", label: "Core Architecture", partNumber: "#04-A" },
      { id: "perf", label: "Speed & Latency", partNumber: "#04-B" },
      { id: "integrations", label: "Checkout & APIs", partNumber: "#04-C" },
      { id: "debt", label: "Product Strategy & Features", partNumber: "#04-D" },
    ],
  },
  {
    id: "onboarding",
    code: "05",
    name: "Onboarding & Aha! Moment",
    partTitle: "Front Terminal Bezel & Keybed",
    finding:
      "Getting new users to their first real win fast, so free signups actually activate, stick around, and pay.",
    isProblem: false,
    subParts: [
      { id: "activation", label: "Time to Aha! Moment", partNumber: "#05-B" },
      { id: "first-run", label: "First-Run UX", partNumber: "#05-A" },
      { id: "retention", label: "Churn & Analytics", partNumber: "#05-C" },
    ],
  },
];
