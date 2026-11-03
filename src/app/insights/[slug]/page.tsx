import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsShell from "@/components/blog/InsightsShell";
import PostArticleView from "@/components/blog/PostArticleView";
import {
  getPublishedPostBySlug,
  getPublishedPosts,
  getRelatedPublishedPosts,
} from "@/lib/blog/public-queries";

export const revalidate = 60;

function getSiteOrigin(): string {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (domain && domain !== "hellosteward.agency") {
    return domain.startsWith("http") ? domain : `https://${domain}`;
  }
  return "https://hellosteward.agency";
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface InsightsPostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InsightsPostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return {
      title: "Not Found — Steward",
      robots: { index: false, follow: false },
    };
  }

  const origin = getSiteOrigin();
  const canonicalUrl = `${origin}/insights/${post.slug}`;
  const metaTitle = post.seo_title?.trim() || `${post.title} — Steward`;
  const metaDescription =
    post.seo_description?.trim() ||
    post.summary?.trim() ||
    `An essay by ${post.author} on ${post.category.toLowerCase()} at Steward.`;

  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "Steward",
      publishedTime: post.publish_at ?? post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function InsightsPostDetailPage({
  params,
}: InsightsPostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  // Drafts and future-scheduled posts never appear on the live site and return 404
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPublishedPosts(post.category, post.id);
  const origin = getSiteOrigin();
  const canonicalUrl = `${origin}/insights/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo_title?.trim() || post.title,
    description: post.seo_description?.trim() || post.summary,
    image: post.cover_image_url
      ? [post.cover_image_url]
      : [`${canonicalUrl}/opengraph-image`],
    datePublished: post.publish_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Steward",
      url: origin,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: post.category,
  };

  return (
    <InsightsShell hasPublishedPosts>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PostArticleView post={post} relatedPosts={relatedPosts} />
    </InsightsShell>
  );
}
