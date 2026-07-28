import type { PanelNavLink } from "../types";

export function PanelNavLinks({
  links,
  onSelect,
}: {
  links: PanelNavLink[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-17">
      <ul className="space-y-4 text-lg text-amber-900/80">
        {links.map((link) => (
          <li
            key={link.id}
            className="border-b border-amber-900/10 pb-3 pl-6"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(link.id);
              }}
              className="w-full touch-manipulation text-left transition-colors hover:text-white"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
