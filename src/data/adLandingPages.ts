export type AdRouteSlug =
  | "mvp-rescue"
  | "conversion-engineering"
  | "speed-audit"
  | "pricing-strategy"
  | "onboarding-retention"
  | "engagement-models";

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

export interface AdFaqItem {
  question: string;
  answer: string;
}

export interface AdComparisonTableRow {
  dimension: string;
  stewardPartnership: string;
  stewardProject: string;
  retainerAgency: string;
  inHouseHire: string;
}

export interface AdComparisonTableSection {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subline: string;
  rows: AdComparisonTableRow[];
}

export interface AdLandingPageConfig {
  slug: AdRouteSlug;
  serviceName: string;
  serviceType: string;
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
  comparisonTableSection?: AdComparisonTableSection;
  pricingSection: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    subline: string;
    equalWeight?: boolean;
    columns: [AdPricingColumn, AdPricingColumn];
  };
  faqs: AdFaqItem[];
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
    serviceName: "SaaS MVP Rescue & Next.js Refactoring",
    serviceType: "SaaS Software Refactoring and Product Engineering",
    seoTitle: "SaaS MVP Rescue & Next.js Refactoring Agency | Hello Steward",
    seoDescription:
      "Turn fragile AI or freelancer prototypes into production-grade React & Next.js SaaS in 14 days. Straight $60/hr senior product engineering, zero lock-in.",
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
      footerNote:
        "No $50k rewrite bluff. We stabilize the core you already own.",
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
              value:
                "Straight $60/hr project rate — 100% guaranteed, zero retainer lock-in.",
            },
            {
              label: "We're responsible for",
              value:
                "Stabilizing your repo, fixing auth/Stripe/data bugs, and shipping production-grade code.",
            },
            {
              label: "We stay",
              value:
                "Through your scoped rescue sprint until every agreed milestone is merged and verified.",
            },
            {
              label: "Handover",
              value:
                "Clean handover into your GitHub with clear architecture notes so any engineer can take over.",
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
              value:
                "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk tied directly to agreed outcome.",
            },
            {
              label: "We're responsible for",
              value:
                "Moving the commercial metric we agree on up front (activation, trial-to-paid, or net revenue).",
            },
            {
              label: "We stay",
              value:
                "Through the full post-launch measurement window, iterating until the target number moves.",
            },
            {
              label: "Handover",
              value:
                "Full production ownership plus instrumented analytics proving the revenue lift.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question: "Do I need a full rewrite or an MVP rescue sprint?",
        answer:
          "Most early-stage SaaS founders do not need a $50,000 from-scratch rewrite. In over 85% of codebases we audit, a focused 14-day MVP rescue sprint refactoring authentication, Stripe billing webhooks, database queries, and TypeScript component boundaries transforms a fragile prototype into a stable, production-grade React and Next.js application.",
      },
      {
        question:
          "Can you refactor MVPs built with AI tools like Cursor, Lovable, or v0?",
        answer:
          "Yes, we specialize in refactoring AI-generated SaaS prototypes built in Cursor, Lovable, Bolt, and v0 into secure production systems. We untangle monolithic client components, enforce server-side API validation, add row-level database security, and establish clean state management while preserving your existing UI and feature velocity.",
      },
      {
        question: "How much does a 14-day SaaS MVP rescue sprint cost?",
        answer:
          "Our MVP rescue sprints are billed at a transparent $60/hr Project rate with a fixed upfront hour cap and zero retainer lock-in. A typical 14-day stabilization sprint requires 40 to 80 senior engineering hours ($2,400 to $4,800 total), depending on the complexity of your authentication, database, and billing flows.",
      },
      {
        question:
          "How do you handle GitHub workflow and code handover after the rescue sprint?",
        answer:
          "We work directly inside your GitHub repository using clean feature branches, atomic pull requests, and automated CI/CD checks from day one. At the end of the sprint, you receive 100% intellectual property ownership, documented architecture notes, and a clean codebase that any internal or future engineer can extend immediately.",
      },
      {
        question:
          "What happens after our SaaS codebase is stabilized in production?",
        answer:
          "Once your codebase is stable in production, you can either take over development internally with zero ongoing obligation or transition into our $100/hr Outcome Partnership model. In the Partnership model, we put 40% of our fee at risk to engineer onboarding activation, trial-to-paid conversion, and net revenue growth.",
      },
    ],
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
          options: [
            "AI tools (Cursor/Lovable/v0)",
            "Freelancer",
            "Internal team",
          ],
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
    serviceName: "SaaS Conversion Engineering & CRO",
    serviceType: "B2B SaaS Conversion Rate Optimization and Growth Engineering",
    seoTitle: "SaaS Conversion Engineering & CRO Agency | Hello Steward",
    seoDescription:
      "We fix B2B SaaS signup, pricing, and onboarding leaks—with 40% of our fee at risk on your conversion lift. Get a free 5-minute Loom funnel teardown.",
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
            'Users sign up for a trial, hit friction on step two, and never reach their "aha" moment.',
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
              value:
                "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk on the agreed conversion target.",
            },
            {
              label: "We're responsible for",
              value:
                "Diagnosing the leak, shipping the product/funnel fix, and moving your agreed conversion metric.",
            },
            {
              label: "We stay",
              value:
                "Through the post-launch measurement window, iterating on real user behavior until the number moves.",
            },
            {
              label: "Handover",
              value:
                "Production code + before/after cohort verification proving the net revenue impact.",
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
              value:
                "Straight $60/hr rate — 100% guaranteed for founders who already have a fixed spec.",
            },
            {
              label: "We're responsible for",
              value:
                "Executing and shipping the agreed landing, pricing, or onboarding rebuild cleanly and fast.",
            },
            {
              label: "We stay",
              value:
                "Until the scoped deliverables are deployed to production and handed over.",
            },
            {
              label: "Handover",
              value:
                "Handover done cleanly into your repo with zero ongoing commitment.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question: "How does the 40% fee-at-risk Partnership model work?",
        answer:
          "Under our $100/hr Partnership model, 60% of our fee is guaranteed (billed 30% upfront and 30% upon production deployment) while 40% is placed at risk on a single agreed conversion metric. We only collect the final 40% once post-launch cohort telemetry confirms your target conversion lift has been achieved.",
      },
      {
        question:
          "What is the difference between traditional CRO agencies and SaaS conversion engineering?",
        answer:
          "Traditional CRO agencies run surface-level button color tests and hand your team static Figma mockups that sit in a backlog for months. As a SaaS conversion engineering partner, Hello Steward diagnoses deep funnel leaks across positioning, pricing, onboarding, and application UX, then writes and deploys the production React and Next.js code directly.",
      },
      {
        question: "What comes in the free 5-minute Loom conversion leak audit?",
        answer:
          "Our free 5-minute Loom conversion leak audit is a personalized video teardown recorded by a senior product engineer inspecting your live landing page, pricing tiers, signup flow, and first-session onboarding. We pinpoint the top three friction points costing you customers and outline concrete engineering fixes before we ever get on a call.",
      },
      {
        question:
          "How do you measure conversion lift without corrupting existing analytics?",
        answer:
          "We instrument clean step-by-step cohort tracking using your existing analytics stack (such as PostHog, Mixpanel, Amplitude, or GA4) alongside server-side Stripe billing events. By baselining visitor-to-signup, signup-to-activation, and trial-to-paid conversion rates prior to deployment, we isolate the exact commercial lift generated by each shipped release.",
      },
      {
        question:
          "How long does a typical SaaS conversion engineering engagement take?",
        answer:
          "A typical SaaS conversion engineering sprint takes two to three weeks to audit, design, code, and deploy into production, followed by a two-to-four-week live measurement window. During the measurement window, we monitor real user sessions and ship iterative adjustments until the agreed conversion target is met.",
      },
    ],
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
          options: [
            "Visitor-to-Demo",
            "Signup-to-Activation",
            "Trial-to-Paid",
          ],
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
    serviceName: "React & Next.js Speed Optimization & Core Web Vitals Audit",
    serviceType: "React and Next.js Web Performance and Core Web Vitals Engineering",
    seoTitle:
      "React & Next.js Speed Optimization & Core Web Vitals Agency | Hello Steward",
    seoDescription:
      "We engineer sub-1.5s SaaS load times, 0.00 CLS, and <100ms INP to lower Google Ads CAC and lift trial conversions. Request a free 5-min speed audit.",
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
              value:
                "Straight $60/hr engineering rate — 100% guaranteed with a clear upfront sprint cap.",
            },
            {
              label: "We're responsible for",
              value:
                "Shipping every technical optimization from your speed audit and hitting agreed Lighthouse/lab benchmarks.",
            },
            {
              label: "We stay",
              value:
                "Through the performance sprint until all PRs are merged, deployed, and verified in production.",
            },
            {
              label: "Handover",
              value:
                "Clean PRs + performance regression guardrails so your bundle stays fast.",
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
              value:
                "60% guaranteed (30% upfront, 30% milestone) + 40% at risk on agreed speed and conversion targets.",
            },
            {
              label: "We're responsible for",
              value:
                "Achieving sub-1.5s load benchmarks AND lifting your target landing/signup conversion metric.",
            },
            {
              label: "We stay",
              value:
                "Through the full field-measurement window (CrUX + funnel analytics) to prove the commercial gain.",
            },
            {
              label: "Handover",
              value:
                "Full production ownership with verified before/after speed and conversion telemetry.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question:
          "How fast can you get a Next.js SaaS app under 1.5s LCP and 0.00 CLS?",
        answer:
          "Most React and Next.js SaaS applications achieve sub-1.5s Largest Contentful Paint (LCP) and 0.00 Cumulative Layout Shift (CLS) within a 7-to-14-day performance engineering sprint. We eliminate render-blocking client bundles, convert above-the-fold views to React Server Components, reserve exact SSR layout dimensions, and optimize critical font and asset preloading.",
      },
      {
        question:
          "Why does our Next.js site have high Total Blocking Time (TBT) and slow INP?",
        answer:
          "High Total Blocking Time (TBT) and poor Interaction to Next Paint (INP) in Next.js applications are almost always caused by hydrating oversized client component trees, third-party tag managers, and continuous requestAnimationFrame loops during initial load. We split heavy interactive stages with dynamic imports and defer non-critical hydration off the main thread.",
      },
      {
        question:
          "How does improving Core Web Vitals lower Google Ads CAC for B2B SaaS?",
        answer:
          "Google Ads uses landing page experience and real-user Core Web Vitals telemetry as direct inputs into your ad Quality Score. Engineering sub-1.5s load times cuts pre-render ad bounce rates by 20% to 45% and raises Quality Scores, which directly reduces your cost-per-click (CPC) and customer acquisition cost (CAC).",
      },
      {
        question:
          "Can you fix Cumulative Layout Shift (CLS) without changing our visual design?",
        answer:
          "Yes, we eliminate Cumulative Layout Shift (CLS) while keeping 100% of your visual design and animations intact. We replace client-side viewport checks that return null during SSR with height-matched structural containers, configure metric-compatible font fallbacks, and enforce explicit aspect ratios on all dynamic media and interactive stages.",
      },
      {
        question:
          "What is included in your free 5-minute React and Next.js speed audit?",
        answer:
          "Our free 5-minute speed audit delivers a prioritized 3-point engineering teardown of your live production URL. A senior Next.js performance engineer profiles your JavaScript chunk waterfall, main-thread long tasks, and Chrome UX Report (CrUX) field data to show you the exact code changes needed to reach 98–100 Lighthouse scores.",
      },
    ],
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

  "pricing-strategy": {
    slug: "pricing-strategy",
    serviceName: "SaaS Pricing Strategy & Monetization Engineering",
    serviceType: "B2B SaaS Pricing Strategy Consulting and Checkout Optimization",
    seoTitle: "SaaS Pricing Strategy & Monetization Consultant | Hello Steward",
    seoDescription:
      "Fix B2B SaaS tier confusion, passive paywalls, and Stripe upgrade friction. Senior product & growth partners offering $60/hr sprints or 40% fee-at-risk partnerships.",
    headerCtaLabel: "Free Pricing Teardown",
    eyebrow: "SAAS MONETIZATION & PRICING STRATEGY CONSULTANT",
    h1: "Your Pricing Page Is Where High-Intent Buyers Hesitate.",
    h1Accent: "We Engineer Monetization That Converts.",
    subheadline:
      "Most B2B SaaS startups guess their tiers, hide their value metric, and rely on passive paywalls. As your SaaS pricing strategy consultant and engineering partner, we align your packaging with buyer willingness-to-pay and build frictionless Stripe upgrade flows.",
    primaryCta: "Get a Free Pricing & Checkout Teardown",
    microCopy:
      "Includes a 5-minute Loom audit of your pricing page, tier packaging, and upgrade triggers.",
    diagnosticCard: {
      headerLabel: "MONETIZATION & CHECKOUT AUDIT",
      liveBadge: "UNIT 01 · REVENUE LIFT",
      title: "Turning Tier Confusion Into Predictable Expansion",
      subtitle: "Measured across B2B SaaS pricing & Stripe checkout rebuilds:",
      metrics: [
        {
          label: "Pricing Page-to-Checkout",
          before: "Tier paralysis & feature-matrix fatigue",
          after: "Clear value-metric anchor & plan fit",
          statusTag: "+64% UPGRADES",
        },
        {
          label: "In-Product Paywall Triggers",
          before: "Hard lockouts or invisible limits",
          after: "Contextual usage & seat expansion prompts",
          statusTag: "ARPU LIFT",
        },
        {
          label: "Stripe Checkout Completion",
          before: "38% cart abandonment at billing step",
          after: "1-click in-app upgrade & annual toggle",
          statusTag: "FRICTION ZERO",
        },
      ],
      footerNote:
        "We don't stop at pricing slide decks—we ship the interactive pricing UI and Stripe billing logic.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "Underpricing and confusing tiers",
      headlineAccent: "silently cap your net revenue.",
      bullets: [
        {
          title: "Feature-Table Paralysis",
          description:
            "When buyers have to compare 35 rows of checkboxes across four tiers, they delay the purchase decision and close the tab.",
        },
        {
          title: "Broken Value-Metric Alignment",
          description:
            "Charging solely per seat when customers derive value from usage, workflows, or automations starves your expansion revenue.",
        },
        {
          title: "Passive Paywalls & Checkout Drop-Off",
          description:
            "Users hit a generic 'Upgrade to Pro' wall or a multi-step external billing form without seeing the immediate ROI of upgrading.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / WHAT WE ENGINEER",
      headline: "Full-stack SaaS monetization and pricing strategy",
      headlineAccent: "from tier architecture to Stripe checkout.",
      cards: [
        {
          code: "01",
          title: "Tier Architecture & Value-Metric Alignment",
          description:
            "Restructuring your Good-Better-Best packaging around the exact usage or outcome metric your highest-LTV customers gladly pay to scale.",
          tags: ["Value Metrics", "Tier Packaging", "Annual Prepay"],
        },
        {
          code: "02",
          title: "Interactive Pricing Page Rebuilds",
          description:
            "Engineering fast, mobile-first pricing pages with clear buyer personas, interactive ROI calculators, and scannable decision tables.",
          tags: ["Interactive Pricing UI", "0.00 CLS", "Buyer Fit"],
        },
        {
          code: "03",
          title: "In-Workflow Upgrade & Paywall Triggers",
          description:
            "Replacing dead-end paywalls with contextual upgrade prompts triggered at the exact moment users experience product value.",
          tags: ["Contextual Paywalls", "Usage Thresholds", "Reverse Trials"],
        },
        {
          code: "04",
          title: "SaaS Checkout Optimization & Stripe Billing",
          description:
            "Eliminating billing friction with embedded Stripe checkout flows, instant proration previews, and automated failed-payment recovery.",
          tags: ["SaaS Checkout Optimization", "Stripe Billing", "Expansion MRR"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW IT WORKS",
      headline: "From pricing diagnosis to",
      headlineAccent: "verified revenue per visitor.",
      steps: [
        {
          step: "01",
          title: "Monetization & Pricing Teardown (Free)",
          description:
            "We audit your current pricing page, competitor positioning, trial-to-paid cohorts, and checkout drop-off in a 5-minute Loom video.",
        },
        {
          step: "02",
          title: "Architecture & Checkout Engineering",
          description:
            "We redesign your tier structure, code the new pricing page and in-app upgrade modals, and wire the Stripe subscription logic.",
        },
        {
          step: "03",
          title: "Cohort Verification",
          description:
            "We track visitor-to-paid conversion, average revenue per account (ARPA), and annual plan adoption across post-launch cohorts.",
        },
      ],
    },
    pricingSection: {
      eyebrow: "04 / TRANSPARENT COMMERCIAL MODELS",
      headline: "Hire a SaaS pricing strategy consultant",
      headlineAccent: "who actually ships the code.",
      subline:
        "Put 40% of our fee at risk on your trial-to-paid or ARPU lift under our Partnership model, or book a fixed $60/hr Project sprint.",
      columns: [
        {
          key: "partnership",
          badge: "RECOMMENDED · 40% FEE AT RISK",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed · 40% at risk on monetization lift",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value:
                "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk on agreed trial-to-paid or ARPA lift.",
            },
            {
              label: "We're responsible for",
              value:
                "Redesigning your pricing strategy, shipping the pricing/checkout UI, and lifting net revenue per user.",
            },
            {
              label: "We stay",
              value:
                "Through the post-launch billing cycle to test price points, paywall triggers, and checkout conversion.",
            },
            {
              label: "Handover",
              value:
                "Full production pricing UI, Stripe webhook integration, and verified cohort revenue attribution.",
            },
          ],
        },
        {
          key: "project",
          badge: "FIXED EXECUTION",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Scoped Pricing & Stripe Sprint",
          highlighted: false,
          rows: [
            {
              label: "Fee structure",
              value:
                "Straight $60/hr rate — 100% guaranteed with a clear upfront hour cap and zero retainer lock-in.",
            },
            {
              label: "We're responsible for",
              value:
                "Engineering your new pricing page, interactive calculators, in-app paywalls, and Stripe checkout flow.",
            },
            {
              label: "We stay",
              value:
                "Until your new pricing and billing architecture is deployed and verified in production.",
            },
            {
              label: "Handover",
              value:
                "Clean handover into your GitHub repository with documented billing and entitlement logic.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question:
          "What does a SaaS pricing strategy consultant at Hello Steward actually deliver?",
        answer:
          "Unlike strategy-only consultants who hand over a PDF slide deck, Hello Steward delivers both the commercial pricing architecture and the production code. We restructure your value metrics and tier packaging, rebuild your interactive pricing page, engineer contextual in-app upgrade paywalls, and implement the underlying Stripe checkout and entitlement logic.",
      },
      {
        question:
          "How do you fix SaaS trial-to-paid conversion and checkout drop-off?",
        answer:
          "We fix trial-to-paid conversion by replacing passive expiry banners with contextual in-workflow upgrade triggers tied to the exact feature or usage threshold where users experience value. Combined with embedded one-click Stripe checkout optimization and transparent annual savings toggles, this typically lifts paid upgrades by 30% to 65%.",
      },
      {
        question:
          "How do we choose the right value metric for our B2B SaaS pricing tiers?",
        answer:
          "The right B2B SaaS value metric aligns directly with the unit of value your customers grow into—such as active workflows, tracked assets, API volume, or revenue processed—rather than arbitrary seat limits. We analyze your highest-retention customer cohorts to anchor your tiers around a metric that drives natural expansion MRR.",
      },
      {
        question:
          "Can we test new SaaS pricing tiers without alienating existing customers?",
        answer:
          "Yes, we implement grandfathered Stripe subscription cohorts and feature-flagged pricing views so your existing customers remain untouched while new visitors evaluate the updated tier architecture. This allows us to measure real checkout conversion and average revenue per account (ARPA) before rolling changes out company-wide.",
      },
      {
        question:
          "How does your 40% fee-at-risk model work for SaaS monetization engagements?",
        answer:
          "In our $100/hr Partnership model, 60% of our fee covers the initial pricing research, UX redesign, and Stripe engineering (30% upfront, 30% at launch), while 40% is held at risk. You only pay the final 40% when your agreed monetization metric—such as pricing-page conversion or trial-to-paid upgrade rate—hits the target.",
      },
    ],
    formSection: {
      eyebrow: "05 / REQUEST YOUR FREE PRICING TEARDOWN",
      headline: "Let’s find where your pricing page",
      headlineAccent: "is leaving revenue on the table.",
      subline:
        "Share your URL below. We’ll record a 5-minute Loom teardown of your pricing architecture, value metrics, and checkout flow within 24–48 hours.",
      urlField: {
        label: "Pricing Page or App URL *",
        placeholder: "https://yourproduct.com/pricing",
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
          label: "Primary Monetization Challenge",
          required: true,
          options: [
            "Low Trial-to-Paid Conversion",
            "Pricing Page Bounce / Tier Confusion",
            "Checkout Drop-Off & Stripe Friction",
          ],
        },
      ],
      submitButton: "Send Me My Free Pricing Teardown",
      successHeadline: "Your Pricing & Monetization Teardown Is Queued.",
      successMessage:
        "We’re reviewing your pricing tiers and upgrade flow now. Expect your personalized 5-minute Loom teardown in your inbox within 24–48 hours.",
    },
  },

  "onboarding-retention": {
    slug: "onboarding-retention",
    serviceName: "SaaS Onboarding Optimization & Activation Engineering",
    serviceType: "B2B SaaS Onboarding Optimization, Activation and Retention Engineering",
    seoTitle:
      "SaaS Onboarding Optimization & Activation Engineering | Hello Steward",
    seoDescription:
      "Eliminate step-2 trial drop-offs and engineer under-90-second 'aha' moments. B2B SaaS onboarding, activation, and retention engineering.",
    headerCtaLabel: "Free Onboarding Audit",
    eyebrow: "SAAS ONBOARDING OPTIMIZATION & ACTIVATION ENGINEERING",
    h1: "Free Signups Mean Nothing If Users Stall on Step Two.",
    h1Accent: "We Engineer Under-90-Second Aha! Moments.",
    subheadline:
      "Most B2B SaaS churn happens in the first five minutes. As your product-led growth consultant and engineering partner, we strip out dead-end empty states, progressive-profile setup friction, and guide new signups to their first real win before they ever close the tab.",
    primaryCta: "Get a Free Onboarding & Activation Audit",
    microCopy:
      "Includes a 5-minute Loom walkthrough of your signup-to-activation flow. $60/hr sprint or 40% fee at risk.",
    diagnosticCard: {
      headerLabel: "FIRST-SESSION ACTIVATION TELEMETRY",
      liveBadge: "UNIT 05 · RETENTION LIFT",
      title: "From Ghosted Free Trials to Activated Power Users",
      subtitle: "Typical impact of a first-session onboarding engineering sprint:",
      metrics: [
        {
          label: "Time-to-First-Value (TTFV)",
          before: "14 mins of forms, docs & empty dashboards",
          after: "Under 90 seconds via pre-loaded templates",
          statusTag: "10X FASTER AHA",
        },
        {
          label: "Day-1 Activation Rate",
          before: "22% complete core setup action",
          after: "54% reach first verified product win",
          statusTag: "+145% ACTIVATION",
        },
        {
          label: "Day-30 Cohort Retention",
          before: "Silent churn after single session",
          after: "Habit loops & contextual lifecycle nudges",
          statusTag: "CHURN SEALED",
        },
      ],
      footerNote:
        "We engineer the actual in-app onboarding UX, sample data states, and cohort telemetry inside your repo.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "You don’t have a churn problem.",
      headlineAccent: "You have a first-session activation leak.",
      bullets: [
        {
          title: "The Cold Empty-State Wall",
          description:
            "New users finish signing up and land on a blank dashboard with zero data, forcing them to do 15 minutes of homework before seeing any value.",
        },
        {
          title: "Interrogation Before Payoff",
          description:
            "Asking for credit cards, 8-field company profiles, and complex SDK integrations before demonstrating the core product payoff kills momentum.",
        },
        {
          title: "Tooltip Tours Nobody Reads",
          description:
            "Slapping a 7-step third-party tooltip modal over a confusing interface just makes users click 'Skip' faster.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / WHAT WE ENGINEER",
      headline: " Practical SaaS onboarding optimization",
      headlineAccent: "built directly into your product workflow.",
      cards: [
        {
          code: "01",
          title: "Empty-State Redesign & Instant Sandbox Data",
          description:
            "Replacing blank dashboards with interactive sample projects, one-click templates, and pre-populated data so users experience your core payoff in 60 seconds.",
          tags: ["Interactive Empty States", "1-Click Templates", "TTFV < 90s"],
        },
        {
          code: "02",
          title: "Frictionless Signup & Progressive Profiling",
          description:
            "Collapsing multi-step registration walls into single-click OAuth/magic links and deferring non-essential workspace setup until after the first win.",
          tags: ["Progressive Profiling", "OAuth / Magic Links", "Zero Friction"],
        },
        {
          code: "03",
          title: "Embedded Activation Checklists & Habit Loops",
          description:
            "Coding native, persistent progress bars and celebration micro-states that guide users through the 3 actions proven to correlate with Day-30 retention.",
          tags: ["Native Checklists", "Activation Milestones", "Habit Loops"],
        },
        {
          code: "04",
          title: "Cohort Instrumentation & Lifecycle Triggers",
          description:
            "Wiring step-by-step activation funnel telemetry and behavior-driven re-engagement triggers when a trial user stalls mid-setup.",
          tags: ["Cohort Analytics", "Stall Recovery", "SaaS Retention Strategy"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW IT WORKS",
      headline: "How we improve SaaS activation rate",
      headlineAccent: "and lock in Day-30 retention.",
      steps: [
        {
          step: "01",
          title: "First-Session Teardown (5-Min Loom)",
          description:
            "We sign up for your product live on video, documenting every second of delay, confusion, or friction between landing and the first 'aha' moment.",
        },
        {
          step: "02",
          title: "Onboarding & Empty-State Sprint",
          description:
            "Our senior engineers code the streamlined signup flow, interactive empty states, and guided activation milestones directly in your React/Next.js codebase.",
        },
        {
          step: "03",
          title: "Activation & Retention Verification",
          description:
            "We measure Time-to-First-Value (TTFV), Day-1 activation completion, and Day-30 trial-to-paid retention across before-and-after user cohorts.",
        },
      ],
    },
    pricingSection: {
      eyebrow: "04 / OUTCOME-ALIGNED ENGAGEMENT MODELS",
      headline: "We move your activation rate.",
      headlineAccent: "Or 40% of our fee stays with you.",
      subline:
        "Partner with us on an outcome-backed basis where 40% of our fee is tied to lifting your activation rate, or book a straight $60/hr Project sprint.",
      columns: [
        {
          key: "partnership",
          badge: "RECOMMENDED · 40% AT RISK ON ACTIVATION",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed · 40% at risk on activation lift",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value:
                "60% guaranteed (30% upfront, 30% at milestone) + 40% at risk on your agreed activation or retention target.",
            },
            {
              label: "We're responsible for",
              value:
                "Engineering your new onboarding flow, cutting time-to-value, and lifting verified user activation.",
            },
            {
              label: "We stay",
              value:
                "Through the post-launch cohort window, watching real user sessions and refining the flow until activation climbs.",
            },
            {
              label: "Handover",
              value:
                "Production React/Next.js code + instrumented activation cohorts proving the retention lift.",
            },
          ],
        },
        {
          key: "project",
          badge: "FIXED EXECUTION",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Scoped Onboarding Sprint",
          highlighted: false,
          rows: [
            {
              label: "Fee structure",
              value:
                "Straight $60/hr rate — 100% guaranteed with a clear upfront sprint cap and zero retainer lock-in.",
            },
            {
              label: "We're responsible for",
              value:
                "Building and shipping your new signup flow, interactive empty states, and native onboarding checklist.",
            },
            {
              label: "We stay",
              value:
                "Until every scoped onboarding component and analytics event is merged and live in production.",
            },
            {
              label: "Handover",
              value:
                "Clean handover into your repository with full ownership and zero recurring software fees.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question:
          "How do you improve SaaS activation rate without adding annoying tooltip tours?",
        answer:
          "We improve SaaS activation rates by redesigning the underlying first-session product architecture rather than pasting third-party tooltip popups over a broken flow. We implement progressive profiling, pre-populated sandbox templates, interactive empty states, and native in-workflow checklists that guide users to a verified product win in under 90 seconds.",
      },
      {
        question:
          "What is a good Time-to-First-Value (TTFV) benchmark for B2B SaaS onboarding?",
        answer:
          "For self-serve and product-led B2B SaaS applications, high-converting Time-to-First-Value (TTFV) is under 90 to 120 seconds from initial signup. When new trial users experience your core product payoff within their first two minutes, Day-1 activation and Day-30 trial-to-paid conversion rates typically double compared to multi-step setup walls.",
      },
      {
        question:
          "How does onboarding optimization impact long-term SaaS retention strategy?",
        answer:
          "Over 60% of B2B SaaS logo churn occurs during the first 14 days when new signups fail to adopt the core habit loop. By engineering a frictionless first-session 'aha' moment and automated stall-recovery triggers, onboarding optimization permanently lifts the baseline of your Day-30, Day-60, and Day-90 retention curves.",
      },
      {
        question:
          "What is the difference between a product-led growth consultant and Hello Steward?",
        answer:
          "A typical product-led growth consultant delivers advisory audits and Miro wireframes that your internal developers still have to interpret and build. Hello Steward embeds senior product and growth engineers directly into your GitHub repo to design, code, instrument, and ship the onboarding and retention fixes into production.",
      },
      {
        question:
          "How does your 40% fee-at-risk Partnership work for onboarding and retention?",
        answer:
          "Under our $100/hr Partnership model, we baseline your current signup-to-activation rate and agree on a concrete lift target before writing code. You pay 60% as the base engineering fee (30% upfront, 30% at deployment), and the remaining 40% is only payable once live cohort data proves the activation target was hit.",
      },
    ],
    formSection: {
      eyebrow: "05 / GET YOUR FREE ONBOARDING TEARDOWN",
      headline: "Let’s watch where new signups",
      headlineAccent: "drop off before their first win.",
      subline:
        "Share your app URL below. We’ll walk through your signup and first-session onboarding flow on video and send a 5-minute Loom teardown within 24–48 hours.",
      urlField: {
        label: "Website or Signup URL *",
        placeholder: "https://app.yourproduct.com/signup",
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
          label: "Biggest Onboarding Bottleneck",
          required: true,
          options: [
            "Step-2 Setup Drop-Off",
            "Blank Empty-State Confusion",
            "Low Day-14 / Day-30 Retention",
          ],
        },
      ],
      submitButton: "Send Me My Free Onboarding Audit",
      successHeadline: "Your First-Session Onboarding Teardown Is Queued.",
      successMessage:
        "We’re walking through your signup and activation flow now. Expect your 5-minute Loom teardown in your inbox within 24–48 hours.",
    },
  },

  "engagement-models": {
    slug: "engagement-models",
    serviceName: "Outcome-Based SaaS Product & Growth Engineering Models",
    serviceType: "Outcome-Based Product Agency and Startup Growth Consulting",
    seoTitle:
      "Outcome-Based SaaS Product & Growth Agency Pricing | Hello Steward",
    seoDescription:
      "Transparent B2B SaaS engineering & growth pricing: $60/hr fixed execution or $100/hr outcome-backed partnership with 40% of our fee at risk.",
    headerCtaLabel: "Compare Models & Start",
    eyebrow: "OUTCOME-BASED PRODUCT AGENCY · US, UK & EU SAAS",
    h1: "Most Agencies Bill You for Hours.",
    h1Accent: "We Put 40% of Our Fee on the Outcome.",
    subheadline:
      "Founders shouldn't bear 100% of the risk when hiring a growth partner for startups. Choose our straight $60/hr Project sprint for fixed engineering specs, or our $100/hr Partnership where 40% of our fee is tied directly to moving your agreed revenue metric.",
    primaryCta: "Start With a Free 5-Unit Funnel Audit",
    microCopy:
      "Zero retainers. Zero junior account managers. Direct senior product & growth engineers.",
    diagnosticCard: {
      headerLabel: "COMMERCIAL ALIGNMENT MODEL",
      liveBadge: "SKIN IN THE GAME",
      title: "Why Seed–Series A Founders Switch to Hello Steward",
      subtitle: "Built to eliminate agency bloat, hiring lag, and unshipped advice:",
      metrics: [
        {
          label: "Partnership Model ($100/hr)",
          before: "100% agency fee billed even if metrics stall",
          after: "60% base (30/30) + 40% at risk on agreed lift",
          statusTag: "OUTCOME-BACKED",
        },
        {
          label: "Project Model ($60/hr)",
          before: "$20k/mo bloated retainers & 6-month lock-in",
          after: "Straight $60/hr scoped sprint & clean handover",
          statusTag: "100% GUARANTEED",
        },
        {
          label: "Execution Velocity",
          before: "3–6 month hiring lag or slide-deck consultants",
          after: "Senior engineers shipping PRs in your repo week 1",
          statusTag: "DIRECT SENIOR TEAM",
        },
      ],
      footerNote:
        "You keep the vision and the decisions. We agree on one number up front, and we answer for it.",
    },
    realitySection: {
      eyebrow: "01 / THE COMMERCIAL REALITY CHECK",
      headline: "Why traditional agencies and solo hires",
      headlineAccent: "fail Seed to Series A founders.",
      bullets: [
        {
          title: "The $20k/mo Retainer Trap",
          description:
            "Traditional agencies lock you into 6-month retainers, pitch you with senior partners, and hand your repo off to junior generalists who get paid whether your revenue moves or not.",
        },
        {
          title: "The Advisory-Only Bottleneck",
          description:
            "Hiring a fractional head of growth or startup growth consultant gives you Notion docs and audit slides—leaving your already-stretched engineers to actually build the fixes.",
        },
        {
          title: "The 5-Month Senior Hiring Lag",
          description:
            "Recruiting a $160k/yr full-time senior engineer only solves one discipline (code), without the positioning, pricing, and conversion engineering needed to move revenue.",
        },
      ],
    },
    deliverablesSection: {
      eyebrow: "02 / FULL-FUNNEL CAPABILITIES",
      headline: "One senior team across all five",
      headlineAccent: "revenue-critical product units.",
      cards: [
        {
          code: "01",
          title: "Monetization, Pricing & Checkout",
          description:
            "Restructuring SaaS tier architecture, value metrics, interactive pricing pages, contextual paywalls, and Stripe checkout flows.",
          tags: ["Pricing Strategy", "Stripe Billing", "ARPU Lift"],
        },
        {
          code: "02",
          title: "Conversion Engineering & Acquisition",
          description:
            "Aligning ad-to-landing message match, sharpening 5-second positioning clarity, and rebuilding high-intent signup funnels.",
          tags: ["Conversion Engineering", "PMF & Positioning", "CAC Payback"],
        },
        {
          code: "03",
          title: "MVP Rescue & Core Product Architecture",
          description:
            "Refactoring fragile AI or freelance prototypes into hardened, scalable React, Next.js, TypeScript, and Supabase/Postgres production apps.",
          tags: ["14-Day MVP Rescue", "React & Next.js", "Production Hardening"],
        },
        {
          code: "04",
          title: "Onboarding, Activation & Speed Sprints",
          description:
            "Engineering under-90-second first-session 'aha' moments, 0.00 CLS, and sub-1.5s load times to maximize retention and ad ROI.",
          tags: ["TTFV < 90s", "Core Web Vitals", "Cohort Retention"],
        },
      ],
    },
    howItWorksSection: {
      eyebrow: "03 / HOW WE ENGAGE",
      headline: "Every engagement starts with proof,",
      headlineAccent: "never a blind retainer.",
      steps: [
        {
          step: "01",
          title: "Free 5-Unit Diagnostic Audit",
          description:
            "We inspect your live product, funnel, and codebase across Monetization, Acquisition, Positioning, Core UX, and Onboarding—delivering a prioritized teardown free.",
        },
        {
          step: "02",
          title: "Select Your Commercial Model",
          description:
            "Pick the $60/hr Project model for fixed-scope execution, or the $100/hr Partnership model where 40% of our fee is tied to moving one agreed metric.",
        },
        {
          step: "03",
          title: "Ship, Measure & Hand Over Cleanly",
          description:
            "We ship production code directly into your GitHub, verify the cohort or performance benchmarks, and hand over 100% ownership with zero lock-in.",
        },
      ],
    },
    comparisonTableSection: {
      eyebrow: "04 / SIDE-BY-SIDE COMMERCIAL COMPARISON",
      headline: "How Hello Steward compares to",
      headlineAccent: "agencies and in-house hires.",
      subline:
        "A transparent breakdown of cost, risk allocation, speed to production, and team composition across all four options for B2B SaaS founders:",
      rows: [
        {
          dimension: "Rate & Fee Structure",
          stewardPartnership:
            "$100/hr — 60% base (30% upfront, 30% milestone) + 40% at risk on agreed conversion/revenue target",
          stewardProject:
            "$60/hr — 100% guaranteed fixed execution rate with an upfront sprint cap",
          retainerAgency:
            "$15k–$30k/mo fixed monthly retainer billed 100% regardless of commercial outcome",
          inHouseHire:
            "$140k–$180k/yr base salary + equity + benefits + recruiting fees",
        },
        {
          dimension: "Outcome Risk & Skin in the Game",
          stewardPartnership:
            "40% of fee at risk until post-launch telemetry proves the agreed metric moved",
          stewardProject:
            "100% milestone deliverable guarantee; pay only for verified shipped scope",
          retainerAgency:
            "Zero fee at risk; you pay full retainer even if conversion and revenue stay flat",
          inHouseHire:
            "100% founder risk across salary, ramp-up time, and potential mis-hire cost",
        },
        {
          dimension: "Who Does the Work",
          stewardPartnership:
            "Direct senior product, growth & full-stack Next.js engineers (zero account managers)",
          stewardProject:
            "Direct senior product & full-stack engineers committing daily to your GitHub",
          retainerAgency:
            "Senior pitch team hands off execution to junior designers and account coordinators",
          inHouseHire:
            "Single-discipline specialist (either an engineer OR a marketer, rarely both)",
        },
        {
          dimension: "Time to Production Impact",
          stewardPartnership:
            "First production PRs and funnel experiments live within 7–14 days",
          stewardProject:
            "Scoped sprint starts within 48 hours; typical rescue or speed sprint in 14 days",
          retainerAgency:
            "4–8 weeks of discovery decks and wireframes before a single line of code ships",
          inHouseHire:
            "3–6 months of sourcing, interviewing, notice periods, and codebase onboarding",
        },
        {
          dimension: "Post-Launch Measurement & Lock-In",
          stewardPartnership:
            "Stays through full measurement window to iterate until target moves; zero lock-in",
          stewardProject:
            "Clean GitHub handover with architecture notes upon sprint completion; zero lock-in",
          retainerAgency:
            "3-to-6-month contractual retainer lock-in with 30–60 day cancellation notice",
          inHouseHire:
            "Permanent fixed payroll overhead and long-term management commitment",
        },
      ],
    },
    pricingSection: {
      eyebrow: "05 / CHOOSE YOUR ENGAGEMENT MODEL",
      headline: "Two transparent models.",
      headlineAccent: "Built for founder alignment.",
      subline:
        "Many founders start with a $60/hr Project sprint to stabilize their codebase or speed, then switch to our $100/hr Partnership to scale conversion.",
      equalWeight: true,
      columns: [
        {
          key: "partnership",
          badge: "OUTCOME-BACKED · 40% AT RISK",
          title: "Partnership",
          rate: "$100/hr",
          rateSub: "60% guaranteed (30/30) · 40% at risk on outcome",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value:
                "60% base (30% upfront, 30% at milestone) + 40% at risk tied directly to your agreed conversion or revenue target.",
            },
            {
              label: "We're responsible for",
              value:
                "Uncovering the bottleneck, shipping the product/funnel code, and moving the agreed commercial metric.",
            },
            {
              label: "We stay",
              value:
                "Through the full post-launch measurement window, iterating on live user cohorts until the number moves.",
            },
            {
              label: "Handover",
              value:
                "100% code ownership plus instrumented before/after cohort analytics proving the revenue lift.",
            },
          ],
        },
        {
          key: "project",
          badge: "FIXED SPRINT · 100% GUARANTEED",
          title: "Project",
          rate: "$60/hr",
          rateSub: "100% guaranteed · Scoped Sprint · Zero Lock-In",
          highlighted: true,
          rows: [
            {
              label: "Fee structure",
              value:
                "Straight $60/hr senior engineering rate — 100% guaranteed with a clear upfront sprint cap.",
            },
            {
              label: "We're responsible for",
              value:
                "Shipping your scoped MVP rescue, Core Web Vitals speed overhaul, or pricing/onboarding build fast and cleanly.",
            },
            {
              label: "We stay",
              value:
                "Through your scoped sprint until every agreed PR and milestone is merged and verified in production.",
            },
            {
              label: "Handover",
              value:
                "Clean GitHub handover with clear documentation so your internal team can build immediately.",
            },
          ],
        },
      ],
    },
    faqs: [
      {
        question:
          "How does Hello Steward's $100/hr Partnership model with 40% fee at risk work?",
        answer:
          "In our $100/hr Partnership model, 60% of the fee is guaranteed—billed 30% upfront and 30% when the engineered solution deploys to production—while 40% is placed at risk on a single agreed commercial metric. We stay through the post-launch measurement window and only collect the final 40% once verified telemetry confirms the target lift.",
      },
      {
        question:
          "When should a SaaS founder choose the $60/hr Project model vs. the $100/hr Partnership model?",
        answer:
          "Choose the $60/hr Project model when you have a clearly defined technical deliverable—such as a 14-day MVP rescue sprint, a Core Web Vitals speed overhaul, or a specific feature build. Choose the $100/hr Partnership model when your product is live with traffic and you want an outcome-based product agency to share the risk of lifting conversion or activation.",
      },
      {
        question:
          "How is Hello Steward different from a fractional head of growth or startup growth consultant?",
        answer:
          "A fractional head of growth or startup growth consultant typically provides high-level strategy decks and channel advice but relies on your internal developers to build the product changes. Hello Steward combines growth strategy, UX positioning, and senior full-stack React/Next.js engineering in one team that ships production code directly into your repository.",
      },
      {
        question:
          "Are there any monthly retainer minimums or long-term contract lock-ins?",
        answer:
          "No, Hello Steward has zero monthly retainer lock-ins. Every Project sprint and Outcome Partnership is scoped around clear milestones and explicit hour caps, giving Seed to Series A founders complete flexibility to scale up, pause, or hand over cleanly into their own GitHub at the end of any sprint.",
      },
      {
        question:
          "Who owns the code, designs, and analytics instrumentation you ship?",
        answer:
          "You retain 100% intellectual property ownership of all source code, UI components, Stripe billing logic, and analytics instrumentation from the moment it is committed. We work directly inside your GitHub, Vercel, and analytics accounts so there is never any proprietary agency black box or vendor lock-in.",
      },
    ],
    formSection: {
      eyebrow: "06 / START WITH A FREE DIAGNOSTIC OR TRIAGE",
      headline: "Let’s pick the model that",
      headlineAccent: "fits your stage and goals.",
      subline:
        "Share your URL and preferred model below. Our senior partners will review your product and reply within 24 hours with a concrete scope and free diagnostic.",
      urlField: {
        label: "Website or App URL *",
        placeholder: "https://yourproduct.com",
        required: true,
      },
      selectFields: [
        {
          name: "current_stage",
          label: "Preferred Engagement Model",
          required: true,
          options: [
            "Partnership ($100/hr · 40% At Risk)",
            "Project ($60/hr · 100% Guaranteed)",
            "Not Sure — Recommend After Audit",
          ],
        },
        {
          name: "biggest_leak",
          label: "Primary Focus Area",
          required: true,
          options: [
            "Conversion, Pricing & Onboarding Lift",
            "MVP Rescue & Next.js Refactoring",
            "Sub-1.5s Speed & Core Web Vitals",
          ],
        },
      ],
      submitButton: "Request My Free Diagnostic & Scope",
      successHeadline: "Your Engagement & Diagnostic Request Is In.",
      successMessage:
        "We’re reviewing your product now. Expect a direct reply from our senior engineering partners within 24 hours with your initial teardown and recommended scope.",
    },
  },
};
