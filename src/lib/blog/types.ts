export const POST_CATEGORIES = [
  "Revenue",
  "Product",
  "Growth",
  "Pricing",
  "Launch",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_AUTHORS = ["Ashish", "Ruchi"] as const;
export type PostAuthor = (typeof POST_AUTHORS)[number];

export const POST_STATUSES = ["draft", "scheduled", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export interface TiptapMark {
  type: "bold" | "italic" | "code" | "link";
  attrs?: {
    href?: string;
    target?: string;
    rel?: string;
  };
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface PostRecord {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: PostCategory;
  author: PostAuthor;
  cover_image_url: string | null;
  cover_image_alt: string;
  body: TiptapNode;
  status: PostStatus;
  publish_at: string | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  updated_by: PostAuthor | null;
}

export const POST_STATUS_META: Record<
  PostStatus,
  { label: string; badgeClass: string }
> = {
  draft: {
    label: "Draft",
    badgeClass: "border-white/[0.14] bg-white/[0.04] text-[#a09c94]",
  },
  scheduled: {
    label: "Scheduled",
    badgeClass: "border-[#e89b3c]/40 bg-[#e89b3c]/15 text-[#e89b3c]",
  },
  published: {
    label: "Published",
    badgeClass: "border-[#10b981]/40 bg-[#10b981]/15 text-[#10b981]",
  },
};

/**
 * Convert a title or raw string into a clean, lowercase, URL-safe slug.
 */
export function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 96);
}

export const EMPTY_TIPTAP_DOC: TiptapNode = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};
