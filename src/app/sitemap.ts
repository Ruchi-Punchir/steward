import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/public-queries";

export const revalidate = 60;

const CANONICAL_ORIGIN = "https://www.hellosteward.agency";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const publishedPosts = await getPublishedPosts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_ORIGIN}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_ORIGIN}/conversion-engineering`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${CANONICAL_ORIGIN}/mvp-rescue`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${CANONICAL_ORIGIN}/speed-audit`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${CANONICAL_ORIGIN}/pricing-strategy`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_ORIGIN}/onboarding-retention`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_ORIGIN}/engagement-models`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_ORIGIN}/audit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_ORIGIN}/talk`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${CANONICAL_ORIGIN}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  if (publishedPosts.length > 0) {
    staticRoutes.push({
      url: `${CANONICAL_ORIGIN}/insights`,
      lastModified: new Date(
        publishedPosts[0].publish_at ?? publishedPosts[0].updated_at
      ),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${CANONICAL_ORIGIN}/insights/${post.slug}`,
    lastModified: new Date(
      post.updated_at ?? post.publish_at ?? post.created_at
    ),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
