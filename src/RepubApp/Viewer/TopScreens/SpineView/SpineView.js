


export default function SpineView ({spineItems, currentSpineId, setCurrentSpineId, toggleSpine}) {
	const items = spineItems.map((item, k) => {
		const current = item.id === currentSpineId;
		let className = "flex px-4 py-4";
		className += current ? " bg-blue-500 text-white" : " odd:bg-slate-100 hover:bg-blue-600 hover:text-white cursor-pointer";

		return (
			<h5 key={k} className={className} onClick={() => setCurrentSpineId(item.id)}>
				<span className="grow">{item.id}</span>
				<span>{Math.round(item.size/1024)} k</span>
			</h5>
		);
	});

	return (
		<section className="h-full w-full flex">
			<div className="grow" onClick={toggleSpine}></div>
			<div className="grow h-full max-w-sm bg-white border-l-2 border-slate-300 overflow-y-scroll">
				<div>{items}</div>
			</div>
		</section>
	);
}
