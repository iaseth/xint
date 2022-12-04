import React from 'react';
import path from 'path-browserify';
import JSZip from 'jszip';

import TocView from './TocView/TocView';
import LoadingView from './LoadingView/LoadingView';
import PageView from './PageView/PageView';

import {getSpineItemDocsFromZip} from '../Utils';



export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const {tocItems} = meta;
	const [zip, setZip] = React.useState(null);

	const [spineItems, setSpineItems] = React.useState([]);
	const [currentSpineId, setCurrentSpineId] = React.useState(null);
	const currentSpineIndex = spineItems.findIndex(x => x.id === currentSpineId);
	const currentSpineItem = spineItems.find(x => x.id === currentSpineId) || null;
	const currentDoc = currentSpineItem?.xmlDoc || null;
	function setCurrentSpineIndex (nuSpineIndex) {
		if (nuSpineIndex > 0 && nuSpineIndex < spineItems.length) {
			const nuSpineId = spineItems[nuSpineIndex].id;
			setCurrentSpineId(nuSpineId);
		}
	}

	const imgTags = currentDoc ? [...currentDoc.getElementsByTagName('img')] : [];
	const imageCount = imgTags.length;
	const [loadedImageCount, setLoadedImageCount] = React.useState(0);
	const loadedAllImages = imageCount === loadedImageCount;

	React.useEffect(() => {
		// gets zip from database
		const tx = appDB.transaction('epubs', 'readonly');
		const req = tx.objectStore('epubs').get(bookId);
		tx.oncomplete = () => {
			const epub = req.result;
			const zip = new JSZip();

			zip.loadAsync(epub.file).then(zip => {
				setZip(zip);
				getSpineItemDocsFromZip(zip, meta).then(spineItems => {
					setSpineItems(spineItems);
					// start from the first item in spine
					setCurrentSpineId(spineItems[0].id);
				});
			});
		};
	}, []);

	React.useEffect(() => {
		// loads images into blobs
		if (currentDoc) {
			// yet to load any image
			setPageNumber(0);
			setLoadedImageCount(0);

			imgTags.forEach(imgTag => {
				// might be a blob
				const src = imgTag.getAttribute('src');
				if (src.startsWith('blob:')) {
					// blob already exists
					setLoadedImageCount(loadedImageCount => loadedImageCount+1);
				} else {
					// blob doesn't exist
					const fullpath = path.join(path.dirname(currentSpineItem.fullpath), src);
					const file = zip.file(fullpath);
					if (file) {
						file.async('blob').then(blob => {
							const URL = window.URL || window.webkitURL;
							const imageURL = URL.createObjectURL(blob);
							imgTag.src = imageURL;
							setLoadedImageCount(loadedImageCount => loadedImageCount+1);
						});
					}
				}
			});
		}
	}, [currentSpineId]);


	const pageViewRef = React.useRef(null);
	const [pageNumber, setPageNumber] = React.useState(0);
	const containerStyle = {
		top: `-${pageNumber * 90}%`
	};

	const goToPreviousPage = () => {
		if (pageNumber > 0) {
			setPageNumber(pageNumber - 1);
		} else {
			setCurrentSpineIndex(currentSpineIndex - 1);
		}
	};
	const goToNextPage = () => {
		const containerHeight = pageViewRef.current.parentElement.offsetHeight * 0.9;
		const contentHeight = pageViewRef.current.offsetHeight;
		const maxPages = Math.ceil(contentHeight / containerHeight);
		const nuPageNumber = pageNumber + 1;
		if (nuPageNumber < maxPages) {
			setPageNumber(nuPageNumber);
		} else {
			// go to next iten in spine
			setCurrentSpineIndex(currentSpineIndex + 1);
		}
	};

	function handleKeyDown (event) {
		const {key} = event;
		switch (key) {
			case "ArrowLeft":
				goToPreviousPage();
				break;
			case "ArrowRight":
				goToNextPage();
				break;
			default:
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});


	if (!currentDoc || !loadedAllImages) {
		return <LoadingView />;
	}

	return (
		<article>
			<main className="grid grid-cols-4 h-screen overflow-hidden ch:h-full">
				<aside className="border-r-2 border-slate-300 overflow-y-scroll">
					<TocView {...{tocItems, currentSpineId, setCurrentSpineId}} />
				</aside>

				<main className="col-span-3 h-full max-w-lg overflow-hidden relative">

					<section ref={pageViewRef} className="relative" style={containerStyle}>
						<PageView {...{currentDoc}} />
					</section>

					<section className="absolute top-0 w-2/5 h-full cursor-pointer left-0" onClick={() => goToPreviousPage()}></section>
					<section className="absolute top-0 w-3/5 h-full cursor-pointer right-0" onClick={() => goToNextPage()}></section>
				</main>
			</main>
		</article>
	);
}
