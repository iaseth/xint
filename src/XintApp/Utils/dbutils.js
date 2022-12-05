


function getStoreInternal (db, storeName, mode) {
	if (db === null) {
		return null;
	}
	const tx = db.transaction(storeName, mode);
	const store = tx.objectStore(storeName);
	return store;
}

export const getStore = (db, storeName) => getStoreInternal(db, storeName, 'readonly');
export const getStoreW = (db, storeName) => getStoreInternal(db, storeName, 'readwrite');