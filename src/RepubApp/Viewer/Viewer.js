import path from 'path-browserify';

import {getXmlDocument} from '../Utils';



export default function Viewer ({data}) {
	const {zip, opfPath, opfDoc} = data;
	const manifest = opfDoc.getElementsByTagName('manifest')[0];
	const manifestItems = [...manifest.getElementsByTagName('item')];

	const spine = opfDoc.getElementsByTagName('spine')[0];
	const spineItems = [...spine.getElementsByTagName('itemref')];

	const chapters = spineItems.map(itemref => {
		const idref = itemref.getAttribute('idref');
		const item = manifestItems.find(x => x.getAttribute('id') === idref);
		return {
			id: idref,
			path: path.join(path.dirname(opfPath), item.getAttribute('href')),
			href: item.getAttribute('href'),
			mediaType: item.getAttribute('media-type')
		};
	});
	console.log(manifestItems[0]);
	console.log(spineItems[0]);
	console.log(chapters[0]);

	return (
		<article>
			<main>
				<section>
					<table className="w-full">
						<thead>
							<tr>
								<td>#</td>
								<td>ID</td>
								<td>Path</td>
							</tr>
						</thead>
						<tbody>
							{chapters.map((c, k) => <tr key={k}>
								<td>{k+1}</td>
								<td>{c.id}</td>
								<td>{c.path}</td>
							</tr>)}
						</tbody>
					</table>
				</section>
			</main>
		</article>
	);
}
