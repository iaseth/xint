


export default function Header ({fullscreen, currentTabIndex, setCurrentTabIndex, REPUB_TABS}) {
	const tabItems = REPUB_TABS.filter(tab => !tab.hidden).map((tab, k) => {
		const current = k === currentTabIndex;
		let className = "rounded-t";
		className += current ? " bg-slate-100 text-red-800" : " cursor-pointer";

		return (
			<div className={className} key={k} onClick={() => setCurrentTabIndex(k)}>
				<h5 className="px-2 py-5">{tab.title}</h5>
			</div>
		);
	});

	return (
		<header className="bg-red-500 text-white pt-2" hidden={fullscreen}>
			<div className="max-w-5xl mx-auto px-2 flex ch:basis-0 ch:grow text-center select-none">
				{tabItems}
			</div>
		</header>
	);
}
