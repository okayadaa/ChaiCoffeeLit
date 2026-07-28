import Image from "next/image";
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
      <p className="font-norwester text-[25px] uppercase tracking-[0.4em] text-amber-800/70">
        Chai Coffee Lit
      </p>
      <p className="mt-6 max-w-[390px] text-lg leading-relaxed text-amber-900/70">
        Open daily 7am – 7pm
      </p>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-amber-800/50">
        Tap to open
      </p>
    </div>
  );
}
