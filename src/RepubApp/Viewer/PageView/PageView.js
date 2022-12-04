import _ from 'lodash';



function getContentHtml (xmlDoc) {
	if (xmlDoc) {
		const body = xmlDoc.getElementsByTagName('body')[0];
		if (body) {
			return _.unescape(body.innerHTML);
		}
	}

	return "";
}

export default function PageView ({currentChapterDoc}) {
	const currentChapterHtml = getContentHtml(currentChapterDoc);

	return (
		<article dangerouslySetInnerHTML={{__html: currentChapterHtml}} className="px-4 py-4 max-w-lg"></article>
	);
}
