


export default function LoadingPage ({meta}) {
	return (
		<div className="h-screen bg-red-400 text-white basestyles">
			<main className="h-full flex">
				<div className="m-auto text-center">
					<h1 className="H2">{meta.title}</h1>
					<h2 className="H4">{meta.author}</h2>
				</div>
			</main>
		</div>
	);
}
