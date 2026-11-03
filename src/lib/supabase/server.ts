import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** 7-day session lifetime in seconds */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Server-side Supabase client bound to Next.js App Router cookies.
 * Uses 7-day httpOnly, secure, sameSite=lax cookies.
 */
export async function createSupabaseServerClient() {
  if (typeof window !== "undefined") {
    throw new Error("createSupabaseServerClient can only be called on the server.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: options?.maxAge ?? SESSION_MAX_AGE_SECONDS,
            })
          );
        } catch {
          // Called from a Server Component where setting cookies is a no-op
          // (handled in Route Handlers / Server Actions / Middleware).
        }
      },
    },
  });
}

/**
 * Server-only Supabase Service Role client.
 * NEVER import or call this from client components.
 */
export function createSupabaseServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: Service role client must never be used in the browser."
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Safe helper that returns the server-only Supabase Service Role client,
 * or null if environment variables are missing.
 */
export function createSupabaseAdminClient() {
  try {
    return createSupabaseServiceClient();
  } catch {
    return null;
  }
}
