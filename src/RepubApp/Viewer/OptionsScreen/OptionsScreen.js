


export default function OptionsScreen ({toggleOptions}) {

	return (
		<section className="absolute w-full h-full top-0 z-40 flex flex-col">
			<header className="bg-white border-b-2 border-zinc-500">
				<h4 className="px-4 py-6 text-center">OptionsScreen</h4>
			</header>

			<main className="grow border-x-2 border-white" onClick={toggleOptions}></main>

			<footer className="bg-white border-t-2 border-zinc-500">
				<h4 className="px-4 py-6 text-center">Footer</h4>
			</footer>
		</section>
	);
}
