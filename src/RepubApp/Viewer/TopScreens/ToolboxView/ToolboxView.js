


export default function ToolboxView ({toggleToolbox}) {
	return (
		<section className="h-full w-full px-4 py-4 flex" onClick={toggleToolbox}>
			<article className="w-full max-w-sm bg-white m-auto rounded shadow border-2 border-red-500">
				<header className="px-4 py-4 text-center border-b-2 border-red-500">
					<h4>Tools</h4>
				</header>

				<main className="px-4 py-24"></main>
			</article>
		</section>
	);
}
