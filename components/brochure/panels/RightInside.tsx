"use client";

import { useCallback, useState } from "react";
import { getPublishedPosts } from "@/lib/blog/queries";
import {
  rightPanelMenu,
  rightPanelNavLinks,
  rightPanelPages,
} from "../content/right-panel";
import type { RightPanelView, SlideDirection } from "../types";
import { BlogPostList } from "../ui/BlogPostList";
import { PanelBackButton } from "../ui/PanelBackButton";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import { PanelTabContent } from "../ui/PanelTabContent";

const publishedPosts = getPublishedPosts();

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
          <div className="relative z-10 p-12">
            <PanelBackButton onBack={() => navigate("menu")} />
            <h3 className="mb-8 text-4xl text-amber-950">Blog</h3>
            <BlogPostList posts={publishedPosts} />
          </div>
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
