import React from 'react';

import './RepubApp.scss';

import Header from './Header';
import Footer from './Footer';

import HomePage from './HomePage/HomePage';
import OptionsPage from './OptionsPage/OptionsPage';
import StorePage from './StorePage/StorePage';
import DebugPage from './DebugPage/DebugPage';

import Viewer from './Viewer/Viewer';



const REPUB_TABS = [
	{Component: HomePage, title: "Home", letter: "H"},
	{Component: StorePage, title: "Store", letter: "S"},
	{Component: OptionsPage, title: "Options", letter: "O"},
	{Component: DebugPage, title: "Debug", letter: "D", hidden: true},
];

const LS = window.localStorage;
const IDB = window.indexedDB;

const APPNAME = "repubapp";
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

export default function RepubApp () {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentTab = REPUB_TABS[currentTabIndex];

	const [fullscreen, setFullscreen] = React.useState(false);
	const [books, setBooks] = React.useState(getBooksFromLS());
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;
	const openViewer = (bookIndex) => {
		setFullscreen(true);
		setCurrentBookIndex(bookIndex);
	};
	const goBackHome = () => {
		setFullscreen(false);
		setCurrentBookIndex(-1);
	};

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


	function reloadBooks () {
		setBooks(getBooksFromLS());
		setCurrentBookIndex(-1);
	}

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


	function handleKeyDown (event) {
		if (event.altKey && event.ctrlKey && event.shiftKey) {
			if (event.key === "F") {
				setFullscreen(fullscreen => !fullscreen);
			} else if (event.key === "D") {
				setCurrentTabIndex(REPUB_TABS.findIndex(tab => tab.title === "Debug"));
			}
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});

	function getCurrentTab () {
		switch (currentTab.title) {
			case "Debug":
				return <DebugPage />;
			case "Store":
				return <StorePage />;
			case "Options":
				return <OptionsPage />;
			case "Home":
			default:
				return <HomePage {...{books, openViewer, addBookToLS, deleteBookFromLS}} />;
		}
	}

	if (currentBook) {
		return <Viewer {...{appDB, currentBook, goBackHome}} />;
	}

	return (
		<div onKeyDown={handleKeyDown}>
			<Header {...{fullscreen, currentTabIndex, setCurrentTabIndex, REPUB_TABS}} />
			{getCurrentTab()}
			<Footer {...{fullscreen}} />
		</div>
	);
}
