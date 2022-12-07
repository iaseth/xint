import React from 'react';
import path from 'path-browserify';

import TopScreens from './TopScreens/TopScreens';

import LoadingPage from './LoadingPage/LoadingPage';
import PageView from './PageView/PageView';
import ClickScreen from './ClickScreen/ClickScreen';
import OptionsScreen from './OptionsScreen/OptionsScreen';

import {getSpineItemDocsFromZip} from '../Utils';



export default function ReaderScreen ({currentBook, zip, details, goBackHome}) {
	const {meta} = currentBook;
	const {tocItems} = details;

	const [showToc, setShowToc] = React.useState(false);
	const [showOptions, setShowOptions] = React.useState(false);
	const [showSpine, setShowSpine] = React.useState(false);
	const [showToolbox, setShowToolbox] = React.useState(false);
	const toggleToc = () => setShowToc(x => !x);
	const toggleOptions = () => setShowOptions(x => !x);
	const toggleSpine = () => setShowSpine(x => !x);
	const toggleToolbox = () => setShowToolbox(x => !x);

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
		getSpineItemDocsFromZip(zip, details).then(spineItems => {
			setSpineItems(spineItems);
			// start from the first item in spine
			setCurrentSpineId(spineItems[0].id);
		});
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


	const readerRef = React.useRef(null);
	const [dimensions, setDimensions] = React.useState({height: 0, width: 0});
	const updateDimensions = () => {
		if (readerRef.current) {
			setDimensions({
				height: readerRef.current.offsetHeight,
				width: readerRef.current.offsetWidth,
			});
		}
	};

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

	function handleReaderKeyDown (event) {
		const {key} = event;
		switch (key) {
			case "ArrowLeft":
				event.ctrlKey ? toggleToc() : goToPreviousPage();
				break;
			case "ArrowRight":
				event.ctrlKey ? toggleSpine() : goToNextPage();
				break;
			case "ArrowUp":
				event.ctrlKey ? toggleOptions() : goToPreviousChapter();
				break;
			case "ArrowDown":
				event.ctrlKey ? toggleToolbox() : goToNextChapter();
				break;
			default:
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleReaderKeyDown, false);
		return () => window.removeEventListener('keydown', handleReaderKeyDown, false);
	});

	return (
		<article>
			<main className="bg-slate-200 h-screen overflow-hidden ch:h-full">

				<main ref={readerRef} className="bg-white h-full w-full max-w-lg mx-auto overflow-hidden relative">

					<section ref={pageViewRef} className="relative duration-300" style={containerStyle}>
						{currentDoc ? <PageView {...{currentDoc}} /> : <LoadingPage {...{meta}} />}
					</section>

					{showOptions && <OptionsScreen {...{goToPreviousChapter, goBackHome, goToNextChapter, toggleOptions,
						pageViewRef, pageNumber, setPageNumber,
						currentSpineId, setCurrentSpineId, tocItems}} />}

					<ClickScreen {...{toggleToc, toggleOptions, toggleSpine, toggleToolbox,
						goToPreviousPage, goToNextPage, goToPreviousChapter, goToNextChapter}} />
				</main>

				<TopScreens {...{showToc, showToolbox, showSpine,
					toggleToc, toggleToolbox, toggleSpine,
					tocItems, spineItems, currentSpineId, setCurrentSpineId}} />

			</main>
		</article>
	);
}
