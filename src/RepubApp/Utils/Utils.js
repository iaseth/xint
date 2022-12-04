


export function Button ({text="Button", onClick}) {
	return (
		<button className="text-center px-5 py-3 mr-2 bg-blue-500 text-white text-sm font-bold rounded shadow border-2 border-blue-700 hover:bg-blue-700" onClick={onClick}>{text}</button>
	);
}


