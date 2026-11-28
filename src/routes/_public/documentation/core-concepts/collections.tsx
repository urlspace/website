import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/core-concepts/collections",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Collections | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Collections" />
			<p>
				Collections are one way to organise your links. Think of a collection as
				a folder: unlike tags, a link can belong to only one collection.
				Collections are private by default. The free plan allows up to 100
				collections.
			</p>
			<hr />
			<Heading level={2} text="Visibility" />
			<p>
				Feasibility allows you to control who can see your collection. They are
				private by default. But subscribers to the unlimited plan can also make
				them public or password protected. This is incredibly useful if you
				would like to share your curated collection with others.
			</p>
		</Page.Main>
	);
}
