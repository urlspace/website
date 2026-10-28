import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Stack } from "#/components";

export const Route = createFileRoute("/_public/terms-of-service")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Terms of service | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Stack>
				<Heading level={1} text="Terms of service" />
				TBC
			</Stack>
		</Page.Main>
	);
}
