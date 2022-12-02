import React from 'react';

const JSZip = require('jszip');

import './RepubApp.scss';
import Viewer from './Viewer/Viewer';
import {getXmlDocument} from './Utils';



export default function RepubApp () {
	const fref = React.useRef(null);
	// const [file, setFile] = React.useState(null);
	const [data, setData] = React.useState({
		zip: null,
		paths: [],
		opfPath: null,
		opfDoc: null
	});

	function handleUploadChange (e) {
		const firstFile = e.target.files[0] || null;

		if (firstFile.type === "application/epub+zip") {
			console.log(firstFile);
			const zip = new JSZip();
			const paths = [];
			zip.loadAsync(firstFile).then((zip) => {
				for (const file in zip.files) {
					paths.push(file);
				}

				zip.file('META-INF/container.xml').async('string').then(xmlText => {
					const cx = getXmlDocument(xmlText);
					const opfPath = cx.getElementsByTagName('rootfile')[0].getAttribute('full-path');
					zip.file(opfPath).async('string').then(opfText => {
						const opfDoc = getXmlDocument(opfText);
						setData({zip, paths, opfPath, opfDoc});
					});
				});
			});
		} else {
			console.log(`Not EPUB: ${firstFile.type}`);
		}
	}

	return (
		<div>
			<header className="bg-red-500 text-white py-4">
				<div className="px-4 py-2">
					<h4 className="text-center" onClick={() => fref.current.click()}>RepubApp</h4>
				</div>

				<div className="max-w-xl mx-auto px-4">
					<h4>
						<input ref={fref} type="file" hidden onChange={handleUploadChange} />
					</h4>
				</div>
			</header>

			<main className="bg-slate-100 min-h-screen">
				<div className="max-w-xl mx-auto px-4 py-4 space-y-2">
					{data.zip && <Viewer {...{data}} />}
				</div>
			</main>

			<footer className="bg-zinc-800 text-white">
				<section className="max-w-xl mx-auto px-4 py-12 text-center">
					<h4>Created by Ankur Seth.</h4>
				</section>
			</footer>
		</div>
	);
}
