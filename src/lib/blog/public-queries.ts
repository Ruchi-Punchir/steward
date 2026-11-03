import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  POST_CATEGORIES,
  type PostCategory,
  type PostRecord,
} from "@/lib/blog/types";

/**
 * Promote any 'scheduled' posts whose publish_at timestamp has arrived to 'published'.
 * Safe no-op if service role key is unavailable.
 */
export async function promoteDueScheduledPosts(): Promise<number> {
  const adminSupabase = createSupabaseAdminClient();
  if (!adminSupabase) return 0;

  try {
    const nowIso = new Date().toISOString();
    const { data } = await adminSupabase
      .from("posts")
      .update({ status: "published" })
      .eq("status", "scheduled")
      .lte("publish_at", nowIso)
      .select("id");

    return data?.length ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch all live published posts (newest publish_at first).
 * Never returns drafts or future-scheduled posts.
 */
export async function getPublishedPosts(
  categoryFilter?: PostCategory
): Promise<PostRecord[]> {
  if (!isSupabaseConfigured()) return [];

  await promoteDueScheduledPosts();

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  const nowIso = new Date().toISOString();

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
    .order("publish_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (categoryFilter) {
    query = query.eq("category", categoryFilter);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data as PostRecord[];
}

/**
 * Fetch a single live published post by slug.
 * Returns null for drafts, future-scheduled posts, or non-existent slugs (so the route returns 404).
 */
export async function getPublishedPostBySlug(
  slug: string
): Promise<PostRecord | null> {
  if (!isSupabaseConfigured() || !slug) return null;

  await promoteDueScheduledPosts();

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug.trim().toLowerCase())
    .eq("status", "published")
    .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
    .maybeSingle();

  if (error || !data) return null;
  return data as PostRecord;
}

/**
 * Fetch up to 2 related published posts from the same category (excluding currentPostId).
 */
export async function getRelatedPublishedPosts(
  category: PostCategory,
  excludePostId: string
): Promise<PostRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", excludePostId)
    .or(`publish_at.is.null,publish_at.lte.${nowIso}`)
    .order("publish_at", { ascending: false, nullsFirst: false })
    .limit(2);

  if (error || !data) return [];
  return data as PostRecord[];
}

/**
 * Check if at least one published post exists (controls whether the "Insights" link appears in the main nav).
 */
export async function hasAtLeastOnePublishedPost(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  await promoteDueScheduledPosts();

  const supabase =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  const nowIso = new Date().toISOString();

  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .or(`publish_at.is.null,publish_at.lte.${nowIso}`);

  if (error) return false;
  return (count ?? 0) > 0;
}

/**
 * Resolve a URL category param (e.g. "revenue" or "Revenue") to a canonical PostCategory.
 */
export function resolveCategoryParam(raw: string): PostCategory | null {
  const normalized = decodeURIComponent(raw).trim().toLowerCase();
  return (
    POST_CATEGORIES.find((c) => c.toLowerCase() === normalized) ?? null
  );
}
