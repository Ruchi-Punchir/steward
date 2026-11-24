"use client";

import React, { useState } from "react";
import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import type {
  CalloutTone,
  ImageAlignOption,
  ImageWidthOption,
} from "@/lib/blog/types";

/* ============================================================================
 * 1. INTERACTIVE RICH IMAGE NODE VIEW & EXTENSION
 *    Supports width (small/medium/wide/full), alignment (left/center/right),
 *    inline caption editing, inline alt-text editing, and base64/HTML paste.
 * ========================================================================== */

const WIDTH_CLASS_MAP: Record<ImageWidthOption, string> = {
  small: "max-w-[340px] w-full",
  medium: "max-w-[500px] w-full",
  wide: "max-w-[600px] w-full",
  full: "w-full",
};

const ALIGN_WRAPPER_MAP: Record<ImageAlignOption, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

function ImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: ReactNodeViewProps) {
  const src = typeof node.attrs.src === "string" ? node.attrs.src : "";
  const alt = typeof node.attrs.alt === "string" ? node.attrs.alt : "";
  const caption =
    typeof node.attrs.caption === "string" ? node.attrs.caption : "";
  const width: ImageWidthOption =
    node.attrs.width === "small" ||
    node.attrs.width === "medium" ||
    node.attrs.width === "wide" ||
    node.attrs.width === "full"
      ? node.attrs.width
      : "full";
  const align: ImageAlignOption =
    node.attrs.align === "left" ||
    node.attrs.align === "center" ||
    node.attrs.align === "right"
      ? node.attrs.align
      : "center";

  const [editingAlt, setEditingAlt] = useState(false);

  return (
    <NodeViewWrapper
      as="figure"
      className="group/img relative my-6 select-none"
      data-drag-handle
    >
      <div
        className={`${WIDTH_CLASS_MAP[width]} ${ALIGN_WRAPPER_MAP[align]} transition-all`}
      >
        {/* Top Floating Controls Bar (shown on hover or selection) */}
        <div
          className={`mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.12] bg-[#101014] px-2.5 py-1.5 shadow-lg transition-opacity ${
            selected || editingAlt
              ? "opacity-100"
              : "opacity-0 group-hover/img:opacity-100"
          }`}
        >
          {/* Size Controls */}
          <div className="flex items-center gap-1">
            <span className="mr-1 font-mono-label text-[9.5px] uppercase tracking-[0.12em] text-[#66635c]">
              Size
            </span>
            {(
              [
                { key: "small", label: "S" },
                { key: "medium", label: "M" },
                { key: "wide", label: "L" },
                { key: "full", label: "Full" },
              ] as { key: ImageWidthOption; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => updateAttributes({ width: opt.key })}
                className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-[10px] uppercase transition-colors ${
                  width === opt.key
                    ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.08] hover:text-[#f4f0ea]"
                }`}
                title={`Image width: ${opt.key}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Alignment Controls */}
          <div className="flex items-center gap-1">
            <span className="mr-1 font-mono-label text-[9.5px] uppercase tracking-[0.12em] text-[#66635c]">
              Align
            </span>
            {(
              [
                { key: "left", label: "Left" },
                { key: "center", label: "Center" },
                { key: "right", label: "Right" },
              ] as { key: ImageAlignOption; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => updateAttributes({ align: opt.key })}
                className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-[10px] uppercase transition-colors ${
                  align === opt.key
                    ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.08] hover:text-[#f4f0ea]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Alt Text & Delete Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEditingAlt((prev) => !prev)}
              className={`cursor-pointer rounded border px-2 py-0.5 font-mono-label text-[10px] uppercase transition-colors ${
                editingAlt
                  ? "border-[#e89b3c] bg-[#e89b3c]/20 text-[#e89b3c]"
                  : alt.trim()
                  ? "border-[#10b981]/35 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-300"
              }`}
              title="Edit accessibility Alt text"
            >
              {alt.trim() ? "Alt ✓" : "+ Alt"}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => deleteNode()}
              className="cursor-pointer rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono-label text-[10px] uppercase text-red-300 transition-colors hover:bg-red-500/25"
              title="Remove image"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Inline Alt Text Editor Drawer */}
        {editingAlt && (
          <div className="mb-2 rounded-lg border border-[#e89b3c]/40 bg-[#0a0a0d] p-2.5">
            <label className="block font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
              Accessibility &amp; SEO Alt Text
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={alt}
                onChange={(e) => updateAttributes({ alt: e.target.value })}
                placeholder="Describe this image for screen readers & search engines..."
                className="w-full rounded border border-white/[0.12] bg-[#101014] px-2.5 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setEditingAlt(false)}
                className="cursor-pointer rounded bg-[#e89b3c] px-2.5 py-1.5 font-mono-label text-[10px] font-semibold uppercase text-[#0a0a0d]"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Image Frame */}
        <div
          className={`relative overflow-hidden rounded-xl border bg-[#0a0a0d] transition-all ${
            selected
              ? "border-[#e89b3c] ring-2 ring-[#e89b3c]/35"
              : "border-white/[0.1] hover:border-white/[0.22]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || caption || "Blog illustration"}
            className="block h-auto max-h-[680px] w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Inline Editable Caption */}
        <div className="mt-2">
          <input
            type="text"
            value={caption}
            onChange={(e) => {
              const nextCaption = e.target.value;
              const nextAttrs: Record<string, string> = {
                caption: nextCaption,
              };
              if (!alt.trim() || alt === "Article image") {
                nextAttrs.alt = nextCaption || "Article image";
              }
              updateAttributes(nextAttrs);
            }}
            placeholder="Write a caption below this image (optional)..."
            className={`w-full bg-transparent font-mono-label text-[11px] text-[#a09c94] placeholder-[#66635c]/70 focus:text-[#f4f0ea] focus:outline-none ${
              align === "center"
                ? "text-center"
                : align === "right"
                ? "text-right"
                : "text-left"
            }`}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const RichImageExtension = Node.create({
  name: "image",
  group: "block",
  inline: false,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "Article image" },
      title: { default: null },
      caption: { default: "" },
      width: { default: "full" },
      align: { default: "center" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return false;
          const img = node.querySelector("img[src]");
          if (!img) return false;
          const src = img.getAttribute("src");
          if (!src) return false;
          const figcaption = node.querySelector("figcaption");
          const captionText = figcaption?.textContent?.trim() ?? "";
          const altText =
            img.getAttribute("alt")?.trim() || captionText || "Article image";
          return {
            src,
            alt: altText,
            title: img.getAttribute("title") || null,
            caption: captionText,
            width: (node.getAttribute("data-width") as ImageWidthOption) || "full",
            align: (node.getAttribute("data-align") as ImageAlignOption) || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return false;
          const src = node.getAttribute("src");
          if (!src) return false;
          const alt = node.getAttribute("alt")?.trim() || "Article image";
          const title = node.getAttribute("title")?.trim() || null;
          return {
            src,
            alt,
            title,
            caption: "",
            width: "full",
            align: "center",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

/* ============================================================================
 * 2. CALLOUT / ASIDE BLOCK NODE VIEW & EXTENSION
 *    Allows inserting editorial callout boxes (Note / Key Takeaway / Warning)
 * ========================================================================== */

const CALLOUT_TONE_STYLES: Record<
  CalloutTone,
  { border: string; badge: string; label: string }
> = {
  info: {
    border: "border-sky-500/35 bg-sky-500/[0.06]",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    label: "Note",
  },
  tip: {
    border: "border-[#e89b3c]/40 bg-[#e89b3c]/[0.07]",
    badge: "bg-[#e89b3c]/20 text-[#e89b3c] border-[#e89b3c]/40",
    label: "Key Takeaway",
  },
  warning: {
    border: "border-amber-500/40 bg-amber-500/[0.07]",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    label: "Watch Out",
  },
};

function CalloutNodeView({
  node,
  updateAttributes,
  deleteNode,
}: ReactNodeViewProps) {
  const tone: CalloutTone =
    node.attrs.tone === "info" ||
    node.attrs.tone === "tip" ||
    node.attrs.tone === "warning"
      ? node.attrs.tone
      : "tip";
  const title = typeof node.attrs.title === "string" ? node.attrs.title : "";
  const style = CALLOUT_TONE_STYLES[tone];

  return (
    <NodeViewWrapper
      as="aside"
      className={`my-6 rounded-xl border p-4 ${style.border}`}
    >
      <div
        contentEditable={false}
        className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2"
      >
        <div className="flex items-center gap-1.5">
          {(["tip", "info", "warning"] as CalloutTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => updateAttributes({ tone: t })}
              className={`cursor-pointer rounded border px-2 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.12em] transition-colors ${
                tone === t
                  ? CALLOUT_TONE_STYLES[t].badge
                  : "border-transparent text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
              }`}
            >
              {CALLOUT_TONE_STYLES[t].label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => deleteNode()}
          className="cursor-pointer font-mono-label text-[9.5px] uppercase text-[#66635c] hover:text-red-300"
        >
          Remove Callout
        </button>
      </div>

      <div contentEditable={false} className="mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => updateAttributes({ title: e.target.value })}
          placeholder={`${style.label} title (optional)...`}
          className="w-full bg-transparent text-sm font-semibold text-[#f4f0ea] placeholder-[#66635c] focus:outline-none"
        />
      </div>

      <NodeViewContent className="text-[15px] leading-relaxed text-[#f4f0ea] [&>p]:my-1.5" />
    </NodeViewWrapper>
  );
}

export const CalloutExtension = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      tone: { default: "tip" },
      title: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'aside[data-callout="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, { "data-callout": "true" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },
});

/* ============================================================================
 * 3. TEXT ALIGNMENT EXTENSION (left | center | right on paragraph & heading)
 * ========================================================================== */

export const TextAlignExtension = Extension.create({
  name: "textAlign",

  addGlobalAttributes() {
    return [
      {
        types: ["heading", "paragraph"],
        attributes: {
          textAlign: {
            default: "left",
            parseHTML: (element) =>
              element.style.textAlign ||
              element.getAttribute("data-text-align") ||
              "left",
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === "left") {
                return {};
              }
              return {
                style: `text-align: ${attributes.textAlign}`,
                "data-text-align": attributes.textAlign,
              };
            },
          },
        },
      },
    ];
  },
});

/* ============================================================================
 * 4. HIGHLIGHT, SUBSCRIPT & SUPERSCRIPT MARKS
 * ========================================================================== */

export const HighlightExtension = Mark.create({
  name: "highlight",

  parseHTML() {
    return [{ tag: "mark" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes(HTMLAttributes, {
        class: "rounded bg-[#e89b3c]/25 px-1 py-0.5 text-[var(--text-primary)]",
      }),
      0,
    ];
  },
});

export const SubscriptExtension = Mark.create({
  name: "subscript",
  excludes: "superscript",

  parseHTML() {
    return [{ tag: "sub" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(HTMLAttributes), 0];
  },
});

export const SuperscriptExtension = Mark.create({
  name: "superscript",
  excludes: "subscript",

  parseHTML() {
    return [{ tag: "sup" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(HTMLAttributes), 0];
  },
});

/* ============================================================================
 * 5. TABLE EXTENSIONS (table, tableRow, tableHeader, tableCell)
 *    Supports pasting HTML/Docs tables and inserting/editing tables in blogs.
 * ========================================================================== */

export const TableExtension = Node.create({
  name: "table",
  group: "block",
  content: "tableRow+",
  isolating: true,

  parseHTML() {
    return [{ tag: "table" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "my-6 overflow-x-auto rounded-xl border border-white/[0.12]" },
      [
        "table",
        mergeAttributes(HTMLAttributes, {
          class: "w-full border-collapse text-left text-sm",
        }),
        ["tbody", 0],
      ],
    ];
  },
});

export const TableRowExtension = Node.create({
  name: "tableRow",
  content: "(tableCell | tableHeader)+",

  parseHTML() {
    return [{ tag: "tr" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "tr",
      mergeAttributes(HTMLAttributes, {
        class: "border-b border-white/[0.08] last:border-b-0",
      }),
      0,
    ];
  },
});

export const TableHeaderExtension = Node.create({
  name: "tableHeader",
  content: "block+",
  isolating: true,

  addAttributes() {
    return {
      colspan: { default: 1 },
      rowspan: { default: 1 },
    };
  },

  parseHTML() {
    return [{ tag: "th" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "th",
      mergeAttributes(HTMLAttributes, {
        class:
          "border-r border-[var(--border-hairline)] last:border-r-0 bg-[#e89b3c]/10 px-3.5 py-2.5 font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e89b3c] [&>p]:my-0",
      }),
      0,
    ];
  },
});

export const TableCellExtension = Node.create({
  name: "tableCell",
  content: "block+",
  isolating: true,

  addAttributes() {
    return {
      colspan: { default: 1 },
      rowspan: { default: 1 },
    };
  },

  parseHTML() {
    return [{ tag: "td" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(HTMLAttributes, {
        class:
          "border-r border-[var(--border-hairline)] last:border-r-0 px-3.5 py-2.5 align-top text-sm text-[var(--text-primary)] [&>p]:my-0",
      }),
      0,
    ];
  },
});
