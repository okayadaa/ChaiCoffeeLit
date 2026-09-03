export function PanelBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onBack();
      }}
      className="mb-8 self-start text-left cursor-pointer touch-manipulation text-xs font-medium uppercase tracking-[0.2em] text-[#333333]"
      aria-label="Home"
    >
      Home
    </button>
  );
}
