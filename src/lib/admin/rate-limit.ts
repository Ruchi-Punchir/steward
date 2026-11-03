import { createSupabaseServiceClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout after 5 failed attempts

interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

// In-memory store (used alongside or as fallback for Supabase `admin_rate_limits` table)
const memoryRateLimits = new Map<string, RateLimitEntry>();

export type AuditEventType =
  | "login_success"
  | "login_failed"
  | "login_locked"
  | "unauthorized_email_blocked"
  | "mfa_enrolled"
  | "mfa_verified"
  | "mfa_failed"
  | "sign_out"
  | "sign_out_everywhere";

/**
 * Check if a key (IP or email) is currently locked out.
 */
export async function checkRateLimit(key: string): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
}> {
  const now = Date.now();
  const normalizedKey = key.toLowerCase().trim();

  // 1. Check in-memory first
  const mem = memoryRateLimits.get(normalizedKey);
  if (mem?.lockedUntil && mem.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((mem.lockedUntil - now) / 1000),
    };
  }

  // 2. Check Supabase `admin_rate_limits` if service role is configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const serviceClient = createSupabaseServiceClient();
      const { data } = await serviceClient
        .from("admin_rate_limits")
        .select("attempts, first_attempt_at, locked_until")
        .eq("key", normalizedKey)
        .maybeSingle();

      if (data?.locked_until) {
        const lockedUntilMs = new Date(data.locked_until).getTime();
        if (lockedUntilMs > now) {
          return {
            allowed: false,
            retryAfterSeconds: Math.ceil((lockedUntilMs - now) / 1000),
          };
        }
      }
    } catch {
      // Fall back to in-memory check if migration hasn't been run yet
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Record a failed login or MFA attempt and apply a 15-minute lockout after 5 failures.
 */
export async function recordFailedAttempt(key: string): Promise<{
  locked: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
}> {
  const now = Date.now();
  const normalizedKey = key.toLowerCase().trim();

  let current = memoryRateLimits.get(normalizedKey);
  if (
    !current ||
    now - current.firstAttemptAt > WINDOW_MS ||
    (current.lockedUntil && current.lockedUntil <= now)
  ) {
    current = {
      attempts: 0,
      firstAttemptAt: now,
      lockedUntil: null,
    };
  }

  current.attempts += 1;
  if (current.attempts >= MAX_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_MS;
  }
  memoryRateLimits.set(normalizedKey, current);

  // Persist to Supabase `admin_rate_limits` if configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const serviceClient = createSupabaseServiceClient();
      await serviceClient.from("admin_rate_limits").upsert({
        key: normalizedKey,
        attempts: current.attempts,
        first_attempt_at: new Date(current.firstAttemptAt).toISOString(),
        locked_until: current.lockedUntil
          ? new Date(current.lockedUntil).toISOString()
          : null,
      });
    } catch {
      // Ignore if table not created yet
    }
  }

  const isLocked = Boolean(current.lockedUntil && current.lockedUntil > now);
  return {
    locked: isLocked,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - current.attempts),
    retryAfterSeconds: isLocked ? Math.ceil(LOCKOUT_MS / 1000) : 0,
  };
}

/**
 * Clear rate limit counters upon successful sign-in + MFA verification.
 */
export async function clearRateLimit(key: string): Promise<void> {
  const normalizedKey = key.toLowerCase().trim();
  memoryRateLimits.delete(normalizedKey);

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const serviceClient = createSupabaseServiceClient();
      await serviceClient
        .from("admin_rate_limits")
        .delete()
        .eq("key", normalizedKey);
    } catch {
      // Ignore if table not created yet
    }
  }
}

/**
 * Log every sign-in, failed attempt, MFA event, and sign-out to both
 * structured server logs and `public.admin_audit_logs`.
 */
export async function logAdminAuditEvent(params: {
  email?: string | null;
  eventType: AuditEventType;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    email: params.email ?? "unknown",
    eventType: params.eventType,
    ipAddress: params.ipAddress ?? "unknown",
    userAgent: params.userAgent ?? "unknown",
    metadata: params.metadata ?? {},
  };

  // Always write structured audit log to server stdout
  console.info("[STEWARD_ADMIN_AUDIT]", JSON.stringify(logEntry));

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const serviceClient = createSupabaseServiceClient();
      await serviceClient.from("admin_audit_logs").insert({
        email: params.email ?? null,
        event_type: params.eventType,
        ip_address: params.ipAddress ?? null,
        user_agent: params.userAgent ?? null,
        metadata: params.metadata ?? {},
      });
    } catch {
      // Never block auth flow if audit table hasn't been migrated yet
    }
  }
}
