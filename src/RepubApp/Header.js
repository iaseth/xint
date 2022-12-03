


export default function Header ({fullscreen}) {
	return (
		<header className="bg-red-500 text-white py-4" hidden={fullscreen}>
			<div className="px-4">
				<h4 className="text-center">Repub</h4>
			</div>
		</header>
	);
}
