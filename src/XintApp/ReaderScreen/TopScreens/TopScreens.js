import TocView from './TocView/TocView';
import SpineView from './SpineView/SpineView';
import ToolboxView from './ToolboxView/ToolboxView';



export default function TopScreens ({
	showToc, showToolbox, showSpine,
	toggleToc, toggleToolbox, toggleSpine,
	tocItems, spineItems, currentSpineId, setCurrentSpineId
}) {

	return (
		<footer className="basestyles">
			<aside className="fixed top-0 w-full h-full z-40 duration-300" style={{ left: showToc ? "0" : "-100%" }}>
				<TocView {...{tocItems, currentSpineId, setCurrentSpineId, toggleToc}} />
			</aside>

			<aside className="fixed left-0 w-full h-full z-40" style={{ top: showToolbox ? "0" : "100%" }}>
				<ToolboxView {...{toggleToolbox}} />
			</aside>

			<aside className="fixed top-0 w-full h-full z-40 duration-300" style={{ right: showSpine ? "0" : "-100%" }}>
				<SpineView {...{spineItems, currentSpineId, setCurrentSpineId, toggleSpine}} />
			</aside>
		</footer>
	);
}
