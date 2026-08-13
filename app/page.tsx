import TriFoldBrochure from "@/components/brochure/TriFoldBrochure";
import type { BlogListPost } from "@/lib/blog/types";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const posts = await client.fetch<BlogListPost[]>(POSTS_QUERY);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#d8c3a5] px-3">
      <TriFoldBrochure posts={posts} />
    </main>
  );
}