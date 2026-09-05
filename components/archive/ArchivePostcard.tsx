import Image from "next/image";
import { formatArchiveDate } from "@/lib/archive/formatArchiveDate";

type ArchivePostcardProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  date: string;
};

export function ArchivePostcard({
  title,
  imageSrc,
  imageAlt,
  date,
}: ArchivePostcardProps) {
  return (
    <div className="mx-auto w-[94%] rotate-[-1deg] bg-[#f7f2e8] p-5 shadow-md">
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>

      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          {formatArchiveDate(date)}
        </p>

        <h2 className="mt-1 text-xl font-medium">
          {title}
        </h2>

      </div>
    </div>
  );
}