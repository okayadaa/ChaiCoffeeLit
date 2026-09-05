"use client";

import { useCallback, useState } from "react";
import { leftPanelNavLinks } from "../content/left-panel";
import type { LeftPanelView, SlideDirection } from "../types";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import type { Participant } from "@/lib/about/types";
import { AboutPanel } from "@/components/about/AboutPanel";
import { ArchivePanel } from "@/components/archive/ArchivePanel";
import type { ArchiveItem } from "@/lib/archive/types";

export function LeftInside({
  participants,
  archiveItems,
  initialView = "menu",
}: {
  participants: Participant[];
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
            participants={participants}
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
