import { PAPER_EDGE } from "../constants";

type EdgeSide = "left" | "right" | "top" | "bottom";

const edgeGradient = `linear-gradient(to bottom, ${PAPER_EDGE.highlight}, ${PAPER_EDGE.face} 18%, ${PAPER_EDGE.shadow} 82%, ${PAPER_EDGE.face})`;

export function PaperEdge({ side }: { side: EdgeSide }) {
  const { width } = PAPER_EDGE;

  if (side === "left" || side === "right") {
    const isLeft = side === "left";
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-[2]"
        style={{
          [isLeft ? "left" : "right"]: 0,
          width,
          height: "100%",
          transformOrigin: isLeft ? "left center" : "right center",
          transform: isLeft
            ? `rotateY(-90deg) translateX(-${width}px)`
            : `rotateY(90deg) translateX(${width}px)`,
          background: edgeGradient,
          boxShadow: isLeft
            ? "inset -1px 0 0 rgba(50,35,18,0.22)"
            : "inset 1px 0 0 rgba(50,35,18,0.22)",
        }}
      />
    );
  }

  const isTop = side === "top";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 z-[2] w-full"
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height: width,
        transformOrigin: isTop ? "center top" : "center bottom",
        transform: isTop
          ? `rotateX(90deg) translateY(-${width}px)`
          : `rotateX(-90deg) translateY(${width}px)`,
        background: edgeGradient,
        boxShadow: isTop
          ? "inset 0 -1px 0 rgba(50,35,18,0.18)"
          : "inset 0 1px 0 rgba(50,35,18,0.24)",
      }}
    />
  );
}
