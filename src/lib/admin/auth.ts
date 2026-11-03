import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export type AdminName = "Ashish" | "Ruchi";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: AdminName;
  aal: "aal1" | "aal2";
}

/**
 * Parse the comma-separated ADMIN_EMAILS environment variable on the server.
 */
export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check if an email is on the server-side ADMIN_EMAILS allowlist.
 */
export function isEmailAllowlisted(email?: string | null): boolean {
  if (!email) return false;
  const allowlist = getAdminAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

/**
 * Map an allowlisted email to either "Ashish" or "Ruchi".
 */
export function resolveAdminName(email: string): AdminName {
  const normalized = email.trim().toLowerCase();
  const ruchiEmail = process.env.ADMIN_RUCHI_EMAIL?.trim().toLowerCase();
  if (ruchiEmail && normalized === ruchiEmail) {
    return "Ruchi";
  }
  if (normalized.includes("ruchi")) {
    return "Ruchi";
  }
  return "Ashish";
}

/**
 * Guard for all protected /admin pages (Leads, Blog, etc.).
 * - Redirects unauthenticated visitors to /admin/login
 * - Returns a strict 404 (notFound()) for any authenticated account not in ADMIN_EMAILS
 * - Redirects to /admin/mfa if TOTP second factor (aal2) is not yet enrolled or verified
 */
export async function requireAdminPage(): Promise<AuthenticatedAdmin> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    redirect("/admin/login");
  }

  // Strict server-side allowlist check: anyone else gets a 404
  if (!isEmailAllowlisted(user.email)) {
    await supabase.auth.signOut();
    notFound();
  }

  // Enforce Two-Factor Authentication (TOTP, aal2)
  const { data: aalData, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalError || aalData?.currentLevel !== "aal2") {
    redirect("/admin/mfa");
  }

  return {
    id: user.id,
    email: user.email,
    name: resolveAdminName(user.email),
    aal: "aal2",
  };
}

/**
 * Guard for the /admin/mfa page (where aal1 allowlisted users enrol or verify TOTP).
 * - Unauthenticated -> /admin/login
 * - Non-allowlisted email -> 404 (notFound())
 * - Already aal2 -> /admin/leads
 */
export async function requirePendingMfaAdmin(): Promise<{
  id: string;
  email: string;
  name: AdminName;
  currentLevel: "aal1" | "aal2" | null;
  nextLevel: "aal1" | "aal2" | null;
}> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    redirect("/admin/login");
  }

  if (!isEmailAllowlisted(user.email)) {
    await supabase.auth.signOut();
    notFound();
  }

  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalData?.currentLevel === "aal2") {
    redirect("/admin/leads");
  }

  return {
    id: user.id,
    email: user.email,
    name: resolveAdminName(user.email),
    currentLevel: (aalData?.currentLevel as "aal1" | "aal2" | null) ?? null,
    nextLevel: (aalData?.nextLevel as "aal1" | "aal2" | null) ?? null,
  };
}

/**
 * Guard for Admin Route Handlers and Server Actions.
 * Anyone not authenticated, not in ADMIN_EMAILS, or without aal2 gets a 404 response.
 */
export async function requireAdminApi(): Promise<
  | { authorized: true; admin: AuthenticatedAdmin }
  | { authorized: false; response: NextResponse }
> {
  if (!isSupabaseConfigured()) {
    return {
      authorized: false,
      response: new NextResponse("Not Found", { status: 404 }),
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email || !isEmailAllowlisted(user.email)) {
    return {
      authorized: false,
      response: new NextResponse("Not Found", { status: 404 }),
    };
  }

  const { data: aalData, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalError || aalData?.currentLevel !== "aal2") {
    return {
      authorized: false,
      response: new NextResponse("Not Found", { status: 404 }),
    };
  }

  return {
    authorized: true,
    admin: {
      id: user.id,
      email: user.email,
      name: resolveAdminName(user.email),
      aal: "aal2",
    },
  };
}
