import { BlurredCafeBackground } from "@/components/brochure/BlurredCafeBackground";
import TriFoldBrochure from "@/components/brochure/TriFoldBrochure";
import type { BlogListPost } from "@/lib/blog/types";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY, PARTICIPANTS_QUERY, BOOKS_QUERY, ARCHIVE_ITEMS_QUERY } from "@/sanity/lib/queries";
import type { Participant } from "@/lib/about/types";
import type {Book} from "@/lib/books/types";
import type { ArchiveItem } from "@/lib/archive/types";

type HomeProps = {
  searchParams: Promise<{
    panel?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { panel } = await searchParams;

  const [{ data: postsData }, { data: participantsData }, { data: booksData }, { data: archiveItemsData }] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY }),
    sanityFetch({ query: PARTICIPANTS_QUERY }),
    sanityFetch({ query: BOOKS_QUERY }),
    sanityFetch({ query: ARCHIVE_ITEMS_QUERY }),
  ]);

  const posts = postsData as BlogListPost[];
  const participants = participantsData as Participant[];
  const books = booksData as Book[];
  const archiveItems = archiveItemsData as ArchiveItem[];

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden px-3">
      <BlurredCafeBackground />
      <div className="relative z-10 w-full">
        <TriFoldBrochure
          posts={posts}
          books={books}
          participants={participants}
          archiveItems={archiveItems}
          initialPanel={
            panel === "blog" || panel === "books" || panel === "archive" || panel === "about"
              ? panel
              : undefined
          }
        />
      </div>
    </main>
  );
}