"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export interface SmokeSparksCanvasProps {
  /** Current power state: idle | surge20 | surge50 | surge100 | silence100 */
  powerState: "idle" | "surge20" | "surge50" | "surge100" | "silence100";
  /** Whether at least one bill has been printed (makes idle smoke slightly thicker) */
  thickerSmoke: boolean;
  /** Respect user reduced-motion preference */
  reducedMotion: boolean;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
  phase: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const CABLE_SPARK_SPOTS = [
  { x: 0.22, y: 0.36 },
  { x: 0.27, y: 0.50 },
  { x: 0.34, y: 0.58 },
  { x: 0.44, y: 0.25 },
  { x: 0.46, y: 0.36 },
  { x: 0.48, y: 0.43 },
  { x: 0.77, y: 0.36 },
  { x: 0.72, y: 0.52 },
  { x: 0.64, y: 0.58 },
];

export default function SmokeSparksCanvas({
  powerState,
  thickerSmoke,
  reducedMotion,
}: SmokeSparksCanvasProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ powerState, thickerSmoke, theme });

  useEffect(() => {
    stateRef.current = { powerState, thickerSmoke, theme };
  }, [powerState, thickerSmoke, theme]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let isMobile = window.innerWidth < 768;

    const smokeParticles: SmokeParticle[] = [];
    const sparkParticles: SparkParticle[] = [];

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const spawnSmoke = (extraPuff = false) => {
      const maxSmoke = isMobile ? 16 : 28;
      if (smokeParticles.length >= maxSmoke) return;

      const rect = canvas.getBoundingClientRect();
      const { thickerSmoke: isThicker, powerState: pState } = stateRef.current;
      const originX = rect.width * 0.5 + (Math.random() - 0.5) * 34;
      const originY = rect.height * 0.48 + (Math.random() - 0.5) * 8;

      const intensityMult =
        pState === "surge100" ? 1.65 : isThicker ? 1.35 : 1.0;

      smokeParticles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.45) * 0.28,
        vy: -(0.38 + Math.random() * 0.35) * (extraPuff ? 1.3 : 1),
        radius: (4 + Math.random() * 4) * intensityMult,
        maxRadius: (18 + Math.random() * 16) * intensityMult,
        alpha: (isThicker ? 0.2 : 0.13) * (extraPuff ? 1.25 : 1),
        life: 0,
        maxLife: isMobile ? 110 + Math.random() * 40 : 140 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const spawnSparkCluster = (
      normX: number,
      normY: number,
      count: number,
      color = "#f5b041"
    ) => {
      const maxSparks = isMobile ? 24 : 48;
      if (sparkParticles.length >= maxSparks) return;

      const rect = canvas.getBoundingClientRect();
      const px = rect.width * normX + (Math.random() - 0.5) * 10;
      const py = rect.height * normY + (Math.random() - 0.5) * 10;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.9 + Math.random() * 2.6;
        sparkParticles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          life: 0,
          maxLife: 14 + Math.random() * 16,
          color,
          size: 1.3 + Math.random() * 1.4,
        });
      }
    };

    let tick = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      tick++;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const {
        powerState: pState,
        thickerSmoke: isThicker,
        theme: currentTheme,
      } = stateRef.current;

      const smokeInterval =
        pState === "surge100"
          ? isMobile
            ? 8
            : 5
          : isThicker
            ? isMobile
              ? 18
              : 13
            : isMobile
              ? 26
              : 19;

      if (tick % smokeInterval === 0) {
        spawnSmoke(pState === "surge100");
      }

      if (pState === "idle" || pState === "silence100") {
        if (Math.random() < (isMobile ? 0.025 : 0.04)) {
          const spot =
            CABLE_SPARK_SPOTS[
              Math.floor(Math.random() * CABLE_SPARK_SPOTS.length)
            ];
          spawnSparkCluster(spot.x, spot.y, isMobile ? 2 : 3, "#e89b3c");
        }
      } else if (pState === "surge20") {
        if (tick % 4 === 0) {
          const spot = CABLE_SPARK_SPOTS[Math.floor(Math.random() * 3)];
          spawnSparkCluster(spot.x, spot.y, isMobile ? 3 : 5, "#8b7cf6");
        }
      } else if (pState === "surge50") {
        if (tick % 4 === 0) {
          const spot = CABLE_SPARK_SPOTS[3 + Math.floor(Math.random() * 3)];
          spawnSparkCluster(spot.x, spot.y, isMobile ? 3 : 5, "#4da8f0");
        }
      } else if (pState === "surge100") {
        if (tick % 2 === 0) {
          const spot = CABLE_SPARK_SPOTS[6 + Math.floor(Math.random() * 3)];
          spawnSparkCluster(
            spot.x,
            spot.y,
            isMobile ? 4 : 7,
            Math.random() > 0.35 ? "#e89b3c" : "#ff9f1a"
          );
          spawnSparkCluster(
            0.46 + Math.random() * 0.08,
            0.49 + Math.random() * 0.05,
            isMobile ? 2 : 4,
            "#e89b3c"
          );
        }
      }

      const isLight = currentTheme === "light";

      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          smokeParticles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        p.x += p.vx + Math.sin(progress * 5 + p.phase) * 0.22;
        p.y += p.vy;
        const currentRadius =
          p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.75);

        const fade =
          progress < 0.2
            ? progress / 0.2
            : 1 - (progress - 0.2) / 0.8;
        const currentAlpha = Math.max(0, p.alpha * fade);

        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentRadius
        );
        if (isLight) {
          grad.addColorStop(0, `rgba(90, 86, 78, ${currentAlpha * 1.15})`);
          grad.addColorStop(0.55, `rgba(120, 116, 108, ${currentAlpha * 0.55})`);
          grad.addColorStop(1, "rgba(120, 116, 108, 0)");
        } else {
          grad.addColorStop(0, `rgba(186, 184, 178, ${currentAlpha})`);
          grad.addColorStop(0.55, `rgba(138, 136, 132, ${currentAlpha * 0.45})`);
          grad.addColorStop(1, "rgba(100, 100, 98, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const s = sparkParticles[i];
        s.life++;
        if (s.life >= s.maxLife) {
          sparkParticles.splice(i, 1);
          continue;
        }

        const prevX = s.x;
        const prevY = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12;

        const alpha = 1 - s.life / s.maxLife;
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 800 540"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M400 265 C392 232, 412 204, 398 170 C386 142, 408 118, 402 92"
          fill="none"
          stroke="rgba(160,156,148,0.28)"
          strokeWidth={thickerSmoke ? "10" : "6"}
          strokeLinecap="round"
          strokeDasharray="2 8"
        />
      </svg>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
