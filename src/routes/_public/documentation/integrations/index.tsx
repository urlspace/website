import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/integrations/")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Integrations | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Integrations" />
		</Page.Main>
	);
}
