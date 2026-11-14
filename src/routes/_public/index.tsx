import { createFileRoute } from "@tanstack/react-router";

import { Intro, Features, Pricing } from "#/components";

export const Route = createFileRoute("/_public/")({
	component: App,
});

function App() {
	const { hasSession } = Route.useRouteContext();

	return (
		<div>
			<Intro />
			<Features />
			<Pricing hasSession={hasSession} />
		</div>
	);
}
