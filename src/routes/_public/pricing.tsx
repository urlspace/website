import { createFileRoute } from "@tanstack/react-router";

import { Heading, Page } from "#/components/index.ts";

export const Route = createFileRoute("/_public/pricing")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Pricing | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Pricing" />
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati
			repellendus, delectus dolores sint voluptatibus mollitia culpa doloremque
			dolorum reiciendis optio! Rerum iusto, doloribus voluptates, assumenda,
			consectetur corrupti facilis pariatur eligendi repellendus dignissimos
			quasi quod fugiat sit consequatur. Vero, animi nostrum.
		</Page.Main>
	);
}
