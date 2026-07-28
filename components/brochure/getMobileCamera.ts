import { MOBILE_FOCUS_BACK_CHROME } from "./constants";
import type { MobileView, PanelId } from "./types";

export function getMobileCamera(
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
  const focusAvailH = availH - MOBILE_FOCUS_BACK_CHROME;
  const focusScale = Math.min(availW / panelWidth, focusAvailH / brochureHeight);

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
