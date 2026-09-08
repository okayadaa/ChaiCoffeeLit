"use client";

import { useEffect, useRef, type ReactNode, type TouchEvent } from "react";

function stopBubble(event: TouchEvent) {
  event.stopPropagation();
}

function visualScale(el: HTMLElement) {
  return el.getBoundingClientRect().height / el.offsetHeight || 1;
}

function wheelDeltaY(event: WheelEvent, el: HTMLElement) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * el.clientHeight;
  return event.deltaY;
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

      const dy = (startY - event.touches[0].clientY) / visualScale(el);
      el.scrollTop = startScroll + dy;
      event.preventDefault();
      event.stopPropagation();
    };

    const onWheel = (event: WheelEvent) => {
      if (el.scrollHeight <= el.clientHeight) return;

      el.scrollTop += wheelDeltaY(event, el) / visualScale(el);
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`min-h-0 flex-1 overflow-y-scroll overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch] ${className}`.trim()}
      onTouchStart={stopBubble}
    >
      {children}
    </div>
  );
}
