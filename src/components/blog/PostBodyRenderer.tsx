import React from "react";
import { sanitizePostBodyJson } from "@/lib/blog/sanitize";
import type {
  CalloutTone,
  ImageAlignOption,
  ImageWidthOption,
  TiptapMark,
  TiptapNode,
} from "@/lib/blog/types";

interface PostBodyRendererProps {
  body: unknown;
}

const IMAGE_WIDTH_CLASSES: Record<ImageWidthOption, string> = {
  small: "max-w-[340px] w-full",
  medium: "max-w-[500px] w-full",
  wide: "max-w-[600px] w-full",
  full: "w-full",
};

const IMAGE_ALIGN_CLASSES: Record<ImageAlignOption, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

const CALLOUT_TONE_CLASSES: Record<
  CalloutTone,
  { box: string; badge: string; defaultLabel: string }
> = {
  info: {
    box: "border-sky-500/35 bg-sky-500/[0.06]",
    badge: "text-sky-400",
    defaultLabel: "Note",
  },
  tip: {
    box: "border-[#e89b3c]/40 bg-[#e89b3c]/[0.07]",
    badge: "text-[#e89b3c]",
    defaultLabel: "Key Takeaway",
  },
  warning: {
    box: "border-amber-500/40 bg-amber-500/[0.07]",
    badge: "text-amber-400",
    defaultLabel: "Watch Out",
  },
};

function getTextAlignClass(align: unknown): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "";
}

