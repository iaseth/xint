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
		<article>
			<header className="px-2 py-2">
				<h4>{title || "No title"}</h4>
				<h4>{chapter.path}</h4>
			</header>
		</article>
	);
}
