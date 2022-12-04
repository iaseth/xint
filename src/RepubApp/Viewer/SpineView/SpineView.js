


export default function SpineView ({toggleSpine}) {
	return (
		<section className="h-full w-full flex">
			<div className="grow" onClick={toggleSpine}></div>
			<div className="grow h-full max-w-sm bg-white border-l-2 border-slate-300 overflow-y-scroll">
				<h4>SpineView</h4>
			</div>
		</section>
	);
}
