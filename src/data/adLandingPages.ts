export type AdRouteSlug =
  | "mvp-rescue"
  | "conversion-engineering"
  | "speed-audit";

export type PricingModelKey = "project" | "partnership";

export interface AdDiagnosticMetric {
  label: string;
  before: string;
  after: string;
  statusTag: string;
}

export interface AdRealityBullet {
  title: string;
  description: string;
}

export interface AdDeliverableCard {
  code: string;
  title: string;
  description: string;
  tags: string[];
}

export interface AdProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface AdPricingColumn {
  key: PricingModelKey;
  badge: string;
  title: string;
  rate: string;
  rateSub: string;
  highlighted?: boolean;
  rows: {
    label: string;
    value: string;
  }[];
}

export interface AdFormSelectField {
  name: string;
  label: string;
  required?: boolean;
  options: string[];
}

export interface AdLandingPageConfig {
  slug: AdRouteSlug;
  seoTitle: string;
  seoDescription: string;
  headerCtaLabel: string;
  eyebrow: string;
  h1: string;
  h1Accent: string;
  subheadline: string;
  primaryCta: string;
  microCopy: string;
  diagnosticCard: {
    headerLabel: string;
    liveBadge: string;
    title: string;
    subtitle: string;
    metrics: AdDiagnosticMetric[];
    footerNote: string;
  };
  realitySection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    bullets: AdRealityBullet[];
  };
  deliverablesSection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    cards: AdDeliverableCard[];
  };
  howItWorksSection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    steps: AdProcessStep[];
  };
  pricingSection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    subline: string;
    equalWeight?: boolean;
    columns: [AdPricingColumn, AdPricingColumn];
  };
  formSection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    subline: string;
    urlField: {
      label: string;
      placeholder: string;
      required: boolean;
    };
    selectFields: AdFormSelectField[];
    textareaField?: {
      name: string;
      label: string;
      placeholder: string;
      required?: boolean;
    };
    submitButton: string;
    successHeadline: string;
    successMessage: string;
  };
}

