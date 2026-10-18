import { createFileRoute } from "@tanstack/react-router";

import { Stack, Intro } from "#/components";

export const Route = createFileRoute("/_public/")({
	component: App,
});

function App() {
	return (
		<Stack>
			<Intro />
		</Stack>
	);
}
