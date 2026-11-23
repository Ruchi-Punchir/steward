import React from "react";

/**
 * Classic Vintage Green US $1 Federal Reserve Note — Old, Creased, Torn & Chewed by the Typewriter
 */
export function DollarBillGraphic({ idPrefix }: { idPrefix: string }) {
  return (
    <svg
      viewBox="0 0 320 165"
      className="h-full w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
      role="img"
      aria-label="Old, creased, and torn classic green 1 US Dollar bill"
    >
      <defs>
        {/* Aged cotton-linen greenback paper gradient */}
        <linearGradient
          id={`${idPrefix}-paper`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#d9e5cc" />
          <stop offset="28%" stopColor="#c3d4b4" />
          <stop offset="48%" stopColor="#adc29d" />
          <stop offset="53%" stopColor="#cfdec0" />
          <stop offset="78%" stopColor="#b9cca9" />
          <stop offset="100%" stopColor="#a7bc96" />
        </linearGradient>

        {/* Deep vintage paper stain / age vignette */}
        <radialGradient id={`${idPrefix}-age`} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#d4c598" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#8c7d56" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3d3522" stopOpacity="0.42" />
        </radialGradient>

        {/* Fine intaglio green guilloche crosshatch pattern */}
        <pattern
          id={`${idPrefix}-guilloche`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
            stroke="#1e462c"
            strokeWidth="0.55"
            opacity="0.42"
          />
        </pattern>

        {/* Jagged torn paper outer silhouette (top-right rip, left roller bite, top-left nick) */}
        <clipPath id={`${idPrefix}-torn-clip`}>
          <path
            d="
              M 0 4
              L 42 0
              L 46 8
              L 51 2
              L 55 11
              L 61 0
              L 208 0
              L 215 16
              L 221 7
              L 228 24
              L 235 4
              L 241 0
              L 314 0
              L 320 9
              L 320 64
              L 310 69
              L 318 74
              L 307 81
              L 320 86
              L 320 165
              L 0 165
              L 0 108
              L 11 103
              L 3 97
              L 14 91
              L 0 85
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Main Torn & Creased Bill Group */}
      <g clipPath={`url(#${idPrefix}-torn-clip)`}>
        {/* Aged cotton-linen greenback base paper */}
        <rect width="320" height="165" fill={`url(#${idPrefix}-paper)`} />
        <rect width="320" height="165" fill={`url(#${idPrefix}-age)`} />

        {/* Diagonal accordion fold shadow bands (gives 3D crumpled paper depth) */}
        <polygon
          points="32,0 64,0 180,165 148,165"
          fill="#152b1c"
          opacity="0.14"
        />
        <polygon
          points="212,0 240,0 138,165 110,165"
          fill="#152b1c"
          opacity="0.12"
        />
        <polygon
          points="0,68 320,82 320,98 0,84"
          fill="#152b1c"
          opacity="0.11"
        />

        {/* Outer ornate intaglio green frame */}
        <rect
          x="7"
          y="7"
          width="306"
          height="151"
          fill={`url(#${idPrefix}-guilloche)`}
          stroke="#1a3d27"
          strokeWidth="2.3"
        />
        <rect
          x="12"
          y="12"
          width="296"
          height="141"
          fill="#c4d5b6"
          fillOpacity="0.82"
          stroke="#214a30"
          strokeWidth="1.2"
        />
        <rect
          x="15"
          y="15"
          width="290"
          height="135"
          fill="none"
          stroke="#2b5c3c"
          strokeWidth="0.75"
          strokeDasharray="3 1.5"
        />

        {/* Typewriter Platen Gear-Tooth Skid Marks along Left & Right Margins */}
        <g fill="#1c241e" opacity="0.42">
          {[22, 32, 42, 52, 62, 72, 114, 124, 134].map((yPos) => (
            <rect
              key={`l-${yPos}`}
              x="3"
              y={yPos}
              width="5"
              height="2.2"
              rx="0.5"
            />
          ))}
          {[26, 36, 46, 56, 96, 106, 116, 126].map((yPos) => (
            <rect
              key={`r-${yPos}`}
              x="312"
              y={yPos}
              width="5"
              height="2.2"
              rx="0.5"
            />
          ))}
        </g>

        {/* Four Corner "1" Green Rosettes */}
        <g transform="translate(28, 28)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry="10"
            fill="none"
            stroke="#84a98c"
            strokeWidth="0.7"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(292, 28)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry="10"
            fill="none"
            stroke="#84a98c"
            strokeWidth="0.7"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(28, 136)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        <g transform="translate(292, 136)">
          <ellipse
            cx="0"
            cy="0"
            rx="15"
            ry="13"
            fill="#173823"
            stroke="#dfead5"
            strokeWidth="1"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#eff5e8"
            fontSize="18"
            fontWeight="900"
            fontFamily="serif"
          >
            1
          </text>
        </g>

        {/* Header Banner */}
        <text
          x="160"
          y="24"
          textAnchor="middle"
          fill="#1b3d28"
          fontSize="6.5"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="serif"
        >
          FEDERAL RESERVE NOTE
        </text>
        <text
          x="160"
          y="35"
          textAnchor="middle"
          fill="#11291a"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1.4"
          fontFamily="serif"
        >
          THE UNITED STATES OF AMERICA
        </text>

        {/* Left Federal Reserve Seal + Green Serial Number */}
        <g transform="translate(68, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="none"
            stroke="#1b3a26"
            strokeWidth="1.4"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#1b3a26"
            strokeWidth="0.8"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#16301f"
            fontSize="12"
            fontWeight="800"
            fontFamily="serif"
          >
            L
          </text>
        </g>
        <text
          x="46"
          y="54"
          fill="#156b38"
          fontSize="7.2"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="monospace"
        >
          L00000001A
        </text>

        {/* Right Emerald Green Treasury Seal + Green Serial Number */}
        <g transform="translate(252, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#19723d"
            fillOpacity="0.14"
            stroke="#19723d"
            strokeWidth="1.5"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#19723d"
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#145c31"
            fontSize="11"
            fontWeight="900"
            fontFamily="serif"
          >
            $1
          </text>
        </g>
        <text
          x="218"
          y="112"
          fill="#156b38"
          fontSize="7.2"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="monospace"
        >
          L00000001A
        </text>

        {/* Center Portrait Oval (George Washington Green Intaglio Engraving) */}
        <g transform="translate(160, 82)">
          <ellipse
            cx="0"
            cy="0"
            rx="34"
            ry="40"
            fill="#adc29e"
            stroke="#173823"
            strokeWidth="2.2"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="30"
            ry="36"
            fill={`url(#${idPrefix}-guilloche)`}
            stroke="#285438"
            strokeWidth="0.9"
          />
          <path
            d="M -21 32 C -18 15, -10 11, 0 11 C 10 11, 18 15, 21 32 Z"
            fill="#183824"
          />
          <path d="M -5 12 L 0 25 L 5 12 Z" fill="#d9e5cc" />
          <path
            d="M -11 -14 C -15 -12, -16 -4, -14 2 C -12 5, -9 7, -9 10 L 9 10 C 9 7, 12 5, 14 2 C 16 -4, 15 -12, 11 -14 C 8 -20, -8 -20, -11 -14 Z"
            fill="#d4e0c7"
            stroke="#183824"
            strokeWidth="1.2"
          />
          <ellipse
            cx="0"
            cy="-4"
            rx="9.5"
            ry="12"
            fill="#c3d4b4"
            stroke="#183824"
            strokeWidth="1.1"
          />
          <line
            x1="-5"
            y1="-6"
            x2="-2"
            y2="-6"
            stroke="#142e1d"
            strokeWidth="1.3"
          />
          <line
            x1="2"
            y1="-6"
            x2="5"
            y2="-6"
            stroke="#142e1d"
            strokeWidth="1.3"
          />
          <path
            d="M 0 -6 L -1 0 L 1 0"
            fill="none"
            stroke="#142e1d"
            strokeWidth="1.1"
          />
          <path
            d="M -4 4 Q 0 1.5 4 4"
            fill="none"
            stroke="#142e1d"
            strokeWidth="1.2"
          />
        </g>

        {/* High-Contrast Classic Green "ONE • 1 USD" Bottom Banner */}
        <rect
          x="92"
          y="122"
          width="136"
          height="24"
          rx="2"
          fill="#163622"
          stroke="#d9e5cc"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="139"
          textAnchor="middle"
          fill="#eff5e8"
          fontSize="16"
          fontWeight="900"
          letterSpacing="3"
          fontFamily="monospace"
        >
          ONE • 1 USD
        </text>

        {/* Malfunctioning Typewriter Ribbon Smudge & Misaligned Strike Marks */}
        <g transform="rotate(-4 195 62)" opacity="0.55">
          <text
            x="178"
            y="62"
            fill="#8f2419"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="1.5"
            fontFamily="monospace"
          >
            #ERR-FEED
          </text>
        </g>
        <circle cx="112" cy="44" r="5" fill="#1a1c19" opacity="0.18" />
        <circle cx="115" cy="47" r="3" fill="#1a1c19" opacity="0.22" />
        <circle cx="204" cy="108" r="6" fill="#5e4b2b" opacity="0.16" />

        {/* Deep Paper Creases, Fold Cracks & Internal Rip Fissures */}
        <path
          d="M 35 0 L 92 78 L 155 165"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.8"
          opacity="0.65"
        />
        <path
          d="M 37 0 L 94 78 L 157 165"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <path
          d="M 228 18 L 172 86 L 118 165"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path
          d="M 230 18 L 174 86 L 120 165"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M 0 74 L 160 85 L 320 79"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.6"
          opacity="0.58"
        />
        <path
          d="M 0 76 L 160 87 L 320 81"
          fill="none"
          stroke="#eef6e6"
          strokeWidth="1.1"
          opacity="0.65"
        />
        <path
          d="M 265 0 L 242 52 L 288 112"
          fill="none"
          stroke="#162e1e"
          strokeWidth="1.1"
          opacity="0.45"
        />
      </g>

      {/* Dark Frayed Paper Edge Outline around the Tears so the rips pop visually */}
      <path
        d="M 42 0 L 46 8 L 51 2 L 55 11 L 61 0 M 208 0 L 215 16 L 221 7 L 228 24 L 235 4 L 241 0 M 320 64 L 310 69 L 318 74 L 307 81 L 320 86 M 0 108 L 11 103 L 3 97 L 14 91 L 0 85"
        fill="none"
        stroke="#e8efe0"
        strokeWidth="1.4"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * Pristine, Brand-New, Crisp US $1 Federal Reserve Note
 * Produced after Steward fixes the leaks and tests the solution
 */
export function CrispDollarBillGraphic({ idPrefix }: { idPrefix: string }) {
  return (
    <svg
      viewBox="0 0 320 165"
      className="h-full w-full drop-shadow-[0_10px_22px_rgba(16,185,129,0.22)]"
      role="img"
      aria-label="Crisp, brand-new 1 US Dollar bill"
    >
      <defs>
        {/* Fresh, uncreased mint-cream cotton-linen paper gradient */}
        <linearGradient
          id={`${idPrefix}-crisp-paper`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f3fbf5" />
          <stop offset="45%" stopColor="#e4f5ea" />
          <stop offset="100%" stopColor="#d1ecd9" />
        </linearGradient>

        {/* Subtle emerald security sheen */}
        <radialGradient
          id={`${idPrefix}-crisp-sheen`}
          cx="50%"
          cy="50%"
          r="65%"
        >
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
          <stop offset="70%" stopColor="#059669" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.18" />
        </radialGradient>

        {/* Crisp emerald intaglio guilloche crosshatch pattern */}
        <pattern
          id={`${idPrefix}-crisp-guilloche`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 6 L 6 0 M -1 1 L 1 -1 M 5 7 L 7 5"
            stroke="#0d5c35"
            strokeWidth="0.6"
            opacity="0.45"
          />
          <path
            d="M 0 0 L 6 6 M -1 5 L 1 7 M 5 -1 L 7 1"
            stroke="#0d5c35"
            strokeWidth="0.45"
            opacity="0.28"
          />
        </pattern>
      </defs>

      {/* Razor-Sharp Intact Outer Bill Rectangle (No Tears or Rips) */}
      <g>
        <rect
          x="1"
          y="1"
          width="318"
          height="163"
          rx="3"
          fill={`url(#${idPrefix}-crisp-paper)`}
          stroke="#0f5132"
          strokeWidth="1.5"
        />
        <rect
          x="1"
          y="1"
          width="318"
          height="163"
          rx="3"
          fill={`url(#${idPrefix}-crisp-sheen)`}
        />

        {/* Outer ornate intaglio emerald frame */}
        <rect
          x="7"
          y="7"
          width="306"
          height="151"
          rx="2"
          fill={`url(#${idPrefix}-crisp-guilloche)`}
          stroke="#0d5430"
          strokeWidth="2.3"
        />
        <rect
          x="12"
          y="12"
          width="296"
          height="141"
          rx="1.5"
          fill="#e2f3e7"
          fillOpacity="0.92"
          stroke="#0f6338"
          strokeWidth="1.2"
        />
        <rect
          x="15"
          y="15"
          width="290"
          height="135"
          fill="none"
          stroke="#10b981"
          strokeWidth="0.85"
          strokeDasharray="3 1.5"
        />

        {/* Four Corner "1" Crisp Emerald Rosettes */}
        {[
          [28, 28],
          [292, 28],
          [28, 136],
          [292, 136],
        ].map(([cx, cy], idx) => (
          <g key={idx} transform={`translate(${cx}, ${cy})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="13"
              fill="#0b4627"
              stroke="#ecfdf5"
              strokeWidth="1.1"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="10"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.75"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="18"
              fontWeight="900"
              fontFamily="serif"
            >
              1
            </text>
          </g>
        ))}

        {/* Header Banner */}
        <text
          x="160"
          y="24"
          textAnchor="middle"
          fill="#0b4627"
          fontSize="6.5"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="serif"
        >
          FEDERAL RESERVE NOTE
        </text>
        <text
          x="160"
          y="35"
          textAnchor="middle"
          fill="#062e19"
          fontSize="9.5"
          fontWeight="900"
          letterSpacing="1.4"
          fontFamily="serif"
        >
          THE UNITED STATES OF AMERICA
        </text>

        {/* Left Federal Reserve Seal + Bright Emerald Serial Number */}
        <g transform="translate(68, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#059669"
            fillOpacity="0.08"
            stroke="#0b4627"
            strokeWidth="1.4"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#0b4627"
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#062e19"
            fontSize="12"
            fontWeight="800"
            fontFamily="serif"
          >
            S
          </text>
        </g>
        <text
          x="44"
          y="54"
          fill="#059669"
          fontSize="7.4"
          fontWeight="800"
          letterSpacing="0.9"
          fontFamily="monospace"
        >
          S88888888A
        </text>

        {/* Right Emerald Treasury Seal + Serial Number */}
        <g transform="translate(252, 78)">
          <circle
            cx="0"
            cy="0"
            r="17"
            fill="#10b981"
            fillOpacity="0.18"
            stroke="#059669"
            strokeWidth="1.6"
            strokeDasharray="2 1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="none"
            stroke="#059669"
            strokeWidth="1"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#047857"
            fontSize="11"
            fontWeight="900"
            fontFamily="serif"
          >
            $1
          </text>
        </g>
        <text
          x="216"
          y="112"
          fill="#059669"
          fontSize="7.4"
          fontWeight="800"
          letterSpacing="0.9"
          fontFamily="monospace"
        >
          S88888888A
        </text>

        {/* Center Portrait Oval (Crisp Engraving with Subtle Confident Smile) */}
        <g transform="translate(160, 82)">
          <ellipse
            cx="0"
            cy="0"
            rx="34"
            ry="40"
            fill="#c6e6d1"
            stroke="#0b4627"
            strokeWidth="2.2"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="30"
            ry="36"
            fill={`url(#${idPrefix}-crisp-guilloche)`}
            stroke="#059669"
            strokeWidth="0.9"
          />
          <path
            d="M -21 32 C -18 15, -10 11, 0 11 C 10 11, 18 15, 21 32 Z"
            fill="#0b4627"
          />
          <path d="M -5 12 L 0 25 L 5 12 Z" fill="#f3fbf5" />
          <path
            d="M -11 -14 C -15 -12, -16 -4, -14 2 C -12 5, -9 7, -9 10 L 9 10 C 9 7, 12 5, 14 2 C 16 -4, 15 -12, 11 -14 C 8 -20, -8 -20, -11 -14 Z"
            fill="#e6f6ec"
            stroke="#0b4627"
            strokeWidth="1.2"
          />
          <ellipse
            cx="0"
            cy="-4"
            rx="9.5"
            ry="12"
            fill="#d9f0e2"
            stroke="#0b4627"
            strokeWidth="1.1"
          />
          <line
            x1="-5"
            y1="-6"
            x2="-2"
            y2="-6"
            stroke="#062e19"
            strokeWidth="1.3"
          />
          <line
            x1="2"
            y1="-6"
            x2="5"
            y2="-6"
            stroke="#062e19"
            strokeWidth="1.3"
          />
          <path
            d="M 0 -6 L -1 0 L 1 0"
            fill="none"
            stroke="#062e19"
            strokeWidth="1.1"
          />
          {/* Subtle smile on the new verified bill */}
          <path
            d="M -4 2.2 Q 0 5.2 4 2.2"
            fill="none"
            stroke="#062e19"
            strokeWidth="1.25"
          />
        </g>

        {/* Crisp Emerald "ONE • 1 USD" Bottom Banner */}
        <rect
          x="92"
          y="122"
          width="136"
          height="24"
          rx="2"
          fill="#0b4627"
          stroke="#ecfdf5"
          strokeWidth="1.2"
        />
        <text
          x="160"
          y="139"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="900"
          letterSpacing="3"
          fontFamily="monospace"
        >
          ONE • 1 USD
        </text>

        {/* Clean Emerald Verification Stamp (contrasting with #ERR-FEED on Old Bill) */}
        <g transform="rotate(-3 200 58)">
          <rect
            x="175"
            y="49"
            width="54"
            height="12"
            rx="2"
            fill="#10b981"
            fillOpacity="0.16"
            stroke="#059669"
            strokeWidth="0.9"
          />
          <text
            x="202"
            y="57.5"
            textAnchor="middle"
            fill="#047857"
            fontSize="6.8"
            fontWeight="800"
            letterSpacing="1.2"
            fontFamily="monospace"
          >
            ✓ MINT-OK
          </text>
        </g>
      </g>
    </svg>
  );
}
