import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/public-queries";

export const revalidate = 60;

function getSiteOrigin(): string {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (domain && domain !== "hellosteward.agency") {
    return domain.startsWith("http") ? domain : `https://${domain}`;
  }
  return "https://hellosteward.agency";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const publishedPosts = await getPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  if (publishedPosts.length > 0) {
    staticRoutes.push({
      url: `${origin}/insights`,
      lastModified: new Date(
        publishedPosts[0].publish_at ?? publishedPosts[0].updated_at
      ),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${origin}/insights/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.publish_at ?? post.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
