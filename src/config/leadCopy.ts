/**
 * =============================================================================
 * STEWARD — EDITABLE FORM, EMAIL & PRIVACY COPY CONFIGURATION
 * =============================================================================
 * All public lead-capture form copy, email templates, and privacy policy text
 * live in this single file so Ashish and Ruchi can update the exact audit
 * promise and turnaround time in one place.
 */

export const LEAD_STAGE_OPTIONS = [
  "Idea",
  "Live product",
  "Not sure",
] as const;

export type LeadStage = (typeof LEAD_STAGE_OPTIONS)[number];
export type LeadIntent = "audit" | "conversation";

export const LEAD_COPY = {
  common: {
    closeButtonLabel: "ESC",
    submittingLabel: "Sending...",
    privacyNoticePrefix: "We only store what you send here. Read our ",
    privacyNoticeLinkText: "Privacy Policy",
    privacyNoticeHref: "/privacy",
    genericError:
      "Something went wrong on our end. Please try again or email connect@hellosteward.agency.",
  },

  audit: {
    eyebrow: "Free Audit",
    headline: "Let’s see where the biggest leak is.",
    subline:
      "Send us your product and where things feel stuck. We will review your funnel, positioning, and onboarding and reach out to you if we need anything else.",
    fields: {
      nameLabel: "Your name",
      namePlaceholder: "Alex Rivera",
      emailLabel: "Work or founder email",
      emailPlaceholder: "alex@yourproduct.com",
      productLinkLabel: "Product link (optional)",
      productLinkPlaceholder: "https://yourproduct.com",
      stageLabel: "Current stage",
      messageLabel: "What feels stuck?",
      messagePlaceholder:
        "Tell us what you’re building, how people find you today, and where conversions or revenue feel stuck...",
    },
    submitButton: "Request free audit",
    successHeadline: "We’ve got your audit request.",
    successMessage:
      "We have your details and will look through your product. We will reach out to you if we need anything else.",
  },

  conversation: {
    eyebrow: "Direct Line",
    headline: "Start the conversation.",
    subline:
      "No account managers and no handoffs. Tell us what you’re building and we’ll get back to you.",
    fields: {
      nameLabel: "Your name",
      namePlaceholder: "Alex Rivera",
      emailLabel: "Your email",
      emailPlaceholder: "alex@yourproduct.com",
      messageLabel: "How can we help?",
      messagePlaceholder:
        "Tell us what you’re working on, what you’re aiming for this quarter, or anything on your mind...",
    },
    submitButton: "Send message",
    successHeadline: "Message received.",
    successMessage:
      "Thanks for reaching out. We’ll review your note and get back to your email shortly.",
  },

  emails: {
    founderNotificationSubject: (intent: LeadIntent, name: string) =>
      `[Steward ${intent === "audit" ? "Audit" : "Conversation"}] New lead from ${name}`,

    visitorAuditConfirmation: {
      subject: "We received your Steward audit request",
      body: (name: string) =>
        [
          `Hi ${name},`,
          ``,
          `Thanks for sending over your product for a free audit.`,
          ``,
          `We have your details and will review your product, positioning, and funnel. We will reach out to you if we need anything else.`,
          ``,
          `If there’s any extra context or numbers you want to share in the meantime, just hit reply.`,
          ``,
          `— Steward`,
          `https://hellosteward.agency`,
        ].join("\n"),
    },

    visitorConversationConfirmation: {
      subject: "Thanks for reaching out to Steward",
      body: (name: string) =>
        [
          `Hi ${name},`,
          ``,
          `We got your note — thank you for reaching out.`,
          ``,
          `We will review it and reply from this address shortly.`,
          ``,
          `— Steward`,
          `https://hellosteward.agency`,
        ].join("\n"),
    },
  },

  privacyPage: {
    eyebrow: "Privacy Policy & GDPR Disclosures",
    headline: "Plain-English Privacy.",
    lastUpdated: "November 2026",
    intro:
      "We collect the minimum information needed to reply to your inquiry or deliver your free product audit. We never sell, rent, or trade your personal data.",
    sections: [
      {
        title: "1. Data Controller & Contact",
        body: "Steward ('Hello Steward', https://hellosteward.agency) acts as the Data Controller for personal data collected through this website. For any privacy inquiries, Data Subject Access Requests (DSAR), or deletion requests, contact our privacy team directly at connect@hellosteward.agency.",
      },
      {
        title: "2. What we collect when you submit a form",
        body: "When you submit the Free Audit, Talk to Us, or campaign inquiry form, we collect your name, work email address, message, optional product URL and product stage, the page and button you submitted from, and campaign attribution parameters (such as UTM tags, referrer, click identifiers like gclid, a tab-scoped session visitor ID, and the pages visited during your current session). We do not collect phone numbers, payment details, or sensitive special-category data.",
      },
      {
        title: "3. Cookies, Local Storage & Google Consent Mode v2",
        body: "By default, we use strictly necessary browser storage to remember your light/dark theme preference (steward-theme), your cookie consent choice (steward_cookie_consent), and tab-scoped sessionStorage (cleared automatically when you close your tab) to carry UTM attribution from your landing page to our inquiry form. We also use Google Tag Manager with Google Consent Mode v2: analytics and advertising storage (ad_storage, analytics_storage, ad_user_data, ad_personalization) default to 'denied' on arrival and are only enabled if you click 'Accept All' on our consent banner. You can change or withdraw your consent at any time using the 'Cookie Preferences' link in the footer or on this page.",
      },
      {
        title: "4. Legal basis for processing (GDPR Art. 6)",
        body: "Under the EU/UK General Data Protection Regulation (GDPR), we process your personal data on the following legal bases: (a) Pre-contractual measures (Art. 6(1)(b)) and Legitimate Interests (Art. 6(1)(f)) to review your product, deliver your requested audit, and respond to your direct inquiry; (b) Legitimate Interests (Art. 6(1)(f)) to protect our forms against automated spam and abuse using short-lived in-memory IP rate limiting and Cloudflare Turnstile; and (c) Explicit Consent (Art. 6(1)(a)) for optional analytics and advertising cookies.",
      },
      {
        title: "5. Sub-processors & international transfers",
        body: "We share data only with trusted infrastructure providers bound by Data Processing Agreements (DPAs) and Standard Contractual Clauses (SCCs) where data is processed outside the EEA/UK: Supabase (encrypted database hosting for lead records), Resend (transactional confirmation and notification emails), Cloudflare Turnstile (privacy-preserving bot verification), Vercel (website hosting and edge delivery), and Google Ireland Ltd / Google LLC (Google Tag Manager and Google Ads conversion measurement, strictly subject to your consent choice).",
      },
      {
        title: "6. How long we keep it (24-month auto-deletion)",
        body: "We retain inquiry records for up to 24 months so we can follow up on conversations and audits. An automated scheduled job permanently deletes any inquiry older than 24 months that did not become an active client partnership. Transient IP addresses used for spam rate-limiting are held only in volatile server memory for up to 60 minutes and are never written to our database.",
      },
      {
        title: "7. Your GDPR rights & immediate deletion",
        body: "Under GDPR Articles 15–22, you have the right to access, rectify, erase ('right to be forgotten'), restrict, or export (portability) your personal data, to object to processing, and to withdraw cookie consent at any time without affecting prior lawful processing. To exercise any of these rights, email connect@hellosteward.agency from the address you used and we will permanently delete or export your record within 48 hours. You also have the right to lodge a complaint with your local Data Protection Authority (DPA).",
      },
    ],
  },
};
