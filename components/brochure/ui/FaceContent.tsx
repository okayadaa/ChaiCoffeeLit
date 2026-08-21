import { BASE_BROCHURE_HEIGHT, BASE_PANEL_WIDTH } from "../constants";

/** Keeps panel art at desktop layout; scales only face content, not the fold. */
export function FaceContent({
  fit,
  children,
}: {
  fit: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="origin-top-left font-brochure text-[#333333]"
      style={{
        width: BASE_PANEL_WIDTH,
        height: BASE_BROCHURE_HEIGHT,
        transform: fit === 1 ? undefined : `scale(${fit})`,
      }}
    >
      {children}
    </div>
  );
}
