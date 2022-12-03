import React from 'react';

import './RepubApp.scss';
import Viewer from './Viewer/Viewer';
import HomePage from './HomePage/HomePage';



export default function RepubApp () {
	const [books, setBooks] = React.useState([]);
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;

	if (currentBook) {
		return <Viewer {...{currentBook}} />;
	} else {
		return <HomePage {...{books, setBooks}} />;
	}
}
