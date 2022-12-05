import React from 'react';

import TocItem from './TocItem';



export default function TocView ({tocItems, currentSpineId, setCurrentSpineId, toggleToc}) {
	const toc = tocItems.map((chapter, k) => {
		return (
			<React.Fragment key={k}>
				<TocItem {...{chapter, currentSpineId, setCurrentSpineId}} />
				{chapter.chapters.map((chapter, k) => <TocItem key={k} {...{chapter, currentSpineId, setCurrentSpineId}} />)}
			</React.Fragment>
		);
	});

	return (
		<section className="h-full w-full flex">
			<div className="grow h-full max-w-sm bg-white border-r-2 border-slate-300 overflow-y-scroll">
				{toc}
			</div>
			<div className="grow" onClick={toggleToc}></div>
		</section>
	);
}
