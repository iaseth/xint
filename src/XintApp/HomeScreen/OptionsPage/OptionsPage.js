import React from 'react';

import Footer from '../Footer';

const OPTIONS_TABS = [
	{Component: "DashPage", title: "O1", letter: "D"},
	{Component: "StorePage", title: "O2", letter: "S"},
	{Component: "OptionsPage", title: "O3", letter: "O"},
];



export default function OptionsPage ({fullscreen}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

	return (
		<div className="min-h-screen bg-slate-100">
			<header className="max-w-5xl mx-auto px-4 py-4 min-h-screen">
				<h2>OptionsPage</h2>
			</header>

			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={OPTIONS_TABS} />
		</div>
	);
}
