import JSZip from 'jszip';
import _ from 'lodash';
import path from 'path-browserify';

import {getXmlDocument} from './xmlutils';



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
		const spineItem = spineItems.find(x => x.fullpath === fullpath);

		return {
			className: navPoint.getAttribute('class'),
			id: navPoint.getAttribute('id'),
			playOrder: navPoint.getAttribute('playOrder'),
			text: text,
			fullpath: fullpath,
			spineId: spineItem.id,
			size: spineItem.size,
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
	const manifestItems = manifestItemTags.map(item => {
		const fullpath = path.join(basepath, item.getAttribute('href'));
		const file = zip.file(fullpath);
		const size = file ? file._data.uncompressedSize : 0;

		return {
			fullpath, size,
			href: item.getAttribute('href'),
			id: item.getAttribute('id'),
			mediaType: item.getAttribute('media-type'),
		};
	});

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

	const coverMeta = [...opfDoc.getElementsByTagName('meta')].find(meta => meta.getAttribute('name') === 'cover');
	const coverId = coverMeta ? coverMeta.getAttribute('content') : null;
	const coverItem = manifestItems.find(x => x.id === coverId);
	const coverPath = coverItem ? coverItem.fullpath : null;

	const meta = {
		basepath, coverId, coverPath,
		manifestItems, spineItems, tocItems,
		identifier: getTagContent(opfDoc, "dc:identifier"),
		title: getTagContent(opfDoc, "dc:title"),
		author: getTagContent(opfDoc, "dc:creator"),
		publisher: getTagContent(opfDoc, "dc:publisher"),
		description: getTagContent(opfDoc, "description"),
	};

	return {zip, paths, opfPath, opfDoc, meta};
}


