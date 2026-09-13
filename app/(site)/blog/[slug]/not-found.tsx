import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl py-12">
      <p className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
        404
      </p>

      <h1 className="mt-5 font-journal text-4xl text-[#1c1b19]">
        Article not found
      </h1>

      <p className="mt-5 font-journal text-lg leading-relaxed text-[#6b6358]">
        This note may have been moved, unpublished, or no longer exists.
      </p>

      <Link
        href="/?panel=blog"
        className="mt-10 inline-block font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]"
      >
        ← Back to Blog
      </Link>
    </div>
  );
}