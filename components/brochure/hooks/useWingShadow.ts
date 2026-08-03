import { useTransform, type MotionValue } from "motion/react";

export function useWingShadow(rotate: MotionValue<number>, side: "left" | "right") {
  const peaks =
    side === "left"
      ? ([
          ["-6px 10px 22px rgba(0,0,0,0.26)", 0],
          ["3px 14px 28px rgba(0,0,0,0.36)", 45],
          ["10px 8px 30px rgba(0,0,0,0.42)", 90],
          ["0px 4px 12px rgba(0,0,0,0.16)", 135],
          ["0px 0px 0px transparent", 180],
        ] as const)
      : ([
          ["8px 12px 28px rgba(0,0,0,0.3)", 0],
          ["-4px 18px 36px rgba(0,0,0,0.46)", -45],
          ["-18px 10px 42px rgba(0,0,0,0.55)", -90],
          ["-4px 18px 36px rgba(0,0,0,0.46)", -135],
          ["0px 3px 10px rgba(0,0,0,0.14)", -180],
        ] as const);

  return useTransform(
    rotate,
    peaks.map(([, angle]) => angle),
    peaks.map(([shadow]) => shadow),
  );
}
