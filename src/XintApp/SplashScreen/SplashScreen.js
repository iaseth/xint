


export default function SplashScreen ({APPNAME}) {

	return (
		<div className="basestyles h-screen w-full bg-red-500 text-white flex flex-col">
			<header></header>

			<main className="grow flex">
				<h1 className="m-auto H4">{APPNAME}</h1>
			</main>

			<footer></footer>
		</div>
	);
}
