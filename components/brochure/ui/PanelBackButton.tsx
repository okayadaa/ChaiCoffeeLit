export function PanelBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onBack();
      }}
      className="mb-8 touch-manipulation text-xs font-medium uppercase tracking-[0.2em] text-amber-900/70 transition-colors hover:text-amber-950"
      aria-label="Home"
    >
      Home
    </button>
  );
}
