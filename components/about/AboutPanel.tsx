import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { ConnectEmailLink } from "./ConnectEmailLink";
import { PanelBackButton } from "@/components/brochure/ui/PanelBackButton";
import { PanelScrollBody } from "@/components/brochure/ui/PanelScrollBody";
import { ScrambleText } from "@/components/brochure/ui/ScrambleText";

type AboutPanelProps = {
  onBack: () => void;
};

const MISSION_QUOTE =
  '"It is not permissible that the authors of devastation may also be innocent. It is the innocence that constitutes the crime."';

const MISSION_PARAGRAPHS = [
  "Chai coffee Lit began as a Book Club at Hunter College when our founder, Kanishka, noticed that postcolonial narratives featured ornamentally as electives in the English Major and Colored authors were glossed over even in student run bookclubs.",
  "To fill these silences we turned to our community to curate syllabi, workshopped poetry and journal entries to create a space of radical relief for decolonial scholarship. Our critical engagement with our narratives has emboldened us to refuse the marginal/ethnicized status and has transformed how we relate to each other. Since we have evolved into an Artist Collective, aimed to spread the insights we’ve gathered from our study and creative practice to the community we wish to mould and live in.",
  "As genocidal flames grow while there is a harrowing silence in space of chants, diverted energies in space of synchronized focus, and an ever-growing chasm between political and personal lives. Academic convictions have soured to cowardice. Subjugation has been sold as subversion. All the while the violence is being committed as Foucault says “at the level of species”.",
  "Submerged in this violence we don't succumb to despair. We, through feeling and study group conversations, orient ourselves towards a language aimed at action, at preservation of our thoughts and sustenance for our future critical work that begins now.",
  'Like Audre Lorde affirms, "where language does not yet exist, it is our poetry which helps to fashion it.” Poetry spoken here is our daydream, consciously stitched in union first at the brutalist Hunter West building that represents a lot of horrors but many more joys. Joy that we bring outside the walls of the institutions that fail to protect us, we let them have their knowledge and bring to you our wisdom.',
];

export function AboutPanel({ onBack }: AboutPanelProps) {
  return (
    <div className="relative z-10 flex h-full flex-col px-8 py-10">
      <PanelBackButton onBack={onBack} />

      <div className="mb-8">
        <h3 className="text-4xl text-[#333333]">
          <ScrambleText text="About Us" />
        </h3>
        <p className="mt-3 text-center text-md text-[#333333]">
          - Get over your colonial hangover -
        </p>
      </div>

      <PanelScrollBody className="pr-2">
        <section aria-labelledby="mission-statement-heading">
          <h4
            id="mission-statement-heading"
            className="text-xl font-semibold text-[#333333]"
          >
            Mission Statement
          </h4>

          <blockquote className="mt-5 text-center text-md leading-relaxed text-[#333333]">
            <p>{MISSION_QUOTE}</p>
            <footer className="mt-3 text-sm">
              <cite className="italic">James Baldwin</cite>
            </footer>
          </blockquote>

          <div className="mt-8 space-y-4 text-left text-md leading-relaxed text-[#333333]">
            {MISSION_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div>
              <p>Through our website we bring to you–</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Blogs on Cultural Crit &amp; Book Thoughts</li>
                <li>Our Bookshelf</li>
                <li>Archive of our initiatives</li>
              </ul>
            </div>

            <p>We are here to disquiet and disrupt.</p>
          </div>
        </section>

        <Link
          href="/team"
          className="mt-6 inline-block text-sm text-blue-500 underline underline-offset-4 hover:text-blue-600"
        >
          View the team
        </Link>

        <div className="mt-16 border-t border-[#8a7f70]/20 pt-8 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7f70]">
            Let&apos;s Connect
          </p>

          <div className="mt-4 flex justify-center gap-6 text-sm text-[#333333]">
            <a
              href="https://www.instagram.com/chaicoffeelit?stkn=MXg0aDVsOTZzMG5lcg=="
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
