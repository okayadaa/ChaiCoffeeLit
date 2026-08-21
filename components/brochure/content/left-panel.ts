import type { PanelNavLink, PanelPageContent } from "../types";

export const leftPanelNavLinks = [
  { id: "about", label: "About" },
  { id: "archive", label: "Archive" },
] satisfies PanelNavLink[];

export const leftPanelPages = {
  about: {
    title: "About Page",
    body: "A neighborhood cafe rooted in single-origin coffee and house-made chai. More stories coming soon.",
  },
  archive: {
    title: "Archive",
    body: "Past menus, events, and seasonal highlights from Chai Coffee Lit. More coming soon.",
  },
} satisfies Record<string, PanelPageContent>;
