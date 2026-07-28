export function CenterPanel() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-800/60">
        Est. 2026
      </p>
      <h2 className="text-7xl text-amber-950">Our Menu</h2>
      <p className="mt-5 max-w-[420px] text-lg leading-relaxed text-amber-900/70">
        Single-origin pours, house chai, and pastries baked each morning.
      </p>
    </div>
  );
}
