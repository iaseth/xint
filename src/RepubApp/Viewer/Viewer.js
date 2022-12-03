import React from 'react';
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
			<main className="flex">
				<aside className="odd:ch:bg-slate-200 w-80 max-w-md border-r-2 border-slate-300">
					{chapters.map((chapter, k) => <h4 key={k} className="px-4 py-3">Chapter {k+1}</h4>)}
				</aside>

				<main className="grow"></main>
			</main>
		</article>
	);
}
