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
    <div className="min-h-screen bg-[#08080a] text-[#f4f0ea] selection:bg-[#e89b3c] selection:text-[#08080a]">
      {children}
    </div>
  );
}
