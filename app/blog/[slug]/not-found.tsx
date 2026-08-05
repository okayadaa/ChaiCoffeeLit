import Link from "next/link";

export default function BlogArticleNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="font-journal text-3xl text-[#1c1b19]">
        Article not found
      </h1>
      <p className="mt-4 text-[#3a3630]">
        That piece is not published, or the link may be outdated.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70] transition-colors hover:text-[#1c1b19]"
      >
        ← Café
      </Link>
    </div>
  );
}
