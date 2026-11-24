import {
  EMPTY_TIPTAP_DOC,
  type CalloutTone,
  type ImageAlignOption,
  type ImageWidthOption,
  type TiptapMark,
  type TiptapMarkType,
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
  "callout",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "image",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
]);

const ALLOWED_MARK_TYPES = new Set<TiptapMarkType>([
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "highlight",
  "subscript",
  "superscript",
  "link",
]);

const ALLOWED_TEXT_ALIGNS = new Set(["left", "center", "right"]);
const ALLOWED_IMAGE_WIDTHS = new Set<ImageWidthOption>([
  "small",
  "medium",
  "wide",
  "full",
]);
const ALLOWED_IMAGE_ALIGNS = new Set<ImageAlignOption>([
  "left",
  "center",
  "right",
]);
const ALLOWED_CALLOUT_TONES = new Set<CalloutTone>(["info", "tip", "warning"]);

const DANGEROUS_SCHEME_REGEX = /^\s*(javascript|vbscript|file|data|blob):/i;
const SAFE_DATA_IMAGE_PREFIX_REGEX =
  /^data:image\/(png|jpeg|jpg|webp|gif|avif)(?:;[^,]*)?;base64,/i;

/**
 * Normalize and validate a URL so links like "hellosteward.agency/speed-audit"
 * or "www.example.com" are preserved as "https://..." instead of being stripped,
 * while strictly rejecting javascript:, vbscript:, data:, file:, etc.
 */
