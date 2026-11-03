import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InsightsShell from "@/components/blog/InsightsShell";
import InsightsListingView from "@/components/blog/InsightsListingView";
import {
  getPublishedPosts,
  hasAtLeastOnePublishedPost,
  resolveCategoryParam,
} from "@/lib/blog/public-queries";
import { POST_CATEGORIES } from "@/lib/blog/types";

export const revalidate = 60;

export async function generateStaticParams() {
  return POST_CATEGORIES.map((c) => ({
    category: c.toLowerCase(),
  }));
}

interface InsightsCategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ limit?: string }>;
}

export async function generateMetadata({
  params,
}: InsightsCategoryPageProps): Promise<Metadata> {
  const { category: rawCat } = await params;
  const resolved = resolveCategoryParam(rawCat);
  if (!resolved) {
    return { title: "Not Found — Steward" };
  }

  return {
    title: `${resolved} Insights — Steward`,
    description: `Steward field notes and teardown essays on ${resolved.toLowerCase()} for founders and product leaders.`,
    alternates: {
      canonical: `/insights/category/${resolved.toLowerCase()}`,
    },
  };
}

export default async function InsightsCategoryPage({
  params,
  searchParams,
}: InsightsCategoryPageProps) {
  const { category: rawCat } = await params;
  const resolvedCategory = resolveCategoryParam(rawCat);
  if (!resolvedCategory) {
    notFound();
  }

  const sp = await searchParams;
  const parsedLimit = Number.parseInt(sp.limit ?? "9", 10);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit >= 9 ? parsedLimit : 9;

  const [posts, hasAnyPublished] = await Promise.all([
    getPublishedPosts(resolvedCategory),
    hasAtLeastOnePublishedPost(),
  ]);

  return (
    <InsightsShell hasPublishedPosts={hasAnyPublished}>
      <InsightsListingView
        posts={posts}
        activeCategory={resolvedCategory}
        limit={limit}
      />
    </InsightsShell>
  );
}
