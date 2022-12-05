


export default function TocItem ({chapter, currentSpineId, setCurrentSpineId}) {
	const current = chapter.spineId === currentSpineId;
	let className = "flex px-4 py-4";
	className += current ? " bg-blue-500 text-white" : " odd:bg-slate-100 hover:bg-blue-600 hover:text-white cursor-pointer";

	return (
		<h5 className={className} onClick={() => setCurrentSpineId(chapter.spineId)}>
			<span className="grow">{chapter.text}</span>
			<span>{Math.round(chapter.size/1024)} k</span>
		</h5>
	);
}
