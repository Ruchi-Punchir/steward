import {
  EMPTY_TIPTAP_DOC,
  type TiptapMark,
  type TiptapNode,
} from "@/lib/blog/types";

const ALLOWED_NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "text",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "image",
]);

const ALLOWED_MARK_TYPES = new Set(["bold", "italic", "code", "link"]);

/**
 * Only allow safe URLs (http, https, mailto, or relative paths starting with /).
 * Rejects javascript:, data:, vbscript:, file:, etc.
 */
export function isSafeUrl(url: unknown, allowMailto = true): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return true;
    }
    if (allowMailto && parsed.protocol === "mailto:") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function sanitizeMarks(marks: unknown): TiptapMark[] | undefined {
  if (!Array.isArray(marks)) return undefined;
  const clean: TiptapMark[] = [];

  for (const raw of marks) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Record<string, unknown>;
    const type = typeof m.type === "string" ? m.type : "";
    if (!ALLOWED_MARK_TYPES.has(type)) continue;

    if (type === "link") {
      const attrs =
        m.attrs && typeof m.attrs === "object"
          ? (m.attrs as Record<string, unknown>)
          : {};
      const href = typeof attrs.href === "string" ? attrs.href.trim() : "";
      if (!isSafeUrl(href, true)) continue;

      clean.push({
        type: "link",
        attrs: {
          href,
          target: href.startsWith("http") ? "_blank" : undefined,
          rel: href.startsWith("http")
            ? "noopener noreferrer nofollow"
            : undefined,
        },
      });
    } else {
      clean.push({ type: type as "bold" | "italic" | "code" });
    }
  }

  return clean.length > 0 ? clean : undefined;
}

function sanitizeNode(raw: unknown): TiptapNode | null {
  if (!raw || typeof raw !== "object") return null;
  const node = raw as Record<string, unknown>;
  const type = typeof node.type === "string" ? node.type : "";

  if (!ALLOWED_NODE_TYPES.has(type)) {
    return null;
  }

  if (type === "text") {
    const text = typeof node.text === "string" ? node.text : "";
    if (!text) return null;
    const marks = sanitizeMarks(node.marks);
    return marks ? { type: "text", text, marks } : { type: "text", text };
  }

  if (type === "horizontalRule" || type === "hardBreak") {
    return { type };
  }

  if (type === "image") {
    const attrs =
      node.attrs && typeof node.attrs === "object"
        ? (node.attrs as Record<string, unknown>)
        : {};
    const src = typeof attrs.src === "string" ? attrs.src.trim() : "";
    const alt = typeof attrs.alt === "string" ? attrs.alt.trim() : "";
    const title = typeof attrs.title === "string" ? attrs.title.trim() : "";

    if (!isSafeUrl(src, false)) {
      return null;
    }

    return {
      type: "image",
      attrs: {
        src,
        alt,
        ...(title ? { title } : {}),
      },
    };
  }

  const sanitizedChildren: TiptapNode[] = [];
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      const cleanChild = sanitizeNode(child);
      if (cleanChild) {
        sanitizedChildren.push(cleanChild);
      }
    }
  }

  if (type === "heading") {
    const attrs =
      node.attrs && typeof node.attrs === "object"
        ? (node.attrs as Record<string, unknown>)
        : {};
    const rawLevel = Number(attrs.level);
    // Only allow H2 and H3 per brief
    const level = rawLevel === 3 ? 3 : 2;
    return {
      type: "heading",
      attrs: { level },
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "orderedList") {
    const attrs =
      node.attrs && typeof node.attrs === "object"
        ? (node.attrs as Record<string, unknown>)
        : {};
    const start =
      typeof attrs.start === "number" && attrs.start > 0 ? attrs.start : 1;
    return {
      type: "orderedList",
      attrs: { start },
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  return {
    type,
    ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
  };
}

/**
 * Treat editor JSON as untrusted: strictly whitelist allowed nodes, marks, and URLs.
 * No raw HTML, <script>, <iframe>, or javascript: links can survive.
 */
export function sanitizePostBodyJson(rawBody: unknown): TiptapNode {
  const clean = sanitizeNode(rawBody);
  if (!clean || clean.type !== "doc") {
    return EMPTY_TIPTAP_DOC;
  }
  return clean;
}

/**
 * Validate that every image node in the document has non-empty alt text.
 */
export function findImagesMissingAlt(node: TiptapNode): string[] {
  const missing: string[] = [];

  function walk(n: TiptapNode) {
    if (n.type === "image") {
      const alt = typeof n.attrs?.alt === "string" ? n.attrs.alt.trim() : "";
      const src = typeof n.attrs?.src === "string" ? n.attrs.src : "image";
      if (!alt) {
        missing.push(src);
      }
    }
    if (Array.isArray(n.content)) {
      for (const child of n.content) {
        walk(child);
      }
    }
  }

  walk(node);
  return missing;
}

/**
 * Extract plain text from a sanitized Tiptap document for word count & reading time.
 */
export function extractPlainTextFromBody(node: TiptapNode): string {
  const chunks: string[] = [];

  function walk(n: TiptapNode) {
    if (n.type === "text" && typeof n.text === "string") {
      chunks.push(n.text);
    }
    if (Array.isArray(n.content)) {
      for (const child of n.content) {
        walk(child);
      }
    }
    if (
      n.type === "paragraph" ||
      n.type === "heading" ||
      n.type === "listItem" ||
      n.type === "blockquote" ||
      n.type === "codeBlock"
    ) {
      chunks.push(" ");
    }
  }

  walk(node);
  return chunks.join("").replace(/\s+/g, " ").trim();
}

/**
 * Calculate estimated reading time in minutes (200 words per minute, minimum 1 min).
 */
export function calculateReadTimeMinutes(body: TiptapNode): number {
  const text = extractPlainTextFromBody(body);
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
