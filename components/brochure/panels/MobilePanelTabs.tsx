import { MOBILE_TAB_HEIGHT, PANELS } from "../constants";
import type { PanelId } from "../types";

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
              ? "bg-amber-900/20 text-[#333333]"
              : "bg-amber-900/10 text-[#333333] hover:bg-amber-900/20"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
