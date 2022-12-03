import JSZip from 'jszip';
import _ from 'lodash';
import path from 'path-browserify';



export function Header () {
	return (
		<header className="bg-red-500 text-white py-4">
			<div className="px-4">
				<h4 className="text-center">Repub</h4>
			</div>
		</header>
	);
}



export function Footer () {
	return (
		<header className="bg-zinc-800 text-white py-10">
			<div className="px-4 py-2">
				<h4 className="text-center">Created by Ankur Seth</h4>
			</div>
		</header>
	);
}

export function Button ({text="Button", onClick}) {
	return (
		<button className="text-center px-5 py-3 mr-2 bg-blue-500 text-white text-sm font-bold rounded shadow border-2 border-blue-700 hover:bg-blue-700" onClick={onClick}>{text}</button>
	);
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
	const manifestItems = [...manifest.getElementsByTagName('item')];
	const content = manifestItems.map(item => ({
		href: item.getAttribute('href'),
		id: item.getAttribute('id'),
		mediaType: item.getAttribute('media-type'),
	}));

	const spine = opfDoc.getElementsByTagName('spine')[0];
	const spineItems = [...spine.getElementsByTagName('itemref')];
	const chapters = spineItems.map((itemref, index) => {
		const idref = itemref.getAttribute('idref');
		const item = content.find(x => x.id === idref);
		return {index, ...item};
	});

	const meta = {
		basepath, content, chapters,
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


