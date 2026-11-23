import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/core-concepts/")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Core concepts | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Core concepts" />
		</Page.Main>
	);
}
