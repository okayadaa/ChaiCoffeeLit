import { useSyncExternalStore } from "react";

function subscribeToViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);

  window.visualViewport?.addEventListener("resize", onChange);

  return () => {
    window.removeEventListener("resize", onChange);
    window.visualViewport?.removeEventListener("resize", onChange);
  };
}

function getViewportWidth() {
  return window.visualViewport?.width ?? window.innerWidth;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function useViewportSize() {
  const width = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    () => 1280,
  );

  const height = useSyncExternalStore(
    subscribeToViewport,
    getViewportHeight,
    () => 800,
  );

  return { width, height };
}