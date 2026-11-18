import React from "react";
import type { Metadata } from "next";
import InsightsShell from "@/components/blog/InsightsShell";
import InsightsListingView from "@/components/blog/InsightsListingView";
import { getPublishedPosts } from "@/lib/blog/public-queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Growth Insights & Business Strategy | Steward",
  description:
    "Explore insights on product strategy, customer experience, technology and business growth to understand what drives sustainable business growth.",
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
