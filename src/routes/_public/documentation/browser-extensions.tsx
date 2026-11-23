import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/browser-extensions",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Browser extensions | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Browser extensions" />
		</Page.Main>
	);
}
