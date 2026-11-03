import { NextResponse } from "next/server";
import { hasAtLeastOnePublishedPost } from "@/lib/blog/public-queries";

export const revalidate = 60;

export async function GET() {
  const hasPublished = await hasAtLeastOnePublishedPost();
  return NextResponse.json({ hasPublished });
}
