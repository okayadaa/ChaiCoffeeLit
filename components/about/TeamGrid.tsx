import type { Participant } from "@/lib/about/types";

import { ParticipantBio } from "./ParticipantBio";

type TeamGridProps = {
  participants: Participant[];
  variant?: "preview" | "page";
};

export function TeamGrid({
  participants,
  variant = "page",
}: TeamGridProps) {
  return (
    <section
      className={
        variant === "preview"
          ? "grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2"
          : "grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-4"
      }
    >
      {participants.map((participant) => (
        <ParticipantBio
          key={participant._id}
          participant={participant}
          variant={variant}
        />
      ))}
    </section>
  );
}
