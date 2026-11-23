import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/core-concepts/links",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Links | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Links" />
		</Page.Main>
	);
}
