import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import PostArticleView from "@/components/blog/PostArticleView";
import type { PostRecord } from "@/lib/blog/types";

export const dynamic = "force-dynamic";

interface AdminPostPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPostPreviewPage({
  params,
}: AdminPostPreviewPageProps) {
  await requireAdminPage();
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const post = data as PostRecord;

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#f4f0ea]">
      {/* Sticky Admin Preview Bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#101014]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#e89b3c]">
              Preview Mode ({post.status})
            </span>
            <span className="hidden font-mono text-xs text-[#66635c] sm:inline">
              /insights/{post.slug}
            </span>
          </div>

          <Link
            href={`/admin/blog/${post.id}`}
            className="rounded-lg border border-white/[0.14] bg-white/[0.04] px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
          >
            ← Back to Editor
          </Link>
        </div>
      </div>

      <PostArticleView post={post} isPreview />
    </div>
  );
}
