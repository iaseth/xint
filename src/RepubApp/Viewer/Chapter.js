import React from 'react';

import {getXmlDocument} from '../Utils';



export default function Chapter ({zip, chapter}) {
	const [doc, setDoc] = React.useState(null);
	const title = doc?.getElementsByTagName('title')[0].innerHTML.trim() || null;
	// console.log(`(${chapter.id}) ${title}`);

	React.useState(() => {
		zip.file(chapter.path).async('string').then(chapterText => {
			const chapterDoc = getXmlDocument(chapterText);
			setDoc(chapterDoc);
		});
	}, []);

	return (
		<article className="bg-white rounded shadow cursor-pointer">
			<header className="ch:px-2 ch:py-2 py-1">
				<h5 className="border-b-2 border-blue-400 text-blue-500">{title || "No title"}</h5>
				<h5>{chapter.path}</h5>
			</header>
		</article>
	);
}
