import { SanityLive } from "@/sanity/lib/live";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SanityLive waitFor="function" />
    </>
  );
}