import { ArchiveGallery } from "@/components/archive/ArchiveGallery";
import type { ArchiveItem } from "@/lib/archive/types";
import { sanityFetch } from "@/sanity/lib/live";
import { ARCHIVE_ITEMS_QUERY } from "@/sanity/lib/queries";

export default async function ArchivePage() {
  const { data } = await sanityFetch({
    query: ARCHIVE_ITEMS_QUERY,
  });

  const archiveItems = data as ArchiveItem[];

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      {archiveItems.length === 0 ? (
    <div className="flex min-h-[50vh] items-center justify-center px-6 text-center">
    <div>
      <h2 className="text-2xl font-medium">
        The archive is still being gathered.
      </h2>

      <p className="mt-3 text-sm text-neutral-600">
        Stories, events, and moments from Chai Coffee Lit will appear here soon.
      </p>
    </div>
  </div>
) : (
  <ArchiveGallery archiveItems={archiveItems} />
)}
    </div>
  );
}