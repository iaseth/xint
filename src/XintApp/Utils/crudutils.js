import {APPNAME} from '../XintApp';

const LS = window.localStorage;



const DEFAULT_JSON = {
	books: [],
	bookshelves: [],
	options: {}
};



const getAppdataFromLS = () => {
	let jsonText = LS.getItem(APPNAME);
	if (!jsonText) {
		saveAppdataToLS(DEFAULT_JSON);
		jsonText = LS.getItem(APPNAME);
	}

	return JSON.parse(jsonText);
};

const saveAppdataToLS = (appdata) => {
	LS.setItem(APPNAME, JSON.stringify(appdata));
};

export const LSU = {
	getAppdataFromLS, saveAppdataToLS
};



export function getCrudUtils (appDB, reloadAppdata) {
	function addBookToLS (data, file) {
		const {meta, details, coverBlob} = data;
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {...DEFAULT_JSON};

		const bookIds = jsonData.books.map(b => b.bookId);
		const maxId = Math.max(0, ...bookIds);
		const bookId = maxId + 1;

		jsonData.books.push({bookId, meta});
		LS.setItem(APPNAME, JSON.stringify(jsonData));

		const tx = appDB.transaction(['books', 'covers', 'epubs'], 'readwrite');
		tx.objectStore('books').put({id: bookId, details});
		tx.objectStore('covers').put({id: bookId, coverBlob});
		tx.objectStore('epubs').put({id: bookId, file});

		tx.oncomplete = () => {
			console.log(`Saved EPUB to database: bookId '#${bookId}'`);
		};

		reloadAppdata();
	}

	function deleteBookFromLS (bookId) {
		const jsonText = LS.getItem(APPNAME);
		const jsonData = jsonText ? JSON.parse(jsonText) : {...DEFAULT_JSON};

		jsonData.books = jsonData.books.filter(b => b.bookId !== bookId);
		LS.setItem(APPNAME, JSON.stringify(jsonData));

		const tx = appDB.transaction(['books', 'covers', 'epubs'], 'readwrite');
		tx.objectStore('books').delete(bookId);
		tx.objectStore('covers').delete(bookId);
		tx.objectStore('epubs').delete(bookId);

		tx.oncomplete = () => {
			console.log(`Deleted EPUB from database: bookId '#${bookId}'`);
		};

		reloadAppdata();
	}

	return {addBookToLS, deleteBookFromLS};
}
