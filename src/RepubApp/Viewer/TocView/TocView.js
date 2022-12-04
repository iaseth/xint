


export default function TocView ({tocItems, currentSpineId, setCurrentSpineId}) {
	const toc = tocItems.map((chapter, k) => {
		const current = chapter.spineId === currentSpineId;
		let className = "px-4 py-4";
		className += current ? " bg-blue-500 text-white" : " odd:bg-slate-100 hover:bg-blue-600 hover:text-white cursor-pointer";

		return (
			<h5 key={k} className={className} onClick={() => setCurrentSpineId(chapter.spineId)}>{chapter.text}</h5>
		);
	});

	return (
		<div className="">
			{toc}
		</div>
	);
}
