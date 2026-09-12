import { useSyncExternalStore } from "react";

function getViewportSize() {
  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;

  return `${width}:${height}`;
}

function subscribeToViewport(onChange: () => void) {
  let frameId: number | null = null;

  const handleResize = () => {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = null;
      onChange();
    });
  };

  window.addEventListener("resize", handleResize);
  window.visualViewport?.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    window.visualViewport?.removeEventListener("resize", handleResize);

    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
  };
}

export function useViewportSize() {
  const snapshot = useSyncExternalStore(
    subscribeToViewport,
    getViewportSize,
    () => "1280:800",
  );

  const [width, height] = snapshot.split(":").map(Number);

  return { width, height };
}