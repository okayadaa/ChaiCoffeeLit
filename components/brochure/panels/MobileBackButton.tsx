export function MobileBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onBack();
      }}
      className="pointer-events-auto z-[200] touch-manipulation rounded-full bg-amber-900/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-900/80 backdrop-blur-sm"
      aria-label="Back to overview"
    >
      Back
    </button>
  );
}
