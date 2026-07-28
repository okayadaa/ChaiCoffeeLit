import type { MenuItem, PanelNavLink, PanelPageContent } from "../types";

export const leftPanelMenu = {
  title: "Espresso",
  items: [
    { name: "Americano", price: "$3.50" },
    { name: "Cortado", price: "$4.00" },
    { name: "Flat White", price: "$4.50" },
  ] satisfies MenuItem[],
};

export const leftPanelNavLinks = [
  { id: "about", label: "About" },
  { id: "blog", label: "Blog" },
] satisfies PanelNavLink[];

export const leftPanelPages = {
  about: {
    title: "About Chai Coffee Lit",
    body: "A neighborhood cafe rooted in single-origin coffee and house-made chai. More stories coming soon.",
  },
  blog: {
    title: "Blog",
    body: "Notes from the bar, seasonal menus, and community updates. Check back for new posts.",
  },
} satisfies Record<string, PanelPageContent>;
