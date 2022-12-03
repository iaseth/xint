


export default function BookBox ({book}) {
	const meta = book.meta;

	return (
		<article className="max-w-sm rounded shadow overflow-hidden cursor-pointer">
			<header className="bg-blue-300 text-white text-center px-4 py-12">
				<h1>Book</h1>
			</header>

			<main className="bg-white px-4 py-4">
				<h4 className="text-blue-800 py-1">{meta.title}</h4>
				<h5>by <b className="text-blue-800">{meta.author}</b></h5>
			</main>
		</article>
	);
}
