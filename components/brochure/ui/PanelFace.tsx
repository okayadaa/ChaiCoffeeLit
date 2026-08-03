import paperTexture from "@/assets/paper.webp";
import {
  PAPER_PANEL_SHADE,
  PAPER_RIM_HIGHLIGHT,
  PAPER_STYLE,
  PAPER_TEXTURE,
} from "../constants";
import { FaceContent } from "./FaceContent";
import { PaperEdge } from "./PaperEdge";

export function PanelFace({
  children,
  className = "",
  flip = false,
  fit,
  outerEdge,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
  fit: number;
  /** Visible exterior edge when the brochure is closed (back cover / front flap). */
  outerEdge?: "left" | "right";
  variant?: "default" | "center";
}) {
  const isCenter = variant === "center";

  return (
    <div
      className={`absolute inset-0 overflow-hidden [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform-style:preserve-3d] ${className}`}
      style={{
        transform: flip ? "rotateY(180deg) translateZ(0.5px)" : "translateZ(0.5px)",
      }}
    >
      {!isCenter && (
        <>
          <div className="absolute inset-0" style={PAPER_STYLE} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${paperTexture.src})`,
              backgroundRepeat: "repeat",
              backgroundSize: `${paperTexture.width}px ${paperTexture.height}px`,
              opacity: PAPER_TEXTURE.opacity,
              mixBlendMode: PAPER_TEXTURE.blendMode,
              filter: "contrast(1.12) brightness(0.98)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{ backgroundImage: PAPER_RIM_HIGHLIGHT }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{ backgroundImage: PAPER_PANEL_SHADE }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(90,60,30,0.12)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-6 bg-gradient-to-t from-[rgba(55,35,18,0.14)] to-transparent" />
          <PaperEdge side="top" />
          <PaperEdge side="bottom" />
          {outerEdge && <PaperEdge side={outerEdge} />}
        </>
      )}
      <FaceContent fit={fit}>{children}</FaceContent>
    </div>
  );
}
