import React from 'react';

const JSZip = require('jszip');

import './RepubApp.scss';



export default function RepubApp () {
	const fref = React.useRef(null);
	// const [file, setFile] = React.useState(null);
	const [data, setData] = React.useState({
		zip: null,
		content: []
	});

	function handleUploadChange (e) {
		const firstFile = e.target.files[0] || null;

		if (firstFile.type === "application/epub+zip") {
			console.log(firstFile);
			const zip = new JSZip();
			const content = [];
			zip.loadAsync(firstFile).then((zip) => {
				for (const file in zip.files) {
					content.push(file);
				}
				setData({zip: zip, content: content});
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
					{data.content && data.content.map((f, k) => <h4 key={k} className="px-4 py-3 bg-white">{k+1}. {f}</h4>)}
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
