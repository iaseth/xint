import React from 'react';

import StoreTab from './StoreTab/StoreTab';
import ImportTab from './ImportTab/ImportTab';
import ExportTab from './ExportTab/ExportTab';

import Footer from '../Footer';

const STORE_TABS = [
	{title: "Store", letter: "S"},
	{title: "Import", letter: "I"},
	{title: "Export", letter: "E"},
];



export default function StorePage ({fullscreen}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentStoreTab = STORE_TABS[currentTabIndex];

	function getCurrentStoreTab () {
		switch (currentStoreTab.title) {
			case "Import":
				return <ImportTab />;
			case "Export":
				return <ExportTab />;
			case "Store":
			default:
				return <StoreTab />;
		}
	}

	return (
		<div className="min-h-screen bg-slate-100">
			{getCurrentStoreTab()}
			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={STORE_TABS} />
		</div>
	);
}
