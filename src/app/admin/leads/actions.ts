"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { requireAdminApi } from "@/lib/admin/auth";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export type LeadStatus =
  | "new"
  | "replied"
  | "audit_sent"
  | "call_booked"
  | "won"
  | "lost";

export type LeadAssignee = "Ashish" | "Ruchi" | null;

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "replied",
  "audit_sent",
  "call_booked",
  "won",
  "lost",
];

/**
 * Update a lead's status and log a 'status_change' event in public.lead_events.
 */
export async function updateLeadStatusAction(
  leadId: string,
  newStatus: LeadStatus
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  if (!VALID_STATUSES.includes(newStatus)) {
    return { success: false, error: "Invalid status value." };
  }

  const adminClient =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { data: currentLead } = await adminClient
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .maybeSingle();

  const previousStatus = currentLead?.status ?? "new";

  const { error: updateErr } = await adminClient
    .from("leads")
    .update({ status: newStatus })
    .eq("id", leadId);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  if (previousStatus !== newStatus) {
    await adminClient.from("lead_events").insert({
      lead_id: leadId,
      type: "status_change",
      metadata: {
        actor: auth.admin.name,
        from: previousStatus,
        to: newStatus,
      },
    });
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

/**
 * Assign a lead to Ashish, Ruchi, or null (unassigned).
 */
export async function updateLeadAssigneeAction(
  leadId: string,
  assignedTo: LeadAssignee
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  if (
    assignedTo !== null &&
    assignedTo !== "Ashish" &&
    assignedTo !== "Ruchi"
  ) {
    return { success: false, error: "Invalid assignee." };
  }

  const adminClient =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { error } = await adminClient
    .from("leads")
    .update({ assigned_to: assignedTo })
    .eq("id", leadId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

/**
 * Add an internal note on a lead and record a 'note' event in public.lead_events.
 */
export async function addLeadNoteAction(
  leadId: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  const trimmed = body.trim();
  if (!trimmed) {
    return { success: false, error: "Note body cannot be empty." };
  }
  if (trimmed.length > 2000) {
    return {
      success: false,
      error: "Note cannot exceed 2,000 characters.",
    };
  }

  const adminClient =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { data: noteRow, error: noteErr } = await adminClient
    .from("lead_notes")
    .insert({
      lead_id: leadId,
      author: auth.admin.name,
      body: trimmed,
    })
    .select("id")
    .single();

  if (noteErr) {
    return { success: false, error: noteErr.message };
  }

  await adminClient.from("lead_events").insert({
    lead_id: leadId,
    type: "note",
    metadata: {
      author: auth.admin.name,
      note_id: noteRow?.id ?? null,
      preview: trimmed.slice(0, 120),
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

/**
 * Permanently delete a lead (cascades to lead_notes and lead_events).
 */
export async function deleteLeadAction(
  leadId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdminApi();
  if (!auth.authorized) {
    notFound();
  }

  const adminClient =
    createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  const { error } = await adminClient.from("leads").delete().eq("id", leadId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}
