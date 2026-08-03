"use client";

import { useCallback, useState } from "react";
import {
  leftPanelMenu,
  leftPanelNavLinks,
  leftPanelPages,
} from "../content/left-panel";
import type { LeftPanelView, SlideDirection } from "../types";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import { PanelTabContent } from "../ui/PanelTabContent";

export function LeftInside() {
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
            title={leftPanelMenu.title}
            items={leftPanelMenu.items}
            navLinks={leftPanelNavLinks}
            onSelect={(id) => navigate(id as LeftPanelView)}
          />
        ),
        about: (
          <PanelTabContent
            title={leftPanelPages.about.title}
            body={leftPanelPages.about.body}
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
