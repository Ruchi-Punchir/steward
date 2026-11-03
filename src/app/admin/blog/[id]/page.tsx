import React from "react";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import PostEditorForm from "@/components/admin/PostEditorForm";
import type { PostRecord } from "@/lib/blog/types";

export const dynamic = "force-dynamic";

interface AdminEditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPostPage({
  params,
}: AdminEditPostPageProps) {
  const admin = await requireAdminPage();
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
    <AdminShell admin={admin}>
      <PostEditorForm initialPost={post} defaultAuthor={admin.name} />
    </AdminShell>
  );
}
