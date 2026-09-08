import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import type { Participant } from "@/lib/about/types";

import { ConnectEmailLink } from "./ConnectEmailLink";
import { TeamGrid } from "./TeamGrid";
import { PanelBackButton } from "@/components/brochure/ui/PanelBackButton";
import { PanelScrollBody } from "@/components/brochure/ui/PanelScrollBody";
import { ScrambleText } from "@/components/brochure/ui/ScrambleText";

type AboutPanelProps = {
  participants: Participant[];
  onBack: () => void;
};

export function AboutPanel({
  participants,
  onBack,
}: AboutPanelProps) {
  const previewParticipants = participants.slice(0, 4);

  return (
    <div className="relative z-10 flex h-full flex-col px-8 py-10">
      <PanelBackButton onBack={onBack} />

      <div className="mb-8">
        <h3 className="text-4xl text-[#333333]">
          <ScrambleText text="About Us" />
        </h3>
      </div>

      <PanelScrollBody className="pr-2">
        {previewParticipants.length === 0 ? (
          <p className="text-center text-sm leading-relaxed text-[#333333]">
            Team profiles will appear here soon.
          </p>
        ) : (
          <TeamGrid participants={previewParticipants} variant="preview" />
        )}

        <Link
          href="/team"
          className="mt-6 inline-block text-sm text-blue-500 underline underline-offset-4 hover:text-blue-600"
        >
          View the Team
        </Link>

        <div className="mt-16 border-t border-[#8a7f70]/20 pt-8 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
            Let&apos;s Connect
          </p>

          <div className="mt-4 flex justify-center gap-6 text-sm text-[#333333]">
            <a
              href="https://www.instagram.com/sexgenlab?igsi=MWg2azRhM3c3aHRoag=="
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-70"
            >
              <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
              Instagram
            </a>

            <ConnectEmailLink />
          </div>
        </div>
      </PanelScrollBody>
    </div>
  );
}
