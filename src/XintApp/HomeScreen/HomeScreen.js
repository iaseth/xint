import React from 'react';

import Header from './Header';

import DashPage from './DashPage/DashPage';
import OptionsPage from './OptionsPage/OptionsPage';
import StorePage from './StorePage/StorePage';
import DebugPage from './DebugPage/DebugPage';



const HOME_TABS = [
	// tabs visible in the header
	{Component: DashPage, title: "Dash", letter: "D"},
	{Component: StorePage, title: "Store", letter: "S"},
	{Component: OptionsPage, title: "Options", letter: "O"},

	// hidden tabs should be at the end
	{Component: DebugPage, title: "Debug", letter: "G", hidden: true},
];



export default function HomeScreen ({books, openReader, toggleLockScreen, crudUtils}) {
	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const currentHomeTab = HOME_TABS[currentTabIndex];

	const [fullscreen, setFullscreen] = React.useState(false);

	const handleKeyDown = (event) => {
		if (event.altKey && event.ctrlKey && event.shiftKey) {
			if (event.key === "F") {
				setFullscreen(fullscreen => !fullscreen);
			} else if (event.key === "D") {
				setCurrentTabIndex(HOME_TABS.findIndex(tab => tab.title === "Debug"));
			} else if (event.key === "L") {
				toggleLockScreen();
			}
		} else if (event.ctrlKey) {
			const N = HOME_TABS.length;
			if (event.key === "ArrowLeft") {
				setCurrentTabIndex(x => (N + x - 1) % N);
			} else if (event.key === "ArrowRight") {
				setCurrentTabIndex(x => (N + x + 1) % N);
			}
		}
	};

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});

	function getCurrentHomeTab () {
		switch (currentHomeTab.title) {
			case "Debug":
				return <DebugPage />;
			case "Store":
				return <StorePage />;
			case "Options":
				return <OptionsPage />;
			case "Dash":
			default:
				return <DashPage {...{fullscreen, books, openReader, crudUtils}} />;
		}
	}

	return (
		<div className="basestyles">
			<Header {...{fullscreen, currentTabIndex, setCurrentTabIndex, HOME_TABS}} />
			{getCurrentHomeTab()}
		</div>
	);
}
