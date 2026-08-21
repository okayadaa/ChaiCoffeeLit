import type { PanelNavLink } from "../types";
import { PanelNavLinks } from "./PanelNavLinks";

export function PanelMenu({
  navLinks,
  onSelect,
}: {
  navLinks: PanelNavLink[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative z-10 flex h-full items-center justify-center p-12">
      <PanelNavLinks links={navLinks} onSelect={onSelect} />
    </div>
  );
}
