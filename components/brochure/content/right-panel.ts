import type { PanelNavLink, PanelPageContent } from "../types";

export const rightPanelNavLinks = [
  { id: "blog", label: "Blog" },
  { id: "books", label: "Books" },
] satisfies PanelNavLink[];

export const rightPanelPages = {
  books: {
    title: "Books",
    body: "Staff picks and reading list from our shelves. New recommendations on the way.",
  },
} satisfies Record<string, PanelPageContent>;
