import React from 'react';

import DashTab from './DashTab/DashTab';
import BooksTab from './BooksTab/BooksTab';
import ShelvesTab from './ShelvesTab/ShelvesTab';

import Footer from '../Footer';

const DASH_TABS = [
	{title: "Dash", letter: "D"},
	{title: "Books", letter: "B"},
	{title: "Shelves", letter: "S"},
];



export default function DashPage ({fullscreen, books, getImageFromDB, openReader, crudUtils}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentDashTab = DASH_TABS[currentTabIndex];

	function getCurrentDashTab () {
		switch (currentDashTab.title) {
			case "Books":
				return <BooksTab />;
			case "Shelves":
				return <ShelvesTab />;
			case "Dash":
			default:
				return <DashTab {...{books, getImageFromDB, openReader, crudUtils}} />;
		}
	}

	return (
		<div className="bg-slate-100">
			{getCurrentDashTab()}
			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={DASH_TABS} />
		</div>
	);
}
