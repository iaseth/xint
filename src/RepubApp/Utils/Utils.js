import JSZip from 'jszip';
import _ from 'lodash';
import path from 'path-browserify';



export function Button ({text="Button", onClick}) {
	return (
		<button className="text-center px-5 py-3 mr-2 bg-blue-500 text-white text-sm font-bold rounded shadow border-2 border-blue-700 hover:bg-blue-700" onClick={onClick}>{text}</button>
	);
}



export async function getSpineItemDocsFromZip (zip, meta) {
	const spineItems = await Promise.all(meta.spineItems.map(async chapter => {
		const xmlText = await zip.file(chapter.fullpath).async('string');
		const xmlDoc = getXmlDocument(xmlText);
		return {xmlDoc, ...chapter};
	}));
	return spineItems;
}



function getTocItems (navMap, basepath, spineItems) {
	const navPoints = [...navMap.children].filter(tag => tag.nodeName === 'navPoint');
	return navPoints.map(navPoint => {
		const navLabel = navPoint.getElementsByTagName('navLabel')[0] || null;
		const text = navLabel ? navLabel.getElementsByTagName('text')[0].innerHTML.trim() : "";
		const src = navPoint.getElementsByTagName('content')[0].getAttribute('src');
		const fullpath = path.join(basepath, src);

		return {
			className: navPoint.getAttribute('class'),
			id: navPoint.getAttribute('id'),
			playOrder: navPoint.getAttribute('playOrder'),
			text: text,
			fullpath: fullpath,
			spineId: spineItems.find(x => x.fullpath === fullpath).id,
			chapters: getTocItems(navPoint, basepath, spineItems)
		};
	});
}

function getTagContent (doc, tagName, defaultValue="Not Found") {
	const tag = doc.getElementsByTagName(tagName)[0] || null;
	return tag ? _.unescape(tag.innerHTML).trim() : defaultValue;
}

export async function getEbookData (firstFile) {
	if (firstFile === null) {
		// console.log(`No file uploaded!`);
		return null;
	} else if (firstFile.type !== "application/epub+zip") {
		// console.log(`Not EPUB: ${firstFile.type}`);
		return null;
	}

	const zip = new JSZip();
	await zip.loadAsync(firstFile);

	const paths = [];
	for (const file in zip.files) {
		paths.push(file);
	}

	const xmlText = await zip.file('META-INF/container.xml').async('string');
	const containerXmlDoc = getXmlDocument(xmlText);

	const opfPath = containerXmlDoc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
	const opfText = await zip.file(opfPath).async('string');
	const opfDoc = getXmlDocument(opfText);
	const basepath = path.dirname(opfPath);

	const manifest = opfDoc.getElementsByTagName('manifest')[0];
	const manifestItemTags = [...manifest.getElementsByTagName('item')];
	const manifestItems = manifestItemTags.map(item => ({
		href: item.getAttribute('href'),
		fullpath: path.join(basepath, item.getAttribute('href')),
		id: item.getAttribute('id'),
		mediaType: item.getAttribute('media-type'),
	}));

	const spine = opfDoc.getElementsByTagName('spine')[0];
	const spineItemrefTags = [...spine.getElementsByTagName('itemref')];
	const spineItems = spineItemrefTags.map((itemref, index) => {
		const idref = itemref.getAttribute('idref');
		const item = manifestItems.find(x => x.id === idref);
		return {index, ...item};
	});

	let tocItems = [];
	const tocId = spine.getAttribute('toc') || null;
	const tocItem = manifestItems.find(x => x.id === tocId) || null;
	if (tocItem) {
		const tocText = await zip.file(tocItem.fullpath).async('string');
		const tocDoc = getXmlDocument(tocText);

		const navMap = tocDoc.getElementsByTagName('navMap')[0];
		const tocBasepath = path.dirname(tocItem.fullpath);
		tocItems = getTocItems(navMap, tocBasepath, spineItems);
	}

	const meta = {
		basepath, manifestItems, spineItems, tocItems,
		identifier: getTagContent(opfDoc, "dc:identifier"),
		title: getTagContent(opfDoc, "dc:title"),
		author: getTagContent(opfDoc, "dc:creator"),
		publisher: getTagContent(opfDoc, "dc:publisher"),
		description: getTagContent(opfDoc, "description"),
	};

	return {zip, paths, opfPath, opfDoc, meta};
}

export function getXmlDocument (xmlText) {
	if (window.DOMParser) {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlText, "text/xml");
		return xmlDoc;
	} else {
		// Internet Explorer
		const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlText);
		return xmlDoc;
	}
}


