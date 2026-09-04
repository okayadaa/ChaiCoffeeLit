import Badge from "@/components/brochure/ui/Badge";
import type { PanelNavLink } from "../types";

export function PanelNavLinks({
  links,
  onSelect,
}: {
  links: PanelNavLink[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col items-center space-y-12">
      {links.map((link) => (
        <li key={link.id}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(link.id);
            }}
            className="cursor-pointer touch-manipulation"
          >
            <Badge label={link.label} rectW={190} />
          </button>
        </li>
      ))}
    </ul>
  );
}
