import { TeamGrid } from "@/components/about/TeamGrid";
import type { Participant } from "@/lib/about/types";
import { sanityFetch } from "@/sanity/lib/live";
import { PARTICIPANTS_QUERY } from "@/sanity/lib/queries";

export default async function TeamPage() {
  const { data } = await sanityFetch({
    query: PARTICIPANTS_QUERY,
  });

  const participants = data as Participant[];

  return (
    <div className="mx-auto w-full max-w-6xl">
      {participants.length === 0 ? (
        <p>Team profiles will appear here soon.</p>
      ) : (
        <TeamGrid participants={participants} />
      )}
    </div>
  );
}