function renderMarks(
  content: React.ReactNode,
  marks?: TiptapMark[]
): React.ReactNode {
  if (!marks || marks.length === 0) return content;

  return marks.reduce<React.ReactNode>((acc, mark, idx) => {
    switch (mark.type) {
      case "bold":
        return (
          <strong
            key={idx}
            className="font-semibold text-[var(--text-primary)]"
          >
            {acc}
          </strong>
        );
      case "italic":
        return (
          <em key={idx} className="italic">
            {acc}
          </em>
        );
      case "underline":
        return (
          <u
            key={idx}
            className="underline decoration-[var(--text-secondary)] underline-offset-4"
          >
            {acc}
          </u>
        );
      case "strike":
        return (
          <s key={idx} className="line-through opacity-75">
            {acc}
          </s>
        );
      case "highlight":
        return (
          <mark
            key={idx}
            className="rounded bg-[#e89b3c]/25 px-1.5 py-0.5 text-[var(--text-primary)]"
          >
            {acc}
          </mark>
        );
      case "subscript":
        return <sub key={idx}>{acc}</sub>;
      case "superscript":
        return <sup key={idx}>{acc}</sup>;
      case "code":
        return (
          <code
            key={idx}
            className="rounded border border-[var(--border-hairline)] bg-[var(--bg-panel)] px-1.5 py-0.5 font-mono text-[0.88em] text-[#e89b3c]"
          >
            {acc}
          </code>
        );
      case "link": {
        const href = mark.attrs?.href ?? "#";
        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");
        const target =
          mark.attrs?.target ?? (isExternal ? "_blank" : undefined);
        const rel =
          mark.attrs?.rel ??
          (target === "_blank" ? "noopener noreferrer nofollow" : undefined);
        return (
          <a
            key={idx}
            href={href}
            target={target}
            rel={rel}
            className="font-medium text-[#e89b3c] underline decoration-[#e89b3c]/70 underline-offset-4 transition-colors hover:text-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, content);
}

function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "doc":
      return <>{children}</>;

    case "paragraph": {
      const alignClass = getTextAlignClass(node.attrs?.textAlign);
      return (
        <p
          key={index}
          className={`my-5 text-[17px] leading-[1.8] text-[var(--text-secondary)] ${alignClass}`.trim()}
        >
          {children && children.length > 0 ? children : <br />}
        </p>
      );
    }

    case "heading": {
      const rawLevel = Number(node.attrs?.level);
      const level =
        rawLevel === 1 || rawLevel === 2 || rawLevel === 3 || rawLevel === 4
          ? rawLevel
          : 2;
      const alignClass = getTextAlignClass(node.attrs?.textAlign);

      if (level === 1) {
        return (
          <h2
            key={index}
            className={`mt-12 mb-4 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl ${alignClass}`.trim()}
          >
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3
            key={index}
            className={`mt-9 mb-3 text-xl font-semibold tracking-tight text-[var(--text-primary)] ${alignClass}`.trim()}
          >
            {children}
          </h3>
        );
      }
      if (level === 4) {
        return (
          <h4
            key={index}
            className={`mt-7 mb-2.5 text-lg font-semibold tracking-tight text-[var(--text-primary)] ${alignClass}`.trim()}
          >
            {children}
          </h4>
        );
      }
      return (
        <h2
          key={index}
          className={`mt-12 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[26px] ${alignClass}`.trim()}
        >
          {children}
        </h2>
      );
    }

    case "bulletList":
      return (
        <ul
          key={index}
          className="my-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.78] text-[var(--text-secondary)] marker:text-[#e89b3c]"
        >
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={index}
          start={
            typeof node.attrs?.start === "number" ? node.attrs.start : undefined
          }
          className="my-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.78] text-[var(--text-secondary)] marker:font-mono marker:text-[#e89b3c]"
        >
          {children}
        </ol>
      );

    case "listItem":
      return (
        <li key={index} className="[&>p]:my-1">
          {children}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-7 rounded-r-xl border-l-2 border-[#e89b3c] bg-[var(--bg-panel)] py-3 pr-4 pl-5 italic text-[var(--text-primary)] [&>p]:my-1.5"
        >
          {children}
        </blockquote>
      );

    case "callout": {
      const tone: CalloutTone =
        node.attrs?.tone === "info" ||
        node.attrs?.tone === "tip" ||
        node.attrs?.tone === "warning"
          ? node.attrs.tone
          : "tip";
      const title =
        typeof node.attrs?.title === "string" ? node.attrs.title.trim() : "";
      const style = CALLOUT_TONE_CLASSES[tone];

      return (
        <aside
          key={index}
          className={`my-7 rounded-xl border p-5 ${style.box}`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] ${style.badge}`}
            >
              {title || style.defaultLabel}
            </span>
          </div>
          <div className="text-[16px] leading-[1.75] text-[var(--text-primary)] [&>p]:my-1.5">
            {children}
          </div>
        </aside>
      );
    }

    case "codeBlock":
      return (
        <pre
          key={index}
          className="my-6 overflow-x-auto rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-4 font-mono text-xs leading-relaxed text-[var(--text-primary)]"
        >
          <code>{children}</code>
        </pre>
      );

    case "horizontalRule":
      return (
        <hr
          key={index}
          className="my-10 border-0 border-t border-[var(--border-hairline)]"
        />
      );

    case "hardBreak":
      return <br key={index} />;

    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      const caption =
        typeof node.attrs?.caption === "string"
          ? node.attrs.caption.trim()
          : "";
      const width: ImageWidthOption =
        node.attrs?.width === "small" ||
        node.attrs?.width === "medium" ||
        node.attrs?.width === "wide" ||
        node.attrs?.width === "full"
          ? node.attrs.width
          : "full";
      const align: ImageAlignOption =
        node.attrs?.align === "left" ||
        node.attrs?.align === "center" ||
        node.attrs?.align === "right"
          ? node.attrs.align
          : "center";

      if (!src) return null;

      return (
        <figure key={index} className="my-8">
          <div
            className={`${IMAGE_WIDTH_CLASSES[width]} ${IMAGE_ALIGN_CLASSES[align]}`}
          >
            <div className="overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-panel)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || caption || "Article illustration"}
                loading="lazy"
                className="block h-auto w-full object-contain"
              />
            </div>
            {caption && (
              <figcaption
                className={`mt-2.5 font-mono-label text-[11.5px] leading-relaxed text-[var(--text-muted)] ${
                  align === "center"
                    ? "text-center"
                    : align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {caption}
              </figcaption>
            )}
          </div>
        </figure>
      );
    }

    case "table":
      return (
        <div
          key={index}
          className="my-7 overflow-x-auto rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-panel)]"
        >
          <table className="w-full border-collapse text-left text-sm">
            <tbody>{children}</tbody>
          </table>
        </div>
      );

    case "tableRow":
      return (
        <tr
          key={index}
          className="border-b border-[var(--border-hairline)] last:border-b-0"
        >
          {children}
        </tr>
      );

    case "tableHeader":
      return (
        <th
          key={index}
          colSpan={
            typeof node.attrs?.colspan === "number"
              ? node.attrs.colspan
              : undefined
          }
          rowSpan={
            typeof node.attrs?.rowspan === "number"
              ? node.attrs.rowspan
              : undefined
          }
          className="border-r border-[var(--border-hairline)] last:border-r-0 bg-white/[0.04] px-4 py-3 font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e89b3c] [&>p]:my-0"
        >
          {children}
        </th>
      );

    case "tableCell":
      return (
        <td
          key={index}
          colSpan={
            typeof node.attrs?.colspan === "number"
              ? node.attrs.colspan
              : undefined
          }
          rowSpan={
            typeof node.attrs?.rowspan === "number"
              ? node.attrs.rowspan
              : undefined
          }
          className="border-r border-[var(--border-hairline)] last:border-r-0 px-4 py-3 align-top text-[15px] leading-relaxed text-[var(--text-secondary)] [&>p]:my-0"
        >
          {children}
        </td>
      );

    case "text":
      return (
        <React.Fragment key={index}>
          {renderMarks(node.text ?? "", node.marks)}
        </React.Fragment>
      );

    default:
      return null;
  }
}

export default function PostBodyRenderer({ body }: PostBodyRendererProps) {
  const cleanDoc = sanitizePostBodyJson(body);

  return (
    <div className="prose-steward max-w-none">{renderNode(cleanDoc, 0)}</div>
  );
}
