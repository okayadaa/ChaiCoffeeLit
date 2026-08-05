import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/blog/format";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog/queries";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  return {
    title: `${post.title} · Chai Coffee Lit`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="journal-article mx-auto w-full max-w-2xl">
      <p className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
        {post.category} · {formatPostDate(post.publishedAt)}
      </p>
      <h1 className="mt-5 font-journal text-4xl leading-tight tracking-tight text-[#1c1b19] sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-12 space-y-6 font-journal text-lg leading-relaxed text-[#3a3630] sm:text-xl sm:leading-relaxed">
        {post.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Link
        href="/"
        className="mt-16 inline-block font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70] transition-colors hover:text-[#1c1b19]"
      >
        ← Café
      </Link>
    </article>
  );
}
