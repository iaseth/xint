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
		<div className="h-screen w-full bg-pink-500 text-white flex flex-col">
			<header></header>

			<main className="grow flex">
				<h1 className="m-auto text-4xl">{APPNAME}</h1>
			</main>

			<footer></footer>
		</div>
	);
}
