import React from "react";
import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { isEmailAllowlisted } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email && isEmailAllowlisted(user.email)) {
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalData?.currentLevel === "aal2") {
        redirect("/admin/leads");
      } else {
        redirect("/admin/mfa");
      }
    }
  }

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
          <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono-label text-[9.5px] uppercase tracking-[0.18em] text-[#a09c94]">
            Admin
          </span>
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-[#f4f0ea]">
          Sign in to Steward
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-[#a09c94]">
          Enter your email and password, then verify with your authenticator
          app.
        </p>

        <LoginForm supabaseConfigured={configured} />
      </div>
    </main>
  );
}
