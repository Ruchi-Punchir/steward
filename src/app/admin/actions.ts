"use server";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { isEmailAllowlisted } from "@/lib/admin/auth";
import {
  checkRateLimit,
  clearRateLimit,
  logAdminAuditEvent,
  recordFailedAttempt,
} from "@/lib/admin/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const verifyTotpSchema = z.object({
  factorId: z.string().min(1, "Missing authenticator factor ID."),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app."),
});

export interface AuthActionState {
  error?: string;
  lockedSeconds?: number;
}

async function getClientMetadata() {
  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = hdrs.get("user-agent") || "unknown";
  return { ipAddress, userAgent };
}

/**
 * Step 1 of Admin Sign-In: Email + Password (with server-side allowlist, rate limiting & audit logging).
 * No "forgot password" flow exists by design — passwords are managed in the Supabase dashboard.
 */
export async function loginWithPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase environment variables are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and ADMIN_EMAILS to .env.local.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid email or password.",
    };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const { ipAddress, userAgent } = await getClientMetadata();

  // 1. Check IP and Email rate limits before touching Supabase Auth
  const ipLimit = await checkRateLimit(`ip:${ipAddress}`);
  if (!ipLimit.allowed) {
    await logAdminAuditEvent({
      email: normalizedEmail,
      eventType: "login_locked",
      ipAddress,
      userAgent,
      metadata: { reason: "ip_rate_limit", retryAfter: ipLimit.retryAfterSeconds },
    });
    return {
      error: `Too many failed attempts. Try again in ${Math.ceil(
        ipLimit.retryAfterSeconds / 60
      )} min.`,
      lockedSeconds: ipLimit.retryAfterSeconds,
    };
  }

  const emailLimit = await checkRateLimit(`email:${normalizedEmail}`);
  if (!emailLimit.allowed) {
    await logAdminAuditEvent({
      email: normalizedEmail,
      eventType: "login_locked",
      ipAddress,
      userAgent,
      metadata: {
        reason: "email_rate_limit",
        retryAfter: emailLimit.retryAfterSeconds,
      },
    });
    return {
      error: `Too many failed attempts. Try again in ${Math.ceil(
        emailLimit.retryAfterSeconds / 60
      )} min.`,
      lockedSeconds: emailLimit.retryAfterSeconds,
    };
  }

  // 2. Server-side allowlist check: anyone not in ADMIN_EMAILS gets a strict 404
  if (!isEmailAllowlisted(normalizedEmail)) {
    await recordFailedAttempt(`ip:${ipAddress}`);
    await logAdminAuditEvent({
      email: normalizedEmail,
      eventType: "unauthorized_email_blocked",
      ipAddress,
      userAgent,
    });
    notFound();
  }

  // 3. Authenticate with Supabase Auth
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.user) {
    const ipFail = await recordFailedAttempt(`ip:${ipAddress}`);
    const emailFail = await recordFailedAttempt(`email:${normalizedEmail}`);
    const isNowLocked = ipFail.locked || emailFail.locked;

    await logAdminAuditEvent({
      email: normalizedEmail,
      eventType: isNowLocked ? "login_locked" : "login_failed",
      ipAddress,
      userAgent,
      metadata: {
        reason: error?.message ?? "invalid_credentials",
        remainingAttempts: Math.min(
          ipFail.remainingAttempts,
          emailFail.remainingAttempts
        ),
      },
    });

    if (isNowLocked) {
      return {
        error: "Too many failed sign-in attempts. Locked for 15 minutes.",
        lockedSeconds: 900,
      };
    }

    return {
      error: "Invalid email or password.",
    };
  }

  await logAdminAuditEvent({
    email: normalizedEmail,
    eventType: "login_success",
    ipAddress,
    userAgent,
    metadata: { step: "password_verified_awaiting_totp" },
  });

  // Always proceed to TOTP second factor verification / enrolment
  redirect("/admin/mfa");
}

/**
 * Step 2 of Admin Sign-In: Verify 6-digit TOTP code from authenticator app (elevates session to aal2).
 */
export async function verifyTotpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const parsed = verifyTotpSchema.safeParse({
    factorId: formData.get("factorId"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Enter a valid 6-digit TOTP code.",
    };
  }

  const { factorId, code } = parsed.data;
  const { ipAddress, userAgent } = await getClientMetadata();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/admin/login");
  }

  if (!isEmailAllowlisted(user.email)) {
    await supabase.auth.signOut();
    notFound();
  }

  const mfaLimit = await checkRateLimit(`mfa:${user.email.toLowerCase()}`);
  if (!mfaLimit.allowed) {
    return {
      error: `Too many invalid codes. Locked for ${Math.ceil(
        mfaLimit.retryAfterSeconds / 60
      )} min.`,
      lockedSeconds: mfaLimit.retryAfterSeconds,
    };
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });

  if (error) {
    const failStatus = await recordFailedAttempt(
      `mfa:${user.email.toLowerCase()}`
    );
    await logAdminAuditEvent({
      email: user.email,
      eventType: "mfa_failed",
      ipAddress,
      userAgent,
      metadata: {
        reason: error.message,
        remainingAttempts: failStatus.remainingAttempts,
      },
    });

    if (failStatus.locked) {
      await supabase.auth.signOut();
      redirect("/admin/login");
    }

    return {
      error: "Invalid authenticator code. Please check your app and try again.",
    };
  }

  // Clear rate limit counters upon full aal2 verification
  await clearRateLimit(`ip:${ipAddress}`);
  await clearRateLimit(`email:${user.email.toLowerCase()}`);
  await clearRateLimit(`mfa:${user.email.toLowerCase()}`);

  await logAdminAuditEvent({
    email: user.email,
    eventType: "mfa_verified",
    ipAddress,
    userAgent,
  });

  redirect("/admin/leads");
}

/**
 * Sign Out (either current browser or "Sign out everywhere" across all devices).
 */
export async function signOutAdminAction(formData: FormData): Promise<void> {
  const scopeRaw = formData.get("scope");
  const scope: "local" | "global" =
    scopeRaw === "global" ? "global" : "local";

  if (isSupabaseConfigured()) {
    const { ipAddress, userAgent } = await getClientMetadata();
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.auth.signOut({ scope });

    await logAdminAuditEvent({
      email: user?.email ?? null,
      eventType: scope === "global" ? "sign_out_everywhere" : "sign_out",
      ipAddress,
      userAgent,
    });
  }

  redirect("/admin/login");
}
