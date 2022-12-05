


export default function TocItem ({chapter, currentSpineId, setCurrentSpineId}) {
	const current = chapter.spineId === currentSpineId;
	let className = "flex px-4 py-4 border-b last:border-b-0 border-zinc-500";
	className += current ? " bg-zinc-700 text-white" : " hover:bg-zinc-500 hover:text-white cursor-pointer";

	return (
		<h5 className={className} onClick={() => setCurrentSpineId(chapter.spineId)}>
			<span className="grow">{chapter.text}</span>
			<span>{Math.round(chapter.size/1024)} k</span>
		</h5>
	);
}
