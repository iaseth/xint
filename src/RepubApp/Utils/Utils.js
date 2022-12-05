


export function Button ({text="Button", onClick}) {
	return (
		<button className="text-center px-5 py-3 mr-2 bg-blue-500 text-white text-sm font-bold rounded shadow border-2 border-blue-700 hover:bg-blue-700" onClick={onClick}>{text}</button>
	);
}



export function ShowMoreButton ({className="", onClick}) {
	return (
		<button onClick={onClick} className={"flex mx-auto bg-white px-5 py-4 shadow rounded space-x-2 hover:ring " + className}>
			{[...Array(3)].map((x, k) => <div key={k} className="bg-slate-800 p-1 rounded"></div>)}
		</button>
	);
}


