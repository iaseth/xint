import React from 'react';
import path from 'path-browserify';
import JSZip from 'jszip';

import {TocView, SpineView, OptionsView} from './TopScreens';

import LoadingView from './LoadingView/LoadingView';
import PageView from './PageView/PageView';
import ClickScreen from './ClickScreen/ClickScreen';

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
	const currentSpineItemDoc = currentSpineItem?.xmlDoc || null;
	const [currentDoc, setCurrentDoc] = React.useState(null);
	const currentDocIsOutdated = currentDoc !== currentSpineItemDoc;
	// const [readyToRender, setReadyToRender] = React.useState(false);

	const setCurrentSpineIndex = (nuSpineIndex) => {
		if (nuSpineIndex >= 0 && nuSpineIndex < spineItems.length) {
			const nuSpineId = spineItems[nuSpineIndex].id;
			setCurrentSpineId(nuSpineId);
		}
	};
	const goToChapterN = (n) => setCurrentSpineIndex(n);
	const goToPreviousChapter = () => goToChapterN(currentSpineIndex - 1);
	const goToNextChapter = () => goToChapterN(currentSpineIndex + 1);

	const imgTags = currentSpineItemDoc ? [...currentSpineItemDoc.getElementsByTagName('img')] : [];
	const imageCount = imgTags.length;
	const [loadedImageCount, setLoadedImageCount] = React.useState(0);
	const loadedAllImages = imageCount === loadedImageCount;


	React.useEffect(() => {
		if (currentDocIsOutdated && loadedAllImages) {
			setCurrentDoc(currentSpineItemDoc);
		}
	}, [currentDocIsOutdated, loadedAllImages]);


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
		if (currentSpineItemDoc) {
			// yet to load any image
			setShowToc(false);
			setShowSpine(false);
			setShowOptions(false);
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


	if (currentDoc === null) {
		return <LoadingView />;
	}

	return (
		<article>
			<main className="bg-slate-200 h-screen overflow-hidden ch:h-full">

				<main className="bg-white h-full w-full max-w-lg mx-auto overflow-hidden relative">

					<section ref={pageViewRef} className="relative" style={containerStyle}>
						<PageView {...{currentDoc}} />
					</section>

					<ClickScreen {...{toggleToc, toggleOptions, toggleSpine, goToPreviousPage, goToNextPage, goToPreviousChapter, goToNextChapter}} />
				</main>

				<footer>
					<aside className="fixed top-0 w-full h-full z-40 duration-300" style={{ left: showToc ? "0" : "-100%" }}>
						<TocView {...{tocItems, currentSpineId, setCurrentSpineId, toggleToc}} />
					</aside>

					<aside className="fixed left-0 w-full h-full z-40 duration-300" style={{ top: showOptions ? "0" : "100%" }}>
						<OptionsView {...{toggleOptions}} />
					</aside>

					<aside className="fixed top-0 w-full h-full z-40 duration-300" style={{ right: showSpine ? "0" : "-100%" }}>
						<SpineView {...{spineItems, currentSpineId, setCurrentSpineId, toggleSpine}} />
					</aside>
				</footer>
			</main>
		</article>
	);
}
