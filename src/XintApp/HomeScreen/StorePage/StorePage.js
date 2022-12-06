import React from 'react';

import Footer from '../Footer';

const STORE_TABS = [
	{Component: "DashPage", title: "S1", letter: "D"},
	{Component: "StorePage", title: "S2", letter: "S"},
	{Component: "OptionsPage", title: "S3", letter: "O"},
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
