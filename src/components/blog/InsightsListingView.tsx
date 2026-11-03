import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  calculateReadTimeMinutes,
  sanitizePostBodyJson,
} from "@/lib/blog/sanitize";
import {
  POST_CATEGORIES,
  type PostCategory,
  type PostRecord,
} from "@/lib/blog/types";

interface InsightsListingViewProps {
  posts: PostRecord[];
  activeCategory?: PostCategory | null;
  limit: number;
}

function formatCardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export default function InsightsListingView({
  posts,
  activeCategory = null,
  limit,
}: InsightsListingViewProps) {
  // Featured post at the top on /insights (or if a featured post is in the category)
  const featuredPost =
    !activeCategory && posts.length > 0
      ? posts.find((p) => p.featured) ?? posts[0]
      : null;

  const remainingPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  const visibleGridPosts = remainingPosts.slice(0, limit);
  const hasMore = remainingPosts.length > limit;
  const nextLimit = limit + 9;
  const loadMoreHref = activeCategory
    ? `/insights/category/${activeCategory.toLowerCase()}?limit=${nextLimit}`
    : `/insights?limit=${nextLimit}`;

  return (
    <div className="mx-auto w-full max-w-[1560px] px-6 py-10 sm:px-10 sm:py-14 lg:px-16 xl:px-24">
      {/* Header Section */}
      <header className="flex flex-col justify-between gap-6 border-b border-[var(--border-hairline)] pb-10 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.24em] text-[#e89b3c]">
              Steward / Insights
            </span>
            <span className="h-px w-8 bg-[#e89b3c]/50" />
            <Link
              href="/insights/rss.xml"
              className="font-mono-label text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors hover:text-[#e89b3c]"
            >
              RSS ↗
            </Link>
          </div>

          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl">
            {activeCategory ? (
              <>
                {activeCategory}{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  field notes.
                </span>
              </>
            ) : (
              <>
                What actually moves{" "}
                <span className="font-serif-editorial font-normal italic text-[#e89b3c]">
                  revenue.
                </span>
              </>
            )}
          </h1>

          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Direct teardown notes from Ashish and Ruchi on pricing, product
            onboarding, positioning, and fixing funnel leaks.
          </p>
        </div>

        {/* Category Filter Chips (Pure HTML <Link> elements — works with or without JavaScript) */}
        <nav aria-label="Insights categories">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/insights"
                className={`inline-flex items-center rounded-full border px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] ${
                  !activeCategory
                    ? "border-[#e89b3c] bg-[#e89b3c] font-semibold text-[#08080a]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:border-[#e89b3c]/50 hover:text-[var(--text-primary)]"
                }`}
              >
                All
              </Link>
            </li>
            {POST_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <li key={cat}>
                  <Link
                    href={`/insights/category/${cat.toLowerCase()}`}
                    className={`inline-flex items-center rounded-full border px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] ${
                      isSelected
                        ? "border-[#e89b3c] bg-[#e89b3c] font-semibold text-[#08080a]"
                        : "border-[var(--border-hairline)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:border-[#e89b3c]/50 hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Empty State: "Arriving soon" */}
      {posts.length === 0 ? (
        <div className="my-16 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] px-6 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e89b3c]/35 bg-[#e89b3c]/10 px-3.5 py-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
            ● Arriving soon
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {activeCategory
              ? `New ${activeCategory.toLowerCase()} essays arriving soon.`
              : "First essays arriving soon."}
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            We write when we have real numbers and teardown findings worth your
            time. Check back shortly or start with a free audit below.
          </p>
          {activeCategory && (
            <div className="mt-6">
              <Link
                href="/insights"
                className="inline-flex items-center rounded-full border border-[var(--border-hairline)] px-5 py-2.5 font-mono-label text-xs uppercase tracking-[0.16em] text-[var(--text-primary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
              >
                ← View all categories
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Featured Post at the Top */}
          {featuredPost && (
            <section aria-label="Featured Post" className="mt-8">
              <Link
                href={`/insights/${featuredPost.slug}`}
                className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] transition-all hover:border-[#e89b3c]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c] lg:max-h-[290px] lg:grid-cols-12"
              >
                {featuredPost.cover_image_url ? (
                  <div className="relative h-[200px] overflow-hidden border-b border-[var(--border-hairline)] bg-[#0c0c10] sm:h-[230px] lg:col-span-6 lg:h-[290px] lg:border-r lg:border-b-0">
                    <Image
                      src={featuredPost.cover_image_url}
                      alt={
                        featuredPost.cover_image_alt || featuredPost.title
                      }
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="flex h-[180px] flex-col justify-between border-b border-[var(--border-hairline)] bg-[radial-gradient(circle_at_top_left,rgba(232,155,60,0.16),transparent_70%)] p-6 lg:col-span-6 lg:h-[290px] lg:border-r lg:border-b-0">
                    <span className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[#e89b3c]">
                      Steward Essay
                    </span>
                    <span className="font-serif-editorial text-3xl italic text-[#e89b3c]/80 sm:text-4xl">
                      {featuredPost.category}
                    </span>
                  </div>
                )}

                <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-6 lg:max-h-[290px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 font-mono-label text-[10px] uppercase tracking-[0.18em]">
                      <span className="rounded border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-2 py-0.5 text-[#e89b3c]">
                        Featured
                      </span>
                      <span className="text-[#e89b3c]">
                        {featuredPost.category}
                      </span>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-secondary)]">
                        {calculateReadTimeMinutes(
                          sanitizePostBodyJson(featuredPost.body)
                        )}{" "}
                        min read
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[#e89b3c] sm:text-2xl">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.summary && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {featuredPost.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border-hairline)] pt-3.5 font-mono-label text-[11px] text-[var(--text-muted)]">
                    <span>
                      By{" "}
                      <strong className="font-medium text-[var(--text-primary)]">
                        {featuredPost.author}
                      </strong>
                    </span>
                    <time
                      dateTime={
                        featuredPost.publish_at ?? featuredPost.created_at
                      }
                    >
                      {formatCardDate(
                        featuredPost.publish_at ?? featuredPost.created_at
                      )}
                    </time>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Grid of Remaining Posts */}
          {visibleGridPosts.length > 0 && (
            <section aria-label="Posts Grid" className="mt-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleGridPosts.map((post) => {
                  const readTime = calculateReadTimeMinutes(
                    sanitizePostBodyJson(post.body)
                  );
                  const dateIso = post.publish_at ?? post.created_at;

                  return (
                    <Link
                      key={post.id}
                      href={`/insights/${post.slug}`}
                      className="group flex max-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-panel)] transition-all hover:border-[#e89b3c]/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
                    >
                      <div>
                        {post.cover_image_url && (
                          <div className="relative h-40 w-full overflow-hidden border-b border-[var(--border-hairline)] bg-[#0c0c10]">
                            <Image
                              src={post.cover_image_url}
                              alt={post.cover_image_alt || post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-center gap-2 font-mono-label text-[10px] uppercase tracking-[0.16em]">
                            <span className="text-[#e89b3c]">
                              {post.category}
                            </span>
                            <span className="text-[var(--text-muted)]">·</span>
                            <span className="text-[var(--text-secondary)]">
                              {readTime} min read
                            </span>
                          </div>

                          <h2 className="mt-2.5 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[#e89b3c]">
                            {post.title}
                          </h2>

                          {post.summary && (
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                              {post.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mx-5 mb-4 flex items-center justify-between border-t border-[var(--border-hairline)] pt-3 font-mono-label text-[10.5px] text-[var(--text-muted)]">
                        <span>{post.author}</span>
                        <time dateTime={dateIso}>
                          {formatCardDate(dateIso)}
                        </time>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* "Load more" after 9 posts (works with or without JavaScript) */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Link
                    href={loadMoreHref}
                    scroll={false}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-panel)] px-7 py-3 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e89b3c]"
                  >
                    Load more
                  </Link>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
