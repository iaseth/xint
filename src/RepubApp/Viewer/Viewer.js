import React from 'react';
import path from 'path-browserify';
import JSZip from 'jszip';

import TocView from './TocView/TocView';
import LoadingView from './LoadingView/LoadingView';
import PageView from './PageView/PageView';

import {getSpineItemDocsFromZip} from '../Utils';



export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const [zip, setZip] = React.useState(null);

	const [spineItems, setSpineItems] = React.useState([]);
	const [spineIndex, setSpineIndex] = React.useState(0);
	const currentSpineItem = spineItems[spineIndex] || null;
	const currentDoc = currentSpineItem?.xmlDoc || null;
	// console.log(currentChapterHtml);

	const [imageCount, setImageCount] = React.useState(0);
	const [loadedImageCount, setLoadedImageCount] = React.useState(0);
	const loadedAllImages = imageCount === loadedImageCount;

	React.useEffect(() => {
		const tx = appDB.transaction('epubs', 'readonly');
		const req = tx.objectStore('epubs').get(bookId);
		tx.oncomplete = () => {
			const epub = req.result;
			const zip = new JSZip();

			zip.loadAsync(epub.file).then(zip => {
				setZip(zip);
				getSpineItemDocsFromZip(zip, meta).then(spineItems => {
					setSpineItems(spineItems);
				});
			});
		};
	}, []);

	React.useEffect(() => {
		if (currentDoc) {
			const imgTags = [...currentDoc.getElementsByTagName('img')];
			setImageCount(imgTags.length);
			setLoadedImageCount(0);

			imgTags.forEach(imgTag => {
				const src = imgTag.getAttribute('src');
				const fullpath = path.join(path.dirname(currentSpineItem.fullpath), src);

				const file = zip.file(fullpath);
				if (file) {
					file.async('blob').then(blob => {
						const URL = window.URL || window.webkitURL;
						const imageURL = URL.createObjectURL(blob);
						imgTag.src = imageURL;
						setLoadedImageCount(loadedImageCount => loadedImageCount+1);
						console.log(`Loaded image: ${loadedImageCount}/${imageCount}`);
					});
				}
			});
		}
	}, [currentDoc]);

	if (!currentDoc || !loadedAllImages) {
		return <LoadingView />;
	}

	return (
		<article>
			<main className="grid grid-cols-4 h-screen overflow-hidden ch:h-full">
				<aside className="border-r-2 border-slate-300 overflow-y-scroll">
					<TocView {...{spineItems, setSpineIndex}} />
				</aside>

				<main className="col-span-3 overflow-y-scroll">
					<PageView {...{currentDoc}} />
				</main>
			</main>
		</article>
	);
}
