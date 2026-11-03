"use client";

import React, { useActionState } from "react";
import {
  loginWithPasswordAction,
  type AuthActionState,
} from "@/app/admin/actions";

const initialState: AuthActionState = {};

export default function LoginForm({
  supabaseConfigured,
}: {
  supabaseConfigured: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    loginWithPasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {!supabaseConfigured && (
        <div className="rounded-lg border border-[#e89b3c]/35 bg-[#e89b3c]/10 p-3.5 text-xs leading-relaxed text-[#f4f0ea]">
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c]">
            Setup Required (.env.local)
          </p>
          <p className="mt-1 text-[#a09c94]">
            Add{" "}
            <code className="text-[#f4f0ea]">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="text-[#f4f0ea]">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
            , <code className="text-[#f4f0ea]">SUPABASE_SERVICE_ROLE_KEY</code>,
            and <code className="text-[#f4f0ea]">ADMIN_EMAILS</code> in{" "}
            <code className="text-[#f4f0ea]">.env.local</code> to activate
            Supabase Auth + TOTP 2FA.
          </p>
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-200"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="admin-email"
          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#a09c94]"
        >
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="ashish@hellosteward.agency"
          className="mt-1.5 w-full rounded-lg border border-white/[0.09] bg-[#09090c] px-3.5 py-2.5 text-sm text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#a09c94]"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          placeholder="••••••••••••"
          className="mt-1.5 w-full rounded-lg border border-white/[0.09] bg-[#09090c] px-3.5 py-2.5 text-sm text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full cursor-pointer rounded-full bg-[#e89b3c] py-2.5 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#08080a] transition-colors hover:bg-[#f2aa4c] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Verifying..." : "Continue to 2FA →"}
      </button>

      <p className="pt-2 text-center font-mono-label text-[10px] tracking-[0.06em] text-[#66635c]">
        Restricted to allowlisted founders (Ashish &amp; Ruchi). TOTP required.
      </p>
    </form>
  );
}