export function normalizeSafeUrl(
  url: unknown,
  allowMailto = true
): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (DANGEROUS_SCHEME_REGEX.test(trimmed)) {
    return null;
  }

  // Relative paths starting with / (not protocol-relative //)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  // Same-page hash anchors
  if (trimmed.startsWith("#") && trimmed.length > 1) {
    return trimmed;
  }

  // Check if it already has an explicit scheme
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);

  let candidate = trimmed;
  if (!hasScheme) {
    // Email without mailto:
    if (
      allowMailto &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
      !trimmed.includes("/")
    ) {
      candidate = `mailto:${trimmed}`;
    } else if (trimmed.includes(".") && !/\s/.test(trimmed)) {
      // Bare domain/path like "hellosteward.agency/speed-audit"
      candidate = `https://${trimmed}`;
    } else {
      return null;
    }
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return candidate;
    }
    if (
      allowMailto &&
      (parsed.protocol === "mailto:" || parsed.protocol === "tel:")
    ) {
      return candidate;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Only allow safe URLs (http, https, mailto, tel, #anchor, or relative paths starting with /).
 * Also accepts bare domain links that normalize cleanly to https://.
 */
export function isSafeUrl(url: unknown, allowMailto = true): boolean {
  return normalizeSafeUrl(url, allowMailto) !== null;
}

/**
 * Validate and normalize image src URLs.
 * Allows https://, http://, relative / paths, and safe base64 raster data:image/ URLs
 * so pasted images never silently disappear.
 */
export function normalizeSafeImageUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (SAFE_DATA_IMAGE_PREFIX_REGEX.test(trimmed)) {
    return trimmed;
  }

  return normalizeSafeUrl(trimmed, false);
}

function sanitizeMarks(marks: unknown): TiptapMark[] | undefined {
  if (!Array.isArray(marks)) return undefined;
  const clean: TiptapMark[] = [];

  for (const raw of marks) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Record<string, unknown>;
    const type = typeof m.type === "string" ? (m.type as TiptapMarkType) : ("" as TiptapMarkType);
    if (!ALLOWED_MARK_TYPES.has(type)) continue;

    if (type === "link") {
      const attrs =
        m.attrs && typeof m.attrs === "object"
          ? (m.attrs as Record<string, unknown>)
          : {};
      const normalizedHref = normalizeSafeUrl(attrs.href, true);
      if (!normalizedHref) continue;

      const isExternal =
        normalizedHref.startsWith("http://") ||
        normalizedHref.startsWith("https://");
      const openInNewTab =
        attrs.target === "_self"
          ? false
          : attrs.target === "_blank"
          ? true
          : isExternal;

      clean.push({
        type: "link",
        attrs: {
          href: normalizedHref,
          target: openInNewTab ? "_blank" : undefined,
          rel: openInNewTab ? "noopener noreferrer nofollow" : undefined,
        },
      });
    } else {
      clean.push({ type });
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
    const src = normalizeSafeImageUrl(attrs.src);
    if (!src) {
      return null;
    }

    const rawAlt = typeof attrs.alt === "string" ? attrs.alt.trim() : "";
    const rawTitle = typeof attrs.title === "string" ? attrs.title.trim() : "";
    const rawCaption =
      typeof attrs.caption === "string" ? attrs.caption.trim() : "";
    const alt = rawAlt || rawCaption || rawTitle || "Article image";

    const rawWidth =
      typeof attrs.width === "string"
        ? (attrs.width as ImageWidthOption)
        : "full";
    const width: ImageWidthOption = ALLOWED_IMAGE_WIDTHS.has(rawWidth)
      ? rawWidth
      : "full";

    const rawAlign =
      typeof attrs.align === "string"
        ? (attrs.align as ImageAlignOption)
        : "center";
    const align: ImageAlignOption = ALLOWED_IMAGE_ALIGNS.has(rawAlign)
      ? rawAlign
      : "center";

    return {
      type: "image",
      attrs: {
        src,
        alt,
        ...(rawTitle ? { title: rawTitle } : {}),
        ...(rawCaption ? { caption: rawCaption } : {}),
        width,
        align,
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

  const attrs =
    node.attrs && typeof node.attrs === "object"
      ? (node.attrs as Record<string, unknown>)
      : {};

  if (type === "paragraph") {
    const textAlign =
      typeof attrs.textAlign === "string" &&
      ALLOWED_TEXT_ALIGNS.has(attrs.textAlign)
        ? attrs.textAlign
        : undefined;
    return {
      type: "paragraph",
      ...(textAlign && textAlign !== "left" ? { attrs: { textAlign } } : {}),
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "heading") {
    const rawLevel = Number(attrs.level);
    const level =
      rawLevel === 1 || rawLevel === 2 || rawLevel === 3 || rawLevel === 4
        ? rawLevel
        : 2;
    const textAlign =
      typeof attrs.textAlign === "string" &&
      ALLOWED_TEXT_ALIGNS.has(attrs.textAlign)
        ? attrs.textAlign
        : undefined;
    return {
      type: "heading",
      attrs: {
        level,
        ...(textAlign && textAlign !== "left" ? { textAlign } : {}),
      },
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "orderedList") {
    const start =
      typeof attrs.start === "number" && attrs.start > 0 ? attrs.start : 1;
    return {
      type: "orderedList",
      attrs: { start },
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "codeBlock") {
    const language =
      typeof attrs.language === "string"
        ? attrs.language.trim().slice(0, 32)
        : "";
    return {
      type: "codeBlock",
      ...(language ? { attrs: { language } } : {}),
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "callout") {
    const rawTone =
      typeof attrs.tone === "string" ? (attrs.tone as CalloutTone) : "info";
    const tone: CalloutTone = ALLOWED_CALLOUT_TONES.has(rawTone)
      ? rawTone
      : "info";
    const title =
      typeof attrs.title === "string" ? attrs.title.trim().slice(0, 120) : "";
    return {
      type: "callout",
      attrs: {
        tone,
        ...(title ? { title } : {}),
      },
      ...(sanitizedChildren.length > 0 ? { content: sanitizedChildren } : {}),
    };
  }

  if (type === "tableHeader" || type === "tableCell") {
    const colspan =
      typeof attrs.colspan === "number" && attrs.colspan > 1
        ? Math.min(attrs.colspan, 12)
        : 1;
    const rowspan =
      typeof attrs.rowspan === "number" && attrs.rowspan > 1
        ? Math.min(attrs.rowspan, 20)
        : 1;
    return {
      type,
      ...(colspan > 1 || rowspan > 1 ? { attrs: { colspan, rowspan } } : {}),
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
      n.type === "callout" ||
      n.type === "codeBlock" ||
      n.type === "tableCell" ||
      n.type === "tableHeader"
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
