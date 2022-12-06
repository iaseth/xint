import React from 'react';

import BookAdder from './BookAdder';
import BookList from './BookList/BookList';
import Footer from '../Footer';
import {Button} from '../../Utils';

const DASH_TABS = [
	{Component: "DashPage", title: "Dash", letter: "D"},
	{Component: "StorePage", title: "Store", letter: "S"},
	{Component: "OptionsPage", title: "Options", letter: "O"},
];



export default function DashPage ({fullscreen, books, openReader, crudUtils}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const fref = React.useRef(null);

	const [currentFile, setCurrentFile] = React.useState(null);
	const clearCurrentFile = () => setCurrentFile(null);

	const [showBookAdder, setShowBookAdder] = React.useState(false);
	const hideBookAdder = () => setShowBookAdder(false);

	const {addBookToLS, deleteBookFromLS} = crudUtils;

	function handleUploadChange (event) {
		const firstFile = event.target.files[0] || null;
		if (firstFile && firstFile.type === "application/epub+zip") {
			setCurrentFile(firstFile);
			setShowBookAdder(true);
		}
	}

	return (
		<div className="bg-slate-100">

			<main className="min-h-screen">
				<BookList {...{books, openReader, deleteBookFromLS}} />
			</main>

			<footer className="bg-slate-200">
				{showBookAdder && <BookAdder {...{currentFile, clearCurrentFile, hideBookAdder, addBookToLS}} />}

				{!showBookAdder && <section className="max-w-lg mx-auto px-4">
					<header className="py-6">
						<input ref={fref} type="file" hidden onChange={handleUploadChange} />
						<Button onClick={() => fref.current.click()} text="Open Ebook" />
					</header>
				</section>}

			</footer>

			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={DASH_TABS} />

		</div>
	);
}
