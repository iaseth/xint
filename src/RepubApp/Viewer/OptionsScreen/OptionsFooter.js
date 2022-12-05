


export default function OptionsFooter ({
	pageViewRef, pageNumber, setPageNumber,
	currentSpineId, setCurrentSpineId, tocItems
}) {
	const containerHeight = pageViewRef.current.parentElement.offsetHeight * 0.9;
	const contentHeight = pageViewRef.current.offsetHeight;
	const pageCount = Math.ceil(contentHeight / containerHeight);

	const pageArray = [...Array(pageCount)].map((x, k) => k);
	const pageDots = pageArray.map(k => {
		const current = k === pageNumber;
		let className = "p-1 border-2";
		className += current ? " border-zinc-500 rounded-full" : " border-transparent";

		return (
			<div key={k} className={className} onClick={() => setPageNumber(k)}>
				<div className="h-2 rounded-full bg-zinc-500"></div>
			</div>
		);
	});

	const chapterDots = tocItems.map((item, k) => {
		const current = currentSpineId === item.spineId;
		let className = "p-1 border-2";
		className += current ? " border-zinc-500" : " border-transparent";

		return (
			<div key={k} className={className} onClick={() => setCurrentSpineId(item.spineId)}>
				<div className="h-2 bg-zinc-500"></div>
			</div>
		);
	});

	return (
		<footer className="bg-white border-t-2 border-zinc-500 py-3">
			{pageCount > 1 && <section className="px-4 py-2">
				<h5 className="max-w-xs mx-auto px-2">{pageCount} pages in this chapter</h5>
				<div className="grid grid-cols-12 py-2 max-w-xs mx-auto">{pageDots}</div>
			</section>}

			<section className="px-4 py-2">
				<h5 className="max-w-xs mx-auto px-2">{tocItems.length} chapters in this book</h5>
				<div className="grid grid-cols-12 py-2 max-w-xs mx-auto">{chapterDots}</div>
			</section>
		</footer>
	);
}
