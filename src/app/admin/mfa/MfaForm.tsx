"use client";

import React, { useActionState } from "react";
import {
  verifyTotpAction,
  signOutAdminAction,
  type AuthActionState,
} from "@/app/admin/actions";

const initialState: AuthActionState = {};

interface MfaFormProps {
  mode: "enroll" | "verify";
  factorId: string;
  qrCodeDataUri?: string | null;
  secretKey?: string | null;
  adminEmail: string;
}

export default function MfaForm({
  mode,
  factorId,
  qrCodeDataUri,
  secretKey,
  adminEmail,
}: MfaFormProps) {
  const [state, formAction, isPending] = useActionState(
    verifyTotpAction,
    initialState
  );

  return (
    <div className="mt-5">
      {mode === "enroll" && qrCodeDataUri && (
        <div className="mb-5 space-y-3 rounded-xl border border-white/10 bg-[#09090c] p-4">
          <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e89b3c]">
            Step 1: Scan QR in Authenticator App
          </p>
          <p className="text-xs leading-relaxed text-[#a09c94]">
            Open 1Password, Google Authenticator, or Authy and scan this QR
            code. You will need it at every sign-in.
          </p>

          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-lg bg-white p-2.5">
            {/* Supabase returns a data:image/svg+xml;utf-8 URI for TOTP enrolment */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeDataUri}
              alt="TOTP Authenticator QR Code"
              className="h-full w-full object-contain"
            />
          </div>

          {secretKey && (
            <div className="pt-1 text-center">
              <span className="block font-mono-label text-[9.5px] uppercase tracking-[0.16em] text-[#66635c]">
                Manual Setup Key
              </span>
              <code className="mt-0.5 inline-block select-all rounded bg-white/[0.06] px-2 py-1 font-mono-label text-[11px] tracking-wider text-[#f4f0ea]">
                {secretKey}
              </code>
            </div>
          )}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="factorId" value={factorId} />

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
            htmlFor="totp-code"
            className="block font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#a09c94]"
          >
            {mode === "enroll"
              ? "Step 2: Enter 6-Digit Code to Confirm"
              : "6-Digit Authenticator Code"}
          </label>
          <input
            id="totp-code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
            required
            disabled={isPending}
            placeholder="000000"
            className="mt-1.5 w-full rounded-lg border border-white/[0.09] bg-[#09090c] px-3.5 py-2.5 text-center font-mono-label text-lg tracking-[0.35em] text-[#f4f0ea] placeholder-[#66635c] focus:border-[#e89b3c] focus:outline-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-full bg-[#e89b3c] py-2.5 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[#08080a] transition-colors hover:bg-[#f2aa4c] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending
            ? "Verifying..."
            : mode === "enroll"
            ? "Activate 2FA & Enter Admin →"
            : "Verify & Enter Admin →"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="truncate font-mono-label text-[10px] text-[#66635c]">
          {adminEmail}
        </span>

        <form action={signOutAdminAction}>
          <input type="hidden" name="scope" value="local" />
          <button
            type="submit"
            className="cursor-pointer font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#a09c94] transition-colors hover:text-[#f4f0ea]"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
