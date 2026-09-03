import type { Metadata, Viewport } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  cyberpunk,
  orbitron,
  play,
  shareTechMono,
  spaceMono,
} from "./fonts";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Chai Coffee Lit",
  description: "Books, blogs, and reflections from Chai Coffee Lit.",
};
// Debugging: figure out why the viewport is not working
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} ${spaceMono.variable} ${play.variable} ${cyberpunk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children} 
        <SanityLive />
      </body>
    </html>
  );
}
