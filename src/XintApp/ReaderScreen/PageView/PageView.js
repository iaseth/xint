import _ from 'lodash';



function getContentHtml (xmlDoc) {
	if (xmlDoc) {
		const body = xmlDoc.body;
		if (body) {
			return _.unescape(body.innerHTML);
		}
	}

	return "";
}

export default function PageView ({currentDoc}) {
	const currentHtml = getContentHtml(currentDoc);

	return (
		<article dangerouslySetInnerHTML={{__html: currentHtml}} className="px-4 py-4"></article>
	);
}
