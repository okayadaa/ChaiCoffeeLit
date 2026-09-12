"use client";

import { useCallback, useState } from "react";
import { rightPanelNavLinks } from "../content/right-panel";
import type { RightPanelView, SlideDirection } from "../types";
import { BlogPostList } from "../ui/BlogPostList";
import { PanelBackButton } from "../ui/PanelBackButton";
import { PanelMenu } from "../ui/PanelMenu";
import { PanelScrollBody } from "../ui/PanelScrollBody";
import { PanelSlideView } from "../ui/PanelSlideView";
import { ScrambleText } from "../ui/ScrambleText";
import type { BlogListPost } from "@/lib/blog/types"; 
import Link from "next/link";
import type {Book} from "@/lib/books/types";
import {BookShelf} from "@/components/books/BookShelf";

type RightInsideProps = {
  posts: BlogListPost[];
  books: Book[];
  initialView?: RightPanelView;
};

export function RightInside({
  posts,
  books,
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
          <div className="relative z-10 flex h-full flex-col p-12">
            <PanelBackButton onBack={() => navigate("menu")} />
            <div className="mb-8">
              <h3 className="text-4xl text-[#333333]">
                <ScrambleText text="Blog" />
              </h3>
              <p className="mt-3 text-center text-md text-[#333333]">
                "To be taken in between sips"
              </p>
            </div>
            <PanelScrollBody className="pr-2">
              <BlogPostList posts={posts.slice(0, 6)} />
            </PanelScrollBody>
            <Link
              href="/blog"
              className="mt-6 inline-block text-sm text-blue-500 underline underline-offset-4 hover:text-blue-600"
            >
              View all posts
            </Link>
          </div>
        ),
        books: (
          <div className="relative z-10 flex h-full flex-col p-12">
            <PanelBackButton onBack={() => navigate("menu")} />

            <h3 className="mb-8 text-4xl text-[#333333]">
              <ScrambleText text="Books" />
            </h3>

            <PanelScrollBody className="pr-2">
              {books.length === 0 ? (
                <p className="text-sm text-[#333333]">
                  No book recommendations yet.
                </p>
              ) : (
                <BookShelf
                  books={books.slice(0, 9)}
                  variant="compact"
                />
              )}
            </PanelScrollBody>

            <Link
              href="/books"
              className="mt-6 inline-block text-sm text-blue-500 underline underline-offset-4 hover:text-blue-600"
            >
              View all books
            </Link>
          </div>
        ),
      }}
    />
  );
}
