


export default function TocView ({tocItems, currentSpineId, setCurrentSpineId, toggleToc}) {
	const toc = tocItems.map((chapter, k) => {
		const current = chapter.spineId === currentSpineId;
		let className = "flex px-4 py-4";
		className += current ? " bg-blue-500 text-white" : " odd:bg-slate-100 hover:bg-blue-600 hover:text-white cursor-pointer";

		return (
			<h5 key={k} className={className} onClick={() => setCurrentSpineId(chapter.spineId)}>
				<span className="grow">{chapter.text}</span>
				<span>{Math.round(chapter.size/1024)} k</span>
			</h5>
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
