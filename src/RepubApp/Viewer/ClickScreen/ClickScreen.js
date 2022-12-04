


export default function ClickScreen ({
	toggleToc, toggleOptions, toggleSpine, toggleToolbox,
	goToPreviousPage, goToNextPage, goToPreviousChapter, goToNextChapter
}) {

	return (
		<section className="absolute top-0 left-0 z-20 w-full h-full border-2 border-red-500">
			<header className="h-1/6 flex">
				<section className="w-1/3 h-full" onClick={toggleToc}></section>
				<section className="w-1/3 h-full" onClick={toggleOptions}></section>
				<section className="w-1/3 h-full" onClick={toggleSpine}></section>
			</header>

			<main className="h-4/6 flex">
				<section className="w-2/5 h-full" onClick={goToPreviousPage}></section>
				<section className="w-3/5 h-full" onClick={goToNextPage}></section>
			</main>

			<footer className="h-1/6 flex">
				<section className="w-1/3 h-full" onClick={goToPreviousChapter}></section>
				<section className="w-1/3 h-full" onClick={toggleToolbox}></section>
				<section className="w-1/3 h-full" onClick={goToNextChapter}></section>
			</footer>
		</section>
	);
}
