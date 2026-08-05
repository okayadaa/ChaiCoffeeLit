import { Newsreader } from "next/font/google";
import Link from "next/link";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${newsreader.variable} flex min-h-full flex-1 flex-col bg-[#f3f4f6] text-[#1c1b19]`}
    >
      <header className="px-6 pt-10 sm:px-10 sm:pt-14">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/"
            className="font-norwester text-3xl tracking-wide text-[#1c1b19] transition-opacity hover:opacity-70 sm:text-4xl"
          >
            Chai Coffee Lit
          </Link>
          <p className="mt-3 font-brochure text-xs uppercase tracking-[0.28em] text-[#6b6358]">
            Journal
          </p>
        </div>
      </header>
      <main className="flex-1 px-6 pb-20 pt-12 sm:px-10 sm:pt-16">{children}</main>
    </div>
  );
}
