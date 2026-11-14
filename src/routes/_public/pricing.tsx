import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Pricing } from "#/components/index.ts";

export const Route = createFileRoute("/_public/pricing")({
	component: App,
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

	return (
		<Page.Main>
			<Heading level={1} text="Pricing" />
			<Pricing hasSession={hasSession} />
		</Page.Main>
	);
}
