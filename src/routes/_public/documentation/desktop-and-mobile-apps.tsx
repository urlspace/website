import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute(
	"/_public/documentation/desktop-and-mobile-apps",
)({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Desktop and mobile apps | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Desktop and mobile apps" />
		</Page.Main>
	);
}
