import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/blog/format";
import type { BlogListPost } from "@/lib/blog/types";
import { client } from "@/sanity/lib/client";
import {
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";


type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await client.fetch<BlogListPost[]>(POSTS_QUERY);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await client.fetch(POST_BY_SLUG_QUERY, {
    slug,
  });

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: `${post.title} · Chai Coffee Lit`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;

  const post = await client.fetch(POST_BY_SLUG_QUERY, {
    slug,
  });

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
      <div className="mt-12 font-journal text-lg leading-relaxed text-[#3a3630] sm:text-xl sm:leading-relaxed">
  <PortableText value={post.body} />
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
