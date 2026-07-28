import { PAPER_STYLE } from "../constants";
import { FaceContent } from "./FaceContent";

export function PanelFace({
  children,
  className = "",
  flip = false,
  fit,
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
  fit: number;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform-style:preserve-3d] ${className}`}
      style={{
        transform: flip ? "rotateY(180deg) translateZ(0.5px)" : "translateZ(0.5px)",
      }}
    >
      <div className="absolute inset-0" style={PAPER_STYLE} />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(139,100,60,0.08)]" />
      <FaceContent fit={fit}>{children}</FaceContent>
    </div>
  );
}
