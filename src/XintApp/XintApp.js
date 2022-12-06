import React from 'react';

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
	{name: "epubs", "fields": []},
	{name: "covers", "fields": []},
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
	const openReader = (bookIndex) => setCurrentBookIndex(bookIndex);
	const goBackHome = () => setCurrentBookIndex(-1);

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
				const db = event.target.result;
				DATABASE_TABLES.forEach(table => {
					const store = db.createObjectStore(table.name, {keyPath: 'id'});
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


	if (splashScreen) {
		return <SplashScreen {...{APPNAME}} />;
	} else if (lockScreen) {
		return <LockScreen {...{APPNAME, toggleLockScreen}} />;
	} else if (currentBook) {
		return <ReaderScreen {...{appDB, currentBook, goBackHome}} />;
	} else {
		return <HomeScreen {...{books, openReader, toggleLockScreen, crudUtils}} />;
	}
}
