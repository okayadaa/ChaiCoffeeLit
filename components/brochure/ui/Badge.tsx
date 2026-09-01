"use client";

import { useId } from "react";

type BadgeProps = {
  label: string;
  rectW?: number;
};

export default function Badge({
  label,
  rectW = 280,
}: BadgeProps) {
  const glowId = useId();

  const rectH = 80;
  const arm = 14;
  const gap = 5;
  const sw = 3;

  const margin = arm + gap + sw * 2;

  const totalW = rectW + margin * 2;
  const totalH = rectH + margin * 2;

  const rx = margin;
  const ry = margin;

  const tl = `M ${rx - gap} ${ry - gap + arm}
    L ${rx - gap} ${ry - gap}
    L ${rx - gap + arm} ${ry - gap}`;

  const tr = `M ${rx + rectW + gap - arm} ${ry - gap}
    L ${rx + rectW + gap} ${ry - gap}
    L ${rx + rectW + gap} ${ry - gap + arm}`;

  const bl = `M ${rx - gap} ${ry + rectH + gap - arm}
    L ${rx - gap} ${ry + rectH + gap}
    L ${rx - gap + arm} ${ry + rectH + gap}`;

  const br = `M ${rx + rectW + gap - arm} ${ry + rectH + gap}
    L ${rx + rectW + gap} ${ry + rectH + gap}
    L ${rx + rectW + gap} ${ry + rectH + gap - arm}`;

  return (
    <div
      style={{
        position: "relative",
        width: totalW,
        height: totalH,
      }}
    >
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <defs>
          <filter
            id={glowId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${glowId})`} stroke="#007BFF" fill="none" strokeWidth={sw}>
          <rect x={rx} y={ry} width={rectW} height={rectH} />
          <path d={tl} />
          <path d={tr} />
          <path d={bl} />
          <path d={br} />
        </g>
        <g stroke="#1B365D" fill="none" strokeWidth={sw}>
          <rect x={rx} y={ry} width={rectW} height={rectH} />
          <path d={tl} />
          <path d={tr} />
          <path d={bl} />
          <path d={br} />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: margin,
          top: margin,
          boxSizing: "border-box",
          width: rectW,
          height: rectH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 16px",
        }}
      >
        <span
          style={{
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            fontSize: 30,
            lineHeight: 1,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            color: "#000",
            WebkitTextStroke: "2px #1B365D",
            textShadow:
              "0 0 6px #007BFF, 0 0 14px rgba(27, 54, 93, 0.4)",
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>
    </div>
  );
}