import BookBox from './BookBox';



export default function BookList ({books, openViewer, deleteBookFromLS}) {

	return (
		<section className="max-w-5xl mx-auto py-6 px-2">
			<header className="px-2 py-2">
				<h2>BookList</h2>
				<h4>{books.length} books</h4>
			</header>

			<main className="py-4 grid gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
				{books.map((book, k) => <BookBox key={book.bookId} {...{k, book, openViewer, deleteBookFromLS}} />)}
			</main>
		</section>
	);
}
