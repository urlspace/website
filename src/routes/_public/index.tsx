import { createFileRoute } from "@tanstack/react-router";

import { Intro } from "#/components";

export const Route = createFileRoute("/_public/")({
	component: App,
});

function App() {
	return (
		<div>
			<Intro />
			{/* <Features /> */}
		</div>
	);
}
