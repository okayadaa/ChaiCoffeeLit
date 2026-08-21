"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MOBILE_FOCUS_BACK_CHROME,
  MOBILE_TAB_HEIGHT,
  VIEWPORT_PADDING,
  WING_DURATION,
  cameraTransition,
  sizeEase,
  wingTransition,
} from "./constants";
import { getMobileCamera } from "./getMobileCamera";
import { useBrochureSize } from "./hooks/useBrochureSize";
import { useIsMobile } from "./hooks/useIsMobile";
import { useViewportSize } from "./hooks/useViewportSize";
import { useWingShadow } from "./hooks/useWingShadow";
import { BackCover } from "./panels/BackCover";
import { CenterPanel } from "./panels/CenterPanel";
import { LeftInside } from "./panels/LeftInside";
import { MobileBackButton } from "./panels/MobileBackButton";
import { MobilePanelTabs } from "./panels/MobilePanelTabs";
import { RightFoldedFace } from "./panels/RightFoldedFace";
import { RightInside } from "./panels/RightInside";
import type { MobileView, PanelId } from "./types";
import { Crease } from "./ui/Crease";
import { PanelFace } from "./ui/PanelFace";
import type { BlogListPost } from "@/lib/blog/types";

type TriFoldBrochureProps = {
  posts: BlogListPost[];
  initialPanel?: "blog";
};

export default function TriFoldBrochure({
  posts,
  initialPanel,
}: TriFoldBrochureProps) {
  const isMobile = useIsMobile();
  const { width, height } = useViewportSize();
  const [isOpen, setIsOpen] = useState(initialPanel === "blog");
  const [mobileView, setMobileView] = useState<MobileView>(initialPanel === "blog" ? "focus" : "cover",);
  const [activePanel, setActivePanel] = useState<PanelId | null>(initialPanel === "blog" ? "right" : null,);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
  const isFirstCameraSync = useRef(true);
  const brochureRef = useRef<HTMLDivElement>(null);

  if (isMobile !== prevIsMobile) {
    setPrevIsMobile(isMobile);
    if (!isMobile) {
      setMobileView("cover");
      setActivePanel(null);
    } else if (isOpen) {
      setMobileView("overview");
    }
  }

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
  const focusAvailH = availH - MOBILE_FOCUS_BACK_CHROME;
  const mobileFocusScale = Math.min(availW / panelWidth, focusAvailH / brochureHeight);
  const mobileFocusVisibleWidth = panelWidth * mobileFocusScale;

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

  const startAnimationGuard = useCallback(() => {
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), WING_DURATION * 1000 * 2);
  }, []);

  const openBrochure = useCallback(() => {
    if (isAnimating) return;
    startAnimationGuard();
    setIsOpen(true);
    setMobileView(isMobile ? "overview" : "cover");
    setActivePanel(null);
  }, [isAnimating, startAnimationGuard, isMobile]);

  const closeBrochure = useCallback(() => {
    if (isAnimating) return;
    startAnimationGuard();
    setIsOpen(false);
    setMobileView("cover");
    setActivePanel(null);
  }, [isAnimating, startAnimationGuard]);

  useEffect(() => {
    if (isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        brochureRef.current &&
        !brochureRef.current.contains(event.target as Node)
      ) {
        closeBrochure();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen, closeBrochure]);

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

  const handleDesktopBrochureClick = () => {
    if (!isOpen) {
      openBrochure();
    }
  };

  const handleMobileTap = () => {
    if (mobileView === "cover") {
      openBrochure();
    } else if (mobileView === "overview") {
      closeBrochure();
    }
  };

  const brochureScene = (
    <div
      ref={brochureRef}
      className="relative mx-auto touch-manipulation"
      onClick={
        isMobile
          ? mobileView !== "focus"
            ? handleMobileTap
            : undefined
          : !isOpen
            ? handleDesktopBrochureClick
            : undefined
      }
      role={
        (isMobile && mobileView !== "focus") || (!isMobile && !isOpen)
          ? "button"
          : undefined
      }
      tabIndex={
        (isMobile && mobileView !== "focus") || (!isMobile && !isOpen) ? 0 : undefined
      }
      aria-expanded={isMobile || !isOpen ? isOpen : undefined}
      aria-label={
        isMobile
          ? mobileView === "cover"
            ? "Open brochure"
            : "Close brochure"
          : !isOpen
            ? "Open brochure"
            : undefined
      }
      style={{
        width: layoutWidth,
        height: brochureHeight,
        transition: `width ${WING_DURATION}s ${sizeEase}`,
        WebkitTapHighlightColor: "transparent",
        cursor: isMobile || !isOpen ? "pointer" : undefined,
      }}
    >
      <div
        className="absolute inset-0 flex justify-center [perspective:1400px]"
        aria-hidden="true"
      >
        <div
          className="relative [transform-style:preserve-3d]"
          style={{ transform: "rotateX(3.2deg) rotateY(-1.2deg)" }}
        >
          {/* Contact shadow — grounds brochure on the surface */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
            style={{
              bottom: -14,
              width: "92%",
              height: 36,
              background:
                "radial-gradient(ellipse at center, rgba(35,22,10,0.48) 0%, rgba(35,22,10,0.14) 50%, transparent 72%)",
              filter: "blur(8px)",
            }}
          />
          <div
            className="relative overflow-visible rounded-sm shadow-[0_22px_55px_rgba(0,0,0,0.32),0_8px_20px_rgba(0,0,0,0.18)] [transform-style:preserve-3d]"
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
            <PanelFace fit={fit} variant="center" className="rounded-sm">
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
              translateZ: 2,
            }}
          >
            <PanelFace fit={fit} className="rounded-sm">
              <RightInside 
              posts={posts}
              initialView={initialPanel === "blog" ? "blog" : "menu"}
              />
            </PanelFace>
            <PanelFace fit={fit} flip className="rounded-sm" outerEdge="right">
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
              translateZ: 2,
            }}
          >
            <PanelFace fit={fit} className="rounded-sm">
              <LeftInside />
            </PanelFace>
            <PanelFace fit={fit} flip className="rounded-sm" outerEdge="left">
              <BackCover />
            </PanelFace>
            {isOpen && <Crease side="right" />}
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="relative flex w-full max-w-full flex-col items-center justify-center overflow-hidden">
        <div
          className={`relative flex w-full flex-1 overflow-hidden ${
            mobileView === "focus"
              ? "flex-col items-center"
              : "items-center justify-center"
          }`}
          style={{ minHeight: availH }}
        >
          {mobileView === "focus" && (
            <div
              className="mb-[10px] flex shrink-0 justify-start"
              style={{ width: mobileFocusVisibleWidth }}
            >
              <MobileBackButton onBack={backToOverview} />
            </div>
          )}
          <div
            className={
              mobileView === "focus"
                ? "flex min-h-0 w-full flex-1 items-center justify-center"
                : "contents"
            }
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
