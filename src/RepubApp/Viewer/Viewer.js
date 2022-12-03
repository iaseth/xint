import React from 'react';
import JSZip from 'jszip';

import Chapter from './Chapter';
import {getXmlDocument} from '../Utils';



export default function Viewer ({appDB, currentBook}) {
	const {bookId, meta} = currentBook;
	const [zip, setZip] = React.useState(null);
	// const {zip, opfPath, opfDoc} = data;

	console.log(currentBook);
	const [chapters, setChapters] = React.useState(null);
	const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
	// const currentChapter = currentBook.chapters[currentChapterIndex] || null;

	const [currentChapterDoc, setCurrentChapterDoc] = React.useState(null);
	React.useEffect(() => {
		const tx = appDB.transaction('epubs', 'readonly');
		const req = tx.objectStore('epubs').get(bookId);
		tx.oncomplete = () => {
			const epub = req.result;
			const zip = new JSZip();
			zip.loadAsync(epub.file).then(zip => {
				setZip(zip);
				console.log(zip);
			});
		};

		// if (currentChapter) {
		// 	zip.file(currentChapter.path).async('string').then(chapterText => {
		// 		const chapterDoc = getXmlDocument(chapterText);
		// 		setCurrentChapterDoc(chapterDoc);
		// 	});
		// }
	}, []);

	return (
		<article>
			<main>
				<section className="space-y-4">
					{meta.chapters.map((chapter, k) => <h4 key={k}>{chapter.title}</h4>)}
				</section>
			</main>
		</article>
	);
}
