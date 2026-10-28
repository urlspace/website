import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page, Stack } from "#/components/index.ts";

export const Route = createFileRoute("/_public/privacy-policy")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Privacy policy | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Stack>
				<Heading level={1} text="Privacy policy" />
				TBC
			</Stack>
		</Page.Main>
	);
}
