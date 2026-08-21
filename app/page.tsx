import TriFoldBrochure from "@/components/brochure/TriFoldBrochure";
import type { BlogListPost } from "@/lib/blog/types";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

type HomeProps = {
  searchParams: Promise<{
    panel?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { panel } = await searchParams;

  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });
  
  const posts = data as BlogListPost[];

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#d8c3a5] px-3">
      <TriFoldBrochure
        posts={posts}
        initialPanel={panel === "blog" ? "blog" : undefined}
      />
    </main>
  );
}