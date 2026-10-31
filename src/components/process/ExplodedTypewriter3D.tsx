"use client";

import React from "react";

export interface ProductUnitSpec {
  id: string;
  code: string;
  name: string;
  partTitle: string;
  finding: string;
  isProblem?: boolean;
  statusBadge?: string;
  subParts: {
    id: string;
    label: string;
    partNumber: string;
  }[];
}

export const PRODUCT_UNITS: ProductUnitSpec[] = [
  {
    id: "monetization",
    code: "01",
    name: "Monetization & Pricing",
    partTitle: "Output Platen & $1 Revenue Feed",
    finding: "Inspecting pricing tiers, paywall trigger & checkout drop-off.",
    isProblem: false,
    subParts: [
      { id: "pricing", label: "Pricing Model", partNumber: "#01-A" },
      { id: "checkout", label: "Checkout Flow", partNumber: "#01-B" },
      { id: "billing", label: "Paywall & Trials", partNumber: "#01-C" },
    ],
  },
  {
    id: "marketing",
    code: "02",
    name: "Marketing & Acquisition",
    partTitle: "Knurled Drive Roller & Gear Train",
    finding: "Auditing ad spend efficiency, email sequences & channel intent.",
    isProblem: true,
    subParts: [
      { id: "ads", label: "Ad Campaigns", partNumber: "#02-A" },
      { id: "email", label: "Email Sequences", partNumber: "#02-B" },
      { id: "seo", label: "SEO & Content", partNumber: "#02-C" },
      { id: "outbound", label: "Cold Outreach", partNumber: "#02-D" },
    ],
  },
  {
    id: "positioning",
    code: "03",
    name: "Positioning & Messaging",
    partTitle: "Upper Ribbon Hood & Brand Plaque",
    finding: "Testing value proposition clarity, hero hook & buyer trust.",
    isProblem: false,
    subParts: [
      { id: "value-prop", label: "Value Proposition", partNumber: "#03-A" },
      { id: "copy", label: "Landing Page Copy", partNumber: "#03-B" },
      { id: "brand", label: "Brand Story", partNumber: "#03-C" },
    ],
  },
  {
    id: "development",
    code: "04",
    name: "Product & Development",
    partTitle: "Logic PCB, Flex Bus & Drive Motor",
    finding: "Profiling core architecture, load latency & feature friction.",
    isProblem: true,
    subParts: [
      { id: "arch", label: "Core Architecture", partNumber: "#04-A" },
      { id: "perf", label: "Speed & Latency", partNumber: "#04-B" },
      { id: "integrations", label: "Checkout & APIs", partNumber: "#04-C" },
      { id: "debt", label: "Code & Tech Debt", partNumber: "#04-D" },
    ],
  },
  {
    id: "onboarding",
    code: "05",
    name: "Onboarding & Retention",
    partTitle: "Front Terminal Bezel & Keybed",
    finding: "Tracing first-run UX, time-to-value & cohort retention leaks.",
    isProblem: false,
    subParts: [
      { id: "first-run", label: "First-Run UX", partNumber: "#05-A" },
      { id: "activation", label: "User Activation", partNumber: "#05-B" },
      { id: "retention", label: "Churn & Analytics", partNumber: "#05-C" },
    ],
  },
];

interface ExplodedTypewriter3DProps {
  /** 0 = collapsed/assembled, 1 = fully exploded in 3D isometric space */
  explosionProgress: number;
  /** Currently active/glowing product unit index (0..4) */
  activeUnitIndex: number;
  /** Callback when user hovers or clicks a specific unit */
  onSelectUnit?: (index: number) => void;
  isLight?: boolean;
  /** 0 = Step 1 Understand (all units visible), 1 = Step 2 Build a solution (only Units 02 & 04 with green repair laser) */
  fixProgress?: number;
  /** 0..1 Step 3 Test the solution (all 5 units brought back together for live user testing) */
  testProgress?: number;
  /** 0..1 Step 4 Launch and measure (re-converged high-performing revenue machine) */
  launchProgress?: number;
}

