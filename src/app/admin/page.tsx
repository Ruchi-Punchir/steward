import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";

export default async function AdminIndexPage() {
  await requireAdminPage();
  redirect("/admin/leads");
}
