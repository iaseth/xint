import JSZip from 'jszip';



export async function getEbookMeta (event) {
	const firstFile = event.target.files[0] || null;

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

	return {zip, paths, opfPath, opfDoc};
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


