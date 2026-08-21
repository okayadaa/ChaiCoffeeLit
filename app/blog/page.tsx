import {BlogPostList} from "@/components/brochure/ui/BlogPostList";
import { sanityFetch } from "@/sanity/lib/live";
import {POSTS_QUERY} from "@/sanity/lib/queries";
import type { BlogListPost } from "@/lib/blog/types";

export default async function BlogPage() {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });

  const posts = data as BlogListPost[];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-10 text-3xl">Blog</h1>

      <BlogPostList posts={posts} />
    </div>
  );
}