"use client";

import { useCallback, useState } from "react";
import {
  rightPanelMenu,
  rightPanelNavLinks,
  rightPanelPages,
} from "../content/right-panel";
import type { RightPanelView, SlideDirection } from "../types";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import { PanelTabContent } from "../ui/PanelTabContent";

export function RightInside() {
  const [{ view, direction }, setNav] = useState<{
    view: RightPanelView;
    direction: SlideDirection;
  }>({ view: "menu", direction: 0 });

  const navigate = useCallback((next: RightPanelView) => {
    setNav({ view: next, direction: next === "menu" ? -1 : 1 });
  }, []);

  return (
    <PanelSlideView
      view={view}
      direction={direction}
      views={{
        menu: (
          <PanelMenu
            title={rightPanelMenu.title}
            items={rightPanelMenu.items}
            navLinks={rightPanelNavLinks}
            onSelect={(id) => navigate(id as RightPanelView)}
          />
        ),
        blog: (
          <PanelTabContent
            title={rightPanelPages.blog.title}
            body={rightPanelPages.blog.body}
            onBack={() => navigate("menu")}
          />
        ),
        books: (
          <PanelTabContent
            title={rightPanelPages.books.title}
            body={rightPanelPages.books.body}
            onBack={() => navigate("menu")}
          />
        ),
      }}
    />
  );
}
