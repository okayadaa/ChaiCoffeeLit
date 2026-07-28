export function Crease({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-0 h-full w-4 ${
        side === "left" ? "right-0" : "left-0"
      }`}
      style={{
        background:
          side === "left"
            ? "linear-gradient(to left, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)"
            : "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)",
      }}
    />
  );
}
