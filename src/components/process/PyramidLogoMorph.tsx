"use client";

import React from "react";

export interface PyramidLogoMorphProps {
  /**
   * 0 = Full US Dollar Great Seal Pyramid with floating Eye of Providence (Section 04: WHO WE WORK WITH)
   * 0..1 = Capstone lowers & locks onto the masonry frustum, rays condense, brick courses fuse into the
   *        hollow triangle frame, and the eye condenses into the glowing amber circle (#e89b3c)
   * 1 = Clean Steward Logo Mark (Hollow triangle + amber circle, matching /public/icon.svg) (Section 05: LET'S START)
   */
  morphProgress: number;
  isLight?: boolean;
  idPrefix?: string;
  className?: string;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// 32 engraved glory rays radiating from the Eye of Providence capstone
const RAY_ANGLES = Array.from({ length: 32 }, (_, i) => (i * 360) / 32);

// 13 courses of masonry for the Great Seal unfinished pyramid
// Base y = 244 (width 260: x from 1 to 261), frustum top y = 96
const MASONRY_COURSES = Array.from({ length: 13 }, (_, idx) => {
  const totalHeight = 244 - 18; // 226
  const yTop = 244 - ((idx + 1) * (244 - 96)) / 13;
  const yBot = 244 - (idx * (244 - 96)) / 13;
  const yMid = (yTop + yBot) / 2;

  const halfWidthAt = (y: number) => ((y - 18) / totalHeight) * 130;
  const xLeftTop = 131 - halfWidthAt(yTop);
  const xRightTop = 131 + halfWidthAt(yTop);
  const xLeftBot = 131 - halfWidthAt(yBot);
  const xRightBot = 131 + halfWidthAt(yBot);

  // Number of bricks in this course (fewer near top, more near base)
  const brickCount = Math.max(3, Math.round(9 - idx * 0.48));
  const verticals: { x: number; y1: number; y2: number }[] = [];
  const offsetPhase = idx % 2 === 0 ? 0.5 : 0.25;

  for (let b = 1; b < brickCount; b++) {
    const frac = (b + (offsetPhase - 0.35)) / brickCount;
    if (frac <= 0.08 || frac >= 0.92) continue;
    const x = lerp(xLeftMid(xLeftTop, xLeftBot), xRightMid(xRightTop, xRightBot), frac);
    verticals.push({ x, y1: yTop, y2: yBot });
  }

  return {
    idx,
    yTop,
    yBot,
    yMid,
    xLeftTop,
    xRightTop,
    xLeftBot,
    xRightBot,
    verticals,
  };
});

function xLeftMid(a: number, b: number) {
  return (a + b) / 2;
}
function xRightMid(a: number, b: number) {
  return (a + b) / 2;
}

export default function PyramidLogoMorph({
  morphProgress,
  isLight = false,
  idPrefix = "steward-pyramid-morph",
  className = "w-full h-full",
}: PyramidLogoMorphProps) {
  const p = clamp01(morphProgress);

  // Phase 1 (0.0 -> 0.58): Capstone descends into the pyramid frustum to complete the triangle
  // and the eye lowers into the Steward circle center (y: 54 -> 167.5)
  const assemblyT = smoothstep(0.0, 0.62, p);

  // Phase 2 (0.18 -> 0.78): Intaglio currency details (glory rays, masonry brick courses, 3D left shadow, Latin banner) fuse & dissolve
  const detailFade = 1 - smoothstep(0.14, 0.72, p);
  const raysScale = lerp(1, 0.38, smoothstep(0.0, 0.65, p));
  const bannerFade = 1 - smoothstep(0.0, 0.42, p);

  // Phase 3 (0.35 -> 0.96): Hollow Steward triangle frame & solid amber circle lock into 100% crisp vector geometry
  const logoFrameFade = smoothstep(0.32, 0.88, p);
  const eyeToOrbT = smoothstep(0.28, 0.9, p);

  // Colors adapted to dark/light surface
  const primaryStroke = isLight ? "#141413" : "#f4f0ea";
  const logoTriFill = isLight ? "#08080a" : "#ffffff";
  const masonryFill = isLight ? "#ebe5d8" : "#15151c";
  const masonryShadowFill = isLight ? "#d5ccb8" : "#0c0c10";
  const amber = "#e89b3c";
  const amberBright = "#f5b661";

  // Capstone coordinates:
  // At p=0, the capstone apex is lifted by -16px (so apex is at y=2, base of capstone at y=72, leaving a dramatic glowing gap above frustum y=96).
  // As assemblyT -> 1, the capstone lowers smoothly so its apex is at y=18 and its base meets y=96 seamlessly!
  const capstoneOffsetY = lerp(-15, 0, assemblyT);

  // Eye of Providence center Y:
  // At p=0, sits inside the floating capstone at y = 55 + capstoneOffsetY = 40.
  // As p -> 1, glides down the central axis to y = 167.5 (exact Steward logo circle center in 262x262 viewBox!).
  const eyeCenterY = lerp(55 + capstoneOffsetY, 167.5, eyeToOrbT);

  // Eye almond half-width & half-height morphing into the r=41 circle
  const eyeRx = lerp(17.5, 41, eyeToOrbT);
  const eyeRy = lerp(9.5, 41, eyeToOrbT);
  const irisRadius = lerp(6.8, 41, eyeToOrbT);

  return (
    <svg
      viewBox="-18 -18 298 304"
      className={`overflow-visible select-none ${className}`}
      role="img"
      aria-label={
        p < 0.5
          ? "US Dollar Great Seal Pyramid with the Eye of Providence"
          : "Steward triangle and circle logo mark"
      }
    >
      <defs>
        {/* Radial amber aura behind the Eye of Providence / Steward orb */}
        <radialGradient id={`${idPrefix}-amber-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={amber} stopOpacity="0.45" />
          <stop offset="45%" stopColor={amber} stopOpacity="0.14" />
          <stop offset="100%" stopColor={amber} stopOpacity="0" />
        </radialGradient>

        {/* Fine US Dollar intaglio horizontal engraving hatching pattern */}
        <pattern
          id={`${idPrefix}-intaglio-hatch`}
          width="6"
          height="3.2"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="1.6"
            x2="6"
            y2="1.6"
            stroke={primaryStroke}
            strokeWidth="0.45"
            strokeOpacity={isLight ? "0.22" : "0.18"}
          />
        </pattern>

        {/* Clip path for the lower 13-course pyramid frustum (y: 96..244) */}
        <clipPath id={`${idPrefix}-frustum-clip`}>
          <polygon points="86.1,96 175.9,96 261,244 1,244" />
        </clipPath>
      </defs>

      {/* =====================================================================
          1. BACKGROUND GREAT SEAL MEDALLION RINGS & GLORY RAYS (Fades out during morph)
      ===================================================================== */}
      {detailFade > 0.005 && (
        <g opacity={detailFade}>
          {/* Outer Great Seal double-engraved circular border */}
          <circle
            cx="131"
            cy="138"
            r="142"
            fill="none"
            stroke={primaryStroke}
            strokeWidth="0.9"
            strokeOpacity="0.16"
            strokeDasharray="3 3"
          />
          <circle
            cx="131"
            cy="138"
            r="134"
            fill="none"
            stroke={amber}
            strokeWidth="0.75"
            strokeOpacity="0.22"
          />

          {/* Glory Rays & Halo centered on the Capstone Eye */}
          <g
            transform={`translate(131, ${55 + capstoneOffsetY}) scale(${raysScale})`}
          >
            <circle
              cx="0"
              cy="0"
              r="76"
              fill={`url(#${idPrefix}-amber-halo)`}
            />

            {/* Concentric currency stipple rings around the capstone */}
            <circle
              cx="0"
              cy="0"
              r="42"
              fill="none"
              stroke={amber}
              strokeWidth="0.8"
              strokeDasharray="1.5 3.5"
              strokeOpacity="0.55"
            />
            <circle
              cx="0"
              cy="0"
              r="56"
              fill="none"
              stroke={primaryStroke}
              strokeWidth="0.65"
              strokeDasharray="1 4"
              strokeOpacity="0.3"
            />

            {/* 32 radiating engraved rays */}
            {RAY_ANGLES.map((deg, idx) => {
              const isMajor = idx % 2 === 0;
              const innerR = isMajor ? 26 : 31;
              const outerR = isMajor ? 68 : 52;
              return (
                <line
                  key={deg}
                  x1="0"
                  y1={-innerR}
                  x2="0"
                  y2={-outerR}
                  transform={`rotate(${deg})`}
                  stroke={isMajor ? amber : primaryStroke}
                  strokeWidth={isMajor ? "1.15" : "0.65"}
                  strokeOpacity={isMajor ? "0.75" : "0.32"}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </g>
      )}

      {/* =====================================================================
          2. UNFINISHED 13-STEP MASONRY PYRAMID FRUSTUM (Fuses into triangle)
      ===================================================================== */}
      {detailFade > 0.005 && (
        <g opacity={detailFade}>
          {/* Base pyramid body */}
          <polygon
            points="86.1,96 175.9,96 261,244 1,244"
            fill={masonryFill}
            stroke={primaryStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Intaglio horizontal line texture overlay */}
          <polygon
            points="86.1,96 175.9,96 261,244 1,244"
            fill={`url(#${idPrefix}-intaglio-hatch)`}
          />

          {/* 3D Left Chiseled Shadow Facet (mimics the 3D angle on the $1 bill pyramid) */}
          <polygon
            points="86.1,96 98.5,96 39,244 1,244"
            fill={masonryShadowFill}
            opacity="0.85"
          />
          <line
            x1="98.5"
            y1="96"
            x2="39"
            y2="244"
            stroke={primaryStroke}
            strokeWidth="1.1"
            strokeOpacity="0.55"
          />

          {/* Top 3D frustum shelf (visible when capstone is floating above, closes as capstone docks) */}
          <polygon
            points={`86.1,96 98.5,96 175.9,96 167,${lerp(90.5, 96, assemblyT)} 94,${lerp(90.5, 96, assemblyT)}`}
            fill={masonryShadowFill}
            stroke={primaryStroke}
            strokeWidth="1"
            strokeOpacity={1 - assemblyT * 0.8}
          />

          {/* 13 Horizontal Masonry Courses & Vertical Brick Joints */}
          <g clipPath={`url(#${idPrefix}-frustum-clip)`}>
            {MASONRY_COURSES.map((course) => (
              <g key={course.idx}>
                {/* Horizontal course seam */}
                {course.idx < 12 && (
                  <line
                    x1={course.xLeftTop}
                    y1={course.yTop}
                    x2={course.xRightTop}
                    y2={course.yTop}
                    stroke={primaryStroke}
                    strokeWidth="1.05"
                    strokeOpacity={isLight ? "0.45" : "0.38"}
                  />
                )}
                {/* Vertical stone joints */}
                {course.verticals.map((v, vIdx) => (
                  <line
                    key={vIdx}
                    x1={v.x}
                    y1={v.y1}
                    x2={v.x}
                    y2={v.y2}
                    stroke={primaryStroke}
                    strokeWidth="0.9"
                    strokeOpacity={isLight ? "0.32" : "0.28"}
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Roman Numerals "MDCCLXXVI" engraved on the bottom foundation course */}
          <text
            x="137"
            y="240.5"
            textAnchor="middle"
            fill={primaryStroke}
            fillOpacity="0.72"
            fontSize="7.4"
            fontWeight="700"
            letterSpacing="2.4"
            fontFamily="serif"
          >
            MDCCLXXVI
          </text>

          {/* Outer Frustum Crisp Border */}
          <polygon
            points="86.1,96 175.9,96 261,244 1,244"
            fill="none"
            stroke={primaryStroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* =====================================================================
          3. FLOATING CAPSTONE TRIANGLE (Lowers onto the frustum as assemblyT -> 1)
      ===================================================================== */}
      {detailFade > 0.005 && (
        <g
          transform={`translate(0, ${capstoneOffsetY})`}
          opacity={detailFade}
        >
          {/* Radiant amber glow under the floating capstone gap */}
          <line
            x1="92"
            y1="86"
            x2="170"
            y2="86"
            stroke={amber}
            strokeWidth="2.5"
            strokeOpacity={0.75 * (1 - assemblyT)}
            strokeLinecap="round"
          />

          {/* Capstone Triangle Body */}
          <polygon
            points="131,18 171.3,88 90.7,88"
            fill={masonryFill}
            stroke={amber}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Left 3D shadow facet on capstone */}
          <polygon
            points="131,18 101,88 90.7,88"
            fill={masonryShadowFill}
            opacity="0.78"
          />

          {/* Inner engraved border inside capstone */}
          <polygon
            points="131,24 166,84.5 96,84.5"
            fill="none"
            stroke={primaryStroke}
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />
        </g>
      )}

      {/* =====================================================================
          4. STEWARD HOLLOW TRIANGLE LOGO FRAME (Fuses in as masonry dissolves)
             Matches /public/icon.svg:
             Outer triangle: M131 18 L261 244 L1 244 Z
             Inner cutout:   M131 55 L33 225 L229 225 Z
      ===================================================================== */}
      {logoFrameFade > 0.005 && (
        <path
          fill={logoTriFill}
          fillRule="evenodd"
          opacity={logoFrameFade}
          d="M131 18 L261 244 L1 244 Z M131 55 L33 225 L229 225 Z"
        />
      )}

      {/* Continuous outer structural triangle outline that bridges Stage 04 -> Stage 05 seamlessly */}
      <polygon
        points={`131,${18 + capstoneOffsetY * (1 - logoFrameFade)} 261,244 1,244`}
        fill="none"
        stroke={amber}
        strokeWidth={lerp(1.2, 0, logoFrameFade)}
        strokeOpacity={lerp(0.35, 0, logoFrameFade)}
        strokeLinejoin="round"
      />

      {/* =====================================================================
          5. THE ALL-SEEING EYE OF PROVIDENCE -> STEWARD AMBER CIRCLE (#e89b3c)
             At p=0: Detailed Eye inside the floating capstone (cx=131, cy=40)
             At p=1: Solid r=41 amber circle inside the hollow triangle (cx=131, cy=167.5)
      ===================================================================== */}
      <g transform={`translate(131, ${eyeCenterY})`}>
        {/* Subtle ambient amber glow behind the eye/orb */}
        <circle
          cx="0"
          cy="0"
          r={lerp(26, 48, eyeToOrbT)}
          fill={`url(#${idPrefix}-amber-halo)`}
          opacity={lerp(0.9, 0.35, eyeToOrbT)}
        />

        {/* Solid Steward Amber Circle (expands from the glowing iris to r=41) */}
        <circle
          cx="0"
          cy="0"
          r={irisRadius}
          fill={amber}
        />

        {/* Detailed Eye of Providence Eyelids, Iris Rings & Glint (fade out as iris expands to full r=41 orb) */}
        {1 - eyeToOrbT > 0.01 && (
          <g opacity={1 - eyeToOrbT}>
            {/* Sclera / Almond Eye Contour */}
            <path
              d={`M ${-eyeRx} 0 Q 0 ${-eyeRy * 1.45} ${eyeRx} 0 Q 0 ${eyeRy * 1.45} ${-eyeRx} 0 Z`}
              fill={masonryFill}
              stroke={amberBright}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* Upper & Lower Engraved Eyelid Creases */}
            <path
              d={`M ${-eyeRx * 1.08} -1.5 Q 0 ${-eyeRy * 1.75} ${eyeRx * 1.08} -1.5`}
              fill="none"
              stroke={primaryStroke}
              strokeWidth="0.95"
              strokeOpacity="0.65"
              strokeLinecap="round"
            />
            <path
              d={`M ${-eyeRx * 0.92} 2 Q 0 ${eyeRy * 1.6} ${eyeRx * 0.92} 2`}
              fill="none"
              stroke={primaryStroke}
              strokeWidth="0.8"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />

            {/* Glowing Amber Iris */}
            <circle
              cx="0"
              cy="0"
              r="7.2"
              fill={amber}
              stroke={primaryStroke}
              strokeWidth="0.9"
            />

            {/* Engraved Iris Spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="0"
                y1="-3.2"
                x2="0"
                y2="-6.8"
                transform={`rotate(${deg})`}
                stroke={masonryFill}
                strokeWidth="0.65"
                strokeOpacity="0.7"
              />
            ))}

            {/* Deep Pupil & Specular Catchlight */}
            <circle cx="0" cy="0" r="3.1" fill={primaryStroke} />
            <circle cx="-1.6" cy="-1.6" r="1.2" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* =====================================================================
          6. GREAT SEAL CURVED MOTTO RIBBON ("NOVUS ORDO SECLORUM" / "ANNUIT COEPTIS")
             Sits gracefully at the base in Section 04 and dissolves early in the morph
      ===================================================================== */}
      {bannerFade > 0.005 && (
        <g opacity={bannerFade}>
          {/* Top Motto Arch above the Eye: ANNUIT COEPTIS */}
          <text
            x="131"
            y="-4"
            textAnchor="middle"
            fill={amber}
            fillOpacity="0.85"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="3.4"
            fontFamily="serif"
          >
            ANNUIT CŒPTIS
          </text>

          {/* Bottom Engraved Scroll Ribbon below the Pyramid base */}
          <g transform="translate(131, 266)">
            <path
              d="M -96 -6 Q 0 6 96 -6 L 90 8 Q 0 20 -90 8 Z"
              fill={masonryFill}
              stroke={primaryStroke}
              strokeWidth="1.1"
              strokeOpacity="0.55"
            />
            <text
              x="0"
              y="6.5"
              textAnchor="middle"
              fill={primaryStroke}
              fillOpacity="0.75"
              fontSize="7.2"
              fontWeight="700"
              letterSpacing="2.6"
              fontFamily="serif"
            >
              NOVUS ORDO SECLORUM
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
