import { MOBILE_TAB_HEIGHT, PANELS } from "../constants";
import type { PanelId } from "../types";
import { GlassPill } from "../ui/GlassPill";

export function MobilePanelTabs({
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
        <GlassPill
          key={id}
          role="tab"
          aria-selected={activePanel === id}
          selected={activePanel === id}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
        >
          {label}
        </GlassPill>
      ))}
    </div>
  );
}
