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
			<p>
				Tags are one way to organise your links. Think of a tags as a labels:
				unlike collectoins, a link can have multiple of them (up to 10). The
				free plan allows up to 100 tags in total.
			</p>
		</Page.Main>
	);
}
