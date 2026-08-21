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
    </div>
  );
}
