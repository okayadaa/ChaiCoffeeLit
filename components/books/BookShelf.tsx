import type {Book} from '@/lib/books/types'
import {BookCard} from './BookCard'

type BookShelfProps = {
  books: Book[];
  variant?: "default" | "compact";
}

export function BookShelf({
  books,
  variant = "default"
}: BookShelfProps) {
  return (
    <section
      className={
        variant === "compact"
          ? "grid grid-cols-3 gap-x-4 gap-y-8"
          : "grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4"
      }
    >
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          variant={variant}
        />
      ))}
    </section>
  )
}