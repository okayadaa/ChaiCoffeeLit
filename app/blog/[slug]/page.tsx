import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/blog/format";
import type { BlogListPost } from "@/lib/blog/types";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import {
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";


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

  const { data } = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  });
  
  const post = data as {
    title: string;
    slug: string;
    category: string;
    publishedAt: string;
    excerpt?: string;
    body: Parameters<typeof PortableTextRenderer>[0]["value"];
  } | null;

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

  const { data } = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  });
  
  const post = data as {
    title: string;
    slug: string;
    category: string;
    publishedAt: string;
    excerpt?: string;
    body: Parameters<typeof PortableTextRenderer>[0]["value"];
  } | null;

  if (!post) {
    notFound();
  }

  return (
    <article className="journal-article mx-auto w-full max-w-2xl py-8 sm:py-12">
      <p className="font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
        {post.category} · {formatPostDate(post.publishedAt)}
      </p>
      <h1 className="mt-5 max-w-xl font-journal text-4xl leading-[1.05] tracking-tight text-[#1c1b19] sm:text-5xl">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-6 font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
        {post.excerpt}
      </p>
      )}

      <div className="mt-10 border-t border-[#8a7f70]/20 pt-10 font-article text-xl">
        <PortableTextRenderer value={post.body} />
      </div>
      <Link
        href="/?panel=blog" 
        className="mt-16 inline-block font-brochure text-xs uppercase tracking-[0.22em] text-[#8a7f70] transition-colors hover:text-[#1c1b19]"
      >
        ← Back to Blog 
      </Link>
    </article>
  );
}
