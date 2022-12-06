


export default function Header ({fullscreen, currentTabIndex, setCurrentTabIndex, HOME_TABS}) {
	const tabItems = HOME_TABS.filter(tab => !tab.hidden).map((tab, k) => {
		const current = k === currentTabIndex;
		let className = "rounded-t duration-300";
		className += current ? " bg-slate-100 text-red-500" : " cursor-pointer hover:bg-red-600";

		return (
			<div className={className} key={k} onClick={() => setCurrentTabIndex(k)}>
				<h5 className="px-2 py-5">
					<span className="border-b-4 border-red-500 pb-1">{tab.title}</span>
				</h5>
			</div>
		);
	});

	return (
		<header className="bg-red-500 text-white pt-2 sticky top-0" hidden={fullscreen}>
			<div className="max-w-5xl mx-auto px-2 flex ch:basis-0 ch:grow text-center select-none">
				{tabItems}
			</div>
		</header>
	);
}
