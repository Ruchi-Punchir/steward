import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Steward Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme-root min-h-screen bg-[var(--bg-stage)] text-[var(--text-primary)] selection:bg-[#e89b3c] selection:text-[#08080a] transition-colors duration-300">
      {children}
    </div>
  );
}
