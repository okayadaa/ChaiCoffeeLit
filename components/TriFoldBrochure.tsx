"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import logo from "@/assets/logo-image.png";

const INCH = 96; // CSS reference pixels per inch
const BASE_PANEL_WIDTH = 380 + 2 * INCH;
const BASE_BROCHURE_HEIGHT = 660 + 2 * INCH;
const VIEWPORT_PADDING = 24;
const MOBILE_MAX = 640;
const MOBILE_TAB_HEIGHT = 56;

const WING_DURATION = 0.75;
const wingTransition = { duration: WING_DURATION, ease: [0.4, 0, 0.2, 1] as const };
const cameraTransition = { duration: WING_DURATION, ease: [0.4, 0, 0.2, 1] as const };
const sizeEase = "cubic-bezier(0.4, 0, 0.2, 1)";

type MobileView = "cover" | "overview" | "focus";
type PanelId = "left" | "center" | "right";

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

function useIsMobile() {
  const mounted = useHasMounted();
  const { width } = useViewportSize();
  return mounted && width <= MOBILE_MAX;
}

/**
 * Stable panel size — does not change with open/close (avoids zoom quirk).
 * On mobile, size for a single panel filling the viewport.
 * On narrow desktop viewports, size for 3 panels so the open state fits.
 */
