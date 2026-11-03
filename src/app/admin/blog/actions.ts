"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  POST_AUTHORS,
  POST_CATEGORIES,
  POST_STATUSES,
  slugifyTitle,
  type PostAuthor,
  type PostCategory,
  type PostRecord,
  type PostStatus,
} from "@/lib/blog/types";
import {
  findImagesMissingAlt,
  sanitizePostBodyJson,
} from "@/lib/blog/sanitize";

const savePostSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z
    .string()
    .trim()
    .min(1, "Post title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  slug: z.string().trim().max(120).optional().or(z.literal("")),
  summary: z
    .string()
    .trim()
    .max(160, "Summary cannot exceed 160 characters.")
    .optional()
    .or(z.literal("")),
  category: z.enum(POST_CATEGORIES),
  author: z.enum(POST_AUTHORS),
  cover_image_url: z.string().trim().max(1000).optional().or(z.literal("")),
  cover_image_alt: z.string().trim().max(300).optional().or(z.literal("")),
  body: z.unknown(),
  status: z.enum(POST_STATUSES),
  publish_at: z.string().trim().optional().or(z.literal("")).nullable(),
  featured: z.boolean().default(false),
  seo_title: z.string().trim().max(120).optional().or(z.literal("")),
  seo_description: z.string().trim().max(200).optional().or(z.literal("")),
  allowPublishedSlugChange: z.boolean().optional().default(false),
  isAutosave: z.boolean().optional().default(false),
});

export type SavePostInput = z.input<typeof savePostSchema>;

export interface SavePostResult {
  success: boolean;
  post?: PostRecord;
  error?: string;
}

async function resolveUniqueSlug(
  baseSlug: string,
  excludePostId?: string | null,
  autoResolveCollision = false
): Promise<{ slug: string; collision: boolean }> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { slug: baseSlug, collision: false };
  }

  let candidate = baseSlug || `post-${Date.now()}`;
  let counter = 2;

  while (true) {
    let query = supabase
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .limit(1);

    if (excludePostId) {
      query = query.neq("id", excludePostId);
    }

    const { data } = await query;
    const exists = Boolean(data && data.length > 0);

    if (!exists) {
      return { slug: candidate, collision: false };
    }

    if (!autoResolveCollision) {
      return { slug: candidate, collision: true };
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function savePostAction(
  rawInput: SavePostInput
): Promise<SavePostResult> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  const parsed = savePostSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check the post fields.",
    };
  }

  const input = parsed.data;
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { success: false, error: "Supabase service client not configured." };
  }

  // 1. Sanitize editor JSON body on the server
  const sanitizedBody = sanitizePostBodyJson(input.body);

  // 2. Enforce required alt text on inline images and cover image
  const missingInlineAlts = findImagesMissingAlt(sanitizedBody);
  if (missingInlineAlts.length > 0 && !input.isAutosave) {
    return {
      success: false,
      error:
        "Every image in the post body must have alt text before saving.",
    };
  }

  const hasCoverImage = Boolean(
    input.cover_image_url && input.cover_image_url.trim().length > 0
  );
  const hasCoverAlt = Boolean(
    input.cover_image_alt && input.cover_image_alt.trim().length > 0
  );

  if (!input.isAutosave) {
    if (hasCoverImage && !hasCoverAlt) {
      return {
        success: false,
        error: "Cover image alt text is required when a cover image is set.",
      };
    }
    if (
      (input.status === "published" || input.status === "scheduled") &&
      !hasCoverAlt
    ) {
      return {
        success: false,
        error:
          "Cover image alt text is required before scheduling or publishing.",
      };
    }
  }

  // 3. Fetch existing post if updating
  let existingPost: PostRecord | null = null;
  if (input.id) {
    const { data: found } = await supabase
      .from("posts")
      .select("*")
      .eq("id", input.id)
      .maybeSingle();
    if (found) {
      existingPost = found as PostRecord;
    }
  }

  // 4. Slug rules: lowercase, unique, no collisions, and locked after publishing unless explicitly confirmed
  const requestedSlug = slugifyTitle(input.slug || input.title);
  if (!requestedSlug) {
    return {
      success: false,
      error: "Please provide a valid URL slug (lowercase letters and numbers).",
    };
  }

  let finalSlug = requestedSlug;
  if (
    existingPost &&
    existingPost.status === "published" &&
    existingPost.slug !== requestedSlug &&
    !input.allowPublishedSlugChange
  ) {
    // Protect published URL from accidental change
    finalSlug = existingPost.slug;
  } else {
    const autoNumber = !existingPost || Boolean(input.isAutosave);
    const slugCheck = await resolveUniqueSlug(
      requestedSlug,
      existingPost?.id ?? null,
      autoNumber
    );
    if (slugCheck.collision) {
      return {
        success: false,
        error: `The slug "${requestedSlug}" is already used by another post. Choose a unique slug.`,
      };
    }
    finalSlug = slugCheck.slug;
  }

  // 5. Status & publish_at rules
  let finalPublishAt: string | null = null;
  if (input.publish_at && input.publish_at.trim()) {
    const d = new Date(input.publish_at);
    if (Number.isNaN(d.getTime())) {
      return { success: false, error: "Invalid publish date/time." };
    }
    finalPublishAt = d.toISOString();
  }

  if (input.status === "scheduled" && !finalPublishAt) {
    return {
      success: false,
      error: "Please choose a publish date and time to schedule this post.",
    };
  }

  if (input.status === "published" && !finalPublishAt) {
    finalPublishAt = existingPost?.publish_at ?? new Date().toISOString();
  }

  // 6. Enforce single featured post rule: unset featured on any other post first
  if (input.featured) {
    let unsetQuery = supabase
      .from("posts")
      .update({ featured: false })
      .eq("featured", true);
    if (existingPost?.id) {
      unsetQuery = unsetQuery.neq("id", existingPost.id);
    }
    await unsetQuery;
  }

  const nowIso = new Date().toISOString();
  const payload = {
    title: input.title,
    slug: finalSlug,
    summary: input.summary ?? "",
    category: input.category as PostCategory,
    author: input.author as PostAuthor,
    cover_image_url: input.cover_image_url || null,
    cover_image_alt: input.cover_image_alt ?? "",
    body: sanitizedBody,
    status: input.status as PostStatus,
    publish_at: finalPublishAt,
    featured: Boolean(input.featured),
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    updated_at: nowIso,
    updated_by: auth.admin.name,
  };

  let savedRecord: PostRecord | null = null;

  if (existingPost) {
    const { data, error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", existingPost.id)
      .select("*")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to update post.",
      };
    }
    savedRecord = data as PostRecord;
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: error?.message ?? "Failed to create post.",
      };
    }
    savedRecord = data as PostRecord;
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${savedRecord.id}`);
  revalidatePath(`/admin/blog/${savedRecord.id}/preview`);
  revalidatePath("/insights");
  revalidatePath(`/insights/${savedRecord.slug}`);

  return {
    success: true,
    post: savedRecord,
  };
}

export async function deletePostAction(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { success: false, error: "Supabase service client not configured." };
  }

  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", postId)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  if (existing?.slug) {
    revalidatePath(`/insights/${existing.slug}`);
  }

  return { success: true };
}
