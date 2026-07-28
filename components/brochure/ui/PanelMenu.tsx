import type { MenuItem, PanelNavLink } from "../types";
import { PanelNavLinks } from "./PanelNavLinks";

export function PanelMenu({
  title,
  items,
  navLinks,
  onSelect,
}: {
  title: string;
  items: MenuItem[];
  navLinks: PanelNavLink[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative z-10 p-12">
      <h3 className="mb-6 text-4xl text-amber-950">{title}</h3>
      <ul className="space-y-4 text-lg text-amber-900/80">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex justify-between border-b border-amber-900/10 pb-3"
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
          </li>
        ))}
      </ul>
      <PanelNavLinks links={navLinks} onSelect={onSelect} />
    </div>
  );
}
