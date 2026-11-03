import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUCKET_NAME = "blog-images";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    return auth.response;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase service client not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Please select an image file to upload." },
        { status: 400 }
      );
    }

    if (!alt) {
      return NextResponse.json(
        { ok: false, error: "Alt text is required for every image." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TO_EXT[file.type];
    if (!ext) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only JPG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "Image must be 5 MB or smaller.",
        },
        { status: 400 }
      );
    }

    // Ensure the public 'blog-images' bucket exists automatically
    const { data: bucketData, error: bucketErr } =
      await supabase.storage.getBucket(BUCKET_NAME);

    if (bucketErr || !bucketData) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE_BYTES,
        allowedMimeTypes: Object.keys(ALLOWED_MIME_TO_EXT),
      });
    }

    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);

    const uniquePath = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${
      safeBaseName || "image"
    }.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniquePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uniquePath);

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      alt,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Failed to upload blog image.",
      },
      { status: 500 }
    );
  }
}
