import React from 'react';

import {Button} from '../../Utils';
import {getEbookData} from '../../Utils';



export default function BookAdder ({currentFile, clearCurrentFile, hideBookAdder, addBookToLS}) {
	const [data, setData] = React.useState({
		zip: null,
		paths: [],
		opfPath: null,
		opfDoc: null,
		meta: {},
		details: {},
		coverBlob: null
	});
	const [coverSrc, setCoverSrc] = React.useState(null);

	const meta = data.meta;

	React.useEffect(() => {
		getEbookData(currentFile).then(ebookData => {
			if (ebookData) {
				setData(ebookData);
				if (ebookData.coverBlob) {
					const URL = window.URL || window.webkitURL;
					const coverBlobURL = URL.createObjectURL(ebookData.coverBlob);
					setCoverSrc(coverBlobURL);
				}
			}
		});
	}, []);

	function addBookAndGoBack () {
		if (data.zip) {
			addBookToLS(data, currentFile);
		}
		clearCurrentFile();
		hideBookAdder(false);
	}

	function cancelAndGoBack () {
		clearCurrentFile();
		hideBookAdder(false);
	}

	return (
		<section className="py-6 bg-slate-200">
			<main className="max-w-3xl mx-auto">

				<section className="max-w-lg mx-auto flex px-4">

					<table className="w-full">
						<tbody>
							<tr>
								<td>Cover</td>
								<td>
									<div className="w-48 h-64">
										{coverSrc && <img src={coverSrc} className="w-full h-full" />}
									</div>
								</td>
							</tr>
							<tr>
								<td>Title</td>
								<td>{meta.title}</td>
							</tr>
							<tr>
								<td>Author</td>
								<td>{meta.author}</td>
							</tr>
							<tr>
								<td>Publisher</td>
								<td>{meta.publisher}</td>
							</tr>
						</tbody>
					</table>

				</section>

				<section className="max-w-lg mx-auto px-4">
					<div className="pt-4">
						<Button text="Add eBook" onClick={addBookAndGoBack} />
						<Button text="Back" onClick={cancelAndGoBack} />
					</div>
				</section>

			</main>
		</section>
	);
}
