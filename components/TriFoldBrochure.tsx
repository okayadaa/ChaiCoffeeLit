"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useState } from "react";

const PANEL_WIDTH = 380;
const BROCHURE_HEIGHT = 660;
const BROCHURE_WIDTH = PANEL_WIDTH;

const WING_DURATION = 0.75;
const wingTransition = { duration: WING_DURATION, ease: [0.4, 0, 0.2, 1] as const };

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
      className={`pointer-events-none absolute top-0 h-full w-3 ${
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

function PanelFace({
  children,
  className = "",
  flip = false,
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden [-webkit-backface-visibility:hidden] [backface-visibility:hidden] ${className}`}
      style={flip ? { transform: "rotateY(180deg)" } : undefined}
    >
      <div className="absolute inset-0" style={PAPER_STYLE} />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(139,100,60,0.08)]" />
      {children}
    </div>
  );
}

function BackCover() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-6 h-24 w-24 rounded-full border-2 border-amber-800/30 bg-amber-900/10 shadow-inner" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-800/70">
        Chai Coffee Lit
      </p>
      <h2 className="mt-2 font-serif text-4xl text-amber-950">Front Cover</h2>
      <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-amber-900/70">
        42 Roastery Lane · Open daily 7am – 7pm
      </p>
      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-amber-800/50">
        Tap to open
      </p>
    </div>
  );
}

function LeftInside() {
  return (
    <div className="relative z-10 p-8">
      <h3 className="mb-4 font-serif text-2xl text-amber-950">Espresso</h3>
      <ul className="space-y-3 text-sm text-amber-900/80">
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
          <span>Americano</span>
          <span>$3.50</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
          <span>Cortado</span>
          <span>$4.00</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
          <span>Flat White</span>
          <span>$4.50</span>
        </li>
      </ul>
    </div>
  );
}

function CenterPanel() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-amber-800/60">
        Est. 2026
      </p>
      <h2 className="font-serif text-5xl text-amber-950">Our Menu</h2>
      <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-amber-900/70">
        Single-origin pours, house chai, and pastries baked each morning.
      </p>
    </div>
  );
}

function RightInside() {
  return (
    <div className="relative z-10 p-8">
      <h3 className="mb-4 font-serif text-2xl text-amber-950">Chai &amp; Tea</h3>
      <ul className="space-y-3 text-sm text-amber-900/80">
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
          <span>Masala Chai</span>
          <span>$4.50</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
          <span>Cardamom Latte</span>
          <span>$5.00</span>
        </li>
        <li className="flex justify-between border-b border-amber-900/10 pb-2">
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
      <p className="text-xs uppercase tracking-[0.3em] text-amber-800/40">
        Inside fold
      </p>
    </div>
  );
}

export default function TriFoldBrochure() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="mx-auto flex justify-center [perspective:1400px]">
      <div
        className="overflow-visible rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
        style={{ width: BROCHURE_WIDTH, height: BROCHURE_HEIGHT }}
      >
        <motion.button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close brochure" : "Open brochure"}
          className="relative block h-full w-full cursor-pointer overflow-visible rounded-sm border-0 bg-transparent p-0 [transform-style:preserve-3d]"
        >
          {/* Center panel — pinned to container midpoint */}
          <div
            className="absolute top-0 z-[5] h-full overflow-hidden rounded-sm"
            style={{
              width: PANEL_WIDTH,
              left: "50%",
              transform: `translateX(-${PANEL_WIDTH / 2}px)`,
            }}
          >
            <PanelFace className="rounded-sm">
              <CenterPanel />
            </PanelFace>
            {isOpen && <Crease side="left" />}
            {isOpen && <Crease side="right" />}
          </div>

          {/* Right wing — folds onto center first; beneath left when closed */}
          <motion.div
            className="absolute top-0 z-[20] h-full [transform-style:preserve-3d] origin-left"
            style={{
              width: PANEL_WIDTH,
              left: "50%",
              x: PANEL_WIDTH / 2,
              rotateY: rightRotate,
              boxShadow: rightShadow,
            }}
          >
            <PanelFace className="rounded-sm">
              <RightInside />
            </PanelFace>
            <PanelFace flip className="rounded-sm">
              <RightFoldedFace />
            </PanelFace>
            {isOpen && <Crease side="left" />}
          </motion.div>

          {/* Left wing — folds on top when closed; back cover faces out */}
          <motion.div
            className="absolute top-0 z-[30] h-full [transform-style:preserve-3d] origin-right"
            style={{
              width: PANEL_WIDTH,
              left: "50%",
              x: -(PANEL_WIDTH * 1.5),
              rotateY: leftRotate,
              boxShadow: leftShadow,
            }}
          >
            <PanelFace className="rounded-sm">
              <LeftInside />
            </PanelFace>
            <PanelFace flip className="rounded-sm">
              <BackCover />
            </PanelFace>
            {isOpen && <Crease side="right" />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
