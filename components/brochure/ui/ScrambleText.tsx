"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DURATION_MS = 700;

function randomChar(matchCase: string) {
  const glyph = CHARS[Math.floor(Math.random() * CHARS.length)];
  return matchCase === matchCase.toLowerCase() ? glyph.toLowerCase() : glyph;
}

function scrambleFrom(text: string, revealed: number) {
  return text
    .split("")
    .map((ch, i) => {
      if (i < revealed || !/[a-zA-Z]/.test(ch)) return ch;
      return randomChar(ch);
    })
    .join("");
}

export function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const revealed = Math.floor(t * text.length);
      setDisplay(t < 1 ? scrambleFrom(text, revealed) : text);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <span className="inline-block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
