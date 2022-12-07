import React from 'react';

import TocItem from './TocItem';



export default function TocItems ({tocItems, currentSpineId, setCurrentSpineId, level=0}) {
	const toc = tocItems.map((chapter, k) => <TocItem key={k} {...{chapter, currentSpineId, setCurrentSpineId, level}} />);

	return (
		<React.Fragment>
			{toc}
		</React.Fragment>
	);
}
