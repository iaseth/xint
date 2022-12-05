import OptionsHeader from './OptionsHeader';
import OptionsFooter from './OptionsFooter';



export default function OptionsScreen ({
	goBackHome, toggleOptions,
	pageViewRef, pageNumber, setPageNumber,
	currentSpineId, setCurrentSpineId, tocItems
}) {

	return (
		<section className="absolute w-full h-full top-0 z-40 flex flex-col select-none">
			<OptionsHeader {...{goBackHome}} />

			<main className="grow translucent" onClick={toggleOptions}></main>

			<OptionsFooter {...{pageViewRef, pageNumber, setPageNumber,
				currentSpineId, setCurrentSpineId, tocItems}} />
		</section>
	);
}
