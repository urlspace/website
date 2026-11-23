import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/core-concepts/tags",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Tags | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Tags" />
		</Page.Main>
	);
}
