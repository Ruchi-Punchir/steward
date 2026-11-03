import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/blog/public-queries";

export const revalidate = 60;

function getSiteOrigin(): string {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (domain && domain !== "hellosteward.agency") {
    return domain.startsWith("http") ? domain : `https://${domain}`;
  }
  return "https://hellosteward.agency";
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const origin = getSiteOrigin();
  const posts = await getPublishedPosts();

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${origin}/insights/${post.slug}`;
      const pubDate = new Date(
        post.publish_at ?? post.created_at
      ).toUTCString();
      const summary = post.summary || `${post.title} — by ${post.author}`;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <author>${escapeXml(post.author)}</author>
      <description>${escapeXml(summary)}</description>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Steward Insights</title>
    <link>${escapeXml(`${origin}/insights`)}</link>
    <description>Direct field notes from Ashish and Ruchi on pricing, product onboarding, positioning, and fixing revenue leaks.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(`${origin}/insights/rss.xml`)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
