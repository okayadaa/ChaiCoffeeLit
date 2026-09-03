import type {Book} from '@/lib/books/types'
import {BookCard} from './BookCard'

type BookShelfProps = {
  books: Book[]
}

export function BookShelf({books}: BookShelfProps) {
  return (
    <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
        />
      ))}
    </section>
  )
}