import React from "react";
import { requireAdminPage } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";
import PostEditorForm from "@/components/admin/PostEditorForm";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  const admin = await requireAdminPage();

  return (
    <AdminShell admin={admin}>
      <PostEditorForm defaultAuthor={admin.name} />
    </AdminShell>
  );
}
