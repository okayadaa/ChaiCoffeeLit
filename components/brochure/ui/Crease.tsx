export function Crease({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <>
      {/* Deep fold valley — wide ambient occlusion */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-0 z-[15] h-full w-10 ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background: isLeft
            ? "linear-gradient(to left, rgba(28,18,8,0.52) 0%, rgba(28,18,8,0.28) 22%, rgba(28,18,8,0.1) 55%, transparent 100%)"
            : "linear-gradient(to right, rgba(28,18,8,0.52) 0%, rgba(28,18,8,0.28) 22%, rgba(28,18,8,0.1) 55%, transparent 100%)",
        }}
      />
      {/* Secondary bleed into panel */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-0 z-[15] h-full w-16 ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background: isLeft
            ? "linear-gradient(to left, rgba(28,18,8,0.18) 0%, transparent 70%)"
            : "linear-gradient(to right, rgba(28,18,8,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Dark crease line */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-0 z-[16] h-full w-[2px] ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,12,5,0.15), rgba(20,12,5,0.62) 48%, rgba(20,12,5,0.15))",
          boxShadow: isLeft
            ? "2px 0 6px rgba(20,12,5,0.35)"
            : "-2px 0 6px rgba(20,12,5,0.35)",
        }}
      />
      {/* Subtle ridge — much dimmer than before */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-0 z-[16] h-full w-[2px] ${
          isLeft ? "right-[3px]" : "left-[3px]"
        }`}
        style={{
          background: isLeft
            ? "linear-gradient(to left, rgba(255,245,230,0.12), transparent)"
            : "linear-gradient(to right, rgba(255,245,230,0.12), transparent)",
        }}
      />
    </>
  );
}
