"use client";

import Link from "next/link";

type ArticleErrorProps = {
  reset: () => void;
};

export default function ArticleError({
  reset,
}: ArticleErrorProps) {
  return (
    <div className="mx-auto w-full max-w-2xl py-12">
      <p className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
        Something went wrong
      </p>

      <h1 className="mt-5 font-journal text-4xl text-[#1c1b19]">
        We couldn&apos;t load this article.
      </h1>

      <p className="mt-5 font-journal text-lg leading-relaxed text-[#6b6358]">
        Try loading the article again or return to the blog.
      </p>

      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          onClick={() => reset()}
          className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70] transition-colors hover:text-[#1c1b19]"
        >
          Try again
        </button>

        <Link
          href="/?panel=blog"
          className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70] transition-colors hover:text-[#1c1b19]"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}