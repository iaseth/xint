import React from 'react';

import ColorTab from './ColorTab/ColorTab';
import FontTab from './FontTab/FontTab';
import PageTab from './PageTab/PageTab';
import ThemeTab from './ThemeTab/ThemeTab';


const TOOLBOX_TABS = [
	{Component: ColorTab, title: "Color"},
	{Component: FontTab, title: "Font"},
	{Component: PageTab, title: "Page"},
	{Component: ThemeTab, title: "Theme"},
];

export default function ToolboxView ({toggleToolbox}) {
	const [toolboxTabIndex, setToolboxTabIndex] = React.useState(0);
	const TAB = TOOLBOX_TABS[toolboxTabIndex];
	const TabComponent = TAB.Component;

	const tabItems = TOOLBOX_TABS.map((tab, k) => {
		const current = k === toolboxTabIndex;
		let className = "mx-[-1px] border-x-2 border-b-2 border-x-transparent";
		className += current ? " border-x-zinc-500 border-b-transparent" : " border-b-zinc-500 cursor-pointer";

		return (
			<div key={k} onClick={() => setToolboxTabIndex(k)} className={className}>
				<h5 className="px-2 py-4">{tab.title}</h5>
			</div>
		);
	});

	function getCurrentToolboxTab () {
		return <TabComponent />;
	}

	return (
		<section className="h-full w-full px-4 py-4 flex select-none translucent" onClick={toggleToolbox}>
			<article className="w-full max-w-sm bg-white m-auto rounded shadow border-2 border-zinc-500" onClick={event => event.stopPropagation()}>
				<header className="text-center">
					<section className="grid grid-cols-4">{tabItems}</section>
				</header>

				<main>
					{getCurrentToolboxTab()}
				</main>
			</article>
		</section>
	);
}
