


export default function TocView ({spineItems, setSpineIndex}) {
	return (
		<div className="odd:ch:bg-slate-100">
			{spineItems.map((chapter, k) => <h5 key={k} className="px-4 py-4 cursor-pointer" onClick={() => setSpineIndex(k)}>Chapter {k+1}</h5>)}
		</div>
	);
}
