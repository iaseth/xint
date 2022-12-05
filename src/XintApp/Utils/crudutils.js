import {APPNAME} from '../XintApp';

const LS = window.localStorage;



const DEFAULT_JSON = {
	books: [],
	bookshelves: [],
	options: {}
};


export function getAppdataFromLS () {
	const jsonText = LS.getItem(APPNAME);
	if (jsonText) {
		const jo = JSON.parse(jsonText);
		return jo;
	} else {
		return DEFAULT_JSON;
	}
}


export function getCrudUtils (appDB, reloadAppdata) {
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

		reloadAppdata();
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

		reloadAppdata();
	}

	return {addBookToLS, deleteBookFromLS};
}
