"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Selection } from "@tiptap/extensions";
import type { Editor } from "@tiptap/core";
import {
  CalloutExtension,
  HighlightExtension,
  RichImageExtension,
  SubscriptExtension,
  SuperscriptExtension,
  TableCellExtension,
  TableExtension,
  TableHeaderExtension,
  TableRowExtension,
  TextAlignExtension,
} from "@/components/admin/BlogEditorExtensions";
import PostBodyRenderer from "@/components/blog/PostBodyRenderer";
import {
  calculateReadTimeMinutes,
  extractPlainTextFromBody,
  normalizeSafeUrl,
} from "@/lib/blog/sanitize";
import {
  EMPTY_TIPTAP_DOC,
  POST_AUTHORS,
  POST_CATEGORIES,
  POST_STATUS_META,
  slugifyTitle,
  type CalloutTone,
  type ImageAlignOption,
  type ImageWidthOption,
  type PostAuthor,
  type PostCategory,
  type PostRecord,
  type PostStatus,
  type TiptapNode,
} from "@/lib/blog/types";
import {
  deletePostAction,
  type SavePostResult,
} from "@/app/admin/blog/actions";

interface PostEditorFormProps {
  initialPost?: PostRecord | null;
  defaultAuthor: PostAuthor;
}

type EditorViewMode = "write" | "split" | "preview";

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function countDocNodesAndMarks(doc: TiptapNode): {
  images: number;
  links: number;
} {
  let images = 0;
  let links = 0;

  function walk(node: TiptapNode) {
    if (node.type === "image") {
      images += 1;
    }
    if (Array.isArray(node.marks)) {
      for (const m of node.marks) {
        if (m.type === "link") {
          links += 1;
        }
      }
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child);
      }
    }
  }

  walk(doc);
  return { images, links };
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
  const [, setEditorTick] = useState(0);

  // Editor view modes
  const [viewMode, setViewMode] = useState<EditorViewMode>("write");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>(
    initialPost ? "Saved" : "New draft"
  );
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
    liveUrl?: string;
    previewUrl?: string;
  } | null>(null);

  // Link popover state + preserved editor selection
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkTextInput, setLinkTextInput] = useState("");
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);

  // Inline image upload / URL modal state
  const [inlineImageOpen, setInlineImageOpen] = useState(false);
  const [inlineImageTab, setInlineImageTab] = useState<"upload" | "url">(
    "upload"
  );
  const [inlineImageFile, setInlineImageFile] = useState<File | null>(null);
  const [inlineImagePreviewUrl, setInlineImagePreviewUrl] = useState<
    string | null
  >(null);
  const [inlineImageDirectUrl, setInlineImageDirectUrl] = useState("");
  const [inlineImageAlt, setInlineImageAlt] = useState("");
  const [inlineImageCaption, setInlineImageCaption] = useState("");
  const [inlineImageWidth, setInlineImageWidth] =
    useState<ImageWidthOption>("full");
  const [inlineImageAlign, setInlineImageAlign] =
    useState<ImageAlignOption>("center");
  const [inlineImageUploading, setInlineImageUploading] = useState(false);
  const [inlineImageError, setInlineImageError] = useState<string | null>(null);
  const [pasteUploadingCount, setPasteUploadingCount] = useState(0);

  // Cover image upload state
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete confirmation state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const wasOriginallyPublished = initialPost?.status === "published";
  const editorRef = useRef<Editor | null>(null);

  // Manage local object URL preview for selected inline image file
  useEffect(() => {
    if (!inlineImageFile) {
      setInlineImagePreviewUrl(null);
      return;
    }
    const objUrl = URL.createObjectURL(inlineImageFile);
    setInlineImagePreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [inlineImageFile]);

  // Helper to upload an image File (from paste, drop, or file picker) to /api/admin/blog/upload
  const uploadImageFileToServer = useCallback(
    async (
      file: File,
      altText?: string
    ): Promise<{ ok: boolean; url?: string; alt?: string; error?: string }> => {
      const fallbackAlt =
        altText?.trim() ||
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim() ||
        title.trim() ||
        "Article image";

      const fd = new FormData();
      fd.set("file", file);
      fd.set("alt", fallbackAlt);

      try {
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
          return {
            ok: false,
            error: json.error ?? "Failed to upload image.",
          };
        }
        return { ok: true, url: json.url, alt: fallbackAlt };
      } catch {
        return {
          ok: false,
          error: "Network error while uploading image.",
        };
      }
    },
    [title]
  );

  // Convert any data:image/... or blob:... image nodes inside a Tiptap JSON tree into uploaded Supabase Storage URLs
  const uploadEmbeddedDataOrBlobImages = useCallback(
    async (
      doc: TiptapNode
    ): Promise<{ node: TiptapNode; replacedCount: number }> => {
      let replacedCount = 0;

      async function walk(n: TiptapNode): Promise<TiptapNode> {
        if (n.type === "image" && n.attrs && typeof n.attrs.src === "string") {
          const src = n.attrs.src.trim();
          if (src.startsWith("data:image/") || src.startsWith("blob:")) {
            try {
              const resp = await fetch(src);
              const blob = await resp.blob();
              const mime = blob.type || "image/png";
              const ext = mime.includes("webp")
                ? "webp"
                : mime.includes("jpeg") || mime.includes("jpg")
                ? "jpg"
                : mime.includes("gif")
                ? "gif"
                : "png";
              const altStr =
                typeof n.attrs.alt === "string" && n.attrs.alt.trim()
                  ? n.attrs.alt.trim()
                  : "Article image";
              const file = new File([blob], `inline-image.${ext}`, {
                type: mime,
              });
              const uploaded = await uploadImageFileToServer(file, altStr);
              if (uploaded.ok && uploaded.url) {
                replacedCount += 1;
                return {
                  ...n,
                  attrs: {
                    ...n.attrs,
                    src: uploaded.url,
                    alt: altStr,
                  },
                };
              }
            } catch {
              // Keep existing node if conversion fails
            }
          }
        }

        if (Array.isArray(n.content)) {
          const nextChildren: TiptapNode[] = [];
          for (const child of n.content) {
            nextChildren.push(await walk(child));
          }
          return {
            ...n,
            content: nextChildren,
          };
        }

        return n;
      }

      const nextDoc = await walk(doc);
      return { node: nextDoc, replacedCount };
    },
    [uploadImageFileToServer]
  );

  // Handle pasted or dropped image files directly inside the editor canvas
  const handleFilesPasteOrDrop = useCallback(
    async (files: File[], insertPos?: number) => {
      const imageFiles = files.filter((f) =>
        /^image\/(jpeg|jpg|png|webp|gif)$/i.test(f.type)
      );
      if (imageFiles.length === 0) return false;

      setPasteUploadingCount((c) => c + imageFiles.length);
      for (const file of imageFiles) {
        const uploaded = await uploadImageFileToServer(file);
        const ed = editorRef.current;
        if (ed) {
          if (uploaded.ok && uploaded.url) {
            const imageNode = {
              type: "image",
              attrs: {
                src: uploaded.url,
                alt: uploaded.alt ?? "Article image",
                title: uploaded.alt ?? "Article image",
                caption: "",
                width: "full",
                align: "center",
              },
            };
            if (typeof insertPos === "number") {
              ed.chain().focus().insertContentAt(insertPos, imageNode).run();
            } else {
              ed.chain().focus().insertContent(imageNode).run();
            }
            setBodyJson(ed.getJSON() as TiptapNode);
            setIsDirty(true);
          } else {
            // Fallback to local data URL so the user's pasted image still appears immediately
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl =
                typeof reader.result === "string" ? reader.result : "";
              if (dataUrl && editorRef.current) {
                editorRef.current
                  .chain()
                  .focus()
                  .insertContent({
                    type: "image",
                    attrs: {
                      src: dataUrl,
                      alt: file.name || "Article image",
                      caption: "",
                      width: "full",
                      align: "center",
                    },
                  })
                  .run();
                setBodyJson(editorRef.current.getJSON() as TiptapNode);
                setIsDirty(true);
              }
            };
            reader.readAsDataURL(file);
          }
        }
        setPasteUploadingCount((c) => Math.max(0, c - 1));
      }
      return true;
    },
    [uploadImageFileToServer]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // Disable StarterKit's built-in link so our configured LinkExtension does not collide
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        link: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class:
            "text-[#e89b3c] underline decoration-[#e89b3c]/70 underline-offset-4 cursor-pointer",
        },
      }),
      RichImageExtension,
      CalloutExtension,
      TextAlignExtension,
      HighlightExtension,
      SubscriptExtension,
      SuperscriptExtension,
      TableExtension,
      TableRowExtension,
      TableHeaderExtension,
      TableCellExtension,
      Selection.configure({
        className: "bg-[#e89b3c]/25 rounded-xs",
      }),
      Placeholder.configure({
        placeholder:
          "Write your essay... Paste or drag-and-drop images directly, highlight text for quick formatting, or use the toolbar above.",
      }),
    ],
    content: (initialPost?.body ??
      EMPTY_TIPTAP_DOC) as unknown as Record<string, unknown>,
    editorProps: {
      attributes: {
        // Headings inherit text-[#f4f0ea] from the root container so light mode adaptation works automatically!
        class:
          "min-h-[520px] px-6 py-5 text-[16.5px] leading-[1.8] text-[#f4f0ea] focus:outline-none [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:mt-9 [&_h2]:mb-3.5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-7 [&_h3]:mb-2.5 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-2 [&_blockquote]:border-[#e89b3c] [&_blockquote]:bg-white/[0.03] [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:pl-5 [&_blockquote]:italic [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/[0.1] [&_pre]:bg-[#070709] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_code]:rounded [&_code]:border [&_code]:border-white/[0.1] [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-[#e89b3c] [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-9 [&_hr]:border-white/[0.12]",
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageFiles: File[] = [];
        for (const item of items) {
          if (item.kind === "file" && item.type.startsWith("image/")) {
            const f = item.getAsFile();
            if (f) imageFiles.push(f);
          }
        }
        // If clipboard contains an image file and no plain text, always upload it to Supabase Storage
        // (even if the browser/Docs also wrapped the single copied image in an HTML tag)
        const plainText = event.clipboardData?.getData("text/plain") ?? "";
        if (imageFiles.length > 0 && !plainText.trim()) {
          event.preventDefault();
          void handleFilesPasteOrDrop(imageFiles);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          event.preventDefault();
          const coords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          void handleFilesPasteOrDrop(files, coords?.pos);
          return true;
        }
        return false;
      },
    },
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
    },
    onUpdate: ({ editor: ed }) => {
      editorRef.current = ed;
      setBodyJson(ed.getJSON() as TiptapNode);
      setIsDirty(true);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      editorRef.current = ed;
      setEditorTick((t) => t + 1);
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Open Link Prompt helper (saves current selection and pre-fills URL & text)
  const openLinkEditor = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedSelectionRef.current = { from, to };

    const selectedText = editor.state.doc.textBetween(from, to, " ");
    const existingHref =
      (editor.getAttributes("link").href as string | undefined) ?? "";
    const existingTarget =
      (editor.getAttributes("link").target as string | undefined) ?? "_blank";

    setLinkTextInput(selectedText);
    setLinkUrlInput(existingHref);
    setLinkOpenNewTab(existingTarget !== "_self");
    setLinkError(null);
    setLinkPromptOpen(true);
    setInlineImageOpen(false);
  }, [editor]);

  // Keyboard shortcut Ctrl+K / Cmd+K for adding/editing a link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (editor?.isFocused) {
          e.preventDefault();
          openLinkEditor();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, openLinkEditor]);

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

  // Live document statistics (words, chars, reading time, images, links)
  const docStats = useMemo(() => {
    const plain = extractPlainTextFromBody(bodyJson);
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const chars = plain.length;
    const readTime = calculateReadTimeMinutes(bodyJson);
    const { images, links } = countDocNodesAndMarks(bodyJson);
    return { words, chars, readTime, images, links };
  }, [bodyJson]);

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

      // Open the preview window synchronously on user click so popup blockers never block it
      let previewWin: Window | null = null;
      if (opts.openPreviewAfter && typeof window !== "undefined") {
        previewWin = window.open("about:blank", "_blank");
        if (previewWin) {
          previewWin.document.write(
            `<!doctype html><html><head><title>Saving & Loading Preview...</title></head><body style="background:#0a0a0d;color:#f4f0ea;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">Saving latest changes &amp; loading preview...</body></html>`
          );
        }
      }

      if (isAuto) {
        setAutosaveStatus("Autosaving...");
      } else {
        setIsSaving(true);
        setFeedback(null);
      }

      try {
        const publishIso = publishAtLocal
          ? new Date(publishAtLocal).toISOString()
          : null;

        // 1. Read the live document directly from the Tiptap editor instance
        let latestBody: TiptapNode = editorRef.current
          ? (editorRef.current.getJSON() as TiptapNode)
          : bodyJson;

        // 2. Auto-upload any inline data:image/... or blob:... images to Supabase Storage before saving
        const { node: uploadedBody, replacedCount } =
          await uploadEmbeddedDataOrBlobImages(latestBody);
        if (replacedCount > 0) {
          latestBody = uploadedBody;
          setBodyJson(uploadedBody);
        }

        // 3. Save via dedicated API endpoint (immune to Server Action manifest hash issues & body size limits)
        const httpRes = await fetch("/api/admin/blog/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: postId,
            title,
            slug: slug || slugifyTitle(title),
            summary,
            category,
            author,
            cover_image_url: coverImageUrl,
            cover_image_alt: coverImageAlt,
            body: latestBody,
            status: effectiveStatus,
            publish_at: publishIso,
            featured,
            seo_title: seoTitle,
            seo_description: seoDescription,
            allowPublishedSlugChange,
            isAutosave: isAuto,
          }),
        });

        const res = (await httpRes.json()) as SavePostResult;

        if (!httpRes.ok || !res.success || !res.post) {
          setIsSaving(false);
          if (previewWin && !previewWin.closed) {
            previewWin.close();
          }
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

        const savedCounts = countDocNodesAndMarks(saved.body);
        const timeStr = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setAutosaveStatus(`Saved at ${timeStr}`);

        const previewPath = `/admin/blog/${saved.id}/preview?t=${Date.now()}`;
        const livePath = `/insights/${saved.slug}`;

        if (!isAuto) {
          const detailSuffix = `(${savedCounts.images} ${
            savedCounts.images === 1 ? "image" : "images"
          }, ${savedCounts.links} ${
            savedCounts.links === 1 ? "link" : "links"
          } saved)`;

          setFeedback({
            type: "ok",
            text:
              saved.status === "published"
                ? `Post published and live on /insights ${detailSuffix}.`
                : saved.status === "scheduled"
                ? `Post scheduled ${detailSuffix}.`
                : `Draft saved ${detailSuffix}.`,
            liveUrl: saved.status === "published" ? livePath : undefined,
            previewUrl: previewPath,
          });
        }

        if (wasNew && typeof window !== "undefined") {
          window.history.replaceState(null, "", `/admin/blog/${saved.id}`);
        }

        if (opts.openPreviewAfter) {
          if (previewWin && !previewWin.closed) {
            previewWin.location.href = previewPath;
          } else if (typeof window !== "undefined") {
            window.location.href = previewPath;
          }
        }
      } catch (err) {
        setIsSaving(false);
        if (previewWin && !previewWin.closed) {
          previewWin.close();
        }
        if (isAuto) {
          setAutosaveStatus("Autosave paused");
        } else {
          setFeedback({
            type: "err",
            text:
              err instanceof Error
                ? `Save failed: ${err.message}`
                : "Network error while saving post.",
          });
        }
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
      seoDescription,
      seoTitle,
      slug,
      status,
      summary,
      title,
      uploadEmbeddedDataOrBlobImages,
    ]
  );

  // Autosave 2.5s after typing stops (for both drafts and published edits so changes are never left unsaved)
  useEffect(() => {
    if (!isDirty || !title.trim() || isSaving) {
      return;
    }
    const timer = setTimeout(() => {
      void performSave({ isAutosave: true });
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
    if (
      !slugManuallyEdited &&
      (!wasOriginallyPublished || allowPublishedSlugChange)
    ) {
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
      const uploaded = await uploadImageFileToServer(file, effectiveAlt);
      if (!uploaded.ok || !uploaded.url) {
        setCoverUploadError(uploaded.error ?? "Failed to upload cover image.");
      } else {
        setCoverImageUrl(uploaded.url);
        setIsDirty(true);
      }
    } finally {
      setCoverUploading(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = "";
      }
    }
  };

  const handleInsertInlineImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setInlineImageError(null);

    const effectiveAlt =
      inlineImageAlt.trim() ||
      inlineImageCaption.trim() ||
      title.trim() ||
      "Article image";

    let finalImageUrl = "";

    if (inlineImageTab === "upload") {
      if (!inlineImageFile) {
        setInlineImageError(
          "Please choose a JPG, PNG, WebP, or GIF file (max 5 MB)."
        );
        return;
      }

      setInlineImageUploading(true);
      const uploaded = await uploadImageFileToServer(
        inlineImageFile,
        effectiveAlt
      );
      setInlineImageUploading(false);

      if (!uploaded.ok || !uploaded.url) {
        setInlineImageError(uploaded.error ?? "Failed to upload image.");
        return;
      }
      finalImageUrl = uploaded.url;
    } else {
      const normalized = normalizeSafeUrl(inlineImageDirectUrl, false);
      if (!normalized) {
        setInlineImageError(
          "Please enter a valid image URL starting with https:// or /."
        );
        return;
      }
      finalImageUrl = normalized;
    }

    const imageNode = {
      type: "image",
      attrs: {
        src: finalImageUrl,
        alt: effectiveAlt,
        title: effectiveAlt,
        caption: inlineImageCaption.trim(),
        width: inlineImageWidth,
        align: inlineImageAlign,
      },
    };

    const savedSel = savedSelectionRef.current;
    if (savedSel) {
      editor
        .chain()
        .focus()
        .insertContentAt(savedSel.to, imageNode)
        .run();
    } else {
      editor.chain().focus().insertContent(imageNode).run();
    }

    setBodyJson(editor.getJSON() as TiptapNode);
    setIsDirty(true);

    setInlineImageFile(null);
    setInlineImageDirectUrl("");
    setInlineImageAlt("");
    setInlineImageCaption("");
    setInlineImageWidth("full");
    setInlineImageAlign("center");
    setInlineImageOpen(false);
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setLinkError(null);

    const trimmedUrl = linkUrlInput.trim();
    const trimmedText = linkTextInput.trim();
    const savedSel = savedSelectionRef.current ?? {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };

    if (!trimmedUrl) {
      editor
        .chain()
        .focus()
        .setTextSelection(savedSel)
        .extendMarkRange("link")
        .unsetLink()
        .run();
      setBodyJson(editor.getJSON() as TiptapNode);
      setIsDirty(true);
      setLinkPromptOpen(false);
      setLinkUrlInput("");
      setLinkTextInput("");
      return;
    }

    const normalizedHref = normalizeSafeUrl(trimmedUrl, true);
    if (!normalizedHref) {
      setLinkError(
        "Please enter a valid URL (e.g. https://hellosteward.agency/speed-audit or /contact)."
      );
      return;
    }

    const targetAttr = linkOpenNewTab ? "_blank" : "_self";
    const relAttr = linkOpenNewTab ? "noopener noreferrer nofollow" : undefined;

    const hasRangeSelection = savedSel.from !== savedSel.to;
    const originalSelectedText = editor.state.doc.textBetween(
      savedSel.from,
      savedSel.to,
      " "
    );

    if (hasRangeSelection) {
      if (trimmedText && trimmedText !== originalSelectedText) {
        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: savedSel.from, to: savedSel.to },
            {
              type: "text",
              text: trimmedText,
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: normalizedHref,
                    target: targetAttr,
                    rel: relAttr,
                  },
                },
              ],
            }
          )
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setTextSelection(savedSel)
          .setLink({
            href: normalizedHref,
            target: targetAttr,
            rel: relAttr,
          })
          .run();
      }
    } else if (editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .setTextSelection(savedSel.from)
        .extendMarkRange("link")
        .setLink({
          href: normalizedHref,
          target: targetAttr,
          rel: relAttr,
        })
        .run();
    } else {
      const labelToInsert = trimmedText || trimmedUrl;
      editor
        .chain()
        .focus()
        .insertContentAt(savedSel.from, {
          type: "text",
          text: labelToInsert,
          marks: [
            {
              type: "link",
              attrs: {
                href: normalizedHref,
                target: targetAttr,
                rel: relAttr,
              },
            },
          ],
        })
        .run();
    }

    setBodyJson(editor.getJSON() as TiptapNode);
    setIsDirty(true);
    setLinkPromptOpen(false);
    setLinkUrlInput("");
    setLinkTextInput("");
  };

  const handleInsertCallout = (tone: CalloutTone = "tip") => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "callout",
        attrs: {
          tone,
          title:
            tone === "tip"
              ? "Key Takeaway"
              : tone === "warning"
              ? "Watch Out"
              : "Note",
        },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Write your key takeaway or note here...",
              },
            ],
          },
        ],
      })
      .run();
    setBodyJson(editor.getJSON() as TiptapNode);
    setIsDirty(true);
  };

  const handleInsertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Metric" }],
                  },
                ],
              },
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Before" }],
                  },
                ],
              },
              {
                type: "tableHeader",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "After" }],
                  },
                ],
              },
            ],
          },
          {
            type: "tableRow",
            content: [
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Performance Score" }],
                  },
                ],
              },
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "64" }],
                  },
                ],
              },
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "100" }],
                  },
                ],
              },
            ],
          },
          {
            type: "tableRow",
            content: [
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "First Contentful Paint" }],
                  },
                ],
              },
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "2.8 s" }],
                  },
                ],
              },
              {
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "0.9 s" }],
                  },
                ],
              },
            ],
          },
        ],
      })
      .run();
    setBodyJson(editor.getJSON() as TiptapNode);
    setIsDirty(true);
  };

  const handleSetTextAlign = (align: "left" | "center" | "right") => {
    if (!editor) return;
    if (editor.isActive("heading")) {
      editor
        .chain()
        .focus()
        .updateAttributes("heading", { textAlign: align })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .updateAttributes("paragraph", { textAlign: align })
        .run();
    }
    setBodyJson(editor.getJSON() as TiptapNode);
    setIsDirty(true);
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
  const activeLinkHref =
    (editor?.getAttributes("link").href as string | undefined) ?? "";
  const currentTextAlign =
    (editor?.getAttributes("heading").textAlign as string | undefined) ||
    (editor?.getAttributes("paragraph").textAlign as string | undefined) ||
    "left";

  return (
    <div className="space-y-6">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-0 z-30 -mx-2 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#08080a]/95 px-2 py-4 backdrop-blur-md">
        <div>
          <Link
            href="/admin/blog"
            className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[#a09c94] transition-colors hover:text-[#e89b3c]"
          >
            ← Back to Blog Posts
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-[#f4f0ea] sm:text-2xl">
              {postId ? "Edit Post" : "New Post"}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}
            >
              {statusMeta.label}
            </span>
            <span
              className={`font-mono-label text-[11px] ${
                isDirty ? "text-[#e89b3c]" : "text-[#66635c]"
              }`}
            >
              {isDirty ? "● Unsaved changes" : autosaveStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {postId && status === "published" && slug && (
            <a
              href={`/insights/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#10b981]/35 bg-[#10b981]/10 px-3 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#10b981] transition-colors hover:bg-[#10b981]/20"
            >
              View Live ↗
            </a>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void performSave({ openPreviewAfter: true })}
            className="cursor-pointer rounded-lg border border-white/[0.14] bg-[#101014] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] disabled:opacity-50"
          >
            Full Page Preview ↗
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void performSave({ targetStatus: "draft" })}
            className="cursor-pointer rounded-lg border border-white/[0.14] bg-white/[0.04] px-3.5 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:bg-white/[0.08] disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              void performSave({
                targetStatus:
                  status === "scheduled" ? "scheduled" : "published",
              })
            }
            className="cursor-pointer rounded-lg bg-[#e89b3c] px-4 py-2 font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : status === "published"
              ? "Update & Publish"
              : status === "scheduled"
              ? "Schedule Post"
              : "Publish Now"}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs ${
            feedback.type === "ok"
              ? "border-[#10b981]/35 bg-[#10b981]/10 text-[#10b981]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <div className="flex items-center gap-3 font-mono-label text-[10.5px] uppercase tracking-[0.12em]">
            {feedback.previewUrl && (
              <a
                href={feedback.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
              >
                Open Full Preview ↗
              </a>
            )}
            {feedback.liveUrl && (
              <a
                href={feedback.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-[#10b981] px-2.5 py-1 font-semibold text-[#08080a] hover:opacity-90"
              >
                Visit Live Blog ↗
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Writing Column */}
        <div
          className={`space-y-6 ${
            viewMode === "split" ? "lg:col-span-12" : "lg:col-span-8"
          }`}
        >
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

          {/* Rich Text WYSIWYG Editor Studio Card */}
          <div
            className={`${
              isFullscreen
                ? "fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/[0.14] bg-[#101014] shadow-2xl"
                : "overflow-hidden rounded-xl border border-white/[0.08] bg-[#101014]"
            }`}
          >
            {/* Editor Studio Header Bar: Mode Switcher + Live Metrics + Save/Preview + Fullscreen */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#09090c] px-4 py-2.5">
              <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#101014] p-0.5">
                {(
                  [
                    { key: "write", label: "Write" },
                    { key: "split", label: "Split View" },
                    { key: "preview", label: "Live Preview" },
                  ] as { key: EditorViewMode; label: string }[]
                ).map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setViewMode(m.key)}
                    className={`cursor-pointer rounded-md px-3 py-1 font-mono-label text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                      viewMode === m.key
                        ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                        : "text-[#a09c94] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 font-mono-label text-[10.5px] text-[#a09c94]">
                <span>{docStats.words} words</span>
                <span className="text-[#66635c]">·</span>
                <span>{docStats.readTime} min read</span>
                <span className="text-[#66635c]">·</span>
                <span
                  className={
                    docStats.images > 0 ? "text-[#10b981]" : "text-[#66635c]"
                  }
                >
                  {docStats.images} {docStats.images === 1 ? "image" : "images"}
                </span>
                <span className="text-[#66635c]">·</span>
                <span
                  className={
                    docStats.links > 0 ? "text-[#e89b3c]" : "text-[#66635c]"
                  }
                >
                  {docStats.links} {docStats.links === 1 ? "link" : "links"}
                </span>

                <span className="mx-0.5 h-3.5 w-px bg-white/[0.1]" />

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => void performSave({ openPreviewAfter: true })}
                  className="cursor-pointer rounded border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] disabled:opacity-50"
                >
                  Full Preview ↗
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    void performSave({
                      targetStatus:
                        status === "scheduled" ? "scheduled" : "published",
                    })
                  }
                  className="cursor-pointer rounded bg-[#e89b3c] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : status === "published"
                    ? "Update Live Post"
                    : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen((prev) => !prev)}
                  className="cursor-pointer rounded border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c]"
                  title="Toggle Fullscreen Writing Mode"
                >
                  {isFullscreen ? "Exit ⤡" : "Fullscreen ⤢"}
                </button>
              </div>
            </div>

            {/* Rich WYSIWYG Formatting Toolbar */}
            {viewMode !== "preview" && (
              <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.08] bg-[#0d0d11] px-3.5 py-2">
                {/* Undo / Redo */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  title="Undo (Ctrl+Z)"
                  className="cursor-pointer rounded px-2 py-1.5 font-mono-label text-xs text-[#a09c94] transition-colors hover:bg-white/[0.07] hover:text-[#f4f0ea] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ↶
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  title="Redo (Ctrl+Y)"
                  className="cursor-pointer rounded px-2 py-1.5 font-mono-label text-xs text-[#a09c94] transition-colors hover:bg-white/[0.07] hover:text-[#f4f0ea] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ↷
                </button>

                <span className="mx-1 h-4 w-px bg-white/[0.08]" />

                {/* Block Style: P, H1, H2, H3, H4 */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  title="Normal Paragraph"
                  className={`cursor-pointer rounded px-2 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("paragraph") &&
                    !editor?.isActive("heading")
                      ? "bg-white/[0.12] text-[#f4f0ea]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  P
                </button>
                {([1, 2, 3, 4] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: lvl }).run()
                    }
                    title={`Heading ${lvl}`}
                    className={`cursor-pointer rounded px-2 py-1 font-mono-label text-[11px] font-semibold transition-colors ${
                      editor?.isActive("heading", { level: lvl })
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                    }`}
                  >
                    H{lvl}
                  </button>
                ))}

                <span className="mx-1 h-4 w-px bg-white/[0.08]" />

                {/* Inline Marks: Bold, Italic, Underline, Strike, Highlight, Inline Code */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  title="Bold (Ctrl+B)"
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  title="Italic (Ctrl+I)"
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  title="Underline (Ctrl+U)"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs underline transition-colors ${
                    editor?.isActive("underline")
                      ? "bg-[#e89b3c] text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  U
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  title="Strikethrough"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-xs line-through transition-colors ${
                    editor?.isActive("strike")
                      ? "bg-[#e89b3c] text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  S
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().toggleMark("highlight").run()
                  }
                  title="Highlight text"
                  className={`cursor-pointer rounded px-2 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("highlight")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  Mark
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  title="Inline Code"
                  className={`cursor-pointer rounded px-2 py-1 font-mono text-[11px] transition-colors ${
                    editor?.isActive("code")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  &lt;/&gt;
                </button>

                <span className="mx-1 h-4 w-px bg-white/[0.08]" />

                {/* Text Alignment */}
                {(
                  [
                    { key: "left", label: "⫷", title: "Align Left" },
                    { key: "center", label: "≡", title: "Align Center" },
                    { key: "right", label: "⫸", title: "Align Right" },
                  ] as const
                ).map((al) => (
                  <button
                    key={al.key}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSetTextAlign(al.key)}
                    title={al.title}
                    className={`cursor-pointer rounded px-2 py-1 font-mono-label text-xs transition-colors ${
                      currentTextAlign === al.key
                        ? "bg-white/[0.14] text-[#e89b3c]"
                        : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {al.label}
                  </button>
                ))}

                <span className="mx-1 h-4 w-px bg-white/[0.08]" />

                {/* Lists & Structural Blocks */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  title="Bullet List"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("bulletList")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  • List
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  title="Numbered List"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("orderedList")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  1. List
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  title="Pull Quote"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("blockquote")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  “ Quote
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleInsertCallout("tip")}
                  title="Insert Key Takeaway / Callout Box"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("callout")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  ✦ Callout
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                  title="Code Block"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] transition-colors ${
                    editor?.isActive("codeBlock")
                      ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                      : "text-[#a09c94] hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                  }`}
                >
                  {"{ }"} Code
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleInsertTable}
                  title="Insert 3x3 Table"
                  className="cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] text-[#a09c94] transition-colors hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                >
                  ⊞ Table
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().setHorizontalRule().run()
                  }
                  title="Horizontal Divider"
                  className="cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] text-[#a09c94] transition-colors hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                >
                  ― Divider
                </button>

                <span className="mx-1 h-4 w-px bg-white/[0.08]" />

                {/* Link & Image Insertion */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (linkPromptOpen) {
                      setLinkPromptOpen(false);
                    } else {
                      openLinkEditor();
                    }
                  }}
                  title="Insert or Edit Link (Ctrl+K)"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] font-semibold transition-colors ${
                    editor?.isActive("link") || linkPromptOpen
                      ? "bg-[#e89b3c] text-[#0a0a0d]"
                      : "border border-white/[0.12] bg-white/[0.03] text-[#f4f0ea] hover:border-[#e89b3c] hover:text-[#e89b3c]"
                  }`}
                >
                  🔗 Link
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (editor) {
                      const { from, to } = editor.state.selection;
                      savedSelectionRef.current = { from, to };
                    }
                    setInlineImageOpen((prev) => !prev);
                    setLinkPromptOpen(false);
                  }}
                  title="Insert Inline Image (Upload or URL)"
                  className={`cursor-pointer rounded px-2.5 py-1 font-mono-label text-[11px] font-semibold transition-colors ${
                    inlineImageOpen
                      ? "bg-[#e89b3c] text-[#0a0a0d]"
                      : "border border-[#e89b3c]/40 bg-[#e89b3c]/15 text-[#e89b3c] hover:bg-[#e89b3c] hover:text-[#0a0a0d]"
                  }`}
                >
                  + Image
                </button>

                {/* Clear Formatting */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor?.chain().focus().unsetAllMarks().clearNodes().run()
                  }
                  title="Clear Formatting"
                  className="ml-auto cursor-pointer rounded px-2 py-1 font-mono-label text-[10px] uppercase text-[#66635c] transition-colors hover:bg-white/[0.06] hover:text-[#f4f0ea]"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Active Link Inspector Strip (Shows when cursor is inside a link and Link editor is closed) */}
            {editor?.isActive("link") && activeLinkHref && !linkPromptOpen && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e89b3c]/30 bg-[#e89b3c]/[0.07] px-4 py-2 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#e89b3c]">
                    Active Link:
                  </span>
                  <a
                    href={activeLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-mono text-xs text-[#f4f0ea] underline decoration-[#e89b3c] underline-offset-4 hover:text-[#e89b3c]"
                  >
                    {activeLinkHref} ↗
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={openLinkEditor}
                    className="cursor-pointer rounded border border-[#e89b3c]/40 bg-[#e89b3c]/15 px-2.5 py-1 font-mono-label text-[10px] uppercase text-[#e89b3c] hover:bg-[#e89b3c] hover:text-[#0a0a0d]"
                  >
                    Edit Link
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().extendMarkRange("link").unsetLink().run();
                      setBodyJson(editor.getJSON() as TiptapNode);
                      setIsDirty(true);
                    }}
                    className="cursor-pointer rounded border border-red-500/35 bg-red-500/10 px-2.5 py-1 font-mono-label text-[10px] uppercase text-red-300 hover:bg-red-500/20"
                  >
                    Unlink
                  </button>
                </div>
              </div>
            )}

            {/* Link Input & Text Drawer */}
            {linkPromptOpen && (
              <form
                onSubmit={handleApplyLink}
                className="space-y-3 border-b border-white/[0.08] bg-[#0a0a0d] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
                    Insert or Edit Hyperlink
                  </span>
                  <button
                    type="button"
                    onClick={() => setLinkPromptOpen(false)}
                    className="cursor-pointer font-mono-label text-[10px] uppercase text-[#66635c] hover:text-[#f4f0ea]"
                  >
                    Close
                  </button>
                </div>

                {linkError && (
                  <p className="text-xs text-red-400">{linkError}</p>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Link Text (Displayed in article)
                    </label>
                    <input
                      type="text"
                      value={linkTextInput}
                      onChange={(e) => setLinkTextInput(e.target.value)}
                      placeholder="e.g. hellosteward.agency/speed-audit"
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Destination URL *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={linkUrlInput}
                      onChange={(e) => setLinkUrlInput(e.target.value)}
                      placeholder="https://hellosteward.agency/speed-audit or /speed-audit"
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#a09c94]">
                    <input
                      type="checkbox"
                      checked={linkOpenNewTab}
                      onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                      className="h-3.5 w-3.5 accent-[#e89b3c]"
                    />
                    <span>Open link in new tab</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {editor?.isActive("link") && (
                      <button
                        type="button"
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .extendMarkRange("link")
                            .unsetLink()
                            .run();
                          setBodyJson(editor.getJSON() as TiptapNode);
                          setIsDirty(true);
                          setLinkPromptOpen(false);
                        }}
                        className="cursor-pointer rounded border border-red-500/35 px-3 py-1.5 font-mono-label text-[10.5px] uppercase text-red-300"
                      >
                        Remove Link
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setLinkPromptOpen(false)}
                      className="cursor-pointer px-2.5 py-1.5 font-mono-label text-[10.5px] uppercase text-[#66635c] hover:text-[#f4f0ea]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer rounded bg-[#e89b3c] px-4 py-1.5 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#0a0a0d] hover:bg-[#f2aa4c]"
                    >
                      Apply Link
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Inline Image Upload & URL Drawer */}
            {inlineImageOpen && (
              <form
                onSubmit={handleInsertInlineImage}
                className="space-y-4 border-b border-white/[0.08] bg-[#0a0a0d] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-label text-[10.5px] uppercase tracking-[0.14em] text-[#e89b3c]">
                      Insert Image into Post
                    </span>
                    <div className="flex rounded-md border border-white/[0.1] bg-[#101014] p-0.5">
                      <button
                        type="button"
                        onClick={() => setInlineImageTab("upload")}
                        className={`cursor-pointer rounded px-2.5 py-0.5 font-mono-label text-[10px] uppercase ${
                          inlineImageTab === "upload"
                            ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                            : "text-[#a09c94] hover:text-[#f4f0ea]"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlineImageTab("url")}
                        className={`cursor-pointer rounded px-2.5 py-0.5 font-mono-label text-[10px] uppercase ${
                          inlineImageTab === "url"
                            ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                            : "text-[#a09c94] hover:text-[#f4f0ea]"
                        }`}
                      >
                        By Image URL
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInlineImageOpen(false)}
                    className="cursor-pointer font-mono-label text-[10px] uppercase text-[#66635c] hover:text-[#f4f0ea]"
                  >
                    Close
                  </button>
                </div>

                {inlineImageError && (
                  <p className="rounded border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {inlineImageError}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {inlineImageTab === "upload" ? (
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                        Image File (JPG, PNG, WebP, GIF · Max 5 MB) *
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setInlineImageFile(f);
                          if (f && !inlineImageAlt.trim()) {
                            const cleanName = f.name
                              .replace(/\.[^/.]+$/, "")
                              .replace(/[-_]+/g, " ")
                              .trim();
                            if (cleanName) setInlineImageAlt(cleanName);
                          }
                        }}
                        className="mt-1 block w-full text-xs text-[#a09c94] file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:font-mono-label file:text-[10px] file:uppercase file:text-[#f4f0ea]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                        Direct Image URL *
                      </label>
                      <input
                        type="text"
                        value={inlineImageDirectUrl}
                        onChange={(e) =>
                          setInlineImageDirectUrl(e.target.value)
                        }
                        placeholder="https://..."
                        className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Alt Text (Accessibility &amp; SEO)
                    </label>
                    <input
                      type="text"
                      value={inlineImageAlt}
                      onChange={(e) => setInlineImageAlt(e.target.value)}
                      placeholder="Describe the chart or screenshot..."
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Visible Caption Below Image (Optional)
                    </label>
                    <input
                      type="text"
                      value={inlineImageCaption}
                      onChange={(e) => setInlineImageCaption(e.target.value)}
                      placeholder="e.g. Mobile Lighthouse lab test via PageSpeed Insights..."
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Display Size
                    </label>
                    <select
                      value={inlineImageWidth}
                      onChange={(e) =>
                        setInlineImageWidth(e.target.value as ImageWidthOption)
                      }
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
                    >
                      <option value="small">Small (340px)</option>
                      <option value="medium">Medium (500px)</option>
                      <option value="wide">Large (600px)</option>
                      <option value="full">Full Width (100%)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#66635c]">
                      Alignment
                    </label>
                    <select
                      value={inlineImageAlign}
                      onChange={(e) =>
                        setInlineImageAlign(e.target.value as ImageAlignOption)
                      }
                      className="mt-1 w-full rounded border border-white/[0.12] bg-[#101014] px-3 py-1.5 text-xs text-[#f4f0ea] focus:border-[#e89b3c] focus:outline-none"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Centered</option>
                      <option value="right">Right Aligned</option>
                    </select>
                  </div>
                </div>

                {/* Live Thumbnail Preview before inserting */}
                {(inlineImagePreviewUrl ||
                  (inlineImageTab === "url" &&
                    inlineImageDirectUrl.trim())) && (
                  <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#101014] p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        inlineImageTab === "upload"
                          ? inlineImagePreviewUrl ?? ""
                          : inlineImageDirectUrl.trim()
                      }
                      alt="Preview"
                      className="h-16 w-auto rounded border border-white/[0.1] object-contain"
                    />
                    <div className="text-xs text-[#a09c94]">
                      <p className="font-medium text-[#f4f0ea]">
                        Ready to insert into post
                      </p>
                      <p className="text-[11px] text-[#66635c]">
                        Tip: You can also resize, realign, or edit the caption
                        anytime by clicking the image in the editor.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono-label text-[10px] text-[#66635c]">
                    Pro tip: You can also paste screenshots (Ctrl+V) or drag
                    &amp; drop images directly into the editor.
                  </span>

                  <button
                    type="submit"
                    disabled={inlineImageUploading}
                    className="cursor-pointer rounded bg-[#e89b3c] px-4 py-1.5 font-mono-label text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] hover:bg-[#f2aa4c] disabled:opacity-50"
                  >
                    {inlineImageUploading
                      ? "Uploading & Inserting..."
                      : "Insert Image"}
                  </button>
                </div>
              </form>
            )}

            {/* Paste/Drop Upload Progress Banner */}
            {pasteUploadingCount > 0 && (
              <div className="flex items-center gap-2 border-b border-[#e89b3c]/30 bg-[#e89b3c]/10 px-4 py-2 font-mono-label text-xs text-[#e89b3c]">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#e89b3c]" />
                Uploading {pasteUploadingCount} pasted/dropped{" "}
                {pasteUploadingCount === 1 ? "image" : "images"} to storage...
              </div>
            )}

            {/* Floating Bubble Menu when text is highlighted */}
            {editor && (
              <BubbleMenu
                editor={editor}
                shouldShow={({ editor: ed, state }) => {
                  const { selection } = state;
                  const { empty } = selection;
                  if (empty) return false;
                  if (ed.isActive("image") || ed.isActive("codeBlock")) {
                    return false;
                  }
                  return true;
                }}
              >
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.16] bg-[#0a0a0d]/95 px-2 py-1.5 shadow-2xl backdrop-blur-md">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-xs font-bold ${
                      editor.isActive("bold")
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-xs italic ${
                      editor.isActive("italic")
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-xs underline ${
                      editor.isActive("underline")
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      editor.chain().focus().toggleMark("highlight").run()
                    }
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-[11px] ${
                      editor.isActive("highlight")
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    Mark
                  </button>
                  <span className="mx-0.5 h-3.5 w-px bg-white/[0.14]" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-[11px] font-semibold ${
                      editor.isActive("heading", { level: 2 })
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`cursor-pointer rounded px-2 py-0.5 font-mono-label text-[11px] font-semibold ${
                      editor.isActive("heading", { level: 3 })
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#f4f0ea] hover:bg-white/[0.1]"
                    }`}
                  >
                    H3
                  </button>
                  <span className="mx-0.5 h-3.5 w-px bg-white/[0.14]" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={openLinkEditor}
                    className={`cursor-pointer rounded px-2.5 py-0.5 font-mono-label text-[11px] font-semibold ${
                      editor.isActive("link")
                        ? "bg-[#e89b3c] text-[#0a0a0d]"
                        : "text-[#e89b3c] hover:bg-white/[0.1]"
                    }`}
                  >
                    🔗 {editor.isActive("link") ? "Edit Link" : "Link"}
                  </button>
                </div>
              </BubbleMenu>
            )}

            {/* Editor & Live Preview Canvas Area */}
            <div
              className={`${
                isFullscreen ? "flex-1 overflow-y-auto" : ""
              } ${
                viewMode === "split"
                  ? "grid grid-cols-1 divide-y divide-white/[0.08] lg:grid-cols-2 lg:divide-x lg:divide-y-0"
                  : ""
              }`}
            >
              {/* Tiptap Writing Surface */}
              <div className={viewMode === "preview" ? "hidden" : "block"}>
                <EditorContent editor={editor} />
              </div>

              {/* In-Editor Live Article Preview */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div className="min-h-[520px] bg-[#08080a] px-6 py-6">
                  <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#e89b3c]">
                      Live Article Render Preview
                    </span>
                    <span className="font-mono-label text-[10px] text-[#66635c]">
                      Exact /insights/{slug || "post-slug"} styling
                    </span>
                  </div>
                  <div className="mx-auto max-w-[680px]">
                    {title && (
                      <h1 className="mb-4 text-2xl font-bold leading-tight text-[#f4f0ea] sm:text-3xl">
                        {title}
                      </h1>
                    )}
                    <PostBodyRenderer body={bodyJson} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Publishing, Category/Author, Cover Image, SEO, Danger Zone) */}
        <div
          className={`space-y-6 ${
            viewMode === "split" ? "lg:col-span-12" : "lg:col-span-4"
          }`}
        >
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
                      // Immediately save when toggling status so clicking Publish in this card persists right away
                      if (title.trim() && (st === "published" || st === "draft")) {
                        void performSave({ targetStatus: st });
                      }
                    }}
                    className={`cursor-pointer rounded-md py-2 font-mono-label text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                      status === st
                        ? "bg-[#e89b3c] font-semibold text-[#0a0a0d]"
                        : "text-[#a09c94] hover:text-[#f4f0ea]"
                    }`}
                  >
                    {st === "scheduled"
                      ? "Schedule"
                      : st === "published"
                      ? "Publish"
                      : "Draft"}
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

            <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-3.5">
              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  void performSave({
                    targetStatus:
                      status === "scheduled" ? "scheduled" : "published",
                  })
                }
                className="w-full cursor-pointer rounded-lg bg-[#e89b3c] px-4 py-2.5 font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0d] transition-colors hover:bg-[#f2aa4c] disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : status === "published"
                  ? "Save & Update Live Post"
                  : status === "scheduled"
                  ? "Save & Schedule Post"
                  : "Save & Publish Now"}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void performSave({ openPreviewAfter: true })}
                className="w-full cursor-pointer rounded-lg border border-white/[0.14] bg-[#0a0a0d] px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#f4f0ea] transition-colors hover:border-[#e89b3c] hover:text-[#e89b3c] disabled:opacity-50"
              >
                Save &amp; Open Full Page Preview ↗
              </button>
            </div>
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

          {/* Cover Image + Alt Text */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#101014] p-5">
            <h3 className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#f4f0ea]">
              Cover Image
            </h3>

            {coverImageUrl && (
              <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0d]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt={coverImageAlt || "Cover preview"}
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
                Cover Image Alt Text {coverImageUrl ? "*" : "(Optional)"}
              </label>
              <input
                id="cover-alt"
                type="text"
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
