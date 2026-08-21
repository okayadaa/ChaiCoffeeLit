import type { PanelNavLink } from "../types";

export function PanelNavLinks({
  links,
  onSelect,
}: {
  links: PanelNavLink[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-4 text-center text-[33px] text-[#333333]">
      {links.map((link) => (
        <li
          key={link.id}
          className="border-b border-amber-900/10 pb-3"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(link.id);
            }}
            className="w-full cursor-pointer touch-manipulation font-bold text-[#333333] [text-shadow:0_0_6px_#007BFF,0_0_14px_#1B365D,0_0_24px_#1B365D] transition-colors hover:text-[#000080]"
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
