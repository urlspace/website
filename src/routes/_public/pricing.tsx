import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Pricing } from "#/components/index.ts";
import { getCountry } from "#/queries/country.ts";

export const Route = createFileRoute("/_public/pricing")({
	component: App,
	loader: () => getCountry(),
	head: () => ({
		meta: [
			{
				title: "Pricing | url.space",
			},
		],
	}),
});

function App() {
	const { hasSession } = Route.useRouteContext();
	const country = Route.useLoaderData();

	return (
		<Page.Main>
			<Heading level={1} text="Pricing" />
			<Pricing hasSession={hasSession} country={country} />
		</Page.Main>
	);
}
