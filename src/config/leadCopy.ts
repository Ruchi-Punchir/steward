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
    eyebrow: "Privacy Policy",
    headline: "Plain-English Privacy.",
    lastUpdated: "October 2026",
    intro:
      "We collect the minimum information needed to reply to your inquiry or deliver your free product audit. We never sell, rent, or trade your data.",
    sections: [
      {
        title: "1. What we store",
        body: "When you submit the Free Audit or Start the Conversation form, we store your name, email address, message, optional product link and stage, the page and button you clicked from, and standard referral/UTM tags so we know how you found Steward. We do not collect phone numbers or use tracking cookies.",
      },
      {
        title: "2. How long we keep it",
        body: "We retain inquiry records for up to 24 months so we can follow up on conversations and audits. Any lead older than 24 months that did not become an active client partnership is automatically and permanently deleted.",
      },
      {
        title: "3. How to request immediate deletion",
        body: "Want us to delete your details right now? Email connect@hellosteward.agency from the address you used and we will permanently delete your record and all notes from our database within 48 hours.",
      },
    ],
  },
};
