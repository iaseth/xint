import React from 'react';

import Footer from '../Footer';

const STORE_TABS = [
	{Component: "DashPage", title: "Store", letter: "S"},
	{Component: "StorePage", title: "Import", letter: "I"},
	{Component: "OptionsPage", title: "Export", letter: "E"},
];



export default function StorePage ({fullscreen}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

	return (
		<div className="min-h-screen bg-slate-100">
			<header className="max-w-5xl mx-auto px-4 py-4 min-h-screen">
				<h2>StorePage</h2>
			</header>

			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={STORE_TABS} />
		</div>
	);
}
