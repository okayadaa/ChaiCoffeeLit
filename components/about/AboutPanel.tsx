import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Participant } from "@/lib/about/types";

import { ParticipantBio } from "./ParticipantBio";
import { PanelBackButton } from "@/components/brochure/ui/PanelBackButton";
import { ScrambleText } from "@/components/brochure/ui/ScrambleText";

type AboutPanelProps = {
  participants: Participant[];
  onBack: () => void;
};

export function AboutPanel({
  participants,
  onBack,
}: AboutPanelProps) {
  return (
    <div className="relative z-10 flex h-full flex-col px-8 py-10">
      <PanelBackButton onBack={onBack} />

      <div className="mb-8">
        <h3 className="text-4xl text-[#333333]">
          <ScrambleText text="About" />
        </h3>
      </div>

    <div className="min-h-0 flex-1 overflow-y-auto pr-2">
      {participants.length === 0 ? (
        <p className="text-sm leading-relaxed text-[#333333] text-center">
          Team profiles will appear here soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {participants.map((participant) => (
            <ParticipantBio
              key={participant._id}
              participant={participant}
        />
      ))}
    </div> )}

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

          <a
            href="mailto:chaicoffeelit@gmail.com"
            className="inline-flex items-center gap-2 hover:opacity-70"
          >
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            Email
          </a>
        </div>
      </div>
    </div>
 </div>
  );
}
