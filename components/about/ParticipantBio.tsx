"use client";

import { useState } from "react";
import Image from "next/image";

import type { Participant } from "@/lib/about/types";
import { urlFor } from "@/sanity/lib/image";

type ParticipantBioProps = {
  participant: Participant;
};

const PREVIEW_WORD_COUNT = 49;

export function ParticipantBio({ participant }: ParticipantBioProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const imageUrl = urlFor(participant.image)
    .width(320)
    .height(320)
    .fit("crop")
    .url();

  const words = participant.bio.trim().split(/\s+/);
  const hasLongBio = words.length > PREVIEW_WORD_COUNT;

  const displayedBio =
    hasLongBio && !isExpanded
      ? `${words.slice(0, PREVIEW_WORD_COUNT).join(" ")}...`
      : participant.bio;

  return (
    <article className="flex min-w-0 flex-col items-center text-center">
      <Image
        src={imageUrl}
        alt={`${participant.name} profile`}
        width={128}
        height={128}
        className="h-32 w-32 shrink-0 rounded-full object-cover"
      />

      <h4 className="mt-4 text-base font-semibold leading-tight text-[#333333]">
        {participant.name}
      </h4>

      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#8a7f70]">
        {participant.role}
      </p>

      <p className="mt-3 max-w-[170px] text-xs leading-relaxed text-[#333333]">
        {displayedBio}
      </p>

      {hasLongBio && (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="mt-3 text-xs font-medium text-[#8a7f70] underline underline-offset-4 hover:opacity-70"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  );
}