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

export const PANEL_BG_COLOR = "#F9FAFB";

export const PAPER_STYLE = {
  backgroundColor: PANEL_BG_COLOR,
} as const;

/** Paper grain overlay tiled on panel faces. */
export const PAPER_TEXTURE = {
  opacity: 0.55,
  blendMode: "multiply" as const,
} as const;

/** Cross-section color for pseudo-3D paper edges (top light → shadow → bottom). */
export const PAPER_EDGE = {
  width: 4,
  highlight: "#f0e8d8",
  face: "#ddd0b8",
  shadow: "#a89578",
} as const;

/** Unified overhead light from upper-left — kept soft so folds stay dark. */
export const PAPER_RIM_HIGHLIGHT =
  "linear-gradient(175deg, rgba(255,250,240,0.28) 0%, transparent 18%)";

/** Directional shade: darker toward bottom-right, sells panel curvature. */
export const PAPER_PANEL_SHADE =
  "linear-gradient(145deg, transparent 40%, rgba(55,38,20,0.09) 100%)";

export const PANELS = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
] as const;
