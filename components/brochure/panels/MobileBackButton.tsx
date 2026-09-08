import { GlassPill } from "../ui/GlassPill";

export function MobileBackButton({ onBack }: { onBack: () => void }) {
  return (
    <GlassPill
      compact
      className="pointer-events-auto z-[200]"
      aria-label="Back to overview"
      onClick={(e) => {
        e.stopPropagation();
        onBack();
      }}
    >
      Back
    </GlassPill>
  );
}
