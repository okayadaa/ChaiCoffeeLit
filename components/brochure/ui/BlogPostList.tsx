import Link from "next/link";
import { formatPostDate } from "@/lib/blog/format";
import type { BlogListPost } from "@/lib/blog/types";

export function BlogPostList({
  posts,
}: {
  posts: BlogListPost[];
}) {
  if (posts.length === 0) {
    return (
      <p className="text-lg leading-relaxed text-[#333333]">
        Blog posts will appear here soon.
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {posts.map((post, index) => (
        <li key={post.slug} className="border-b border-amber-900/10 py-5 first:pt-0 last:border-b-0">
          <Link
            href={`/blog/${post.slug}`}
            className="touch-manipulation block animate-[journal-fade-up_0.45s_ease-out_both]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="text-xl leading-snug text-[#333333]">
              {post.title}
            </span>
            <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-[#333333]">
             {post.author && `By ${post.author}`} · {formatPostDate(post.publishedAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
