import React from 'react';

import AboutTab from './AboutTab/AboutTab';
import HelpTab from './HelpTab/HelpTab';
import OptionsTab from './OptionsTab/OptionsTab';

import Footer from '../Footer';

const OPTIONS_TABS = [
	{title: "Options", letter: "O"},
	{title: "Help", letter: "H"},
	{title: "About", letter: "A"},
];



export default function OptionsPage ({fullscreen}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentOptionsTab = OPTIONS_TABS[currentTabIndex];

	function getCurrentOptionsTab () {
		switch (currentOptionsTab.title) {
			case "About":
				return <AboutTab />;
			case "Help":
				return <HelpTab />;
			case "Options":
			default:
				return <OptionsTab />;
		}
	}

	return (
		<div className="min-h-screen bg-slate-100">
			{getCurrentOptionsTab()}
			<Footer {...{fullscreen, currentTabIndex, setCurrentTabIndex}} TABS={OPTIONS_TABS} />
		</div>
	);
}
