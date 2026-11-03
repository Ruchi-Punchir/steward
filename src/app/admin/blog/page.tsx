import React from "react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import {
  POST_STATUS_META,
  type PostRecord,
  type PostStatus,
} from "@/lib/blog/types";

export const dynamic = "force-dynamic";

interface AdminBlogListPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminBlogListPage({
  searchParams,
}: AdminBlogListPageProps) {
  const admin = await requireAdminPage();
  const params = await searchParams;
  const statusFilter = (params.status ?? "all").trim();

  const supabase = createSupabaseAdminClient();
  let allPosts: PostRecord[] = [];
  let fetchError: string | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      fetchError = error.message;
    } else if (data) {
      allPosts = data as PostRecord[];
    }
  } else {
    fetchError = "Supabase service client is not configured.";
  }

  const filteredPosts = allPosts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const statusTabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: allPosts.length },
    {
      key: "draft",
      label: "Drafts",
      count: allPosts.filter((p) => p.status === "draft").length,
    },
    {
      key: "scheduled",
      label: "Scheduled",
      count: allPosts.filter((p) => p.status === "scheduled").length,
    },
    {
      key: "published",
      label: "Published",
      count: allPosts.filter((p) => p.status === "published").length,
    },
  ];

  return (
    <AdminShell admin={admin}>
      {/* Top Header + New Post Button */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[#e89b3c]">
            02 / Blog
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f4f0ea]">
            Insights Posts
          </h1>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center rounded-full bg-[#e89b3c] px-5 py-2.5 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c]"
        >
          + New post
        </Link>
      </div>

      {fetchError && (
        <div className="mt-6 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          Database notice: {fetchError}
        </div>
      )}

      {/* Status Filter Strip */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          const href =
            tab.key === "all"
              ? "/admin/blog"
              : `/admin/blog?status=${tab.key}`;

          return (
            <Link
              key={tab.key}
              href={href}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono-label text-[11px] uppercase tracking-[0.14em] transition-colors ${
                isActive
                  ? "border-[#e89b3c] bg-[#e89b3c]/15 text-[#e89b3c]"
                  : "border-white/[0.08] bg-[#101014] text-[#a09c94] hover:border-white/[0.18] hover:text-[#f4f0ea]"
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-[#f4f0ea]">
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Posts Table: title, category, author, status, date */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014]">
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#a09c94]">
              No posts found
            </p>
            <p className="mt-1.5 text-xs text-[#66635c]">
              {allPosts.length === 0
                ? "Create your first post for /insights using the New post button above."
                : "No posts match the selected status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]">
                  <th className="px-4 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Author</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredPosts.map((post) => {
                  const statusMeta =
                    POST_STATUS_META[post.status as PostStatus] ??
                    POST_STATUS_META.draft;
                  const displayDate = post.publish_at ?? post.updated_at;

                  return (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="font-medium text-[#f4f0ea] hover:text-[#e89b3c] hover:underline"
                          >
                            {post.title}
                          </Link>
                          {post.featured && (
                            <span className="inline-flex items-center rounded border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-1.5 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <span className="mt-0.5 block font-mono text-[11px] text-[#66635c]">
                          /insights/{post.slug}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-mono-label text-xs text-[#a09c94]">
                        {post.category}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-[#f4f0ea]">
                        {post.author}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-mono-label text-xs text-[#a09c94]">
                        {new Date(displayDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-mono-label text-xs">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={`/admin/blog/${post.id}/preview`}
                            className="text-[#a09c94] hover:text-[#f4f0ea]"
                          >
                            Preview
                          </Link>
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="text-[#e89b3c] hover:underline"
                          >
                            Edit →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
