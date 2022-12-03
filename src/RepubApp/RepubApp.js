import React from 'react';

import './RepubApp.scss';
import Viewer from './Viewer/Viewer';
import Home from './Home/Home';
import {getEbookMeta} from './Utils';



export default function RepubApp () {
	const fref = React.useRef(null);
	const [books, setBooks] = React.useState([]);
	const [currentBookIndex, setCurrentBookIndex] = React.useState(-1);
	const currentBook = books[currentBookIndex] || null;

	const [data, setData] = React.useState({
		zip: null,
		paths: [],
		opfPath: null,
		opfDoc: null
	});

	function handleUploadChange (event) {
		getEbookMeta(event).then(ebookMeta => {
			if (ebookMeta) {
				setData(ebookMeta);
			}
		});
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
