import type { ArchiveItem } from "@/lib/archive/types";
import { urlFor } from "@/sanity/lib/image";
import { formatArchiveDate } from "@/lib/archive/formatArchiveDate";
import Image from "next/image";

type ArchiveGalleryProps = {
  archiveItems: ArchiveItem[];
};

export function ArchiveGallery({
  archiveItems,
}: ArchiveGalleryProps) {
  return (
    <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {archiveItems.map((item) => {
        const imageUrl = urlFor(item.image)
          .width(1400)
          .height(1050)
          .fit("crop")
          .url();

        return (
          <article
            key={item._id}
            className="min-w-0 bg-[#f7f2e8] p-4 shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
              <Image
                src={imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                {formatArchiveDate(item.eventDate)}
              </p>

              <h2 className="mt-2 min-w-0 break-words text-2xl font-medium">
                {item.title}
              </h2>

              <p className="mt-3 text-base leading-relaxed break-words text-neutral-700">
                {item.description}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}