"use client";

import { useCallback, useState } from "react";
import { rightPanelNavLinks, rightPanelPages } from "../content/right-panel";
import type { RightPanelView, SlideDirection } from "../types";
import { BlogPostList } from "../ui/BlogPostList";
import { PanelBackButton } from "../ui/PanelBackButton";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelSlideView } from "../ui/PanelSlideView";
import { PanelTabContent } from "../ui/PanelTabContent";
import { ScrambleText } from "../ui/ScrambleText";
import type { BlogListPost } from "@/lib/blog/types"; 
import Link from "next/link";

type RightInsideProps = {
  posts: BlogListPost[];
  initialView?: RightPanelView;
};

export function RightInside({
  posts,
  initialView = "menu",
}: RightInsideProps) {
  const [{ view, direction }, setNav] = useState<{
    view: RightPanelView;
    direction: SlideDirection;
  }>({ view: initialView, direction: 0 });

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
            navLinks={rightPanelNavLinks}
            onSelect={(id) => navigate(id as RightPanelView)}
          />
        ),
        blog: (
          <div className="relative z-10 p-12">
            <PanelBackButton onBack={() => navigate("menu")} />
            <h3 className="mb-8 text-4xl text-[#333333]">
              <ScrambleText text="Blog" />
            </h3>
            <div className="max-h-[420px] overflow-y-auto pr-2">
              <BlogPostList posts={posts.slice(0, 6)} />
            </div>
            
            <Link
              href="/blog"
              className="mt-6 inline-block text-sm underline underline-offset-4 text-blue-500 hover:text-blue-600">
                View all posts →
            </Link>

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
