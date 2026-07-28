import {
  BASE_BROCHURE_HEIGHT,
  BASE_PANEL_WIDTH,
  VIEWPORT_PADDING,
} from "../constants";
import { useHasMounted } from "./useHasMounted";
import { useViewportSize } from "./useViewportSize";

/**
 * Stable panel size — does not change with open/close (avoids zoom quirk).
 * On mobile, size for a single panel filling the viewport.
 * On narrow desktop viewports, size for 3 panels so the open state fits.
 */
export function useBrochureSize(isMobile: boolean) {
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
