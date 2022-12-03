import React from 'react';

import BookAdder from './BookAdder';
import BookList from './BookList/BookList';
import {Header, Footer, Button} from '../Utils';



export default function HomePage ({fullscreen, books, addBookToLS, deleteBookFromLS}) {
	const fref = React.useRef(null);

	const [currentFile, setCurrentFile] = React.useState(null);
	const clearCurrentFile = () => setCurrentFile(null);

	const [showBookAdder, setShowBookAdder] = React.useState(false);
	const hideBookAdder = () => setShowBookAdder(false);

	function handleUploadChange (event) {
		const firstFile = event.target.files[0] || null;
		if (firstFile && firstFile.type === "application/epub+zip") {
			setCurrentFile(firstFile);
			setShowBookAdder(true);
		}
	}

	return (
		<div>
			<Header {...{fullscreen}} />

			<header className="bg-slate-200">
				{showBookAdder && <BookAdder {...{currentFile, clearCurrentFile, hideBookAdder, addBookToLS}} />}

				{!showBookAdder && <section className="max-w-lg mx-auto px-4">
					<header className="py-6">
						<input ref={fref} type="file" hidden onChange={handleUploadChange} />
						<Button onClick={() => fref.current.click()} text="Open Ebook" />
					</header>
				</section>}

			</header>

			<main className="min-h-screen bg-slate-100">
				<BookList {...{books, deleteBookFromLS}} />
			</main>

			<Footer {...{fullscreen}} />
		</div>
	);
}