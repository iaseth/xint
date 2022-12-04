import OptionsHeader from './OptionsHeader';
import OptionsFooter from './OptionsFooter';



export default function OptionsScreen ({
	pageViewRef, pageNumber, setPageNumber,
	toggleOptions, goBackHome
}) {

	return (
		<section className="absolute w-full h-full top-0 z-40 flex flex-col select-none">
			<OptionsHeader {...{goBackHome}} />

			<main className="grow border-x-2 border-white" onClick={toggleOptions}></main>

			<OptionsFooter {...{pageViewRef, pageNumber, setPageNumber}} />
		</section>
	);
}
