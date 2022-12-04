


export default function OptionsFooter ({
	pageViewRef, pageNumber, setPageNumber,
	currentSpineId, setCurrentSpineId, tocItems
}) {
	const containerHeight = pageViewRef.current.parentElement.offsetHeight * 0.9;
	const contentHeight = pageViewRef.current.offsetHeight;
	const pageCount = Math.ceil(contentHeight / containerHeight);

	const maxWidth = pageViewRef.current.parentElement.offsetWidth - 32;
	const dotWidth = 20;
	const maxDots = Math.floor(maxWidth / dotWidth);

	const pageArray = [...Array(pageCount)].map((x, k) => k);
	let pageStartIndex = 0;
	if (pageCount > maxDots) {
		const maxDotsHalf = Math.floor(maxDots/2);
		if (pageNumber <= maxDotsHalf) {
			pageStartIndex = 0;
		} else if (pageCount - pageNumber < maxDotsHalf) {
			pageStartIndex = pageCount - maxDots;
		} else {
			pageStartIndex = pageNumber - maxDotsHalf;
		}
	}

	const pageDots = pageArray.slice(pageStartIndex, pageStartIndex + maxDots).map(k => {
		const current = k === pageNumber;
		let className = "p-1 border-2";
		className += current ? " border-zinc-500 rounded-full" : " border-transparent";

		return (
			<div key={k} className={className} onClick={() => setPageNumber(k)}>
				<div className="w-2 h-2 rounded-full bg-zinc-500"></div>
			</div>
		);
	});

	const chapterDots = tocItems.map((item, k) => {
		const current = currentSpineId === item.spineId;
		let className = "p-1 border-2";
		className += current ? " border-zinc-500" : " border-transparent";

		return (
			<div key={k} className={className} onClick={() => setCurrentSpineId(item.spineId)}>
				<div className="w-2 h-2 bg-zinc-500"></div>
			</div>
		);
	});

	return (
		<footer className="bg-white border-t-2 border-zinc-500 py-3">
			{pageCount > 1 && <section className="px-4 py-2">
				<h5 className="text-center">{pageCount} pages in this chapter</h5>
				<div className="flex py-2 overflow-hidden justify-center">{pageDots}</div>
			</section>}

			<section className="px-4 py-2">
				<h5 className="text-center">{tocItems.length} chapters in this book</h5>
				<div className="flex py-2 overflow-hidden justify-center">{chapterDots}</div>
			</section>
		</footer>
	);
}
