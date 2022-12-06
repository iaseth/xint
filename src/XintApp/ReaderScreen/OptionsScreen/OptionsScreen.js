import OptionsHeader from './OptionsHeader';
import OptionsFooter from './OptionsFooter';



export default function OptionsScreen ({
	goToPreviousChapter, goBackHome, goToNextChapter, toggleOptions,
	pageViewRef, pageNumber, setPageNumber,
	currentSpineId, setCurrentSpineId, tocItems
}) {

	return (
		<section className="basestyles absolute w-full h-full top-0 z-40 flex flex-col select-none">
			<OptionsHeader {...{goToPreviousChapter, goBackHome, goToNextChapter}} />

			<main className="grow translucent" onClick={toggleOptions}></main>

			<OptionsFooter {...{pageViewRef, pageNumber, setPageNumber,
				currentSpineId, setCurrentSpineId, tocItems}} />
		</section>
	);
}
