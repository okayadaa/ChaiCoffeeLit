"use client";

import Image from "next/image";
import { useState } from "react";
import { formatArchiveDate } from "@/lib/archive/formatArchiveDate";
import styles from "./ArchivePostcard.module.css";

type ArchivePostcardProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  date: string;
  description: string;
};

export function ArchivePostcard({
  title,
  imageSrc,
  imageAlt,
  date,
  description,
}: ArchivePostcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article
      className={styles.postcard}
      onClick={() => setFlipped((previous) => !previous)}
    >
      <button
        type="button"
        className={`${styles.flipButton} ${flipped ? styles.flipButtonBehind : ""}`}
        aria-label={flipped ? `Show photograph for ${title}` : `Read the back of ${title}`}
      />
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        <div
          className={`${styles.face} ${styles.front}`}
          inert={flipped}
          aria-hidden={flipped}
        >
          <span className={styles.photo}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 94vw, 380px"
              className="object-cover"
            />
          </span>
        </div>

        <div
          className={`${styles.face} ${styles.back}`}
          inert={!flipped}
          aria-hidden={!flipped}
        >
          <div className={styles.postmark} aria-hidden="true">Chai Coffee Lit · Postcard</div>
          <div className={styles.message} data-panel-scroll-region tabIndex={flipped ? 0 : -1}>
            <p className={styles.date}>{formatArchiveDate(date)}</p>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
