import { useSyncExternalStore } from "react";

function subscribeToViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

export function useViewportSize() {
  const width = useSyncExternalStore(
    subscribeToViewport,
    () => window.innerWidth,
    () => 1280,
  );
  const height = useSyncExternalStore(
    subscribeToViewport,
    () => window.innerHeight,
    () => 800,
  );
  return { width, height };
}
