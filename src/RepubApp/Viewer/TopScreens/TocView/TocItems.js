import React from 'react';

import TocItem from './TocItem';



export default function TocItems ({tocItems, currentSpineId, setCurrentSpineId}) {
	const toc = tocItems.map((chapter, k) => {
		return (
			<React.Fragment key={k}>
				<TocItem {...{chapter, currentSpineId, setCurrentSpineId}} />
				{chapter.chapters.length > 0 && <TocItems tocItems={chapter.chapters} {...{currentSpineId, setCurrentSpineId}} />}
			</React.Fragment>
		);
	});

	return (
		<React.Fragment>
			{toc}
		</React.Fragment>
	);
}
