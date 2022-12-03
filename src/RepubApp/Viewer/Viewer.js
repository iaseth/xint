import React from 'react';
import path from 'path-browserify';

import Chapter from './Chapter';
import {getXmlDocument} from '../Utils';



export default function Viewer ({data}) {
	const {zip, opfPath, opfDoc} = data;

	const manifest = opfDoc.getElementsByTagName('manifest')[0];
	const manifestItems = [...manifest.getElementsByTagName('item')];

	const spine = opfDoc.getElementsByTagName('spine')[0];
	const spineItems = [...spine.getElementsByTagName('itemref')];

	const chapters = spineItems.map((itemref, index) => {
		const idref = itemref.getAttribute('idref');
		const item = manifestItems.find(x => x.getAttribute('id') === idref);
		return {
			index: index,
			id: idref,
			path: path.join(path.dirname(opfPath), item.getAttribute('href')),
			href: item.getAttribute('href'),
			mediaType: item.getAttribute('media-type')
		};
	});

	const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
	const currentChapter = chapters[currentChapterIndex] || null;

	const [currentChapterDoc, setCurrentChapterDoc] = React.useState(null);
	React.useEffect(() => {
		if (currentChapter) {
			zip.file(currentChapter.path).async('string').then(chapterText => {
				const chapterDoc = getXmlDocument(chapterText);
				setCurrentChapterDoc(chapterDoc);
			});
		}
	}, [currentChapterIndex]);

	console.log(manifestItems[0]);
	console.log(spineItems[0]);
	console.log(chapters[0]);

	return (
		<article>
			<main>
				<section className="space-y-4">
					{chapters.map((chapter, k) => <Chapter key={k} {...{zip, chapter}} />)}
				</section>
			</main>
		</article>
	);
}
