"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EMPTY_TIPTAP_DOC,
  POST_AUTHORS,
  POST_CATEGORIES,
  POST_STATUS_META,
  slugifyTitle,
  type PostAuthor,
  type PostCategory,
  type PostRecord,
  type PostStatus,
  type TiptapNode,
} from "@/lib/blog/types";
import {
  deletePostAction,
  savePostAction,
} from "@/app/admin/blog/actions";

interface PostEditorFormProps {
  initialPost?: PostRecord | null;
  defaultAuthor: PostAuthor;
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function PostEditorForm({
  initialPost,
  defaultAuthor,
}: PostEditorFormProps) {
  const router = useRouter();

  const [postId, setPostId] = useState<string | null>(initialPost?.id ?? null);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialPost?.slug)
  );
  const [allowPublishedSlugChange, setAllowPublishedSlugChange] =
    useState(false);

  const [summary, setSummary] = useState(initialPost?.summary ?? "");
  const [category, setCategory] = useState<PostCategory>(
    initialPost?.category ?? "Revenue"
  );
  const [author, setAuthor] = useState<PostAuthor>(
    initialPost?.author ?? defaultAuthor
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialPost?.cover_image_url ?? ""
  );
  const [coverImageAlt, setCoverImageAlt] = useState(
    initialPost?.cover_image_alt ?? ""
  );
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status ?? "draft"
  );
  const [publishAtLocal, setPublishAtLocal] = useState("");

  useEffect(() => {
    if (initialPost?.publish_at) {
      setPublishAtLocal(toDatetimeLocalValue(initialPost.publish_at));
    }
  }, [initialPost?.publish_at]);
  const [featured, setFeatured] = useState<boolean>(
    initialPost?.featured ?? false
  );
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialPost?.seo_description ?? ""
  );

  const [bodyJson, setBodyJson] = useState<TiptapNode>(
    initialPost?.body ?? EMPTY_TIPTAP_DOC
  );

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>(
    initialPost ? "Saved" : "New draft"
  );
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Link popover state
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("");

  // Inline image upload modal state
  const [inlineImageOpen, setInlineImageOpen] = useState(false);
  const [inlineImageFile, setInlineImageFile] = useState<File | null>(null);
  const [inlineImageAlt, setInlineImageAlt] = useState("");
  const [inlineImageUploading, setInlineImageUploading] = useState(false);
  const [inlineImageError, setInlineImageError] = useState<string | null>(null);

  // Cover image upload state
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete confirmation state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const wasOriginallyPublished = initialPost?.status === "published";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-[#e89b3c] underline underline-offset-4",
        },
      }),
      ImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class:
            "my-5 max-h-[420px] w-auto rounded-xl border border-white/[0.1]",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Write clearly for founders and product leaders. Use H2 and H3 for structure...",
      }),
    ],
    content: (initialPost?.body ??
      EMPTY_TIPTAP_DOC) as unknown as Record<string, unknown>,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] px-5 py-4 text-[16px] leading-[1.75] text-[#f4f0ea] focus:outline-none [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#f4f0ea] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#f4f0ea] [&_p]:my-3.5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#e89b3c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:my-4 [&_pre]:rounded-lg [&_pre]:bg-[#070709] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_hr]:my-8 [&_hr]:border-white/[0.12]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      setBodyJson(ed.getJSON() as TiptapNode);
      setIsDirty(true);
    },
  });

  // Warn before closing tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const performSave = useCallback(
    async (opts: {
      targetStatus?: PostStatus;
      isAutosave?: boolean;
      openPreviewAfter?: boolean;
    }) => {
      const effectiveStatus = opts.targetStatus ?? status;
      const isAuto = Boolean(opts.isAutosave);

      if (!title.trim()) {
        if (!isAuto) {
          setFeedback({ type: "err", text: "Please enter a post title." });
        }
        return;
      }

      if (isAuto) {
        setAutosaveStatus("Autosaving draft...");
      } else {
        setIsSaving(true);
        setFeedback(null);
      }

      const publishIso = publishAtLocal
        ? new Date(publishAtLocal).toISOString()
        : null;

      const res = await savePostAction({
        id: postId,
        title,
        slug: slug || slugifyTitle(title),
        summary,
        category,
        author,
        cover_image_url: coverImageUrl,
        cover_image_alt: coverImageAlt,
        body: bodyJson,
        status: effectiveStatus,
        publish_at: publishIso,
        featured,
        seo_title: seoTitle,
        seo_description: seoDescription,
        allowPublishedSlugChange,
        isAutosave: isAuto,
      });

      if (!res.success || !res.post) {
        setIsSaving(false);
        if (isAuto) {
          setAutosaveStatus("Autosave paused");
        } else {
          setFeedback({
            type: "err",
            text: res.error ?? "Could not save post.",
          });
        }
        return;
      }

      const saved = res.post;
      const wasNew = !postId;
      setPostId(saved.id);
      setSlug(saved.slug);
      setStatus(saved.status);
      if (saved.publish_at) {
        setPublishAtLocal(toDatetimeLocalValue(saved.publish_at));
      }
      setIsDirty(false);
      setIsSaving(false);

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setAutosaveStatus(`Saved at ${timeStr}`);

      if (!isAuto) {
        setFeedback({
          type: "ok",
          text:
            saved.status === "published"
              ? "Post published and live on /insights."
              : saved.status === "scheduled"
              ? "Post scheduled."
              : "Draft saved.",
        });
      }

      if (wasNew) {
        router.replace(`/admin/blog/${saved.id}`);
      }

      if (opts.openPreviewAfter) {
        window.open(`/admin/blog/${saved.id}/preview`, "_blank");
      }
    },
    [
      allowPublishedSlugChange,
      author,
      bodyJson,
      category,
      coverImageAlt,
      coverImageUrl,
      featured,
      postId,
      publishAtLocal,
      router,
      seoDescription,
      seoTitle,
      slug,
      status,
      summary,
      title,
    ]
  );

  // Autosave drafts 2.5s after typing stops when status === 'draft'
  useEffect(() => {
    if (!isDirty || status !== "draft" || !title.trim() || isSaving) {
      return;
    }
    const timer = setTimeout(() => {
      performSave({ isAutosave: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    isDirty,
    status,
    title,
    summary,
    category,
    author,
    coverImageUrl,
    coverImageAlt,
    bodyJson,
    featured,
    seoTitle,
    seoDescription,
    isSaving,
    performSave,
  ]);

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle);
    setIsDirty(true);
    if (!slugManuallyEdited && (!wasOriginallyPublished || allowPublishedSlugChange)) {
      setSlug(slugifyTitle(nextTitle));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploadError(null);

    const effectiveAlt = coverImageAlt.trim() || title.trim() || "Cover image";
    if (!coverImageAlt.trim() && title.trim()) {
      setCoverImageAlt(title.trim());
    }

    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("alt", effectiveAlt);

      const res = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as {
        ok: boolean;
        url?: string;
        error?: string;
      };

      if (!res.ok || !json.ok || !json.url) {
        setCoverUploadError(json.error ?? "Failed to upload cover image.");
      } else {
        setCoverImageUrl(json.url);
        setIsDirty(true);
      }
    } catch {
      setCoverUploadError("Network error while uploading cover image.");
    } finally {
      setCoverUploading(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = "";
      }
    }
  };

  const handleInsertInlineImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineImageError(null);

    if (!inlineImageFile) {
      setInlineImageError("Please choose a JPG, PNG, or WebP file (max 5 MB).");
      return;
    }
    if (!inlineImageAlt.trim()) {
      setInlineImageError("Alt text is required for every image.");
      return;
    }

    setInlineImageUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", inlineImageFile);
      fd.set("alt", inlineImageAlt.trim());

      const res = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as {
        ok: boolean;
        url?: string;
        alt?: string;
        error?: string;
      };

      if (!res.ok || !json.ok || !json.url) {
        setInlineImageError(json.error ?? "Failed to upload image.");
        setInlineImageUploading(false);
        return;
      }

      editor
        ?.chain()
        .focus()
        .setImage({
          src: json.url,
          alt: inlineImageAlt.trim(),
          title: inlineImageAlt.trim(),
        })
        .run();

      setInlineImageFile(null);
      setInlineImageAlt("");
      setInlineImageOpen(false);
      setIsDirty(true);
    } catch {
      setInlineImageError("Network error while uploading image.");
    } finally {
      setInlineImageUploading(false);
    }
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    const trimmed = linkUrlInput.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href =
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("mailto:") ||
        trimmed.startsWith("/")
          ? trimmed
          : `https://${trimmed}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run();
    }
    setLinkPromptOpen(false);
    setLinkUrlInput("");
  };

  const handleConfirmDelete = async () => {
    if (!postId) return;
    setIsDeleting(true);
    const res = await deletePostAction(postId);
    if (!res.success) {
      setIsDeleting(false);
      setFeedback({
        type: "err",
        text: res.error ?? "Failed to delete post.",
      });
      return;
    }
    setIsDirty(false);
    router.push("/admin/blog");
    router.refresh();
  };

  const statusMeta = POST_STATUS_META[status];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <Link
            href="/admin/blog"
            className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[#a09c94] transition-colors hover:text-[#e89b3c]"
          >
            ← Back to Blog Posts
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-[#f4f0ea]">
              {postId ? "Edit Post" : "New Post"}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
            >
              {statusMeta.label}
            </span>
            <span className="font-mono-label text-[11px] text-[#66635c]">
              {isDirty ? "● Unsaved changes" : autosaveStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => performSave({ openPreviewAfter: true })}
            className="cursor-pointer rounded-lg border border-white/[0.14] bg-[#101014] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] disabled:opacity-50"
          >
            Preview ↗
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => performSave({ targetStatus: "draft" })}
            className="cursor-pointer rounded-lg border border-white/[0.14] bg-white/[0.04] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:bg-white/[0.08] disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => performSave({ targetStatus: status })}
            className="cursor-pointer rounded-lg bg-[#e89b3c] px-4 py-2 font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : status === "published"
              ? "Publish Now"
              : status === "scheduled"
              ? "Schedule Post"
              : "Save Post"}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs ${
            feedback.type === "ok"
              ? "border-[#10b981]/35 bg-[#10b981]/10 text-[#10b981]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Writing Column (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title, Slug & Summary Card */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-6">
            <div>
              <label
                htmlFor="post-title"
                className="block font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]"
              >
                Post Title *
              </label>
              <input
                id="post-title"
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Why Your Onboarding Leaks 60% of Trial Signups"
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-4 py-3 text-lg font-semibold text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>

            {/* URL Slug with Post-Publish Lock Protection */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="post-slug"
                  className="block font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]"
                >
                  URL Slug (/insights/[slug]) *
                </label>

                {wasOriginallyPublished && (
                  <button
                    type="button"
                    onClick={() =>
                      setAllowPublishedSlugChange((prev) => !prev)
                    }
                    className="cursor-pointer font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#e89b3c] hover:underline"
                  >
                    {allowPublishedSlugChange
                      ? "Lock published slug"
                      : "Unlock to edit published slug"}
                  </button>
                )}
              </div>

              <div className="mt-1.5 flex items-center rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3.5 py-2">
                <span className="select-none font-mono text-xs text-[#66635c]">
                  /insights/
                </span>
                <input
                  id="post-slug"
                  type="text"
                  disabled={
                    wasOriginallyPublished && !allowPublishedSlugChange
                  }
                  value={slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setSlug(slugifyTitle(e.target.value));
                    setIsDirty(true);
                  }}
                  placeholder="why-your-onboarding-leaks"
                  className="w-full bg-transparent font-mono text-xs text-[#f4f0ea] placeholder-[#66635c] focus:outline-none disabled:cursor-not-allowed disabled:text-[#66635c]"
                />
              </div>

              {wasOriginallyPublished && allowPublishedSlugChange && (
                <p className="mt-1.5 rounded border border-amber-500/35 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-200">
                  Warning: This post is already published. Changing its slug will
                  change its live URL and break existing external links.
                </p>
              )}
            </div>

            {/* Summary (max 160 characters) */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="post-summary"
                  className="block font-mono-label text-[10px] uppercase tracking-[0.16em] text-[#66635c]"
                >
                  Summary (card &amp; meta excerpt, max 160 chars)
                </label>
                <span
                  className={`font-mono-label text-[10px] ${
                    summary.length > 160 ? "text-red-400" : "text-[#66635c]"
                  }`}
                >
                  {summary.length}/160
                </span>
              </div>
              <textarea
                id="post-summary"
                rows={2}
                maxLength={160}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="One crisp sentence summarizing the takeaway for founders."
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3.5 py-2.5 text-sm text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor Card */}
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014]">
            {/* Sticky Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.08] bg-[#0d0d11] px-3.5 py-2.5">
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("heading", { level: 2 })
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                H2
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("heading", { level: 3 })
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                H3
              </button>

              <span className="mx-1 h-4 w-px bg-white/[0.08]" />

              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs font-bold transition-colors ${
                  editor?.isActive("bold")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                B
              </button>

              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs italic transition-colors ${
                  editor?.isActive("italic")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                I
              </button>

              <button
                type="button"
                onClick={() => {
                  const existingHref =
                    (editor?.getAttributes("link").href as string) ?? "";
                  setLinkUrlInput(existingHref);
                  setLinkPromptOpen((prev) => !prev);
                  setInlineImageOpen(false);
                }}
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("link") || linkPromptOpen
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                Link
              </button>

              <span className="mx-1 h-4 w-px bg-white/[0.08]" />

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleBulletList().run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("bulletList")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                • List
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("orderedList")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                1. List
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleBlockquote().run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("blockquote")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                “ Quote
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().setHorizontalRule().run()
                }
                className="cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs text-[#a09c94] transition-colors hover:bg-white/[0.06] hover:text-[#f4f0ea]"
              >
                ― Divider
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleCodeBlock().run()
                }
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  editor?.isActive("codeBlock")
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                {"{ }"} Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setInlineImageOpen((prev) => !prev);
                  setLinkPromptOpen(false);
                }}
                className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs transition-colors ${
                  inlineImageOpen
                    ? "bg-[#e89b3c] text-[#0a0a0d]"
                    : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                }`}
              >
                + Image
              </button>
            </div>

            {/* Link Input Bar */}
            {linkPromptOpen && (
              <form
                onSubmit={handleApplyLink}
                className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] bg-[#0a0a0d] px-4 py-2.5"
              >
                <input
                  type="text"
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  placeholder="https://example.com or /contact"
                  className="min-w-[240px] flex-1 rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded bg-[#e89b3c] px-3 py-1.5 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#0a0a0d]"
                >
                  Apply Link
                </button>
                {editor?.isActive("link") && (
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setLinkPromptOpen(false);
                    }}
                    className="cursor-pointer rounded border border-red-500/35 px-2.5 py-1.5 font-mono-label text-[10.5px] uppercase text-red-300"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLinkPromptOpen(false)}
                  className="cursor-pointer px-2 font-mono-label text-[10.5px] uppercase text-[#66635c] hover:text-[#f4f0ea]"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Inline Image Upload Drawer (Enforces required Alt text + JPG/PNG/WebP max 5MB) */}
            {inlineImageOpen && (
              <form
                onSubmit={handleInsertInlineImage}
                className="space-y-3 border-b border-white/[0.08] bg-[#0a0a0d] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
                    Insert Image into Post (JPG, PNG, WebP · Max 5 MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setInlineImageOpen(false)}
                    className="font-mono-label text-[10px] uppercase text-[#66635c] hover:text-[#f4f0ea]"
                  >
                    Close
                  </button>
                </div>

                {inlineImageError && (
                  <p className="text-xs text-red-400">{inlineImageError}</p>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Image File *
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        setInlineImageFile(e.target.files?.[0] ?? null)
                      }
                      className="mt-1 block w-full text-xs text-[#a09c94] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:font-mono-label file:text-[10px] file:uppercase file:text-[#f4f0ea]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Alt Text (Required for accessibility &amp; SEO) *
                    </label>
                    <input
                      type="text"
                      required
                      value={inlineImageAlt}
                      onChange={(e) => setInlineImageAlt(e.target.value)}
                      placeholder="Describe the chart or screenshot..."
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={inlineImageUploading}
                    className="cursor-pointer rounded bg-[#e89b3c] px-4 py-1.5 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] disabled:opacity-50"
                  >
                    {inlineImageUploading
                      ? "Uploading & Inserting..."
                      : "Upload & Insert Image"}
                  </button>
                </div>
              </form>
            )}

            {/* Tiptap Content Surface */}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Right Sidebar (4 cols): Publishing, Category/Author, Cover Image, SEO, Danger Zone */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status & Schedule Control */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-5">
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
              Publishing &amp; Status
            </h3>

            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-white/[0.08] bg-[#0a0a0d] p-1">
              {(["draft", "scheduled", "published"] as PostStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatus(st);
                      setIsDirty(true);
                    }}
                    className={`cursor-pointer rounded-md py-2 font-mono-label text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                      status === st
                        ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                        : "text-[#a09c94] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {st === "scheduled" ? "Schedule" : st === "published" ? "Publish" : "Draft"}
                  </button>
                )
              )}
            </div>

            <div>
              <label
                htmlFor="post-publish-at"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Publish Date &amp; Time{" "}
                {status === "scheduled" ? "(Required)" : "(Optional)"}
              </label>
              <input
                id="post-publish-at"
                type="datetime-local"
                value={publishAtLocal}
                onChange={(e) => {
                  setPublishAtLocal(e.target.value);
                  setIsDirty(true);
                }}
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 border-t border-white/[0.08] pt-3.5">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  setIsDirty(true);
                }}
                className="mt-0.5 h-4 w-4 accent-[#e89b3c]"
              />
              <div>
                <span className="block font-mono-label text-[11px] uppercase tracking-[0.12em] text-[#f4f0ea]">
                  Featured Post
                </span>
                <span className="mt-0.5 block text-[11px] text-[#66635c]">
                  Highlights this post at the top of /insights. Only one post is
                  featured at a time.
                </span>
              </div>
            </label>
          </div>

          {/* Category & Author */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-5">
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
              Category &amp; Author
            </h3>

            <div>
              <label
                htmlFor="post-category"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Category *
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as PostCategory);
                  setIsDirty(true);
                }}
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
              >
                {POST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-author"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Author *
              </label>
              <select
                id="post-author"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value as PostAuthor);
                  setIsDirty(true);
                }}
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
              >
                {POST_AUTHORS.map((authName) => (
                  <option key={authName} value={authName}>
                    {authName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image + Required Alt Text */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-5">
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
              Cover Image
            </h3>

            {coverImageUrl && (
              <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0d]">
                <Image
                  src={coverImageUrl}
                  alt={coverImageAlt || "Cover preview"}
                  width={640}
                  height={360}
                  className="h-36 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImageUrl("");
                    setIsDirty(true);
                  }}
                  className="absolute right-2 top-2 cursor-pointer rounded bg-black/75 px-2 py-1 font-mono-label text-[10px] uppercase text-red-300 hover:bg-black"
                >
                  Remove
                </button>
              </div>
            )}

            <div>
              <label
                htmlFor="cover-alt"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                Cover Image Alt Text (Required) *
              </label>
              <input
                id="cover-alt"
                type="text"
                required
                value={coverImageAlt}
                onChange={(e) => {
                  setCoverImageAlt(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Describe the cover image..."
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]">
                Upload JPG / PNG / WebP (Max 5 MB)
              </label>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={coverUploading}
                onChange={handleCoverUpload}
                className="mt-1.5 block w-full text-xs text-[#a09c94] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:font-mono-label file:text-[10px] file:uppercase file:text-[#f4f0ea]"
              />
              {coverUploading && (
                <p className="mt-1.5 font-mono-label text-[10px] text-[#e89b3c]">
                  Uploading to Supabase Storage...
                </p>
              )}
              {coverUploadError && (
                <p className="mt-1.5 text-xs text-red-400">
                  {coverUploadError}
                </p>
              )}
            </div>
          </div>

          {/* SEO Overrides */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-5">
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
              SEO Overrides (Optional)
            </h3>

            <div>
              <label
                htmlFor="seo-title"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                SEO Title (defaults to Post Title)
              </label>
              <input
                id="seo-title"
                type="text"
                maxLength={120}
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={title || "Custom <title> tag..."}
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="seo-desc"
                className="block font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#66635c]"
              >
                SEO Description (defaults to Summary)
              </label>
              <textarea
                id="seo-desc"
                rows={2}
                maxLength={200}
                value={seoDescription}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={summary || "Custom meta description..."}
                className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0a0a0d] px-3 py-2 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
              />
            </div>
          </div>

          {/* Delete Post with Confirmation */}
          {postId && (
            <div className="rounded-xl border border-red-500/20 bg-[#101014] p-5">
              <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-red-300">
                Delete Post
              </h3>
              <p className="mt-1 text-xs text-[#66635c]">
                Permanently remove this post. No version history is kept.
              </p>

              {!confirmDeleteOpen ? (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="mt-3.5 cursor-pointer rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2 font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-red-300 hover:bg-red-500/20"
                >
                  Delete post...
                </button>
              ) : (
                <div className="mt-3.5 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
                  <p className="text-xs text-red-200">
                    Permanently delete &ldquo;{title || "Untitled"}&rdquo;?
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleConfirmDelete}
                      className="cursor-pointer rounded bg-red-500 px-3 py-1.5 font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setConfirmDeleteOpen(false)}
                      className="cursor-pointer rounded border border-white/[0.15] px-2.5 py-1.5 font-mono-label text-[10px] uppercase text-[#a09c94] hover:text-[#f4f0ea]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
