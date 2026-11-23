import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/api")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "API | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="API" />
		</Page.Main>
	);
}
