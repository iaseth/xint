import React from 'react';

import Footer from '../Footer';

const OPTIONS_TABS = [
	{Component: "DashPage", title: "Options", letter: "O"},
	{Component: "StorePage", title: "Help", letter: "H"},
	{Component: "OptionsPage", title: "About", letter: "A"},
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
