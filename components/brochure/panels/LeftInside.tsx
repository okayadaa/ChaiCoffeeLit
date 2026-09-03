"use client";

import { useCallback, useState } from "react";
import { leftPanelNavLinks, leftPanelPages } from "../content/left-panel";
import type { LeftPanelView, SlideDirection } from "../types";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import { PanelTabContent } from "../ui/PanelTabContent";
import type { Participant } from "@/lib/about/types";
import { AboutPanel } from "@/components/about/AboutPanel";

export function LeftInside({
  participants,
}: {
  participants: Participant[];
}) {
  const [{ view, direction }, setNav] = useState<{
    view: LeftPanelView;
    direction: SlideDirection;
  }>({ view: "menu", direction: 0 });

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
          <PanelTabContent
            title={leftPanelPages.archive.title}
            body={leftPanelPages.archive.body}
            onBack={() => navigate("menu")}
          />
        ),
      }}
    />
  );
}