export default function ExplodedTypewriter3D({
  explosionProgress,
  activeUnitIndex,
  onSelectUnit,
  isLight = false,
  fixProgress = 0,
  testProgress = 0,
  launchProgress = 0,
}: ExplodedTypewriter3DProps) {
  const rawP = Math.max(0, Math.min(1, explosionProgress));
  const fixP = Math.max(0, Math.min(1, fixProgress));
  const testP = Math.max(0, Math.min(1, testProgress));
  const launchP = Math.max(0, Math.min(1, launchProgress));
  // Collapse all 5 tiers back together as we scroll from Build a solution -> Test the solution
  const collapseP = Math.min(1, testP / 0.55);
  const p = rawP * (1 - collapseP);
  const labelOpacity = p * Math.max(0, 1 - testP * 3);
  const laserOpacity = Math.min(1, fixP * 1.4) * Math.max(0, 1 - testP * 2.5);
  const isFixMode = fixP > 0.08 && testP < 0.25;
  const isTestMode = testP > 0.15;
  const isLaunchMode = launchP > 0.15;

  // Isometric explosion offsets along the 3D CAD diagonal (Back-Top-Right -> Front-Bottom-Left)
  // Matches the exact 5-tier exploded isometric axis in the reference illustration
  const tier1X = 112 * p;
  const tier1Y = -112 * p;

  const tier2X = 58 * p;
  const tier2Y = -58 * p;

  const tier3X = 4 * p;
  const tier3Y = -4 * p;

  const tier4X = -52 * p;
  const tier4Y = 52 * p;

  const tier5X = -114 * p;
  const tier5Y = 112 * p;

  const isProblemUnit = (idx: number) => idx === 1 || idx === 3;
  const isUnitActive = (idx: number) => p > 0.35 && activeUnitIndex === idx;

  const strokeBase = isLight ? "#24221e" : "#a8a49a";
  const strokeFine = isLight ? "rgba(36,34,30,0.38)" : "rgba(244,240,234,0.28)";
  const accentAmber = isLight ? "#c26a1b" : "#e89b3c";
  // Toned-down, refined architectural red (subdued, not neon/searing)
  const accentRed = isLight ? "#b23b32" : "#c94f45";
  // Emerald repair green for Step 2 ("Fix")
  const accentGreen = isLight ? "#059669" : "#10b981";
  const accentGreenBright = isLight ? "#10b981" : "#34d399";

  // In Fix mode, problem units 02 and 04 transition from diagnosis red to repair green
  const problemStroke = isFixMode ? accentGreen : accentRed;
  // Non-problem units (01, 03, 05) fade out to 0 opacity in Fix mode, then return immediately as Test mode assembles the machine
  const nonProblemOpacity = Math.max(Math.max(0, 1 - fixP * 1.5), Math.min(1, testP * 3));

  const tier2Stroke = isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeBase);
  const tier2Accent = isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeFine);
  const tier4Stroke = isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : strokeBase);
  const tier4Accent = isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : strokeFine);

  const getUnitAccent = (idx: number) => {
    if (isFixMode && isProblemUnit(idx)) return accentGreen;
    return isProblemUnit(idx) ? accentRed : accentAmber;
  };

  const getUnitFilter = (idx: number) => {
    if (isFixMode && isProblemUnit(idx)) return "url(#unit-repair-glow-green)";
    if (!isUnitActive(idx)) return "url(#iso-part-shadow)";
    return isProblemUnit(idx)
      ? "url(#unit-diagnostic-glow-red)"
      : "url(#unit-diagnostic-glow-amber)";
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center select-none">
      {/* Subtle ambient diagnostic radial glow behind the 3D exploded assembly */}
      <div
        aria-hidden="true"
        style={{ opacity: 0.25 + p * 0.55 }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,155,60,0.14)_0%,rgba(8,8,10,0)_70%)] blur-3xl transition-opacity duration-300"
      />

      <svg
        viewBox="0 0 960 660"
        className="pointer-events-auto h-full w-full max-w-[920px] overflow-visible"
        role="img"
        aria-label="3D isometric exploded view of your business machine showing Monetization, Marketing, Positioning, Development, and Onboarding subsystems"
      >
        <defs>
          {/* Traveling Green Repair Laser Keyframe Animations */}
          <style>{`
            @keyframes repairLaserSweepForward {
              0% { stroke-dashoffset: 780; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes repairScanSweepTier2 {
              0% { transform: translate(-10px, -4px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translate(288px, 103px); opacity: 0; }
            }
            @keyframes repairScanSweepTier4 {
              0% { transform: translate(-10px, -4px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translate(265px, 96px); opacity: 0; }
            }
            .repair-laser-anim {
              animation: repairLaserSweepForward 2.4s linear infinite;
            }
            .repair-scan-tier2 {
              animation: repairScanSweepTier2 2.6s ease-in-out infinite;
            }
            .repair-scan-tier4 {
              animation: repairScanSweepTier4 2.8s ease-in-out 0.4s infinite;
            }
          `}</style>

          {/* Emerald Repair Glow Filter for Fix Mode (Units 02 & 04) */}
          <filter
            id="unit-repair-glow-green"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="7"
              floodColor={accentGreen}
              floodOpacity="0.75"
            />
          </filter>

          {/* Traveling Repair Laser Glow Filter (Intense Neon Beam) */}
          <filter id="repair-laser-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Amber Diagnostic Glow Filter for normal inspected units */}
          <filter
            id="unit-diagnostic-glow-amber"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="9"
              floodColor="#e89b3c"
              floodOpacity="0.75"
            />
          </filter>

          {/* Fallback alias */}
          <filter
            id="unit-diagnostic-glow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="9"
              floodColor="#e89b3c"
              floodOpacity="0.75"
            />
          </filter>

          {/* Toned-down Red Diagnostic Glow Filter for Problem Subsystems (Units 02 & 04) */}
          <filter
            id="unit-diagnostic-glow-red"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor={accentRed}
              floodOpacity="0.45"
            />
          </filter>

          {/* Subtle 3D Metallic Part Shadow */}
          <filter
            id="iso-part-shadow"
            x="-15%"
            y="-15%"
            width="130%"
            height="140%"
          >
            <feDropShadow
              dx="-6"
              dy="10"
              stdDeviation="7"
              floodColor="#000000"
              floodOpacity={isLight ? "0.22" : "0.65"}
            />
          </filter>

          {/* Cross-hatched knurled roller pattern */}
          <pattern
            id="iso-knurl-pattern"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
              stroke={isLight ? "#1e1d1a" : "#d8d4cc"}
              strokeWidth="0.6"
              opacity="0.32"
            />
            <path
              d="M 0 0 L 6 6 M -1 5 L 1 7 M 5 -1 L 7 1"
              stroke={isLight ? "#1e1d1a" : "#d8d4cc"}
              strokeWidth="0.6"
              opacity="0.22"
            />
          </pattern>

          {/* Circuit board grid pattern */}
          <pattern
            id="iso-pcb-pattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 4 L 8 4 M 4 0 L 4 8"
              stroke="#e89b3c"
              strokeWidth="0.45"
              opacity="0.28"
            />
          </pattern>

          {/* Aged Green Dollar Bill Gradient */}
          <linearGradient id="iso-bill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9e5cc" />
            <stop offset="50%" stopColor="#b9cca9" />
            <stop offset="100%" stopColor="#9ab089" />
          </linearGradient>

          {/* Dark Cast-Iron / Enamel Chassis Gradient */}
          <linearGradient id="iso-chassis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#3a3833" : "#2c2c36"} />
            <stop offset="55%" stopColor={isLight ? "#262522" : "#191920"} />
            <stop offset="100%" stopColor={isLight ? "#181715" : "#0e0e13"} />
          </linearGradient>

          {/* Machined Steel / Aluminium Sub-Frame Gradient */}
          <linearGradient id="iso-steel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#e5dfd3" : "#4a4844"} />
            <stop offset="50%" stopColor={isLight ? "#c8c0b0" : "#2f2e2b"} />
            <stop offset="100%" stopColor={isLight ? "#9e9688" : "#1c1b19"} />
          </linearGradient>
        </defs>

        {/* ===================================================================
            CORNER BLUEPRINT REGISTRATION CROSSHAIRS (Matches 3rd Image)
        =================================================================== */}
        <g opacity={0.35 * p} stroke={strokeBase} strokeWidth="1">
          <path d="M 30 45 L 70 45 M 50 25 L 50 65" />
          <path d="M 890 45 L 930 45 M 910 25 L 910 65" />
          <path d="M 30 615 L 70 615 M 50 595 L 50 635" />
          <path d="M 890 615 L 930 615 M 910 595 L 910 635" />
        </g>

        {/* ===================================================================
            MASTER ISOMETRIC EXPLODED AXIS LINES (Dashed CAD Centerlines)
        =================================================================== */}
        <g
          opacity={p * 0.75 * nonProblemOpacity}
          stroke={strokeFine}
          strokeWidth="1.1"
          strokeDasharray="4 4"
        >
          {/* Left & Right Isometric Assembly Spine Lines connecting all 5 tiers */}
          <line
            x1={355 + tier1X}
            y1={195 + tier1Y}
            x2={355 + tier5X}
            y2={195 + tier5Y}
          />
          <line
            x1={615 + tier1X}
            y1={285 + tier1Y}
            x2={615 + tier5X}
            y2={285 + tier5Y}
          />
          <line
            x1={485 + tier1X}
            y1={240 + tier1Y}
            x2={485 + tier5X}
            y2={240 + tier5Y}
          />
        </g>

        {/* ===================================================================
            TIER 05 (BOTTOM BASEPLATE): Foundation & Mounting Bolts
            (Fades out in Fix mode)
        =================================================================== */}
        <g
          transform={`translate(${(tier5X + 42 * p).toFixed(1)}, ${(
            tier5Y +
            44 * p
          ).toFixed(1)})`}
          opacity={(0.35 + p * 0.65) * nonProblemOpacity}
          style={{ pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
        >
          {/* Isometric Perforated Steel Baseplate */}
          <polygon
            points="275,380 575,488 665,432 365,324"
            fill={isLight ? "#dad3c5" : "#18181f"}
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth={isUnitActive(4) ? "1.8" : "1.1"}
          />
          <polygon
            points="275,380 575,488 575,495 275,387"
            fill={isLight ? "#9e988c" : "#0e0e12"}
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth="0.9"
          />
          <polygon
            points="575,488 665,432 665,439 575,495"
            fill={isLight ? "#847e72" : "#09090c"}
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth="0.9"
          />
          {/* Baseplate mounting holes */}
          {[
            [325, 382],
            [405, 411],
            [485, 440],
            [560, 468],
            [615, 436],
          ].map(([hx, hy], idx) => (
            <ellipse
              key={idx}
              cx={hx}
              cy={hy}
              rx="4.5"
              ry="2.5"
              fill="#070709"
              stroke={strokeBase}
              strokeWidth="0.8"
            />
          ))}

          {/* Exploded Bottom Screws (#05-C: Churn & Analytics) */}
          <g
            transform={`translate(0, ${(28 * p).toFixed(1)})`}
            opacity={p}
          >
            {[
              [285, 395],
              [385, 432],
              [485, 468],
              [572, 500],
            ].map(([sx, sy], idx) => (
              <g key={idx} transform={`translate(${sx}, ${sy})`}>
                <line
                  x1="0"
                  y1="-28"
                  x2="0"
                  y2="0"
                  stroke={isUnitActive(4) ? accentAmber : strokeFine}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <rect
                  x="-2"
                  y="0"
                  width="4"
                  height="14"
                  rx="1"
                  fill={isUnitActive(4) ? accentAmber : strokeBase}
                />
                <ellipse
                  cx="0"
                  cy="14"
                  rx="5.5"
                  ry="2.8"
                  fill={isUnitActive(4) ? accentAmber : "#2a2a32"}
                  stroke={strokeBase}
                  strokeWidth="0.9"
                />
              </g>
            ))}
          </g>
        </g>

        {/* ===================================================================
            TIER 01 (BACK-TOP-RIGHT): MONETIZATION & PRICING
            Torn $1 Bill & Upper Paper Feed Guide Assembly
        =================================================================== */}
        <g
          transform={`translate(${tier1X.toFixed(1)}, ${tier1Y.toFixed(1)})`}
          onClick={() => onSelectUnit?.(0)}
          onMouseEnter={() => onSelectUnit?.(0)}
          className="pointer-events-auto cursor-pointer"
          style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
          opacity={nonProblemOpacity}
          filter={getUnitFilter(0)}
        >
          {/* Tailored non-overlapping hit surface for Tier 01 (Upper paper feed & $1 bill) */}
          <rect
            x="200"
            y="30"
            width="580"
            height="150"
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />

          {/* Smaller Part #01-A (Left Feed Pinch Roller: Pricing Model) */}
          <g transform={`translate(${(-48 * p).toFixed(1)}, ${(-18 * p).toFixed(1)})`}>
            <line
              x1="348"
              y1="176"
              x2={348 + 48 * p}
              y2={176 + 18 * p}
              stroke={isUnitActive(0) ? accentAmber : strokeFine}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity={p}
            />
            <ellipse
              cx="336"
              cy="171"
              rx="12"
              ry="18"
              transform="rotate(20 336 171)"
              fill="url(#iso-chassis-grad)"
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(0) ? "2" : "1.2"}
            />
            <ellipse
              cx="332"
              cy="170"
              rx="6"
              ry="9"
              transform="rotate(20 332 170)"
              fill={isLight ? "#383630" : "#111115"}
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth="1"
            />
            {/* Sub-part floating label: Pricing Model */}
            <g opacity={p}>
              <line
                x1="322"
                y1="164"
                x2="282"
                y2="146"
                stroke={isUnitActive(0) ? accentAmber : strokeFine}
                strokeWidth="1.2"
              />
              <rect
                x="155"
                y="128"
                width="135"
                height="26"
                rx="5"
                fill={
                  isUnitActive(0)
                    ? isLight
                      ? "rgba(194,106,27,0.18)"
                      : "rgba(232,155,60,0.22)"
                    : isLight
                    ? "#ffffff"
                    : "rgba(16,16,21,0.85)"
                }
                stroke={isUnitActive(0) ? accentAmber : isLight ? "#c5bdb0" : strokeFine}
                strokeWidth="1.2"
              />
              <text
                x="222"
                y="145.5"
                textAnchor="middle"
                fill={
                  isUnitActive(0)
                    ? isLight
                      ? "#9a5214"
                      : "#f4f0ea"
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                Pricing Model
              </text>
            </g>
          </g>

          {/* Isometric Torn $1 Dollar Bill emerging at 20-deg angle */}
          <g transform="translate(382, 82) skewY(19.5) skewX(-12)">
            <path
              d="M 0 4 L 46 0 L 52 12 L 59 2 L 185 0 L 194 18 L 202 5 L 265 0 L 265 92 L 0 92 Z"
              fill="url(#iso-bill-grad)"
              stroke={isUnitActive(0) ? accentAmber : "#214a30"}
              strokeWidth={isUnitActive(0) ? "2.4" : "1.5"}
            />
            <rect
              x="8"
              y="8"
              width="249"
              height="76"
              fill="none"
              stroke="#1b3d28"
              strokeWidth="1.2"
            />
            {/* Left & Right "1" medallions */}
            <ellipse
              cx="26"
              cy="26"
              rx="13"
              ry="11"
              fill="#173823"
              stroke="#dfead5"
              strokeWidth="0.9"
            />
            <text
              x="26"
              y="30"
              textAnchor="middle"
              fill="#eff5e8"
              fontSize="13"
              fontWeight="900"
              fontFamily="serif"
            >
              1
            </text>
            <ellipse
              cx="238"
              cy="46"
              rx="13"
              ry="11"
              fill="#173823"
              stroke="#dfead5"
              strokeWidth="0.9"
            />
            <text
              x="238"
              y="50"
              textAnchor="middle"
              fill="#eff5e8"
              fontSize="13"
              fontWeight="900"
              fontFamily="serif"
            >
              1
            </text>
            <text
              x="132"
              y="24"
              textAnchor="middle"
              fill="#1b3d28"
              fontSize="6.5"
              fontWeight="800"
              letterSpacing="1.8"
              fontFamily="serif"
            >
              FEDERAL RESERVE NOTE
            </text>
            <text
              x="132"
              y="36"
              textAnchor="middle"
              fill="#11291a"
              fontSize="8"
              fontWeight="900"
              letterSpacing="1.2"
              fontFamily="serif"
            >
              THE UNITED STATES OF AMERICA
            </text>
            <rect
              x="82"
              y="48"
              width="100"
              height="18"
              rx="2"
              fill="#163622"
            />
            <text
              x="132"
              y="60"
              textAnchor="middle"
              fill="#eff5e8"
              fontSize="10"
              fontWeight="800"
              letterSpacing="2"
              fontFamily="monospace"
            >
              ONE • 1 USD
            </text>
          </g>

          {/* Upper Cylindrical Paper Feed Guide Rail (Isometric Extruded Cylinder) */}
          <g>
            <polygon
              points="356,162 648,266 636,294 344,190"
              fill="url(#iso-chassis-grad)"
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(0) ? "2.2" : "1.3"}
            />
            {/* Metallic paper bail rod & feed rollers */}
            <line
              x1="362"
              y1="170"
              x2="638"
              y2="269"
              stroke="#d8d4cc"
              strokeWidth="2.2"
            />
            <rect
              x="412"
              y="184"
              width="18"
              height="9"
              rx="2"
              transform="rotate(19.5 412 184)"
              fill="#e89b3c"
              stroke="#111115"
              strokeWidth="0.9"
            />
            <rect
              x="558"
              y="236"
              width="18"
              height="9"
              rx="2"
              transform="rotate(19.5 558 236)"
              fill="#e89b3c"
              stroke="#111115"
              strokeWidth="0.9"
            />
            <ellipse
              cx="642"
              cy="280"
              rx="9"
              ry="15"
              transform="rotate(20 642 280)"
              fill="#18181f"
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth="1.3"
            />
          </g>

          {/* Smaller Part #01-B (Right Pressure Roller & Tension Screw: Checkout Flow) */}
          <g transform={`translate(${(52 * p).toFixed(1)}, ${(18 * p).toFixed(1)})`}>
            <line
              x1={642 - 52 * p}
              y1={280 - 18 * p}
              x2="642"
              y2="280"
              stroke={isUnitActive(0) ? accentAmber : strokeFine}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity={p}
            />
            <ellipse
              cx="656"
              cy="285"
              rx="12"
              ry="18"
              transform="rotate(20 656 285)"
              fill="url(#iso-chassis-grad)"
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(0) ? "2" : "1.2"}
            />
            <circle
              cx="656"
              cy="285"
              r="4"
              fill={isUnitActive(0) ? accentAmber : "#9e9a90"}
            />

            {/* Sub-part floating label: Checkout Flow */}
            <g opacity={p}>
              <line
                x1="668"
                y1="282"
                x2="695"
                y2="262"
                stroke={isUnitActive(0) ? accentAmber : strokeFine}
                strokeWidth="1.2"
              />
              <rect
                x="690"
                y="248"
                width="135"
                height="26"
                rx="5"
                fill={
                  isUnitActive(0)
                    ? isLight
                      ? "rgba(194,106,27,0.18)"
                      : "rgba(232,155,60,0.22)"
                    : isLight
                    ? "#ffffff"
                    : "rgba(16,16,21,0.85)"
                }
                stroke={isUnitActive(0) ? accentAmber : isLight ? "#c5bdb0" : strokeFine}
                strokeWidth="1.2"
              />
              <text
                x="757"
                y="264.5"
                textAnchor="middle"
                fill={
                  isUnitActive(0)
                    ? isLight
                      ? "#9a5214"
                      : "#f4f0ea"
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                Checkout Flow
              </text>
            </g>
          </g>
        </g>

        {/* ===================================================================
            TIER 02 (UPPER-MIDDLE): MARKETING & ACQUISITION (PROBLEM BOTTLENECK -> RED)
            Knurled Platen Cylinder, Center V-Striker & Twin Spur Gears
        =================================================================== */}
        <g
          transform={`translate(${tier2X.toFixed(1)}, ${tier2Y.toFixed(1)})`}
          onClick={() => onSelectUnit?.(1)}
          onMouseEnter={() => onSelectUnit?.(1)}
          className="pointer-events-auto cursor-pointer"
          style={{ cursor: "pointer", pointerEvents: "auto" }}
          filter={getUnitFilter(1)}
        >
          {/* Tailored non-overlapping hit surface for Tier 02 (Platen roller & gear train) */}
          <rect
            x="180"
            y="185"
            width="620"
            height="85"
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />

          {/* Smaller Part #02-A (Left Drive Gear & Bolt: Ad Campaigns) */}
          <g transform={`translate(${(-54 * p).toFixed(1)}, ${(-19 * p).toFixed(1)})`}>
            <line
              x1="340"
              y1="222"
              x2={340 + 54 * p}
              y2={222 + 19 * p}
              stroke={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeFine)}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity={p}
            />
            <ellipse
              cx="326"
              cy="217"
              rx="11"
              ry="16"
              transform="rotate(20 326 217)"
              fill="url(#iso-steel-grad)"
              stroke={tier2Stroke}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.2"}
              strokeDasharray="3 1.5"
            />
            <circle cx="326" cy="217" r="4.5" fill="#141418" />

            {/* Sub-part floating label: Ad Spend */}
            <g opacity={p}>
              <line
                x1="312"
                y1="212"
                x2="268"
                y2="196"
                stroke={tier2Stroke}
                strokeWidth="1.2"
              />
              <rect
                x="76"
                y="181"
                width={isFixMode ? 210 : 192}
                height="28"
                rx="6"
                fill={isLight ? "#ffffff" : "rgba(16,16,21,0.92)"}
                stroke={tier2Stroke}
                strokeWidth={isFixMode || isUnitActive(1) ? "1.6" : "1.2"}
              />
              <text
                x={isFixMode ? 181 : 172}
                y="198.5"
                textAnchor="middle"
                fill={
                  isFixMode
                    ? accentGreen
                    : isUnitActive(1)
                    ? accentRed
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                {isFixMode ? "Ad Spend (Optimizing)" : "Ad Spend (Leaking)"}
              </text>
            </g>
          </g>

          {/* Main Knurled Isometric Platen Roller Cylinder */}
          <g>
            <polygon
              points="350,208 626,307 614,339 338,240"
              fill="url(#iso-chassis-grad)"
              stroke={tier2Stroke}
              strokeWidth={isFixMode || isUnitActive(1) ? "2.2" : "1.3"}
            />
            <polygon
              points="350,208 626,307 614,339 338,240"
              fill="url(#iso-knurl-pattern)"
            />
            {/* Center V-Striker Fin Guide on Platen */}
            <polygon
              points="468,245 492,254 480,292 456,283"
              fill={isLight ? "#c8c2b4" : "#2a2a34"}
              stroke={tier2Stroke}
              strokeWidth={isFixMode || isUnitActive(1) ? "1.8" : "1"}
            />
            <ellipse
              cx="620"
              cy="323"
              rx="10"
              ry="17"
              transform="rotate(20 620 323)"
              fill="#141419"
              stroke={tier2Stroke}
              strokeWidth="1.4"
            />
          </g>

          {/* Smaller Part #02-B & #02-C (Right Twin Spur Gears: Email Marketing & SEO/Content) */}
          <g transform={`translate(${(64 * p).toFixed(1)}, ${(23 * p).toFixed(1)})`}>
            <line
              x1={620 - 64 * p}
              y1={323 - 23 * p}
              x2="668"
              y2="340"
              stroke={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeFine)}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity={p}
            />
            {/* Inner Spur Gear (Email Marketing) */}
            <ellipse
              cx="644"
              cy="331"
              rx="13"
              ry="20"
              transform="rotate(20 644 331)"
              fill="url(#iso-steel-grad)"
              stroke={tier2Stroke}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.3"}
              strokeDasharray="3.5 1.8"
            />
            <circle cx="644" cy="331" r="5" fill="#121216" />

            {/* Outer Spur Gear (SEO & Content) */}
            <ellipse
              cx="676"
              cy="343"
              rx="12"
              ry="18"
              transform="rotate(20 676 343)"
              fill="url(#iso-chassis-grad)"
              stroke={tier2Stroke}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.3"}
              strokeDasharray="3 1.5"
            />
            <circle
              cx="676"
              cy="343"
              r="4.5"
              fill={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : "#9e9a90")}
            />

            {/* Sub-part floating labels: Email Marketing + SEO & Content */}
            <g opacity={p}>
              <line
                x1="654"
                y1="316"
                x2={isFixMode ? 665 : 685}
                y2="298"
                stroke={tier2Stroke}
                strokeWidth="1.2"
              />
              <rect
                x={isFixMode ? 665 : 685}
                y="284"
                width={isFixMode ? 220 : 172}
                height="28"
                rx="6"
                fill={isLight ? "#ffffff" : "rgba(16,16,21,0.92)"}
                stroke={tier2Stroke}
                strokeWidth={isFixMode || isUnitActive(1) ? "1.6" : "1.2"}
              />
              <text
                x={isFixMode ? 775 : 771}
                y="301.5"
                textAnchor="middle"
                fill={
                  isFixMode
                    ? accentGreen
                    : isUnitActive(1)
                    ? accentRed
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className={`font-mono-label font-semibold uppercase ${
                  isFixMode
                    ? "text-[11px] tracking-[0.05em]"
                    : "text-[11px] tracking-[0.11em]"
                }`}
              >
                {isFixMode ? "Email Sequences (Fixed)" : "Email Sequences"}
              </text>

              <line
                x1="688"
                y1="348"
                x2="720"
                y2="360"
                stroke={tier2Stroke}
                strokeWidth="1.2"
              />
              <rect
                x="720"
                y="346"
                width="150"
                height="28"
                rx="6"
                fill={isLight ? "#ffffff" : "rgba(16,16,21,0.92)"}
                stroke={tier2Stroke}
                strokeWidth={isFixMode || isUnitActive(1) ? "1.6" : "1.2"}
              />
              <text
                x="795"
                y="363.5"
                textAnchor="middle"
                fill={
                  isFixMode
                    ? accentGreen
                    : isUnitActive(1)
                    ? accentRed
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                SEO &amp; Content
              </text>
            </g>
          </g>

          {/* ===================================================================
              TRAVELING GREEN REPAIR LASER OUTLINE OVERLAY (STEP 2: FIX)
              Sweeps continuously along the platen and drive gear perimeter
          =================================================================== */}
          {fixP > 0.05 && laserOpacity > 0.01 && (
            <g opacity={laserOpacity} className="pointer-events-none">
              {/* Outer contour connecting left gear, platen and right gear */}
              <path
                d="M 326,204 L 350,208 L 626,307 Q 690,332 676,355 L 614,339 L 338,240 Q 314,228 326,204 Z"
                fill="none"
                stroke={accentGreen}
                strokeWidth="5"
                opacity="0.35"
                filter="url(#repair-laser-glow)"
              />
              <path
                d="M 326,204 L 350,208 L 626,307 Q 690,332 676,355 L 614,339 L 338,240 Q 314,228 326,204 Z"
                fill="none"
                stroke={accentGreenBright}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="140 540"
                className="repair-laser-anim"
                filter="url(#repair-laser-glow)"
              />
              {/* White hot laser spark head */}
              <path
                d="M 326,204 L 350,208 L 626,307 Q 690,332 676,355 L 614,339 L 338,240 Q 314,228 326,204 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40 640"
                className="repair-laser-anim"
              />

              {/* Traveling Laser Sweep Beam that travels from left to right across the platen */}
              <g className="repair-scan-tier2">
                <line
                  x1="348"
                  y1="205"
                  x2="334"
                  y2="243"
                  stroke={accentGreenBright}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter="url(#repair-laser-glow)"
                />
                <line
                  x1="348"
                  y1="205"
                  x2="334"
                  y2="243"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                {/* Contact sparks */}
                <circle cx="348" cy="205" r="3.2" fill="#ffffff" filter="url(#repair-laser-glow)" />
                <circle cx="334" cy="243" r="3.2" fill="#ffffff" filter="url(#repair-laser-glow)" />
              </g>
            </g>
          )}
        </g>

        {/* ===================================================================
            TIER 03 (CENTER): POSITIONING & MESSAGING
            Upper Ribbon Hood, Twin Spools & "YOUR BUSINESS" Brass Plaque
            (Matches Component #18 in the 3rd reference image)
        =================================================================== */}
        <g
          transform={`translate(${tier3X.toFixed(1)}, ${tier3Y.toFixed(1)})`}
          onClick={() => onSelectUnit?.(2)}
          onMouseEnter={() => onSelectUnit?.(2)}
          className="pointer-events-auto cursor-pointer"
          style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
          opacity={nonProblemOpacity}
          filter={getUnitFilter(2)}
        >
          {/* Tailored non-overlapping hit surface for Tier 03 (Upper ribbon hood & plaque) */}
          <rect
            x="100"
            y="275"
            width="600"
            height="80"
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />

          {/* Extruded 3D Top Thickness of the Upper Hood */}
          <polygon
            points="296,246 610,360 624,350 310,236"
            fill={isLight ? "#4a4842" : "#343440"}
            stroke={isUnitActive(2) ? accentAmber : strokeBase}
            strokeWidth="1.2"
          />
          {/* Right Side Depth Wall of the Upper Hood */}
          <polygon
            points="610,360 624,350 624,412 610,422"
            fill="#101015"
            stroke={isUnitActive(2) ? accentAmber : strokeBase}
            strokeWidth="1.2"
          />
          {/* Front Isometric Face of the Upper Hood */}
          <polygon
            points="296,246 610,360 610,422 296,308"
            fill="url(#iso-chassis-grad)"
            stroke={isUnitActive(2) ? accentAmber : strokeBase}
            strokeWidth={isUnitActive(2) ? "2.4" : "1.4"}
          />

          {/* Bichrome Horizontal Ribbon Stripe across the Hood */}
          <line
            x1="332"
            y1="286"
            x2="574"
            y2="374"
            stroke="#e89b3c"
            strokeWidth="1.6"
            opacity="0.75"
          />

          {/* Left Spoked Ribbon Spool (#03-A: Value Proposition) */}
          <g transform="translate(324, 282) skewY(20)">
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="#0d0d11"
              stroke={isUnitActive(2) ? accentAmber : "#c8c2b4"}
              strokeWidth="1.6"
            />
            <line x1="-13" y1="0" x2="13" y2="0" stroke="#c8c2b4" strokeWidth="1.5" />
            <line x1="0" y1="-13" x2="0" y2="13" stroke="#c8c2b4" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4.5" fill="#e89b3c" />
          </g>

          {/* Center Winged Emblem & Riveted "YOUR BUSINESS" Brass Plaque (#03-C: Brand Story) */}
          <g transform="translate(452, 332) skewY(20)">
            {/* Winged crest above plaque */}
            <path
              d="M -36 -20 L 36 -20 L 24 -6 L -24 -6 Z"
              fill="#121217"
              stroke={isUnitActive(2) ? accentAmber : "#7e7a70"}
              strokeWidth="1"
            />
            <line x1="-22" y1="-15" x2="22" y2="-15" stroke="#e89b3c" strokeWidth="1.2" />
            <line x1="-16" y1="-11" x2="16" y2="-11" stroke="#e89b3c" strokeWidth="1" />

            {/* Riveted Brass Nameplate */}
            <rect
              x="-70"
              y="-2"
              width="140"
              height="24"
              rx="3"
              fill="#191610"
              stroke="#e89b3c"
              strokeWidth={isUnitActive(2) ? "2" : "1.3"}
            />
            <circle cx="-61" cy="10" r="2" fill="#e89b3c" />
            <circle cx="61" cy="10" r="2" fill="#e89b3c" />
            <text
              x="0"
              y="14.5"
              textAnchor="middle"
              fill="#f3b15c"
              fontSize="11.5"
              fontWeight="800"
              letterSpacing="2.2"
              fontFamily="monospace"
            >
              YOUR BUSINESS
            </text>
          </g>

          {/* Right Spoked Ribbon Spool (#03-B: Landing Page Copy) */}
          <g transform="translate(580, 375) skewY(20)">
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="#0d0d11"
              stroke={isUnitActive(2) ? accentAmber : "#c8c2b4"}
              strokeWidth="1.6"
            />
            <line x1="-13" y1="0" x2="13" y2="0" stroke="#c8c2b4" strokeWidth="1.5" />
            <line x1="0" y1="-13" x2="0" y2="13" stroke="#c8c2b4" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4.5" fill="#e89b3c" />
          </g>

          {/* Sub-part callout pills for Positioning (Value Prop & Landing Page Copy) */}
          <g opacity={p}>
            <line
              x1="296"
              y1="274"
              x2="255"
              y2="254"
              stroke={isUnitActive(2) ? accentAmber : strokeFine}
              strokeWidth="1.2"
            />
            <rect
              x="90"
              y="240"
              width="165"
              height="28"
              rx="6"
              fill={
                isUnitActive(2)
                  ? isLight
                    ? "rgba(194,106,27,0.18)"
                    : "rgba(232,155,60,0.22)"
                  : isLight
                  ? "#ffffff"
                  : "rgba(16,16,21,0.85)"
              }
              stroke={isUnitActive(2) ? accentAmber : isLight ? "#c5bdb0" : strokeFine}
              strokeWidth="1.2"
            />
            <text
              x="172.5"
              y="257.5"
              textAnchor="middle"
              fill={
                isUnitActive(2)
                  ? isLight
                    ? "#9a5214"
                    : "#f4f0ea"
                  : isLight
                  ? "#1a1917"
                  : "#9e9a90"
              }
              className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
            >
              Value Proposition
            </text>
          </g>
        </g>

        {/* ===================================================================
            TIER 04 (LOWER-MIDDLE): PRODUCT & DEVELOPMENT (CRITICAL PROBLEM AREA -> RED)
            Internal Microprocessor PCB, Arched Flex Ribbon Bus, Inner Frame &
            Exploded Right Stepper Motor (Matches #11, #12, #19 in 3rd image)
        =================================================================== */}
        <g
          transform={`translate(${tier4X.toFixed(1)}, ${tier4Y.toFixed(1)})`}
          onClick={() => onSelectUnit?.(3)}
          onMouseEnter={() => onSelectUnit?.(3)}
          className="pointer-events-auto cursor-pointer"
          style={{ cursor: "pointer", pointerEvents: "auto" }}
          filter={getUnitFilter(3)}
        >
          {/* Tailored non-overlapping hit surface for Tier 04 (Logic PCB & stepper motor) */}
          <rect
            x="220"
            y="360"
            width="620"
            height="90"
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />

          {/* Machined Cast-Aluminium Inner Structural Sub-Frame */}
          <polygon
            points="286,320 594,432 638,402 330,290"
            fill="url(#iso-steel-grad)"
            stroke={tier4Stroke}
            strokeWidth={isFixMode || isUnitActive(3) ? "2" : "1.2"}
          />
          <polygon
            points="286,320 594,432 594,454 286,342"
            fill={isLight ? "#b4ac9c" : "#222229"}
            stroke={tier4Stroke}
            strokeWidth="1.2"
          />

          {/* Upright Isometric Microprocessor Circuit Board (PCB #19 in reference image) */}
          <g>
            <polygon
              points="324,264 584,358 584,398 324,304"
              fill="#141816"
              stroke={tier4Stroke}
              strokeWidth={isFixMode || isUnitActive(3) ? "2.2" : "1.3"}
            />
            <polygon
              points="324,264 584,358 584,398 324,304"
              fill="url(#iso-pcb-pattern)"
            />
            {/* Three Square Silicon IC Microprocessor Chips on the PCB */}
            {[
              [348, 282],
              [392, 298],
              [506, 340],
            ].map(([cx, cy], idx) => (
              <g key={idx} transform={`translate(${cx}, ${cy}) skewY(20)`}>
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="20"
                  rx="2"
                  fill="#0b0b0e"
                  stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : "#9e9a90")}
                  strokeWidth="1.1"
                />
                {/* IC pins */}
                <line
                  x1="4"
                  y1="-3"
                  x2="20"
                  y2="-3"
                  stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : "#e89b3c")}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <line
                  x1="4"
                  y1="23"
                  x2="20"
                  y2="23"
                  stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : "#e89b3c")}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </g>
            ))}

            {/* Arched Multi-Pin Flex Ribbon Bus Cable (Center of PCB, matching reference image #19) */}
            <path
              d="M 438 308 C 442 282, 466 288, 466 318 L 456 364 L 428 354 Z"
              fill={isLight ? "#d8d0c0" : "#8e8a80"}
              stroke={tier4Stroke}
              strokeWidth="1.2"
            />
            <path
              d="M 443 310 L 434 352 M 449 312 L 440 355 M 455 314 L 446 358"
              stroke="#18181f"
              strokeWidth="0.7"
              opacity="0.55"
            />
          </g>

          {/* Smaller Part #04-B (Exploded Right Cylindrical Stepper Drive Motor & Gearbox — #11 & #12 in 3rd image!) */}
          <g transform={`translate(${(78 * p).toFixed(1)}, ${(28 * p).toFixed(1)})`}>
            {/* Dashed explosion guide line from chassis to motor */}
            <line
              x1={610 - 78 * p}
              y1={405 - 28 * p}
              x2="635"
              y2="414"
              stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : strokeFine)}
              strokeWidth="1.3"
              strokeDasharray="3 3"
              opacity={p}
            />
            {/* Cylindrical Motor Body */}
            <polygon
              points="642,395 706,418 694,452 630,429"
              fill="url(#iso-steel-grad)"
              stroke={tier4Stroke}
              strokeWidth={isFixMode || isUnitActive(3) ? "2.2" : "1.3"}
            />
            <ellipse
              cx="636"
              cy="412"
              rx="10"
              ry="18"
              transform="rotate(20 636 412)"
              fill="#26262e"
              stroke={tier4Stroke}
              strokeWidth="1.2"
            />
            <ellipse
              cx="700"
              cy="435"
              rx="10"
              ry="18"
              transform="rotate(20 700 435)"
              fill="#141419"
              stroke={tier4Stroke}
              strokeWidth="1.4"
            />
            {/* Motor Rotor Shaft + Outer Gearbox Bracket (#12) */}
            <line
              x1="700"
              y1="435"
              x2="734"
              y2="447"
              stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : "#e89b3c")}
              strokeWidth="3.5"
            />
            <polygon
              points="734,424 768,436 768,474 734,462"
              fill="url(#iso-chassis-grad)"
              stroke={tier4Stroke}
              strokeWidth="1.2"
            />

            {/* Sub-part callout pills: Speed & Latency + Core Architecture */}
            <g opacity={p}>
              <line
                x1="675"
                y1="406"
                x2="690"
                y2="386"
                stroke={tier4Stroke}
                strokeWidth="1.2"
              />
              <rect
                x="680"
                y="372"
                width={isFixMode ? 260 : 250}
                height="28"
                rx="6"
                fill={isLight ? "#ffffff" : "rgba(16,16,21,0.92)"}
                stroke={tier4Stroke}
                strokeWidth={isFixMode || isUnitActive(3) ? "1.6" : "1.2"}
              />
              <text
                x={isFixMode ? 810 : 805}
                y="389.5"
                textAnchor="middle"
                fill={
                  isFixMode
                    ? accentGreen
                    : isUnitActive(3)
                    ? accentRed
                    : isLight
                    ? "#1a1917"
                    : "#9e9a90"
                }
                className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                {isFixMode ? "Speed & Latency (Optimizing)" : "Speed & Latency (Friction)"}
              </text>
            </g>
          </g>

          {/* ===================================================================
              TRAVELING GREEN REPAIR LASER OUTLINE OVERLAY (STEP 2: FIX)
              Sweeps continuously along the PCB logic board and drive frame perimeter
          =================================================================== */}
          {fixP > 0.05 && laserOpacity > 0.01 && (
            <g opacity={laserOpacity} className="pointer-events-none">
              {/* Outer contour loop around PCB & Stepper Motor */}
              <path
                d="M 324,264 L 584,358 L 642,398 Q 664,425 640,455 L 594,454 L 286,342 L 286,320 L 324,264 Z"
                fill="none"
                stroke={accentGreen}
                strokeWidth="5"
                opacity="0.35"
                filter="url(#repair-laser-glow)"
              />
              <path
                d="M 324,264 L 584,358 L 642,398 Q 664,425 640,455 L 594,454 L 286,342 L 286,320 L 324,264 Z"
                fill="none"
                stroke={accentGreenBright}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="160 620"
                className="repair-laser-anim"
                filter="url(#repair-laser-glow)"
              />
              {/* White hot laser spark head */}
              <path
                d="M 324,264 L 584,358 L 642,398 Q 664,425 640,455 L 594,454 L 286,342 L 286,320 L 324,264 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="45 735"
                className="repair-laser-anim"
              />

              {/* Inner PCB board traveling outline */}
              <polygon
                points="324,264 584,358 584,398 324,304"
                fill="none"
                stroke={accentGreen}
                strokeWidth="1.8"
                strokeDasharray="80 320"
                className="repair-laser-anim"
                filter="url(#repair-laser-glow)"
              />

              {/* Traveling Laser Sweep Beam across the PCB */}
              <g className="repair-scan-tier4">
                <line
                  x1="324"
                  y1="264"
                  x2="324"
                  y2="304"
                  stroke={accentGreenBright}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter="url(#repair-laser-glow)"
                />
                <line
                  x1="324"
                  y1="264"
                  x2="324"
                  y2="304"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <circle cx="324" cy="264" r="3.2" fill="#ffffff" filter="url(#repair-laser-glow)" />
                <circle cx="324" cy="304" r="3.2" fill="#ffffff" filter="url(#repair-laser-glow)" />
              </g>
            </g>
          )}
        </g>

        {/* ===================================================================
            TIER 05 (FRONT-BOTTOM-LEFT): ONBOARDING & RETENTION
            Front Sloped Terminal Screen Bezel ("TTY://SPEND.LOG"),
            SHIFT / ENTER Keys & Spacebar (Matches Component #22 in 3rd image)
        =================================================================== */}
        <g
          transform={`translate(${tier5X.toFixed(1)}, ${tier5Y.toFixed(1)})`}
          onClick={() => onSelectUnit?.(4)}
          onMouseEnter={() => onSelectUnit?.(4)}
          className="pointer-events-auto cursor-pointer"
          style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
          opacity={nonProblemOpacity}
          filter={
            isUnitActive(4)
              ? "url(#unit-diagnostic-glow)"
              : "url(#iso-part-shadow)"
          }
        >
          {/* Tailored non-overlapping hit surface for Tier 05 (Front console & keys) */}
          <rect
            x="60"
            y="455"
            width="520"
            height="135"
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
          />

          {/* 3D Extruded Top Thickness of Front Bezel */}
          <polygon
            points="232,295 562,415 574,406 244,286"
            fill={isLight ? "#4a4842" : "#32323d"}
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth="1.2"
          />
          {/* 3D Right Depth Wall of Front Bezel */}
          <polygon
            points="562,415 574,406 566,508 554,518"
            fill="#0d0d12"
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth="1.2"
          />
          {/* Front Sloped Isometric Face of the Terminal Bezel */}
          <polygon
            points="232,295 562,415 554,518 224,398"
            rx="12"
            fill="url(#iso-chassis-grad)"
            stroke={isUnitActive(4) ? accentAmber : strokeBase}
            strokeWidth={isUnitActive(4) ? "2.4" : "1.5"}
          />

          {/* Recessed Dark Terminal Screen ("TTY://SPEND.LOG") */}
          <polygon
            points="248,314 542,421 536,482 242,375"
            fill="#07070a"
            stroke={isUnitActive(4) ? accentAmber : "rgba(244,240,234,0.18)"}
            strokeWidth="1.2"
          />

          {/* Terminal Header Dots & Text inside Isometric Screen */}
          <g transform="translate(256, 326) skewY(20)">
            <circle cx="4" cy="4" r="2.5" fill="#5c5954" />
            <circle cx="12" cy="4" r="2.5" fill="#5c5954" />
            <circle cx="20" cy="4" r="2.5" fill={isUnitActive(4) ? accentAmber : "#9e9a90"} />
            <text
              x="138"
              y="7.5"
              textAnchor="middle"
              fill={isLight ? "#a19d94" : "#8e8a80"}
              fontSize="9.5"
              fontFamily="monospace"
              letterSpacing="1.5"
            >
              TTY://SPEND.LOG
            </text>
            <text
              x="268"
              y="7.5"
              textAnchor="end"
              fill={accentAmber}
              fontSize="9.5"
              fontFamily="monospace"
              letterSpacing="1.2"
            >
              SCAN
            </text>

            <line
              x1="0"
              y1="14"
              x2="274"
              y2="14"
              stroke="rgba(244,240,234,0.14)"
              strokeWidth="0.8"
            />

            <text
              x="4"
              y="29"
              fill={isLight ? "#b4b0a8" : "#a09c94"}
              fontSize="10.5"
              fontFamily="monospace"
            >
              &gt; {PRODUCT_UNITS[activeUnitIndex]?.id ?? "business"}.sys audit
            </text>
            <text
              x="4"
              y="43"
              fill={getUnitAccent(activeUnitIndex)}
              fontSize="10.5"
              fontWeight="700"
              fontFamily="monospace"
            >
              ▸ {PRODUCT_UNITS[activeUnitIndex]?.partTitle}
            </text>
          </g>

          {/* Left Round Chrome-Ringed "SHIFT" Key (#05-A: First-Run UX) */}
          <g transform="translate(248, 392) skewY(20)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#141419"
              stroke={isUnitActive(4) ? accentAmber : "#c8c2b4"}
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fill="#f4f0ea"
              fontSize="8"
              fontWeight="800"
              fontFamily="monospace"
            >
              SHIFT
            </text>
          </g>

          {/* Center Bakelite Spacebar (#05-B: User Activation) */}
          <polygon
            points="286,403 496,479 493,491 283,415"
            fill="#141419"
            stroke={isUnitActive(4) ? accentAmber : "#8e8a80"}
            strokeWidth="1.3"
          />

          {/* Right Round Chrome-Ringed "ENTER" Key */}
          <g transform="translate(528, 494) skewY(20)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#141419"
              stroke={isUnitActive(4) ? accentAmber : "#c8c2b4"}
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fill="#f4f0ea"
              fontSize="8"
              fontWeight="800"
              fontFamily="monospace"
            >
              ENTER
            </text>
          </g>

          {/* Sub-part callout: First-Run UX */}
          <g opacity={p}>
            <line
              x1="226"
              y1="365"
              x2="178"
              y2="385"
              stroke={isUnitActive(4) ? accentAmber : strokeFine}
              strokeWidth="1.2"
            />
            <rect
              x="55"
              y="372"
              width="135"
              height="26"
              rx="5"
              fill={
                isUnitActive(4)
                  ? isLight
                    ? "rgba(194,106,27,0.18)"
                    : "rgba(232,155,60,0.22)"
                  : isLight
                  ? "#ffffff"
                  : "rgba(16,16,21,0.85)"
              }
              stroke={isUnitActive(4) ? accentAmber : isLight ? "#c5bdb0" : strokeFine}
              strokeWidth="1.2"
            />
            <text
              x="122.5"
              y="388.5"
              textAnchor="middle"
              fill={
                isUnitActive(4)
                  ? isLight
                    ? "#9a5214"
                    : "#f4f0ea"
                  : isLight
                  ? "#1a1917"
                  : "#9e9a90"
              }
              className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.12em]"
            >
              First-Run UX
            </text>
          </g>
        </g>

        {/* ===================================================================
            TOP-LEVEL INTERACTIVE BADGES & NUMBER PINS (Rendered on top of all 3D layers)
            Guarantees 100% clickability and hoverability for Units 01, 02, 03, 04, and 05
            Units 02 (Marketing) and 04 (Product & Dev) highlighted in RED as problem areas
        =================================================================== */}
        <g
          id="cad-top-interactive-badges"
          className="pointer-events-auto"
          style={{
            opacity: labelOpacity,
            pointerEvents: labelOpacity < 0.1 ? "none" : "auto",
            transition: "opacity 0.15s ease",
          }}
        >
          {/* BADGE 01: MONETIZATION & PRICING */}
          <g
            transform={`translate(${tier1X.toFixed(1)}, ${tier1Y.toFixed(1)})`}
            onClick={() => onSelectUnit?.(0)}
            onMouseEnter={() => onSelectUnit?.(0)}
            className="cursor-pointer group"
            style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
            opacity={nonProblemOpacity}
            role="button"
            aria-label="Inspect 01 Monetization & Pricing"
          >
            {/* Number Pin 1 (Patent style) */}
            <circle
              cx="546"
              cy="142"
              r="14"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(0) ? "2" : "1.5"}
            />
            <text
              x="546"
              y="146.5"
              textAnchor="middle"
              fill={isUnitActive(0) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-black"
            >
              1
            </text>
            <line
              x1="560"
              y1="138"
              x2="600"
              y2="98"
              stroke={isUnitActive(0) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(0) ? "2" : "1.2"}
            />
            <rect
              x="590"
              y="80"
              width="280"
              height="36"
              rx="8"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(0) ? accentAmber : (isLight ? "#c5bdb0" : "rgba(255,255,255,0.2)")}
              strokeWidth={isUnitActive(0) ? "2" : "1.4"}
              filter="url(#iso-part-shadow)"
            />
            <text
              x="730"
              y="102.5"
              textAnchor="middle"
              fill={isUnitActive(0) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-bold uppercase tracking-[0.11em]"
            >
              01 · MONETIZATION &amp; PRICING
            </text>
          </g>

          {/* BADGE 02: MARKETING & ACQUISITION (DIAGNOSTIC RED ONLY WHEN ACTIVE -> GREEN IN FIX MODE) */}
          <g
            transform={`translate(${tier2X.toFixed(1)}, ${tier2Y.toFixed(1)})`}
            onClick={() => onSelectUnit?.(1)}
            onMouseEnter={() => onSelectUnit?.(1)}
            className="cursor-pointer group"
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Inspect 02 Marketing & Growth"
          >
            {/* Number Pin 2 - Active ring during active scan or pulsing green during Fix mode */}
            {(isUnitActive(1) || isFixMode) && (
              <circle
                cx="480"
                cy="252"
                r={isFixMode ? 19 : 18}
                fill="none"
                stroke={isFixMode ? accentGreen : accentRed}
                strokeWidth={isFixMode ? "1.8" : "1.2"}
                strokeDasharray={isFixMode ? "4 3" : "3 3"}
                opacity={isFixMode ? 0.95 : 0.8}
                filter={isFixMode ? "url(#repair-laser-glow)" : undefined}
              />
            )}
            <circle
              cx="480"
              cy="252"
              r="14"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeBase)}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.5"}
            />
            <text
              x="480"
              y="256.5"
              textAnchor="middle"
              fill={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : (isLight ? "#181715" : "#f4f0ea"))}
              className="font-mono-label text-[12px] font-black"
            >
              2
            </text>
            <line
              x1="494"
              y1="245"
              x2={isFixMode ? 515 : 525}
              y2={198}
              stroke={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : strokeBase)}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.2"}
            />
            <rect
              x={isFixMode ? 456 : 490}
              y="162"
              width={isFixMode ? 348 : 284}
              height="36"
              rx="8"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : (isLight ? "#c5bdb0" : "rgba(255,255,255,0.2)"))}
              strokeWidth={isFixMode || isUnitActive(1) ? "2" : "1.4"}
              filter="url(#iso-part-shadow)"
            />
            <text
              x={isFixMode ? 630 : 632}
              y="184.5"
              textAnchor="middle"
              fill={isFixMode ? accentGreen : (isUnitActive(1) ? accentRed : (isLight ? "#181715" : "#f4f0ea"))}
              className={`font-mono-label font-bold uppercase ${
                isFixMode
                  ? "text-[11px] tracking-[0.05em]"
                  : "text-[12px] tracking-[0.11em]"
              }`}
            >
              {isLaunchMode
                ? "02 · MARKETING & GROWTH (SCALING)"
                : isTestMode
                ? "02 · MARKETING & GROWTH (TESTED)"
                : isFixMode
                ? "02 · MARKETING & GROWTH (OPTIMIZING)"
                : "02 · MARKETING & GROWTH"}
            </text>
          </g>

          {/* BADGE 03: POSITIONING & MESSAGING */}
          <g
            transform={`translate(${tier3X.toFixed(1)}, ${tier3Y.toFixed(1)})`}
            onClick={() => onSelectUnit?.(2)}
            onMouseEnter={() => onSelectUnit?.(2)}
            className="cursor-pointer group"
            style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
            opacity={nonProblemOpacity}
            role="button"
            aria-label="Inspect 03 Positioning & Messaging"
          >
            {/* Number Pin 3 (Patent style) */}
            <circle
              cx="312"
              cy="302"
              r="14"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(2) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(2) ? "2" : "1.5"}
            />
            <text
              x="312"
              y="306.5"
              textAnchor="middle"
              fill={isUnitActive(2) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-black"
            >
              3
            </text>
            <line
              x1="298"
              y1="302"
              x2="255"
              y2="302"
              stroke={isUnitActive(2) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(2) ? "2" : "1.2"}
            />
            <rect
              x="35"
              y="284"
              width="250"
              height="36"
              rx="8"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(2) ? accentAmber : (isLight ? "#c5bdb0" : "rgba(255,255,255,0.2)")}
              strokeWidth={isUnitActive(2) ? "2" : "1.4"}
              filter="url(#iso-part-shadow)"
            />
            <text
              x="160"
              y="306.5"
              textAnchor="middle"
              fill={isUnitActive(2) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-bold uppercase tracking-[0.11em]"
            >
              03 · POSITIONING &amp; COPY
            </text>
          </g>

          {/* BADGE 04: PRODUCT & DEVELOPMENT (DIAGNOSTIC RED ONLY WHEN ACTIVE -> GREEN IN FIX MODE) */}
          <g
            transform={`translate(${tier4X.toFixed(1)}, ${tier4Y.toFixed(1)})`}
            onClick={() => onSelectUnit?.(3)}
            onMouseEnter={() => onSelectUnit?.(3)}
            className="cursor-pointer group"
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Inspect 04 Product & Dev"
          >
            {/* Number Pin 4 - Active ring during active scan or pulsing green during Fix mode */}
            {(isUnitActive(3) || isFixMode) && (
              <circle
                cx="740"
                cy="468"
                r={isFixMode ? 19 : 18}
                fill="none"
                stroke={isFixMode ? accentGreen : accentRed}
                strokeWidth={isFixMode ? "1.8" : "1.2"}
                strokeDasharray={isFixMode ? "4 3" : "3 3"}
                opacity={isFixMode ? 0.95 : 0.8}
                filter={isFixMode ? "url(#repair-laser-glow)" : undefined}
              />
            )}
            <circle
              cx="740"
              cy="468"
              r="14"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : strokeBase)}
              strokeWidth={isFixMode || isUnitActive(3) ? "2" : "1.5"}
            />
            <text
              x="740"
              y="472.5"
              textAnchor="middle"
              fill={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : (isLight ? "#181715" : "#f4f0ea"))}
              className="font-mono-label text-[12px] font-black"
            >
              4
            </text>
            <line
              x1="752"
              y1="474"
              x2={isFixMode ? 765 : 785}
              y2={490}
              stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : strokeBase)}
              strokeWidth={isFixMode || isUnitActive(3) ? "2" : "1.2"}
            />
            <rect
              x={isFixMode ? 616 : 660}
              y="490"
              width={isFixMode ? 348 : 264}
              height="36"
              rx="8"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : (isLight ? "#c5bdb0" : "rgba(255,255,255,0.2)"))}
              strokeWidth={isFixMode || isUnitActive(3) ? "2" : "1.4"}
              filter="url(#iso-part-shadow)"
            />
            <text
              x={isFixMode ? 790 : 792}
              y="512.5"
              textAnchor="middle"
              fill={isFixMode ? accentGreen : (isUnitActive(3) ? accentRed : (isLight ? "#181715" : "#f4f0ea"))}
              className={`font-mono-label font-bold uppercase ${
                isFixMode
                  ? "text-[11px] tracking-[0.05em]"
                  : "text-[12px] tracking-[0.11em]"
              }`}
            >
              {isLaunchMode
                ? "04 · PRODUCT & DEV (SHIPPED)"
                : isTestMode
                ? "04 · PRODUCT & DEV (VERIFIED)"
                : isFixMode
                ? "04 · PRODUCT & DEV (ADDING FEATURES)"
                : "04 · PRODUCT & DEV"}
            </text>
          </g>

          {/* BADGE 05: ONBOARDING & RETENTION */}
          <g
            transform={`translate(${tier5X.toFixed(1)}, ${tier5Y.toFixed(1)})`}
            onClick={() => onSelectUnit?.(4)}
            onMouseEnter={() => onSelectUnit?.(4)}
            className="cursor-pointer group"
            style={{ cursor: "pointer", pointerEvents: nonProblemOpacity < 0.1 ? "none" : "auto" }}
            opacity={nonProblemOpacity}
            role="button"
            aria-label="Inspect 05 Onboarding & Retention"
          >
            {/* Number Pin 5 (Patent style) */}
            <circle
              cx="345"
              cy="442"
              r="14"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(4) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(4) ? "2" : "1.5"}
            />
            <text
              x="345"
              y="446.5"
              textAnchor="middle"
              fill={isUnitActive(4) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-black"
            >
              5
            </text>
            <line
              x1="333"
              y1="448"
              x2="285"
              y2="480"
              stroke={isUnitActive(4) ? accentAmber : strokeBase}
              strokeWidth={isUnitActive(4) ? "2" : "1.2"}
            />
            <rect
              x="75"
              y="468"
              width="284"
              height="36"
              rx="8"
              fill={isLight ? "#ffffff" : "#121217"}
              stroke={isUnitActive(4) ? accentAmber : (isLight ? "#c5bdb0" : "rgba(255,255,255,0.2)")}
              strokeWidth={isUnitActive(4) ? "2" : "1.4"}
              filter="url(#iso-part-shadow)"
            />
            <text
              x="217"
              y="490.5"
              textAnchor="middle"
              fill={isUnitActive(4) ? accentAmber : (isLight ? "#181715" : "#f4f0ea")}
              className="font-mono-label text-[12px] font-bold uppercase tracking-[0.11em]"
            >
              05 · ONBOARDING &amp; RETENTION
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
