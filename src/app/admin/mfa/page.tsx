import React from "react";
import { requirePendingMfaAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logAdminAuditEvent } from "@/lib/admin/rate-limit";
import MfaForm from "./MfaForm";

export default async function AdminMfaPage() {
  const pendingAdmin = await requirePendingMfaAdmin();
  const supabase = await createSupabaseServerClient();

  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const verifiedTotp = factorsData?.totp?.find(
    (f) => f.status === "verified"
  );

  // If the user already has a verified TOTP factor, prompt for the 6-digit code
  if (verifiedTotp) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.09] bg-[#101014] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#e89b3c]" />
              <span className="flex flex-col leading-none">
                <span className="font-mono-label text-[8.5px] font-medium uppercase tracking-[0.32em] text-[#e89b3c]">
                  Hello
                </span>
                <span className="mt-0.5 font-mono-label text-xs font-semibold tracking-[0.24em] text-[#f4f0ea]">
                  STEWARD
                </span>
              </span>
            </div>
            <span className="rounded border border-[#10b981]/35 bg-[#10b981]/10 px-2 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[#10b981]">
              2FA Required
            </span>
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-tight text-[#f4f0ea]">
            Two-factor verification
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#a09c94]">
            Hi {pendingAdmin.name}. Enter the 6-digit code from your
            authenticator app.
          </p>

          <MfaForm
            mode="verify"
            factorId={verifiedTotp.id}
            adminEmail={pendingAdmin.email}
          />
        </div>
      </main>
    );
  }

  // First login: Clean up any stale unverified TOTP factors and enrol a fresh TOTP factor
  const unverifiedFactors =
    factorsData?.all?.filter(
      (f) => f.factor_type === "totp" && f.status === "unverified"
    ) ?? [];

  for (const stale of unverifiedFactors) {
    await supabase.auth.mfa.unenroll({ factorId: stale.id });
  }

  const { data: enrollData, error: enrollError } =
    await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "Steward Admin",
      friendlyName: `Steward (${pendingAdmin.name})`,
    });

  if (enrollError || !enrollData) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-[#101014] p-6 text-xs text-red-200">
          Failed to initialize TOTP enrolment: {enrollError?.message}. Ensure
          MFA (TOTP) is enabled in your Supabase Auth settings.
        </div>
      </main>
    );
  }

  await logAdminAuditEvent({
    email: pendingAdmin.email,
    eventType: "mfa_enrolled",
    metadata: { factorId: enrollData.id },
  });

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.09] bg-[#101014] p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e89b3c]" />
            <span className="font-mono-label text-xs font-semibold tracking-[0.24em] text-[#f4f0ea]">
              STEWARD
            </span>
          </div>
          <span className="rounded border border-[#e89b3c]/40 bg-[#e89b3c]/10 px-2 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[#e89b3c]">
            First Login Setup
          </span>
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-[#f4f0ea]">
          Set up two-factor auth
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-[#a09c94]">
          Welcome, {pendingAdmin.name}. Enrol your authenticator app to access
          Steward Admin.
        </p>

        <MfaForm
          mode="enroll"
          factorId={enrollData.id}
          qrCodeDataUri={enrollData.totp.qr_code}
          secretKey={enrollData.totp.secret}
          adminEmail={pendingAdmin.email}
        />
      </div>
    </main>
  );
}
