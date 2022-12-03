import {Button} from '../../Utils';



export default function BookBox ({book, deleteBookFromLS}) {
	const meta = book.meta;

	return (
		<article className="bg-white ch:px-4 rounded shadow overflow-hidden cursor-pointer">
			<header className="bg-blue-300 text-white text-center py-12">
				<h1>Book</h1>
			</header>

			<main className="py-4">
				<h4 className="text-blue-800 py-1">{meta.title}</h4>
				<h5>by <b className="text-blue-800">{meta.author}</b></h5>
			</main>

			<footer>
				<section className="py-4">
					<Button text="Delete" onClick={() => deleteBookFromLS(book.bookId)} />
				</section>
			</footer>
		</article>
	);
}
