


export default function SplashScreen ({APPNAME}) {

	return (
		<div className="h-screen w-full bg-red-500 text-white flex flex-col">
			<header></header>

			<main className="grow flex">
				<h1 className="m-auto text-4xl">{APPNAME}</h1>
			</main>

			<footer></footer>
		</div>
	);
}
