


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


