import React from 'react';

import Header from './Header';
import Footer from './Footer';

import DashPage from './DashPage/DashPage';
import OptionsPage from './OptionsPage/OptionsPage';
import StorePage from './StorePage/StorePage';
import DebugPage from './DebugPage/DebugPage';



const XINT_TABS = [
	{Component: DashPage, title: "Dash", letter: "D"},
	{Component: StorePage, title: "Store", letter: "S"},
	{Component: OptionsPage, title: "Options", letter: "O"},
	{Component: DebugPage, title: "Debug", letter: "G", hidden: true},
];



export default function HomeScreen ({books, openReader, toggleLockScreen, crudUtils}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentTab = XINT_TABS[currentTabIndex];

	const [fullscreen, setFullscreen] = React.useState(false);

	function handleKeyDown (event) {
		if (event.altKey && event.ctrlKey && event.shiftKey) {
			if (event.key === "F") {
				setFullscreen(fullscreen => !fullscreen);
			} else if (event.key === "D") {
				setCurrentTabIndex(XINT_TABS.findIndex(tab => tab.title === "Debug"));
			} else if (event.key === "L") {
				toggleLockScreen();
			}
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});

	function getCurrentTab () {
		switch (currentTab.title) {
			case "Debug":
				return <DebugPage />;
			case "Store":
				return <StorePage />;
			case "Options":
				return <OptionsPage />;
			case "Home":
			default:
				return <DashPage {...{books, openReader, crudUtils}} />;
		}
	}

	return (
		<div onKeyDown={handleKeyDown}>
			<Header {...{fullscreen, currentTabIndex, setCurrentTabIndex, XINT_TABS}} />
			{getCurrentTab()}
			<Footer {...{fullscreen}} />
		</div>
	);
}
