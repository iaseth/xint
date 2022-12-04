


export default function OptionsHeader ({goBackHome}) {
	return (
		<header className="bg-white border-b-2 border-zinc-500">
			<h4 className="px-4 py-6 text-center" onClick={goBackHome}>Go Back</h4>
		</header>
	);
}
