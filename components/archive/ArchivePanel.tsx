"use client";

import { PanelBackButton } from "@/components/brochure/ui/PanelBackButton";
import { PanelScrollBody } from "@/components/brochure/ui/PanelScrollBody";
import { ScrambleText } from "@/components/brochure/ui/ScrambleText";
import { ArchivePostcard } from "@/components/archive/ArchivePostcard";
import type { ArchiveItem } from "@/lib/archive/types";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./ArchivePanel.module.css";

type ArchivePanelProps = {
  archiveItems: ArchiveItem[];
  onBack: () => void;
};

export function ArchivePanel({ archiveItems, onBack }: ArchivePanelProps) {
  return (
    <div className="relative z-10 flex h-full flex-col p-12">
      <PanelBackButton onBack={onBack} />

      <h3 className="mb-8 text-4xl text-[#333333]">
        <ScrambleText text="Archive" />
      </h3>

      <PanelScrollBody>
        {archiveItems.length === 0 ? (
          <p className="text-sm leading-relaxed text-neutral-600">
            The archive is being gathered. Check back soon.
          </p>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-neutral-600">Tap a postcard to flip it</p>
            <div className={styles.postcards}>
              {archiveItems.slice(0, 5).map((item, index) => {
                const imageUrl = urlFor(item.image)
                  .width(900)
                  .height(600)
                  .fit("crop")
                  .url();

                return (
                  <div
                    key={item._id}
                    className={styles.postcard}
                    style={{ "--postcard-index": index } as CSSProperties}
                  >
                    <ArchivePostcard
                      title={item.title}
                      imageSrc={imageUrl}
                      imageAlt={item.title}
                      date={item.eventDate}
                      description={item.description}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PanelScrollBody>

      {archiveItems.length > 5 && (
        <Link
          href="/archive"
          className="mt-6 inline-block text-sm text-blue-500 underline underline-offset-4 hover:text-blue-600"
        >
          View for more
        </Link>
      )}
    </div>
  );
}
