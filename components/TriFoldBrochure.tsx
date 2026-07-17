"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

const INCH = 96; // CSS reference pixels per inch
const BASE_PANEL_WIDTH = 380 + 2 * INCH;
const BASE_BROCHURE_HEIGHT = 660 + 2 * INCH;
const VIEWPORT_PADDING = 24;

const WING_DURATION = 0.75;
const wingTransition = { duration: WING_DURATION, ease: [0.4, 0, 0.2, 1] as const };
const sizeEase = "cubic-bezier(0.4, 0, 0.2, 1)";

function subscribeToViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function useViewportSize() {
  const width = useSyncExternalStore(
    subscribeToViewport,
    () => window.innerWidth,
    () => 1280,
  );
  const height = useSyncExternalStore(
    subscribeToViewport,
    () => window.innerHeight,
    () => 800,
  );
  return { width, height };
}

/**
 * Stable panel size — does not change with open/close (avoids zoom quirk).
 * On narrow viewports, size for 3 panels so the open state fits without rescaling.
 * Until mount, use base sizes so SSR HTML matches the client's first paint.
 */
function useBrochureSize() {
  const mounted = useHasMounted();
  const { width, height } = useViewportSize();

  if (!mounted) {
    return {
      fit: 1,
      panelWidth: BASE_PANEL_WIDTH,
      brochureHeight: BASE_BROCHURE_HEIGHT,
    };
  }

  const availW = width - VIEWPORT_PADDING * 2;
  const availH = height - VIEWPORT_PADDING * 2;
  const openNeedsNarrowFit =
    width < BASE_PANEL_WIDTH * 3 + VIEWPORT_PADDING * 2;

  const fit = Math.min(
    1,
    availH / BASE_BROCHURE_HEIGHT,
    availW / (openNeedsNarrowFit ? BASE_PANEL_WIDTH * 3 : BASE_PANEL_WIDTH),
  );

  return {
    fit,
    panelWidth: BASE_PANEL_WIDTH * fit,
    brochureHeight: BASE_BROCHURE_HEIGHT * fit,
  };
}

const PAPER_STYLE = {
  backgroundImage:
    "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, transparent 40%), linear-gradient(to bottom, #faf6ee, #f0e6d3)",
} as const;

function useWingShadow(rotate: MotionValue<number>, side: "left" | "right") {
  const peaks =
    side === "left"
      ? ([
          ["-4px 8px 18px rgba(0,0,0,0.18)", 0],
          ["2px 12px 24px rgba(0,0,0,0.28)", 45],
          ["8px 6px 24px rgba(0,0,0,0.32)", 90],
          ["0px 2px 8px rgba(0,0,0,0.1)", 135],
          ["0px 0px 0px transparent", 180],
        ] as const)
      : ([
          ["6px 10px 22px rgba(0,0,0,0.22)", 0],
          ["-2px 16px 30px rgba(0,0,0,0.38)", -45],
          ["-14px 8px 36px rgba(0,0,0,0.48)", -90],
          ["-2px 16px 30px rgba(0,0,0,0.38)", -135],
          ["0px 2px 6px rgba(0,0,0,0.1)", -180],
        ] as const);

  return useTransform(
    rotate,
    peaks.map(([, angle]) => angle),
    peaks.map(([shadow]) => shadow),
  );
}

function Crease({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-0 h-full w-4 ${
        side === "left" ? "right-0" : "left-0"
      }`}
      style={{
        background:
          side === "left"
            ? "linear-gradient(to left, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)"
            : "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)",
      }}
    />
  );
}

/** Keeps panel art at desktop layout; scales only face content, not the fold. */
function FaceContent({ fit, children }: { fit: number; children: React.ReactNode }) {
  return (
    <div
      className="origin-top-left"
      style={{
        width: BASE_PANEL_WIDTH,
        height: BASE_BROCHURE_HEIGHT,
        transform: fit === 1 ? undefined : `scale(${fit})`,
      }}
    >
      {children}
    </div>
  );
}

function PanelFace({
  children,
  className = "",
  flip = false,
  fit,
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
  fit: number;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform-style:preserve-3d] ${className}`}
      style={{
        transform: flip ? "rotateY(180deg) translateZ(0.5px)" : "translateZ(0.5px)",
      }}
    >
      <div className="absolute inset-0" style={PAPER_STYLE} />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(139,100,60,0.08)]" />
      <FaceContent fit={fit}>{children}</FaceContent>
    </div>
  );
}

function BackCover() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center">
      <div className="mb-8 h-36 w-36 rounded-full border-2 border-amber-800/30 bg-amber-900/10 shadow-inner" />
      <p className="text-xs uppercase tracking-[0.4em] text-amber-800/70">
        Chai Coffee Lit
      </p>
      <h2 className="mt-3 font-sans text-6xl text-amber-950">Front Cover</h2>
      <p className="mt-6 max-w-[390px] text-lg leading-relaxed text-amber-900/70">
        42 Roastery Lane · Open daily 7am – 7pm
      </p>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-amber-800/50">
        Tap to open
      </p>
    </div>
  );
}

