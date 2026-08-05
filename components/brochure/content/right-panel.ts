import type { MenuItem, PanelNavLink, PanelPageContent } from "../types";

export const rightPanelMenu = {
  title: "Chai & Tea",
  items: [
    { name: "Masala Chai", price: "$4.50" },
    { name: "Cardamom Latte", price: "$5.00" },
    { name: "Matcha Oat", price: "$5.50" },
  ] satisfies MenuItem[],
};

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
