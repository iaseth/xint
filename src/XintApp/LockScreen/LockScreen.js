import React from 'react';



export default function LockScreen ({APPNAME, toggleLockScreen}) {
	function handleKeyDown (event) {
		if (event.key === " ") {
			event.preventDefault();
			toggleLockScreen();
		}
	}

	React.useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => window.removeEventListener('keydown', handleKeyDown, false);
	});

	return (
		<div className="basestyles h-screen w-full bg-pink-500 text-white flex flex-col">
			<header></header>

			<main className="grow flex">
				<h1 className="m-auto H3">{APPNAME}</h1>
			</main>

			<footer></footer>
		</div>
	);
}
