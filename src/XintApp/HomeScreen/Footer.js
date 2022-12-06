


export default function Footer ({fullscreen, currentTabIndex, setCurrentTabIndex, TABS}) {
	const tabItems = TABS.filter(tab => !tab.hidden).map((tab, k) => {
		const current = k === currentTabIndex;
		let className = "rounded-b duration-300";
		className += current ? " bg-slate-100 text-zinc-700" : " cursor-pointer hover:bg-zinc-600";

		return (
			<div className={className} key={k} onClick={() => setCurrentTabIndex(k)}>
				<h5 className="px-2 py-5">
					<span className="border-b-4 border-zinc-700 pb-1">{tab.title}</span>
				</h5>
			</div>
		);
	});

	return (
		<header className="bg-zinc-800 text-white pb-2 sticky bottom-0" hidden={fullscreen}>
			<div className="max-w-5xl mx-auto px-2 flex ch:basis-0 ch:grow text-center select-none">
				{tabItems}
			</div>
		</header>
	);
}
