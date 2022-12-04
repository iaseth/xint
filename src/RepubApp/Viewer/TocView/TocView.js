


export default function TocView ({chapters, setCurrentChapterIndex}) {
	return (
		<div className="odd:ch:bg-slate-100">
			{chapters.map((chapter, k) => <h5 key={k} className="px-4 py-4 cursor-pointer" onClick={() => setCurrentChapterIndex(k)}>Chapter {k+1}</h5>)}
		</div>
	);
}
