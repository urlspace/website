import { createFileRoute } from "@tanstack/react-router";

import { Intro, Features, Pricing, About } from "#/components";
import { getCountry } from "#/queries/country.ts";

export const Route = createFileRoute("/_public/")({
	component: App,
	loader: () => getCountry(),
});

function App() {
	const { hasSession } = Route.useRouteContext();
	const country = Route.useLoaderData();

	return (
		<div>
			<Intro hasSession={hasSession} />
			<Features />
			<About />
			<Pricing hasSession={hasSession} country={country} />
		</div>
	);
}
