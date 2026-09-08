"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type TouchEvent,
  type WheelEvent,
} from "react";

function stopBubble(event: TouchEvent | WheelEvent) {
  event.stopPropagation();
}

export function PanelScrollBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startY = 0;
    let startScroll = 0;

    const onStart = (event: globalThis.TouchEvent) => {
      startY = event.touches[0].clientY;
      startScroll = el.scrollTop;
    };

    const onMove = (event: globalThis.TouchEvent) => {
      if (el.scrollHeight <= el.clientHeight) return;

      const visualScale = el.getBoundingClientRect().height / el.offsetHeight || 1;
      const dy = (startY - event.touches[0].clientY) / visualScale;
      el.scrollTop = startScroll + dy;
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`min-h-0 flex-1 overflow-y-scroll overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch] ${className}`.trim()}
      onTouchStart={stopBubble}
      onWheel={stopBubble}
    >
      {children}
    </div>
  );
}
