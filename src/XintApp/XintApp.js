import React from 'react';

import './XintApp.scss';

import HomeScreen from './HomeScreen/HomeScreen';
import ReaderScreen from './ReaderScreen/ReaderScreen';
import SplashScreen from './SplashScreen/SplashScreen';
import LockScreen from './LockScreen/LockScreen';

const LS = window.localStorage;
const IDB = window.indexedDB;

const APPNAME = "xint";
const DATABASE_NAME = APPNAME;
const DATABASE_TABLES = [
	{name: "epubs", "fields": []},
	{name: "covers", "fields": []},
];

const DEFAULT_JSON = {
	books: [],
	settings: {}
};

function getBooksFromLS () {
	const jsonText = LS.getItem(APPNAME);
	if (jsonText) {
		const jo = JSON.parse(jsonText);
		return jo.books || [];
	} else {
		return [];
	}
}

export default function XintApp () {
	// shows or hides splash/lock screen
	const [splashScreen, setSplashScreen] = React.useState(true);
	const [lockScreen, setLockScreen] = React.useState(false);
	const toggleLockScreen = () => setLockScreen(x => !x);

	const [books, setBooks] = React.useState(getBooksFromLS());
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;

	const openReader = (bookIndex) => setCurrentBookIndex(bookIndex);
	const goBackHome = () => setCurrentBookIndex(-1);

	const [appDB, setAppDB] = React.useState(null);
	React.useEffect(() => {
		const request = IDB.open(DATABASE_NAME, 1);
		request.onsuccess = (event) => {
			const db = event.target.result;
			setAppDB(db);
		};

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			DATABASE_TABLES.forEach(table => {
				const store = db.createObjectStore(table.name, {keyPath: 'id'});
				table.fields.forEach(field => {
					store.createIndex(field, field, {unique: false});
				});
			});
		};

		return () => {
			if (appDB) {
				appDB.close();
			}
		};
	}, []);


	React.useEffect(() => {
		setTimeout(() => {
			// hides splashscreen after 5s
			setSplashScreen(false);
		}, 1000);
	}, []);


	function addBookToLS (meta, file) {
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {...DEFAULT_JSON};

		const bookIds = jsonData.books.map(b => b.bookId);
		const maxId = Math.max(0, bookIds);
		const bookId = maxId + 1;

		jsonData.books.push({bookId, meta});
		LS.setItem(APPNAME, JSON.stringify(jsonData));

		const tx = appDB.transaction('epubs', 'readwrite');
		tx.objectStore('epubs').put({id: bookId, file});
		tx.oncomplete = () => {
			console.log(`Saved EPUB to database: bookId '#${bookId}'`);
		};

		reloadBooks();
	}

	function deleteBookFromLS (bookId) {
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {...DEFAULT_JSON};

		jsonData.books = jsonData.books.filter(b => b.bookId !== bookId);
		LS.setItem(APPNAME, JSON.stringify(jsonData));

		const tx = appDB.transaction('epubs', 'readwrite');
		tx.objectStore('epubs').delete(bookId);
		tx.oncomplete = () => {
			console.log(`Deleted EPUB from database: bookId '#${bookId}'`);
		};

		reloadBooks();
	}


	function reloadBooks () {
		setBooks(getBooksFromLS());
		setCurrentBookIndex(-1);
	}

	if (splashScreen) {
		return <SplashScreen {...{APPNAME}} />;
	} else if (lockScreen) {
		return <LockScreen {...{APPNAME, toggleLockScreen}} />;
	} else if (currentBook) {
		return <ReaderScreen {...{appDB, currentBook, goBackHome}} />;
	} else {
		return <HomeScreen {...{addBookToLS, deleteBookFromLS, books, openReader, toggleLockScreen}} />;
	}
}
