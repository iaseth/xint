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

	function deleteBookFromLS (book) {
		reloadBooks();
	}

	if (currentBook) {
		return <Viewer {...{currentBook}} />;
	} else {
		return <HomePage {...{books, addBookToLS, deleteBookFromLS}} />;
	}
}
