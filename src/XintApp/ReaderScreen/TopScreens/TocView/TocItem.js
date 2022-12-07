import React from 'react';

import TocItems from './TocItems';



export default function TocItem ({chapter, currentSpineId, setCurrentSpineId, level}) {
	const [expanded, setExpanded] = React.useState(false);
	const toggleExpanded = () => setExpanded(x => !x);
	const expandable = chapter.chapters.length > 0;

	const current = chapter.spineId === currentSpineId;
	let className = "flex select-none ch:py-4 border-b last:border-b-0 border-zinc-500";
	className += current ? " bg-zinc-700 text-white" : " hover:bg-zinc-500 hover:text-white cursor-pointer";
	const style = {
		paddingLeft: `${level*20}px`
	};

	return (
		<>
			<div className={className} style={style}>
				<div className="w-8">
					<div onClick={toggleExpanded} hidden={!expandable} className="pl-3 pr-1 cursor-pointer">
						<div className="h-4 w-4 border-transparent border-8 border-l-zinc-500"></div>
					</div>
				</div>

				<div className="grow" onClick={() => setCurrentSpineId(chapter.spineId)}>
					<h5>{chapter.text}</h5>
				</div>

				<div className="px-3">
					<h5>{Math.round(chapter.size/1024)} k</h5>
				</div>
			</div>
			{expanded && expandable && <TocItems tocItems={chapter.chapters} {...{currentSpineId, setCurrentSpineId}} level={level+1} />}
		</>
	);
}
