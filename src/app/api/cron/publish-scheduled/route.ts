import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { promoteDueScheduledPosts } from "@/lib/blog/public-queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const isCronAuthorized =
    Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;

  if (!isCronAuthorized) {
    const adminAuth = await requireAdminApi();
    if (!adminAuth.authorized) {
      return adminAuth.response;
    }
  }

  const promotedCount = await promoteDueScheduledPosts();
  if (promotedCount > 0) {
    revalidatePath("/insights");
    revalidatePath("/sitemap.xml");
    revalidatePath("/insights/rss.xml");
  }

  return NextResponse.json({
    ok: true,
    promotedCount,
    checkedAt: new Date().toISOString(),
  });
}
