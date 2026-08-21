export type MobileView = "cover" | "overview" | "focus";
export type SlideDirection = -1 | 0 | 1;
export type PanelId = "left" | "center" | "right";
export type LeftPanelView = "menu" | "about" | "archive";
export type RightPanelView = "menu" | "blog" | "books";

export type PanelNavLink = {
  id: string;
  label: string;
};

export type PanelPageContent = {
  title: string;
  body: string;
};
