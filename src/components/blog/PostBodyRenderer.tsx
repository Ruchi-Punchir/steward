import React from "react";
import Image from "next/image";
import { sanitizePostBodyJson } from "@/lib/blog/sanitize";
import type { TiptapMark, TiptapNode } from "@/lib/blog/types";

interface PostBodyRendererProps {
  body: unknown;
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
          <strong key={idx} className="font-semibold text-[var(--text-primary)]">
            {acc}
          </strong>
        );
      case "italic":
        return (
          <em key={idx} className="italic">
            {acc}
          </em>
        );
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
        const isExternal = href.startsWith("http");
        return (
          <a
            key={idx}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer nofollow" : undefined}
            className="text-[#e89b3c] underline decoration-[#e89b3c]/60 underline-offset-4 transition-colors hover:text-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
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

    case "paragraph":
      return (
        <p
          key={index}
          className="my-5 text-[17px] leading-[1.8] text-[var(--text-secondary)]"
        >
          {children && children.length > 0 ? children : <br />}
        </p>
      );

    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      if (level === 3) {
        return (
          <h3
            key={index}
            className="mt-9 mb-3 text-xl font-semibold tracking-tight text-[var(--text-primary)]"
          >
            {children}
          </h3>
        );
      }
      return (
        <h2
          key={index}
          className="mt-12 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[26px]"
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

    case "codeBlock":
      return (
        <pre
          key={index}
          className="my-6 overflow-x-auto rounded-xl border border-[var(--border-hairline)] bg-[#0c0c10] p-4 font-mono text-xs leading-relaxed text-[#f4f0ea]"
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
      if (!src) return null;
      return (
        <figure key={index} className="my-8">
          <div className="relative overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-panel)]">
            <Image
              src={src}
              alt={alt || "Article illustration"}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 680px"
              className="max-h-[380px] w-full object-cover"
            />
          </div>
          {alt && (
            <figcaption className="mt-2.5 text-center font-mono-label text-[11px] text-[var(--text-muted)]">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }

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
