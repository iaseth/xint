import React from 'react';

import {Button} from '../Utils';
import {getEbookData} from '../Utils';



export default function BookAdder ({currentFile, clearCurrentFile, hideBookAdder, addBookToLS}) {
	const [data, setData] = React.useState({
		zip: null,
		paths: [],
		opfPath: null,
		opfDoc: null,
		meta: {}
	});

	const meta = data.meta;

	React.useEffect(() => {
		getEbookData(currentFile).then(ebookDeta => {
			if (ebookDeta) {
				setData(ebookDeta);
			}
		});
	}, []);

	function addBookAndGoBack () {
		if (data.zip) {
			addBookToLS(data.meta, currentFile);
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

				<div className="max-w-lg mx-auto px-4">
					<table className="w-full">
						<tbody>
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

					<div className="pt-4">
						<Button text="Add eBook" onClick={addBookAndGoBack} />
						<Button text="Back" onClick={cancelAndGoBack} />
					</div>
				</div>

			</main>
		</section>
	);
}
