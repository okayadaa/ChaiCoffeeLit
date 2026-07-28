import { useTransform, type MotionValue } from "motion/react";

export function useWingShadow(rotate: MotionValue<number>, side: "left" | "right") {
  const peaks =
    side === "left"
      ? ([
          ["-4px 8px 18px rgba(0,0,0,0.18)", 0],
          ["2px 12px 24px rgba(0,0,0,0.28)", 45],
          ["8px 6px 24px rgba(0,0,0,0.32)", 90],
          ["0px 2px 8px rgba(0,0,0,0.1)", 135],
          ["0px 0px 0px transparent", 180],
        ] as const)
      : ([
          ["6px 10px 22px rgba(0,0,0,0.22)", 0],
          ["-2px 16px 30px rgba(0,0,0,0.38)", -45],
          ["-14px 8px 36px rgba(0,0,0,0.48)", -90],
          ["-2px 16px 30px rgba(0,0,0,0.38)", -135],
          ["0px 2px 6px rgba(0,0,0,0.1)", -180],
        ] as const);

  return useTransform(
    rotate,
    peaks.map(([, angle]) => angle),
    peaks.map(([shadow]) => shadow),
  );
}