function LeftInside() {
  return (
    <div className="relative z-10 p-12">
      <h3 className="mb-6 font-sans text-4xl text-amber-950">Espresso</h3>
      <ul className="space-y-4 text-lg text-amber-900/80">
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Americano</span>
          <span>$3.50</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Cortado</span>
          <span>$4.00</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Flat White</span>
          <span>$4.50</span>
        </li>
      </ul>
    </div>
  );
}

function CenterPanel() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-800/60">
        Est. 2026
      </p>
      <h2 className="font-sans text-7xl text-amber-950">Our Menu</h2>
      <p className="mt-5 max-w-[420px] text-lg leading-relaxed text-amber-900/70">
        Single-origin pours, house chai, and pastries baked each morning.
      </p>
    </div>
  );
}

function RightInside() {
  return (
    <div className="relative z-10 p-12">
      <h3 className="mb-6 font-sans text-4xl text-amber-950">Chai &amp; Tea</h3>
      <ul className="space-y-4 text-lg text-amber-900/80">
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Masala Chai</span>
          <span>$4.50</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Cardamom Latte</span>
          <span>$5.00</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-3">
          <span>Matcha Oat</span>
          <span>$5.50</span>
        </li>
      </ul>
    </div>
  );
}

function RightFoldedFace() {
  return (
    <div className="relative z-10 flex h-full items-center justify-center">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-800/40">
        Inside fold
      </p>
    </div>
  );
}

export default function TriFoldBrochure() {
  const [isOpen, setIsOpen] = useState(false);
  const { fit, panelWidth, brochureHeight } = useBrochureSize();
  const layoutWidth = panelWidth * (isOpen ? 3 : 1);

  const leftRotate = useMotionValue(180);
  const rightRotate = useMotionValue(-180);

  const leftShadow = useWingShadow(leftRotate, "left");
  const rightShadow = useWingShadow(rightRotate, "right");

  useEffect(() => {
    const controls: ReturnType<typeof animate>[] = [];

    if (isOpen) {
      controls.push(
        animate(leftRotate, 0, wingTransition),
        animate(rightRotate, 0, { ...wingTransition, delay: WING_DURATION }),
      );
    } else {
      controls.push(
        animate(rightRotate, -180, wingTransition),
        animate(leftRotate, 180, { ...wingTransition, delay: WING_DURATION }),
      );
    }

    return () => controls.forEach((control) => control.stop());
  }, [isOpen, leftRotate, rightRotate]);

  const toggle = () => setIsOpen((open) => !open);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: layoutWidth,
        height: brochureHeight,
        transition: `width ${WING_DURATION}s ${sizeEase}`,
      }}
    >
      {/* 3D scene sits under a flat overlay — keep perspective off the hit-target ancestor */}
      <div
        className="pointer-events-none absolute inset-0 flex justify-center [perspective:2100px]"
        aria-hidden="true"
      >
        <div
          className="relative overflow-visible rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.28)] [transform-style:preserve-3d]"
          style={{
            width: panelWidth,
            height: brochureHeight,
          }}
        >
          {/* Center panel — pinned to container midpoint */}
          <div
            className="absolute top-0 z-[5] h-full overflow-hidden rounded-sm"
            style={{
              width: panelWidth,
              left: "50%",
              transform: `translateX(-${panelWidth / 2}px)`,
            }}
          >
            <PanelFace fit={fit} className="rounded-sm">
              <CenterPanel />
            </PanelFace>
            {isOpen && <Crease side="left" />}
            {isOpen && <Crease side="right" />}
          </div>

          {/* Right wing — folds onto center first; beneath left when closed */}
          <motion.div
            className="absolute top-0 z-[20] h-full origin-left [transform-style:preserve-3d]"
            style={{
              width: panelWidth,
              left: "50%",
              x: panelWidth / 2,
              rotateY: rightRotate,
              boxShadow: rightShadow,
            }}
          >
            <PanelFace fit={fit} className="rounded-sm">
              <RightInside />
            </PanelFace>
            <PanelFace fit={fit} flip className="rounded-sm">
              <RightFoldedFace />
            </PanelFace>
            {isOpen && <Crease side="left" />}
          </motion.div>

          {/* Left wing — folds on top when closed; back cover faces out */}
          <motion.div
            className="absolute top-0 z-[30] h-full origin-right [transform-style:preserve-3d]"
            style={{
              width: panelWidth,
              left: "50%",
              x: -(panelWidth * 1.5),
              rotateY: leftRotate,
              boxShadow: leftShadow,
            }}
          >
            <PanelFace fit={fit} className="rounded-sm">
              <LeftInside />
            </PanelFace>
            <PanelFace fit={fit} flip className="rounded-sm">
              <BackCover />
            </PanelFace>
            {isOpen && <Crease side="right" />}
          </motion.div>
        </div>
      </div>

      {/*
        Flat overlay sibling — outside perspective/preserve-3d so iOS hit-testing
        isn't competing with rotateY layers. Near-opaque fill required on WebKit.
      */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close brochure" : "Open brochure"}
        className="absolute inset-0 z-[100] touch-manipulation border-0 p-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.01)",
          WebkitTapHighlightColor: "transparent",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
