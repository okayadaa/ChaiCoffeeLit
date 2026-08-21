import Image from "next/image";
import { cyberpunk } from "@/app/fonts";
import logo from "@/assets/logo-image.png";

export function BackCover() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center">
      <Image
        src={logo}
        alt="Chai Coffee Lit logo"
        className="mb-[-65px] h-92 w-92 object-contain"
        priority
      />
      <p
        className={`${cyberpunk.className} text-[29px] uppercase tracking-[0.4em] text-[#333333] [backface-visibility:visible] [-webkit-backface-visibility:visible]`}
      >
        CHAI COFFEE LIT
      </p>
      <p className="font-play-heading mt-6 max-w-[390px] text-lg leading-relaxed text-[#333333]">
        Open daily 7am - 7pm
      </p>
      <p className="font-play-heading mt-10 text-xs uppercase tracking-[0.3em] text-[#333333]">
        TAP TO OPEN
      </p>
    </div>
  );
}
