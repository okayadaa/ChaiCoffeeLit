import {BookShelf} from '@/components/books/BookShelf'
import type {Book} from '@/lib/books/types'
import {sanityFetch} from '@/sanity/lib/live'
import {BOOKS_QUERY} from '@/sanity/lib/queries'

export default async function BooksPage() {
  const {data} = await sanityFetch({
    query: BOOKS_QUERY,
  })

  const books = data as Book[]

  return (
    <div className="mx-auto w-full max-w-6xl">
      {books.length === 0 ? (
        <p>No book recommendations yet.</p>
      ) : (
        <BookShelf books={books} />
      )}
    </div>
  );
}
