import type {Book} from '@/lib/books/types'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'

type BookCardProps = {
  book: Book;
  variant?: "default" | "compact";
}

export function BookCard({
  book,
  variant = "default"
}: BookCardProps) {
  return (
    <article className="min-w-0 space-y-2 text-center">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md">
        <Image
          src={urlFor(book.coverImage).width(600).height(900).url()}
          alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
      </div>

      <h2
        className={
          variant === "compact"
            ? "min-w-0 break-words text-center text-xs font-medium leading-snug line-clamp-2"
            : "text-center text-lg font-medium"
        }
      > 
        {book.title}
      </h2>

      {variant !== "compact" && book.author && (
        <p className="text-sm text-neutral-600">
          {book.author}
        </p>
      )}
    </article>
  )
}