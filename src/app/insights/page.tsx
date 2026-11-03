import React from "react";
import type { Metadata } from "next";
import InsightsShell from "@/components/blog/InsightsShell";
import InsightsListingView from "@/components/blog/InsightsListingView";
import { getPublishedPosts } from "@/lib/blog/public-queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Insights — Steward",
  description:
    "Direct field notes from Ashish and Ruchi on pricing, product onboarding, positioning, and fixing revenue leaks.",
  alternates: {
    canonical: "/insights",
    types: {
      "application/rss+xml": "/insights/rss.xml",
    },
  },
};

interface InsightsIndexPageProps {
  searchParams: Promise<{ limit?: string }>;
}

export default async function InsightsIndexPage({
  searchParams,
}: InsightsIndexPageProps) {
  const params = await searchParams;
  const parsedLimit = Number.parseInt(params.limit ?? "9", 10);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit >= 9 ? parsedLimit : 9;

  const posts = await getPublishedPosts();

  return (
    <InsightsShell hasPublishedPosts={posts.length > 0}>
      <InsightsListingView posts={posts} activeCategory={null} limit={limit} />
    </InsightsShell>
  );
}
