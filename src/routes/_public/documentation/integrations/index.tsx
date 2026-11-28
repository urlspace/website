import { createFileRoute, Link } from "@tanstack/react-router";

import { Heading, Page, Toc } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/integrations/")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Integrations | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Integrations" />
			<p>
				Make your Workflows even smoother by integrating URL.space with your
				favorite tools.
			</p>
			<Toc>
				<ul>
					<li>
						<Link to="/documentation/integrations/apple-shortcuts">
							Apple Shortcuts
						</Link>
					</li>
				</ul>
			</Toc>
		</Page.Main>
	);
}
