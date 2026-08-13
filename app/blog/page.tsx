import {BlogPostList} from "@/components/brochure/ui/BlogPostList";
import {client} from "@/sanity/lib/client";
import {POSTS_QUERY} from "@/sanity/lib/queries";

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-10 text-3xl">Blog</h1>

      <BlogPostList posts={posts} />
    </div>
  );
}