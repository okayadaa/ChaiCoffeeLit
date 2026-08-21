import { Orbitron, Play, Share_Tech_Mono, Space_Mono } from "next/font/google";
import localFont from "next/font/local";

export const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: "400",
  subsets: ["latin"],
});

export const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const play = Play({
  variable: "--font-play",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const cyberpunk = localFont({
  src: "../assets/fonts/Cyberpunk.ttf",
  variable: "--font-cyberpunk",
  display: "swap",
  adjustFontFallback: false,
});
