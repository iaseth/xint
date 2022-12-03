import React from 'react';

import './RepubApp.scss';
import Viewer from './Viewer/Viewer';
import HomePage from './HomePage/HomePage';



const APPNAME = "repub";
const LS = window.localStorage;

function getBooksFromLS () {
	const jsonText = LS.getItem(APPNAME);
	if (jsonText) {
		const jo = JSON.parse(jsonText);
		return jo.books || [];
	} else {
		return [];
	}
}

export default function RepubApp () {
	const [fullscreen, setFullscreen] = React.useState(false);
	const [books, setBooks] = React.useState(getBooksFromLS());
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;

	function reloadBooks () {
		setBooks(getBooksFromLS());
		setCurrentBookIndex(-1);
	}

	function addBookToLS (meta, file) {
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {books: []};

		const bookIds = jsonData.books.map(b => b.bookId);
		const maxId = Math.max(0, bookIds);
		const bookId = maxId + 1;

		jsonData.books.push({bookId, meta});
		LS.setItem(APPNAME, JSON.stringify(jsonData));
		reloadBooks();
	}

	function deleteBookFromLS (bookId) {
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {books: []};

		jsonData.books = jsonData.books.filter(b => b.bookId !== bookId);
		LS.setItem(APPNAME, JSON.stringify(jsonData));
		reloadBooks();
	}

	function handleKeyDown (event) {
		if (event.altKey && event.ctrlKey && event.shiftKey) {
			if (event.key) {
				setFullscreen(fullscreen => !fullscreen);
			}
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});

	return (
		<div onKeyDown={handleKeyDown}>
			{currentBook ? <Viewer {...{currentBook}} /> : <HomePage {...{fullscreen, books, addBookToLS, deleteBookFromLS}} />}
		</div>
	);
}
