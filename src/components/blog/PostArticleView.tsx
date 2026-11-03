import React from "react";
import Image from "next/image";
import Link from "next/link";
import PostBodyRenderer from "@/components/blog/PostBodyRenderer";
import {
  calculateReadTimeMinutes,
  sanitizePostBodyJson,
} from "@/lib/blog/sanitize";
import type { PostRecord } from "@/lib/blog/types";

interface PostArticleViewProps {
  post: PostRecord;
  relatedPosts?: PostRecord[];
  isPreview?: boolean;
}

function formatPublishedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export default function PostArticleView({
  post,
  relatedPosts = [],
  isPreview = false,
}: PostArticleViewProps) {
  const sanitizedBody = sanitizePostBodyJson(post.body);
  const readTimeMinutes = calculateReadTimeMinutes(sanitizedBody);
  const displayDate = post.publish_at ?? post.updated_at ?? post.created_at;

  return (
    <article className="mx-auto w-full max-w-[680px] px-5 py-10 sm:px-6 sm:py-14">
      {/* Back to Insights Link */}
      <div className="mb-6">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors hover:text-[#e89b3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e89b3c]"
        >
          ← All Insights
        </Link>
      </div>

      {/* Category & Meta Header */}
      <header className="border-b border-[var(--border-hairline)] pb-8">
        <div className="flex flex-wrap items-center gap-2.5 font-mono-label text-[11px] uppercase tracking-[0.18em]">
          <Link
            href={`/insights/category/${post.category.toLowerCase()}`}
            className="text-[#e89b3c] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            {post.category}
          </Link>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-[var(--text-secondary)]">
            {readTimeMinutes} min read
          </span>
          {isPreview && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="rounded border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-2 py-0.5 text-[10px] text-[#e89b3c]">
                Admin Preview ({post.status})
              </span>
            </>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-[1.14] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[40px]">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {post.summary}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between font-mono-label text-xs text-[var(--text-secondary)]">
          <span>
            By{" "}
            <strong className="font-semibold text-[var(--text-primary)]">
              {post.author}
            </strong>
          </span>
          <time dateTime={displayDate} className="text-[var(--text-muted)]">
            {formatPublishedDate(displayDate)}
          </time>
        </div>
      </header>

      {/* Cover Image (Optimized with next/image + required alt text) */}
      {post.cover_image_url && (
        <figure className="my-8">
          <div className="relative h-[220px] overflow-hidden rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] sm:h-[340px]">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
            />
          </div>
          {post.cover_image_alt && (
            <figcaption className="mt-2.5 text-center font-mono-label text-[11px] text-[var(--text-muted)]">
              {post.cover_image_alt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Sanitized Body Content */}
      <div className="mt-8">
        <PostBodyRenderer body={sanitizedBody} />
      </div>

      {/* Bottom CTA Block: "Want us to look at yours?" with Free Audit button */}
      <aside className="mt-14 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-7 sm:p-8">
        <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[#e89b3c]">
          05 / Let&rsquo;s Start
        </span>
        <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Want us to look at yours?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Send us your product and your numbers, and we&rsquo;ll show you where
          the biggest leak is. No cost, no strings.
        </p>
        <div className="mt-5">
          <Link
            href="/contact?intent=audit&source=insights-post"
            data-open-audit-modal="true"
            data-cta-source="insights-post"
            className="inline-flex items-center justify-center rounded-full bg-[#e89b3c] px-6 py-3 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#08080a] transition-colors hover:bg-[#f2aa4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
          >
            Get a free audit
          </Link>
        </div>
      </aside>

      {/* "Next up" — Two related posts from the same category */}
      {relatedPosts.length > 0 && (
        <section
          aria-labelledby="next-up-heading"
          className="mt-16 border-t border-[var(--border-hairline)] pt-10"
        >
          <div className="flex items-center justify-between">
            <h2
              id="next-up-heading"
              className="font-mono-label text-xs uppercase tracking-[0.22em] text-[#e89b3c]"
            >
              Next up in {post.category}
            </h2>
            <Link
              href={`/insights/category/${post.category.toLowerCase()}`}
              className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {relatedPosts.map((rel) => {
              const relDate = rel.publish_at ?? rel.updated_at ?? rel.created_at;
              return (
                <Link
                  key={rel.id}
                  href={`/insights/${rel.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] p-5 transition-all hover:border-[#e89b3c]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
                >
                  <div>
                    <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#e89b3c]">
                      {rel.category}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[#e89b3c]">
                      {rel.title}
                    </h3>
                    {rel.summary && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {rel.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-hairline)] pt-3 font-mono-label text-[10.5px] text-[var(--text-muted)]">
                    <span>{rel.author}</span>
                    <time dateTime={relDate}>{formatPublishedDate(relDate)}</time>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
