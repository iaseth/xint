import TocItems from './TocItems';



export default function TocView ({tocItems, currentSpineId, setCurrentSpineId, toggleToc}) {

	return (
		<section className="h-full w-full flex">
			<div className="grow h-full max-w-sm bg-white border-r-2 border-slate-300 overflow-y-scroll">
				<TocItems {...{tocItems, currentSpineId, setCurrentSpineId}} />
			</div>
			<div className="grow" onClick={toggleToc}></div>
		</section>
	);
}
