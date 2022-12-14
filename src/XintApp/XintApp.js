import React from 'react';
import JSZip from 'jszip';

import './XintApp.scss';

import HomeScreen from './HomeScreen/HomeScreen';
import ReaderScreen from './ReaderScreen/ReaderScreen';
import SplashScreen from './SplashScreen/SplashScreen';
import LockScreen from './LockScreen/LockScreen';

import {LSU, getCrudUtils} from './Utils';

const IDB = window.indexedDB;

export const APPNAME = "xint";
const DATABASE_NAME = APPNAME;
const DATABASE_TABLES = [
	{name: "books", "fields": []},
	{name: "covers", "fields": []},
	{name: "epubs", "fields": []},
];


export default function XintApp () {
	// shows or hides splash/lock screen
	const [splashScreen, setSplashScreen] = React.useState(true);
	const [lockScreen, setLockScreen] = React.useState(false);
	const toggleLockScreen = () => setLockScreen(x => !x);

	const [appdata, setAppdata] = React.useState(LSU.getAppdataFromLS());
	const reloadAppdata = () => {
		setAppdata(LSU.getAppdataFromLS());
		setCurrentBookIndex(-1);
	};

	const {books, bookshelves, options} = appdata;
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;
	const [readerScreen, setReaderScreen] = React.useState(false);

	// for the current book
	const [zip, setZip] = React.useState(null);
	const [details, setDetails] = React.useState({
		tocItems: []
	});

	const openReader = (bookIndex) => {
		const book = books[bookIndex];
		const {bookId, meta} = book;

		// gets zip from database
		const tx = appDB.transaction(['books', 'epubs'], 'readonly');
		const reqBook = tx.objectStore('books').get(bookId);
		const reqEpub = tx.objectStore('epubs').get(bookId);
		tx.oncomplete = () => {
			const bookResult = reqBook.result;
			const epubResult = reqEpub.result;
			const {details} = bookResult;
			const zip = new JSZip();

			zip.loadAsync(epubResult.file).then(zip => {
				setZip(zip);
				setDetails(details);
				setCurrentBookIndex(bookIndex);
				setReaderScreen(true);
			});
		};
	};
	const goBackHome = () => {
		setCurrentBookIndex(-1);
		setReaderScreen(false);
	};

	const getOption = (k) => options[k] || null;
	const setOption = (k, v) => {
		const nuAppdata = {...appdata};
		nuAppdata.options[k] = v;
		LSU.saveAppdataToLS(nuAppdata);
	};

	const [appDB, setAppDB] = React.useState(null);
	const crudUtils = getCrudUtils(appDB, reloadAppdata);
	React.useEffect(() => {
		if (appDB === null) {
			const request = IDB.open(DATABASE_NAME, 1);
			request.onsuccess = (event) => {
				const db = event.target.result;
				setAppDB(db);
			};

			request.onupgradeneeded = (event) => {
				console.log(`Created database: '${DATABASE_NAME}'`);
				const db = event.target.result;
				DATABASE_TABLES.forEach(table => {
					const store = db.createObjectStore(table.name, {keyPath: 'id'});
					console.log(`\tCreated objectStore: '${table.name}'`);
					table.fields.forEach(field => {
						store.createIndex(field, field, {unique: false});
					});
				});
			};
		}

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


	const getImageFromDB = (bookId, callback) => {
		const tx = appDB.transaction(['covers'], 'readonly');
		const req = tx.objectStore('covers').get(bookId);
		tx.oncomplete = () => {
			const coverBlob = req.result ? req.result.coverBlob : null;
			callback(coverBlob);
		};
	};


	if (splashScreen || appDB === null) {
		return <SplashScreen {...{APPNAME}} />;
	} else if (lockScreen) {
		return <LockScreen {...{APPNAME, toggleLockScreen}} />;
	} else if (readerScreen && currentBook) {
		return <ReaderScreen {...{currentBook, zip, details, goBackHome}} />;
	} else {
		return <HomeScreen {...{books, getImageFromDB, openReader, toggleLockScreen, crudUtils}} />;
	}
}
