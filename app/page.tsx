import TriFoldBrochure from "@/components/brochure/TriFoldBrochure";
import type { BlogListPost } from "@/lib/blog/types";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY, PARTICIPANTS_QUERY } from "@/sanity/lib/queries";
import type { Participant } from "@/lib/about/types";

type HomeProps = {
  searchParams: Promise<{
    panel?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { panel } = await searchParams;

  const [{ data: postsData }, { data: participantsData }] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY }),
    sanityFetch({ query: PARTICIPANTS_QUERY }),
  ]);

  const posts = postsData as BlogListPost[];
  const participants = participantsData as Participant[];

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#d8c3a5] px-3">
      <TriFoldBrochure
        posts={posts}
        participants={participants}
        initialPanel={panel === "blog" ? "blog" : undefined}
      />
    </main>
  );
}