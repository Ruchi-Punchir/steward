"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface StewardLogoProps {
  /**
   * "auto" (default) switches between white-on-dark (/logo-dark.png) and
   * black-on-light (/logo-light.png) based on the active site theme.
   * Use "dark" to force the white logo on always-dark surfaces, or "light"
   * to force the black logo on always-light surfaces.
   */
  variant?: "auto" | "dark" | "light";
  /** Render only the triangle + amber circle icon mark */
  markOnly?: boolean;
  /** Tailwind height / sizing classes for the image (defaults to "h-6 sm:h-7 w-auto") */
  className?: string;
  alt?: string;
}

export default function StewardLogo({
  variant = "auto",
  markOnly = false,
  className = "h-6 sm:h-7 w-auto",
  alt = "Steward",
}: StewardLogoProps) {
  const { theme } = useTheme();
  const isLightSurface =
    variant === "light" ? true : variant === "dark" ? false : theme === "light";

  const src = markOnly
    ? isLightSurface
      ? "/logo-mark-light.png"
      : "/logo-mark-dark.png"
    : isLightSurface
      ? "/logo-light.png"
      : "/logo-dark.png";

  return (
    <img
      src={src}
      alt={alt}
      width={markOnly ? 261 : 991}
      height={226}
      className={`select-none object-contain ${className}`}
    />
  );
}
