import BookBox from './BookBox';



export default function BookList ({books, deleteBookFromLS}) {

	return (
		<section className="max-w-5xl mx-auto py-6 px-4">
			<header>
				<h2>BookList</h2>
				<h4>{books.length} books</h4>
			</header>

			<main className="py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
				{books.map(book => <BookBox key={book.bookId} {...{book, deleteBookFromLS}} />)}
			</main>
		</section>
	);
}
