export const INCH = 96; // CSS reference pixels per inch
export const BASE_PANEL_WIDTH = 380 + 2 * INCH;
export const BASE_BROCHURE_HEIGHT = 660 + 2 * INCH;
export const VIEWPORT_PADDING = 24;
export const MOBILE_MAX = 640;
export const MOBILE_TAB_HEIGHT = 56;
export const MOBILE_FOCUS_BACK_GAP = 10;
export const MOBILE_FOCUS_BACK_BUTTON_HEIGHT = 32;
export const MOBILE_FOCUS_BACK_CHROME =
  MOBILE_FOCUS_BACK_GAP + MOBILE_FOCUS_BACK_BUTTON_HEIGHT;

export const WING_DURATION = 0.75;
export const wingTransition = {
  duration: WING_DURATION,
  ease: [0.4, 0, 0.2, 1] as const,
};
export const cameraTransition = {
  duration: WING_DURATION,
  ease: [0.4, 0, 0.2, 1] as const,
};
export const sizeEase = "cubic-bezier(0.4, 0, 0.2, 1)";

export const PANEL_SLIDE_DURATION = 0.45;
export const panelSlideTransition = {
  duration: PANEL_SLIDE_DURATION,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const PAPER_STYLE = {
  backgroundImage:
    "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, transparent 40%), linear-gradient(to bottom, #faf6ee, #f0e6d3)",
} as const;

export const PANELS = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
] as const;
