import React from 'react';
import _ from 'lodash';
import JSZip from 'jszip';

import Chapter from './Chapter';
import {getChapterDocsFromZip} from '../Utils';



export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const [zip, setZip] = React.useState(null);

	const [chapters, setChapters] = React.useState([]);
	const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
	const currentChapter = chapters[currentChapterIndex] || null;
	const currentChapterDoc = currentChapter?.xmlDoc || null;
	const currentChapterHtml = currentChapterDoc ? _.unescape(currentChapterDoc.getElementsByTagName('body')[0].innerHTML) : "";

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

	return (
		<article>
			<main className="grid grid-cols-4 h-screen overflow-hidden ch:h-full">
				<aside className="border-r-2 border-slate-300 overflow-scroll">
					<div className="odd:ch:bg-slate-100">
						{chapters.map((chapter, k) => <h5 key={k} className="px-4 py-4 cursor-pointer" onClick={() => setCurrentChapterIndex(k)}>Chapter {k+1}</h5>)}
					</div>
				</aside>

				<main className="col-span-3 overflow-scroll">
					<article dangerouslySetInnerHTML={{__html: currentChapterHtml}} className="px-4 py-4 max-w-lg"></article>
				</main>
			</main>
		</article>
	);
}
