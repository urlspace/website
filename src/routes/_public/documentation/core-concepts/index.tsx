import { createFileRoute, Link } from "@tanstack/react-router";

import { Heading, Page, Toc } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/core-concepts/")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Core concepts | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Core concepts" />
			<p>
				Links, collections, and tags are the core building blocks of url.space.
				Explore them to get the most out of saving and organising your pages.
				Developers can also manage all three through{" "}
				<Link to="/documentation/api">the API</Link>.
			</p>
			<Toc>
				<ul>
					<li>
						<Link to="/documentation/core-concepts/links">Links</Link>
					</li>
					<li>
						<Link to="/documentation/core-concepts/collections">
							Collections
						</Link>
					</li>
					<li>
						<Link to="/documentation/core-concepts/tags">Tags</Link>
					</li>
				</ul>
			</Toc>
		</Page.Main>
	);
}