function useBrochureSize(isMobile: boolean) {
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

  if (isMobile) {
    const fit = Math.min(
      availH / BASE_BROCHURE_HEIGHT,
      availW / BASE_PANEL_WIDTH,
    );
    return {
      fit,
      panelWidth: BASE_PANEL_WIDTH * fit,
      brochureHeight: BASE_BROCHURE_HEIGHT * fit,
    };
  }

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

function getMobileCamera(
  mobileView: MobileView,
  activePanel: PanelId | null,
  panelWidth: number,
  brochureHeight: number,
  availW: number,
  availH: number,
) {
  const closedW = panelWidth;
  const openW = panelWidth * 3;

  const coverScale = Math.min(availW / closedW, availH / brochureHeight);
  const overviewScale = Math.min(availW / openW, availH / brochureHeight);
  const focusScale = Math.min(availW / panelWidth, availH / brochureHeight);

  if (mobileView === "cover") {
    return { scale: coverScale, x: 0, y: 0 };
  }

  if (mobileView === "overview") {
    return { scale: overviewScale, x: 0, y: 0 };
  }

  const panelOffset =
    activePanel === "left"
      ? panelWidth
      : activePanel === "right"
        ? -panelWidth
        : 0;

  return { scale: focusScale, x: panelOffset * focusScale, y: 0 };
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
      <Image
        src={logo}
        alt="Chai Coffee Lit logo"
        className="mb-9 h-72 w-72 object-contain"
        priority
      />
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

const PANELS: { id: PanelId; label: string }[] = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

function MobilePanelTabs({
  activePanel,
  onSelect,
}: {
  activePanel: PanelId | null;
  onSelect: (panel: PanelId) => void;
}) {
  return (
    <div
      className="flex w-full shrink-0 items-center justify-center gap-2 px-3"
      style={{ height: MOBILE_TAB_HEIGHT }}
      role="tablist"
      aria-label="Brochure panels"
    >
      {PANELS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activePanel === id}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className={`touch-manipulation rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
            activePanel === id
              ? "bg-amber-900 text-amber-50"
              : "bg-amber-900/10 text-amber-900/70 hover:bg-amber-900/20"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MobileBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onBack();
      }}
      className="absolute left-3 top-3 z-[200] touch-manipulation rounded-full bg-amber-900/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-900/80 backdrop-blur-sm"
      aria-label="Back to overview"
    >
      Back
    </button>
  );
}

export default function TriFoldBrochure() {
  const isMobile = useIsMobile();
  const { width, height } = useViewportSize();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("cover");
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstCameraSync = useRef(true);

  const { fit, panelWidth, brochureHeight } = useBrochureSize(isMobile);
  const layoutWidth = panelWidth * (isOpen ? 3 : 1);

  const leftRotate = useMotionValue(180);
  const rightRotate = useMotionValue(-180);
  const cameraScale = useMotionValue(1);
  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(0);

  const leftShadow = useWingShadow(leftRotate, "left");
  const rightShadow = useWingShadow(rightRotate, "right");

  const showMobileTabs = isMobile && mobileView !== "cover";
  const chromeH = showMobileTabs ? MOBILE_TAB_HEIGHT : 0;
  const availW = width - VIEWPORT_PADDING * 2;
  const availH = height - VIEWPORT_PADDING * 2 - chromeH;

  const syncCamera = useCallback(
    (view: MobileView, panel: PanelId | null, animateCamera = true) => {
      const target = getMobileCamera(
        view,
        panel,
        panelWidth,
        brochureHeight,
        availW,
        availH,
      );

      if (animateCamera) {
        animate(cameraScale, target.scale, cameraTransition);
        animate(cameraX, target.x, cameraTransition);
        animate(cameraY, target.y, cameraTransition);
      } else {
        cameraScale.set(target.scale);
        cameraX.set(target.x);
        cameraY.set(target.y);
      }
    },
    [panelWidth, brochureHeight, availW, availH, cameraScale, cameraX, cameraY],
  );

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

  useEffect(() => {
    if (!isMobile) {
      isFirstCameraSync.current = true;
      return;
    }
    syncCamera(mobileView, activePanel, !isFirstCameraSync.current);
    isFirstCameraSync.current = false;
  }, [isMobile, mobileView, activePanel, syncCamera]);

  useEffect(() => {
    if (!isMobile) return;
    if (isOpen && mobileView === "cover") {
      setMobileView("overview");
    }
    if (!isOpen && mobileView !== "cover") {
      setMobileView("cover");
      setActivePanel(null);
    }
  }, [isMobile, isOpen, mobileView]);

  useEffect(() => {
    if (isMobile) return;
    if (isOpen || mobileView !== "cover") {
      setMobileView("cover");
      setActivePanel(null);
    }
  }, [isMobile, isOpen, mobileView]);

  const startAnimationGuard = useCallback(() => {
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), WING_DURATION * 1000 * 2);
  }, []);

  const openBrochure = useCallback(() => {
    if (isAnimating) return;
    startAnimationGuard();
    setIsOpen(true);
    setMobileView("overview");
    setActivePanel(null);
  }, [isAnimating, startAnimationGuard]);

  const closeBrochure = useCallback(() => {
    if (isAnimating) return;
    startAnimationGuard();
    setIsOpen(false);
    setMobileView("cover");
    setActivePanel(null);
  }, [isAnimating, startAnimationGuard]);

  const selectPanel = useCallback(
    (panel: PanelId) => {
      if (isAnimating) return;
      setActivePanel(panel);
      setMobileView("focus");
    },
    [isAnimating],
  );

  const backToOverview = useCallback(() => {
    if (isAnimating) return;
    setMobileView("overview");
    setActivePanel(null);
  }, [isAnimating]);

  const toggle = () => setIsOpen((open) => !open);

  const handleMobileTap = () => {
    if (mobileView === "cover") {
      openBrochure();
    } else if (mobileView === "overview") {
      closeBrochure();
    }
  };

  const brochureScene = (
    <div
      className="relative mx-auto"
      style={{
        width: layoutWidth,
        height: brochureHeight,
        transition: `width ${WING_DURATION}s ${sizeEase}`,
      }}
    >
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

      {isMobile ? (
        mobileView !== "focus" && (
          <button
            type="button"
            onClick={handleMobileTap}
            aria-expanded={isOpen}
            aria-label={
              mobileView === "cover" ? "Open brochure" : "Close brochure"
            }
            className="absolute inset-0 z-[100] touch-manipulation border-0 p-0"
            style={{
              backgroundColor: "rgba(0,0,0,0.01)",
              WebkitTapHighlightColor: "transparent",
              cursor: "pointer",
            }}
          />
        )
      ) : (
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
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="relative flex w-full max-w-full flex-col items-center justify-center overflow-hidden">
        {mobileView === "focus" && <MobileBackButton onBack={backToOverview} />}

        <div
          className="relative flex w-full flex-1 items-center justify-center overflow-hidden"
          style={{ minHeight: availH }}
        >
          <motion.div
            style={{
              scale: cameraScale,
              x: cameraX,
              y: cameraY,
            }}
            className="origin-center"
          >
            {brochureScene}
          </motion.div>
        </div>

        {showMobileTabs && (
          <MobilePanelTabs
            activePanel={mobileView === "focus" ? activePanel : null}
            onSelect={selectPanel}
          />
        )}
      </div>
    );
  }

  return brochureScene;
}
