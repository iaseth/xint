


export default function OptionsHeader ({goToPreviousChapter, goBackHome, goToNextChapter}) {
	return (
		<header className="bg-white border-b-2 border-zinc-500">
			<section className="grid grid-cols-3 gap-x-2 px-2 py-2 text-center ch:py-5 ch:bg-zinc-100 ch:rounded">
				<h5 onClick={goToPreviousChapter}>Previous</h5>
				<h5 onClick={goBackHome}>Home</h5>
				<h5 onClick={goToNextChapter}>Next</h5>
			</section>
		</header>
	);
}
