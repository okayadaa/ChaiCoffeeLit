"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { leftPanelNavLinks } from "../content/left-panel";
import type { LeftPanelView, SlideDirection } from "../types";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import type { ArchiveItem } from "@/lib/archive/types";

const AboutPanel = dynamic(() =>
  import("@/components/about/AboutPanel").then((module) => module.AboutPanel),
);
const ArchivePanel = dynamic(() =>
  import("@/components/archive/ArchivePanel").then((module) => module.ArchivePanel),
);

export function LeftInside({
  archiveItems,
  initialView = "menu",
}: {
  archiveItems: ArchiveItem[];
  initialView?: LeftPanelView;
}) {
  const [{ view, direction }, setNav] = useState<{
    view: LeftPanelView;
    direction: SlideDirection;
  }>({ view: initialView, direction: 0 });

  const navigate = useCallback((next: LeftPanelView) => {
    setNav({ view: next, direction: next === "menu" ? -1 : 1 });
  }, []);

  return (
    <PanelSlideView
      view={view}
      direction={direction}
      views={{
        menu: (
          <PanelMenu
            navLinks={leftPanelNavLinks}
            onSelect={(id) => navigate(id as LeftPanelView)}
          />
        ),
        about: (
          <AboutPanel
            onBack={() => navigate("menu")}
          />
        ),
        archive: (
          <ArchivePanel
            archiveItems={archiveItems}
            onBack={() => navigate("menu")}
          />
        ),
      }}
    />
  );
}
