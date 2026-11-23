import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/integrations/apple-shortcuts",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Apple Shortcuts | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Apple Shortcuts" />
		</Page.Main>
	);
}
