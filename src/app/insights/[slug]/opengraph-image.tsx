import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/blog/public-queries";

export const runtime = "nodejs";
export const alt = "Steward Insights";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OgProps {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage({ params }: OgProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  const title = post?.title ?? "Steward Insights";
  const category = post?.category ?? "Revenue";
  const author = post?.author ?? "Steward";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08080a",
          color: "#f4f0ea",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Top Row: STEWARD Brand & Category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              color: "#f4f0ea",
            }}
          >
            <svg
              width="36"
              height="32"
              viewBox="0 0 262 226"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ffffff"
                fillRule="evenodd"
                d="M131 0 L261 226 L1 226 Z M131 37 L33 207 L229 207 Z"
              />
              <circle cx="131" cy="149.5" r="41" fill="#e89b3c" />
            </svg>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "#f4f0ea",
              }}
            >
              Steward
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(232,155,60,0.45)",
              backgroundColor: "rgba(232,155,60,0.12)",
              color: "#e89b3c",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        {/* Center Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 70 ? "50px" : "62px",
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: "#f4f0ea",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Row: Author & Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "28px",
            fontSize: "20px",
            color: "#a09c94",
          }}
        >
          <div>By {author}</div>
          <div style={{ color: "#e89b3c", letterSpacing: "0.14em" }}>
            HELLOSTEWARD.AGENCY / INSIGHTS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
