import React from 'react';
import path from 'path-browserify';
import JSZip from 'jszip';

import TocView from './TocView/TocView';
import SpineView from './SpineView/SpineView';
import OptionsView from './OptionsView/OptionsView';

import LoadingView from './LoadingView/LoadingView';
import PageView from './PageView/PageView';

import {getSpineItemDocsFromZip} from '../Utils';



export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const {tocItems} = meta;
	const [zip, setZip] = React.useState(null);

	const [showToc, setShowToc] = React.useState(false);
	const [showSpine, setShowSpine] = React.useState(false);
	const [showOptions, setShowOptions] = React.useState(false);
	const toggleToc = () => setShowToc(x => !x);
	const toggleSpine = () => setShowSpine(x => !x);
	const toggleOptions = () => setShowOptions(x => !x);

	const [spineItems, setSpineItems] = React.useState([]);
	const [currentSpineId, setCurrentSpineId] = React.useState(null);
	const currentSpineIndex = spineItems.findIndex(x => x.id === currentSpineId);
	const currentSpineItem = spineItems.find(x => x.id === currentSpineId) || null;
	const currentDoc = currentSpineItem?.xmlDoc || null;

	const setCurrentSpineIndex = (nuSpineIndex) => {
		if (nuSpineIndex >= 0 && nuSpineIndex < spineItems.length) {
			const nuSpineId = spineItems[nuSpineIndex].id;
			setCurrentSpineId(nuSpineId);
		}
	};
	const goToChapterN = (n) => setCurrentSpineIndex(n);
	const goToPreviousChapter = () => goToChapterN(currentSpineIndex - 1);
	const goToNextChapter = () => goToChapterN(currentSpineIndex + 1);

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
			case "ArrowUp":
				goToPreviousChapter();
				break;
			case "ArrowDown":
				goToNextChapter();
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
			<main className="bg-slate-200 h-screen overflow-hidden ch:h-full">

				<main className="bg-white h-full w-full max-w-lg mx-auto overflow-hidden relative">

					<section ref={pageViewRef} className="relative" style={containerStyle}>
						<PageView {...{currentDoc}} />
					</section>

					<section className="absolute top-0 left-0 w-full h-full cursor-pointer border-2 border-red-500">
						<header className="h-1/6 flex">
							<section className="w-1/3 h-full" onClick={toggleToc}></section>
							<section className="w-1/3 h-full" onClick={toggleOptions}></section>
							<section className="w-1/3 h-full" onClick={toggleSpine}></section>
						</header>

						<main className="h-4/6 flex">
							<section className="w-2/5 h-full" onClick={goToPreviousPage}></section>
							<section className="w-3/5 h-full" onClick={goToNextPage}></section>
						</main>

						<footer className="h-1/6" onClick={goToNextChapter}></footer>
					</section>
				</main>

				<footer>
					<aside className="fixed top-0 w-full h-full max-w-sm z-70 bg-white border-r-2 border-slate-300 duration-300 overflow-y-scroll" style={{ left: showToc ? "0" : "-100%" }}>
						<TocView {...{tocItems, currentSpineId, setCurrentSpineId}} />
					</aside>

					<aside className="fixed left-0 w-full h-full z-70 duration-300 overflow-y-scroll" style={{ top: showOptions ? "0" : "100%" }}>
						<div className="max-w-md mx-auto px-4 py-4">
							<OptionsView />
						</div>
					</aside>

					<aside className="fixed top-0 w-full h-full max-w-sm z-70 bg-white border-l-2 border-slate-300 duration-300 overflow-y-scroll" style={{ right: showSpine ? "0" : "-100%" }}>
						<SpineView />
					</aside>
				</footer>
			</main>
		</article>
	);
}
