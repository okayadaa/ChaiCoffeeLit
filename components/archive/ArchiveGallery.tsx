import type { ArchiveItem } from "@/lib/archive/types";
import { urlFor } from "@/sanity/lib/image";
import type { CSSProperties } from "react";
import styles from "./ArchiveGallery.module.css";
import { ArchivePostcard } from "./ArchivePostcard";

type ArchiveGalleryProps = {
  archiveItems: ArchiveItem[];
};

export function ArchiveGallery({ archiveItems }: ArchiveGalleryProps) {
  return (
    <section className={styles.gallery}>
      {archiveItems.map((item, index) => {
        const imageUrl = urlFor(item.image)
          .width(900)
          .height(600)
          .fit("crop")
          .url();

        return (
          <div
            key={item._id}
            className={styles.slot}
            style={{ "--postcard-index": index } as CSSProperties}
          >
            <div className="mx-auto w-full max-w-[380px]">
              <ArchivePostcard
                title={item.title}
                imageSrc={imageUrl}
                imageAlt={item.title}
                date={item.eventDate}
                description={item.description}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
