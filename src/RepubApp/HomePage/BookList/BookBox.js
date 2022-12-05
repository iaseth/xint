import React from 'react';

import {Button, ShowMoreButton} from '../../Utils';



export default function BookBox ({k, book, openViewer, deleteBookFromLS}) {
	const {meta} = book;
	const [expanded, setExpanded] = React.useState(false);

	return (
		<div>
			<article className="bg-white rounded shadow overflow-hidden flex flex-col">
				<header className="grow flex ch:basis-0 ch:grow">
					<section className="h-64 bg-red-500 text-white py-12 cursor-pointer flex" onClick={() => openViewer(k)}>
						<h1 className="m-auto">Book</h1>
					</section>

					<section className="flex flex-col">
						<div className="px-4 py-2 grow">
							<h4 className="text-blue-800 py-1">{meta.title}</h4>
							<h5 className="text-blue-800">{meta.author}</h5>
						</div>

						<div className="px-4 py-4">
							<ShowMoreButton onClick={() => setExpanded(x => !x)} className="mx-0" />
						</div>
					</section>
				</header>

				<footer hidden={!expanded} className="border-t-2 border-red-500">
					<section className="px-4 py-4">
						<Button text="Delete" onClick={() => deleteBookFromLS(book.bookId)} />
					</section>
				</footer>
			</article>
		</div>
	);
}
