import React from 'react';
import _ from 'lodash';
import path from 'path-browserify';
import JSZip from 'jszip';

import Chapter from './Chapter';
import {getChapterDocsFromZip} from '../Utils';



function getContentHtml (xmlDoc) {
	if (xmlDoc) {
		const body = xmlDoc.getElementsByTagName('body')[0];
		if (body) {
			return _.unescape(body.innerHTML);
		}
	}

	return "";
}

export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const [zip, setZip] = React.useState(null);

	const [chapters, setChapters] = React.useState([]);
	const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
	const currentChapter = chapters[currentChapterIndex] || null;
	const currentChapterDoc = currentChapter?.xmlDoc || null;
	const currentChapterHtml = getContentHtml(currentChapterDoc);
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
				getChapterDocsFromZip(zip, meta).then(chapters => {
					setChapters(chapters);
				});
			});
		};
	}, []);

	React.useEffect(() => {
		if (currentChapterDoc) {
			const imgTags = [...currentChapterDoc.getElementsByTagName('img')];
			setImageCount(imgTags.length);
			setLoadedImageCount(0);

			imgTags.forEach(imgTag => {
				const src = imgTag.getAttribute('src');
				const fullpath = path.join(path.dirname(currentChapter.fullpath), src);

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
	}, [currentChapterDoc]);

	return (
		<article>
			<main className="grid grid-cols-4 h-screen overflow-hidden ch:h-full">
				<aside className="border-r-2 border-slate-300 overflow-scroll">
					<div className="odd:ch:bg-slate-100">
						{chapters.map((chapter, k) => <h5 key={k} className="px-4 py-4 cursor-pointer" onClick={() => setCurrentChapterIndex(k)}>Chapter {k+1}</h5>)}
					</div>
				</aside>

				<main className="col-span-3 overflow-scroll">
					{loadedAllImages && <article dangerouslySetInnerHTML={{__html: currentChapterHtml}} className="px-4 py-4 max-w-lg"></article>}
				</main>
			</main>
		</article>
	);
}
