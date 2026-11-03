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
              gap: "14px",
              color: "#f4f0ea",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                backgroundColor: "#e89b3c",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.05,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.32em",
                  color: "#e89b3c",
                  textTransform: "uppercase",
                }}
              >
                HELLO
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  color: "#f4f0ea",
                }}
              >
                STEWARD
              </span>
            </div>
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
