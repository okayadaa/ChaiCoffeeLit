import Image from "next/image";
import brochureBackground from "@/assets/backgroundImage.png";
import { BASE_BROCHURE_HEIGHT, BASE_PANEL_WIDTH } from "../constants";

export function CenterPanel() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
      <Image
        src={brochureBackground}
        alt=""
        width={BASE_PANEL_WIDTH}
        height={BASE_BROCHURE_HEIGHT}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        priority
      />
      <p className="relative z-10 mb-3 text-xs uppercase tracking-[0.35em] text-amber-800/60">
        Est. 2026
      </p>
      <h2 className="relative z-10 text-7xl text-amber-950">Our Menu</h2>
      <p className="relative z-10 mt-5 max-w-[420px] text-lg leading-relaxed text-amber-900/70">
        Single-origin pours, house chai, and pastries baked each morning.
      </p>
    </div>
  );
}