export const AD_LANDING_PAGES: Record<AdRouteSlug, AdLandingPageConfig> = {
  "mvp-rescue": {
    slug: "mvp-rescue",
    seoTitle: "MVP Rescue & Production Refactoring | Steward",
    seoDescription:
      "Senior product engineers refactor your fragile AI or freelance MVP into clean, scalable production SaaS at a straight $60/hr rate.",
    headerCtaLabel: "Book 20-Min Triage",
    eyebrow: "FOR SEED & PRE-SEED SAAS FOUNDERS",
    h1: "Your Prototype Validated the Idea.",
    h1Accent: "Now Let’s Make It Survive Real Users.",
    subheadline:
      "AI tools and rushed freelancers get you to a demo. They don't get you to production. Senior product engineers refactor your fragile codebase into clean, scalable SaaS—without a 6-month agency retainer.",
    primaryCta: "Book a 20-Min Codebase Triage",
    microCopy:
      "Straight $60/hr project rate. Zero lock-in. Direct access to the engineers writing your code.",
    diagnosticCard: {
      headerLabel: "CODEBASE TRIAGE SNAPSHOT",
      liveBadge: "PRODUCTION AUDIT",
      title: "From Fragile Prototype to Production-Grade SaaS",
      subtitle: "Typical 14-day rescue sprint outcome across core architecture:",
      metrics: [
        {
          label: "Auth & Stripe Webhooks",
          before: "Race conditions & dropped events",
          after: "Idempotent, typed & verified",
          statusTag: "STABILIZED",
        },
        {
          label: "Database & API Layer",
          before: "Unprotected routes & N+1 queries",
          after: "Row-level security & schema cleanup",
          statusTag: "HARDENED",
        },
        {
          label: "Release Confidence",
          before: "1 fix breaks 2 other screens",
          after: "Clean CI/CD & modular boundaries",
          statusTag: "SHIPPING FAST",
        },
      ],
      footerNote: "No $50k rewrite bluff. We stabilize the core you already own.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "The demo worked.",
      headlineAccent: "Production is a different sport.",
      bullets: [
        {
          title: "The Whack-a-Mole Trap",
          description:
            "Fixing one bug in your checkout or auth flow breaks two unrelated screens.",
        },
        {
          title: "Silent Revenue Leaks",
          description:
            "Broken mobile layouts, dropped Stripe webhooks, and failed signups quietly kill early traction before users ever complain.",
        },
        {
          title: "The Rewrite Bluff",
          description:
            "Most agencies tell you to throw everything away for a $50k rebuild. Usually, you don’t need a rewrite—you need disciplined refactoring of the core.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / WHAT WE FIX",
      headline: "Surgical engineering across your",
      headlineAccent: "most fragile bottlenecks.",
      cards: [
        {
          code: "01",
          title: "Production Architecture",
          description:
            "Untangling monolithic components, stabilizing state management, and enforcing strict TypeScript boundaries so features ship cleanly.",
          tags: ["React", "Next.js", "TypeScript", "Node.js"],
        },
        {
          code: "02",
          title: "Auth, Billing & Data Integrity",
          description:
            "Fixing Stripe webhook edge cases, broken subscription state transitions, session drops, and database schema inconsistencies.",
          tags: ["Stripe Edge Cases", "Auth Flows", "Schema Cleanup"],
        },
        {
          code: "03",
          title: "Security & Stability",
          description:
            "Locking down exposed API endpoints, patching client-side state leaks, and setting up automated CI/CD checks before deploy.",
          tags: ["Endpoint Security", "State Leaks", "CI/CD"],
        },
        {
          code: "04",
          title: "Mobile & Core UX Friction",
          description:
            "Eliminating broken responsive layouts, sluggish modals, and dead-end error states that make early customers lose trust.",
          tags: ["Responsive Polish", "Core UX", "Error Recovery"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW IT WORKS",
      headline: "Three steps from fragile repo to",
      headlineAccent: "clean production code.",
      steps: [
        {
          step: "01",
          title: "20-Min Codebase Triage",
          description:
            "We inspect your repo, live app, and error logs together to isolate the exact architectural bottlenecks causing instability.",
        },
        {
          step: "02",
          title: "Scoped Rescue Sprint",
          description:
            "Senior engineers refactor the critical paths first—auth, billing, data layer, and core UX—with daily commits in your GitHub.",
        },
        {
          step: "03",
          title: "Clean Handover (or Growth Phase)",
          description:
            "You get a documented, production-ready codebase your team can build on—or we stay on to engineer conversion and growth.",
        },
      ],
    },
    pricingSection: {
      eyebrow: "04 / TRANSPARENT COMMERCIAL MODELS",
      headline: "Founder-aligned pricing.",
      headlineAccent: "Zero agency bloat.",
      subline:
        "Most MVP rescues start with our straight $60/hr Project sprint for immediate stabilization, then optionally move to Partnership once live traffic scales.",
      columns: [
        {
          key: "project",
          badge: "RECOMMENDED FOR MVP RESCUE",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Clean handover",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value: "Straight $60/hr project rate — 100% guaranteed, zero retainer lock-in.",
            },
            {
              label: "We're responsible for",
              value: "Stabilizing your repo, fixing auth/Stripe/data bugs, and shipping production-grade code.",
            },
            {
              label: "We stay",
              value: "Through your scoped rescue sprint until every agreed milestone is merged and verified.",
            },
            {
              label: "Handover",
              value: "Clean handover into your GitHub with clear architecture notes so any engineer can take over.",
            },
          ],
        },
        {
          key: "partnership",
          badge: "FOR POST-LAUNCH GROWTH",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed · 40% at risk on outcome",
          highlighted: false,
          rows: [
            {
              label: "Fee structure",
              value: "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk tied directly to agreed outcome.",
            },
            {
              label: "We're responsible for",
              value: "Moving the commercial metric we agree on up front (activation, trial-to-paid, or net revenue).",
            },
            {
              label: "We stay",
              value: "Through the full post-launch measurement window, iterating until the target number moves.",
            },
            {
              label: "Handover",
              value: "Full production ownership plus instrumented analytics proving the revenue lift.",
            },
          ],
        },
      ],
    },
    formSection: {
      eyebrow: "05 / BOOK YOUR TRIAGE",
      headline: "Let’s inspect your codebase and",
      headlineAccent: "map the fastest fix.",
      subline:
        "Share your details below. A senior product engineer will review your stack and reply within 24 hours to lock in your 20-minute triage.",
      urlField: {
        label: "Product / Repo URL (Optional)",
        placeholder: "https://app.yourproduct.com or github.com/...",
        required: false,
      },
      selectFields: [
        {
          name: "current_stack",
          label: "Current Stack",
          required: true,
          options: ["Next.js", "React", "Vue", "Other"],
        },
        {
          name: "built_by",
          label: "How was it built?",
          required: true,
          options: ["AI tools (Cursor/Lovable/v0)", "Freelancer", "Internal team"],
        },
      ],
      textareaField: {
        name: "breaking_right_now",
        label: "What is breaking right now?",
        placeholder:
          "e.g. Stripe webhooks failing, auth state dropping on mobile, Cursor prototype throwing hydration/DB errors under real users...",
        required: true,
      },
      submitButton: "Book My Codebase Triage",
      successHeadline: "Your Codebase Triage Request Is In.",
      successMessage:
        "We’ve queued your product details for engineering review. Expect a direct note from Ashish or Ruchi within 24 hours with times for your 20-minute triage.",
    },
  },

  "conversion-engineering": {
    slug: "conversion-engineering",
    seoTitle: "SaaS Conversion & Onboarding Engineering | Steward",
    seoDescription:
      "We fix your SaaS conversion leaks across landing pages, pricing, and onboarding—with 40% of our fee at risk on the outcome.",
    headerCtaLabel: "Get Free Leak Audit",
    eyebrow: "COMMERCIAL ENGINEERING FOR US & EU SAAS FOUNDERS",
    h1: "We Fix Your SaaS Conversion Leaks—",
    h1Accent: "With 40% of Our Fee At Risk.",
    subheadline:
      "Stop pouring ad spend into a funnel that drops high-intent visitors. We diagnose where your signup, pricing, and onboarding flows lose revenue, engineer the fix, and don't collect our full fee unless the numbers move.",
    primaryCta: "Get a Free Conversion Leak Audit",
    microCopy:
      "Includes a 5-minute Loom teardown of your live funnel before we ever get on a call.",
    diagnosticCard: {
      headerLabel: "FUNNEL LEAK DIAGNOSTIC",
      liveBadge: "40% FEE AT RISK",
      title: "Same Ad Spend. Radically Different Net Revenue.",
      subtitle: "Where high-intent SaaS funnels quietly bleed out:",
      metrics: [
        {
          label: "Landing & Pricing Clarity",
          before: "2.1% visitor-to-signup (hesitation)",
          after: "4.8% high-intent conversion",
          statusTag: "+128% LIFT",
        },
        {
          label: "Signup-to-Aha! Activation",
          before: "64% drop-off at step 2 setup",
          after: "Guided first-session payoff",
          statusTag: "LEAK SEALED",
        },
        {
          label: "Trial-to-Paid Upgrade",
          before: "Passive paywall & tier confusion",
          after: "In-workflow upgrade triggers",
          statusTag: "REVENUE UP",
        },
      ],
      footerNote:
        "We agree on one target metric up front—and put 40% of our fee on the line.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "More traffic won’t save a",
      headlineAccent: "leaking funnel.",
      bullets: [
        {
          title: "Traffic Is Up, Pipeline Is Flat",
          description:
            "Visitors hit your landing or pricing page, hesitate, and leave—driving your CAC up every month.",
        },
        {
          title: "Onboarding Drop-Off",
          description:
            "Users sign up for a trial, hit friction on step two, and never reach their \"aha\" moment.",
        },
        {
          title: "Mobile Friction You Don't See",
          description:
            "Your team builds on 27-inch monitors while first-touch buyers evaluate you on their phones between meetings.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / WHAT WE ENGINEER",
      headline: "End-to-end commercial engineering",
      headlineAccent: "from first click to paid plan.",
      cards: [
        {
          code: "01",
          title: "Landing & Pricing Page Rebuilds",
          description:
            "Sharpening positioning, message match, and tier architecture so high-intent visitors immediately understand why you win and which plan fits.",
          tags: ["Message Match", "Pricing Architecture", "Mobile First"],
        },
        {
          code: "02",
          title: "Activation & Onboarding Flows",
          description:
            "Stripping unnecessary form fields, empty states, and setup walls so new signups reach their first value moment in under 90 seconds.",
          tags: ["First-Session Aha!", "Empty States", "Guided Setup"],
        },
        {
          code: "03",
          title: "Checkout & Upgrade Friction",
          description:
            "Engineering contextual upgrade prompts, clean Stripe checkout transitions, and expansion triggers inside the product workflow.",
          tags: ["Trial-to-Paid", "Stripe Checkout", "Expansion Prompts"],
        },
        {
          code: "04",
          title: "Instrumentation & Proof",
          description:
            "Setting up clean step-by-step cohort tracking so you see exact drop-off rates before and after every shipped release.",
          tags: ["Funnel Cohorts", "Attribution", "Revenue Proof"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW IT WORKS",
      headline: "No pitch decks.",
      headlineAccent: "We start by showing you the leak.",
      steps: [
        {
          step: "01",
          title: "Free Conversion Leak Audit (5-min Loom)",
          description:
            "We walk through your live landing page, pricing, and signup flow on video—pinpointing the exact friction points costing you customers.",
        },
        {
          step: "02",
          title: "Agree on the Number",
          description:
            "We define one clear commercial metric (Visitor-to-Demo, Signup-to-Activation, or Trial-to-Paid) and tie 40% of our fee to moving it.",
        },
        {
          step: "03",
          title: "Ship & Measure",
          description:
            "We design, code, and deploy the fixes directly into your stack, then stay through the measurement window to verify the lift.",
        },
      ],
    },
    pricingSection: {
      eyebrow: "04 / OUTCOME-BACKED PRICING",
      headline: "We own the outcome.",
      headlineAccent: "Or you don’t pay our full fee.",
      subline:
        "Choose our flagship Partnership model where 40% of our fee is at risk on your conversion lift, or a straight $60/hr Project sprint.",
      columns: [
        {
          key: "partnership",
          badge: "RECOMMENDED · SKIN IN THE GAME",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed · 40% at risk on outcome",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value: "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk on the agreed conversion target.",
            },
            {
              label: "We're responsible for",
              value: "Diagnosing the leak, shipping the product/funnel fix, and moving your agreed conversion metric.",
            },
            {
              label: "We stay",
              value: "Through the post-launch measurement window, iterating on real user behavior until the number moves.",
            },
            {
              label: "Handover",
              value: "Production code + before/after cohort verification proving the net revenue impact.",
            },
          ],
        },
        {
          key: "project",
          badge: "FIXED EXECUTION",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Handover done",
          highlighted: false,
          rows: [
            {
              label: "Fee structure",
              value: "Straight $60/hr rate — 100% guaranteed for founders who already have a fixed spec.",
            },
            {
              label: "We're responsible for",
              value: "Executing and shipping the agreed landing, pricing, or onboarding rebuild cleanly and fast.",
            },
            {
              label: "We stay",
              value: "Until the scoped deliverables are deployed to production and handed over.",
            },
            {
              label: "Handover",
              value: "Handover done cleanly into your repo with zero ongoing commitment.",
            },
          ],
        },
      ],
    },
    formSection: {
      eyebrow: "05 / GET YOUR FREE 5-MIN LOOM TEARDOWN",
      headline: "Let’s find what’s costing",
      headlineAccent: "you revenue.",
      subline:
        "Drop your URL below. We’ll inspect your live funnel and send you a personal 5-minute Loom teardown within 24–48 hours. No sales call required.",
      urlField: {
        label: "Website / App URL *",
        placeholder: "https://yourproduct.com",
        required: true,
      },
      selectFields: [
        {
          name: "current_stage",
          label: "Current Stage",
          required: true,
          options: ["Pre-Seed", "Seed", "Series A+"],
        },
        {
          name: "biggest_leak",
          label: "Biggest Leak Right Now",
          required: true,
          options: ["Visitor-to-Demo", "Signup-to-Activation", "Trial-to-Paid"],
        },
      ],
      submitButton: "Send Me My Free Leak Audit",
      successHeadline: "Your 5-Minute Loom Teardown Is Queued.",
      successMessage:
        "We’re inspecting your funnel now. You’ll receive your prioritized Loom teardown directly in your inbox within 24–48 hours—no strings attached.",
    },
  },

  "speed-audit": {
    slug: "speed-audit",
    seoTitle: "React & Next.js Speed Audit & Core Web Vitals Overhaul | Steward",
    seoDescription:
      "We engineer sub-1.5s load times and passing Core Web Vitals (LCP, INP, CLS) for React and Next.js SaaS applications.",
    headerCtaLabel: "Free 5-Min Speed Audit",
    eyebrow: "REACT & NEXT.JS PERFORMANCE ENGINEERING",
    h1: "Slow SaaS Kills Retention and Inflates Your CAC.",
    h1Accent: "We Engineer Sub-1.5s Load Times.",
    subheadline:
      "Bloated JS bundles, layout shifts, and sluggish dashboards quietly tank your Google Ads Quality Score, SEO rankings, and trial conversions. We audit the bottlenecks, fix the code, and prove the gain.",
    primaryCta: "Request a Free 5-Min Speed Audit",
    microCopy:
      "Get a 3-point technical teardown of your site or app. Choose $60/hr execution or our 40% outcome-backed model.",
    diagnosticCard: {
      headerLabel: "CORE WEB VITALS BENCHMARK",
      liveBadge: "CRUX & LIGHTHOUSE",
      title: "Real-User Performance After a Speed Sprint",
      subtitle: "Measured at the 75th percentile on mobile & desktop:",
      metrics: [
        {
          label: "Largest Contentful Paint (LCP)",
          before: "4.6s (Ad bounce & low Quality Score)",
          after: "1.1s instant above-the-fold render",
          statusTag: "SUB-1.5S PASS",
        },
        {
          label: "Interaction to Next Paint (INP)",
          before: "340ms main-thread JS lockup",
          after: "48ms snappy UI responsiveness",
          statusTag: "ZERO LAG",
        },
        {
          label: "Cumulative Layout Shift (CLS)",
          before: "0.24 jumping fonts & un-sized media",
          after: "0.00 rock-solid layout stability",
          statusTag: "0.00 CLS",
        },
      ],
      footerNote:
        "Faster loads directly lift Google Ads Quality Score, organic rankings, and signup conversion.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "Every extra second of load time",
      headlineAccent: "taxes your growth twice.",
      bullets: [
        {
          title: "You’re Overpaying for Ads",
          description:
            "Slow landing pages drag down Google Ads Quality Score and cause high-intent buyers to bounce before your hero renders.",
        },
        {
          title: "SEO Ceiling",
          description:
            "Failing Core Web Vitals (LCP, INP, CLS) holds your highest-intent commercial pages back in organic search.",
        },
        {
          title: "Churn by a Thousand Cuts",
          description:
            "When your SaaS dashboard lags on every click or filter, users perceive the product as unreliable.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / WHAT WE OPTIMIZE",
      headline: "Deep React & Next.js optimization.",
      headlineAccent: "Not superficial plugin tweaks.",
      cards: [
        {
          code: "01",
          title: "Core Web Vitals Overhaul (LCP, INP, CLS)",
          description:
            "Eliminating render-blocking scripts, preloading critical assets, and reserving exact layout dimensions for sub-1.5s LCP and 0 CLS.",
          tags: ["LCP < 1.5s", "INP < 100ms", "CLS 0.00"],
        },
        {
          code: "02",
          title: "React & Next.js Bottlenecks",
          description:
            "Moving heavy client components to React Server Components, pruning hydration payloads, and stopping cascading re-renders.",
          tags: ["RSC Architecture", "Bundle Splitting", "Hydration Diet"],
        },
        {
          code: "03",
          title: "Asset & Caching Architecture",
          description:
            "Configuring modern AVIF/WebP pipelines, font subsetting, edge CDN cache headers, and ISR/streaming boundaries.",
          tags: ["Edge Caching", "Next/Image & Fonts", "Streaming SSR"],
        },
        {
          code: "04",
          title: "API & Data Fetching Cleanup",
          description:
            "Collapsing sequential client waterfalls into parallel server queries, adding optimistic UI updates, and indexing hot DB queries.",
          tags: ["Zero Waterfalls", "Parallel Queries", "Instant UI"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW IT WORKS",
      headline: "Measured in milliseconds",
      headlineAccent: "and conversion lift.",
      steps: [
        {
          step: "01",
          title: "5-Minute Technical Teardown (Free)",
          description:
            "We profile your live bundle, network waterfall, and CrUX telemetry to show you the top 3 bottlenecks slowing you down.",
        },
        {
          step: "02",
          title: "Targeted Performance Sprint",
          description:
            "We ship surgical PRs into your repo—cutting JS payload weight, fixing hydration/render blockers, and optimizing data waterfalls.",
        },
        {
          step: "03",
          title: "Verified Benchmarks",
          description:
            "We verify the before/after improvement across Lighthouse, field CrUX metrics, and your landing page conversion rate.",
        },
      ],
    },
    pricingSection: {
      eyebrow: "04 / TWO WAYS TO WORK TOGETHER",
      headline: "Pick fixed execution or",
      headlineAccent: "tie 40% to the result.",
      subline:
        "Both models give you direct senior React/Next.js performance engineering—choose whichever structure fits your team best.",
      equalWeight: true,
      columns: [
        {
          key: "project",
          badge: "FIXED SPEED SPRINT",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Fixed Speed Sprint",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value: "Straight $60/hr engineering rate — 100% guaranteed with a clear upfront sprint cap.",
            },
            {
              label: "We're responsible for",
              value: "Shipping every technical optimization from your speed audit and hitting agreed Lighthouse/lab benchmarks.",
            },
            {
              label: "We stay",
              value: "Through the performance sprint until all PRs are merged, deployed, and verified in production.",
            },
            {
              label: "Handover",
              value: "Clean PRs + performance regression guardrails so your bundle stays fast.",
            },
          ],
        },
        {
          key: "partnership",
          badge: "OUTCOME-BACKED LIFT",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed · 40% tied to speed + conversion lift",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value: "60% guaranteed (30% upfront, 30% milestone) + 40% at risk on agreed speed and conversion targets.",
            },
            {
              label: "We're responsible for",
              value: "Achieving sub-1.5s load benchmarks AND lifting your target landing/signup conversion metric.",
            },
            {
              label: "We stay",
              value: "Through the full field-measurement window (CrUX + funnel analytics) to prove the commercial gain.",
            },
            {
              label: "Handover",
              value: "Full production ownership with verified before/after speed and conversion telemetry.",
            },
          ],
        },
      ],
    },
    formSection: {
      eyebrow: "05 / REQUEST YOUR FREE 5-MIN SPEED AUDIT",
      headline: "Let’s benchmark your stack and",
      headlineAccent: "uncover the bottlenecks.",
      subline:
        "Enter your URL below. We’ll inspect your bundle, network waterfall, and Core Web Vitals and send a 3-point technical teardown within 24 hours.",
      urlField: {
        label: "Website or App URL *",
        placeholder: "https://yourproduct.com",
        required: true,
      },
      selectFields: [
        {
          name: "primary_stack",
          label: "Primary Stack",
          required: true,
          options: ["Next.js", "React", "Framer", "Other"],
        },
        {
          name: "main_goal",
          label: "Main Goal",
          required: true,
          options: [
            "Pass Core Web Vitals",
            "Lower Ad Bounce Rate",
            "Speed Up App Dashboard",
          ],
        },
      ],
      submitButton: "Get My Free 5-Min Speed Audit",
      successHeadline: "Your 5-Min Speed Audit Is Underway.",
      successMessage:
        "We’re profiling your bundle and Core Web Vitals now. Expect your 3-point technical teardown in your inbox within 24 hours.",
    },
  },
};
