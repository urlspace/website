import { createFileRoute, Link } from "@tanstack/react-router";

import { Heading, Page, Toc } from "#/components/index.ts";

export const Route = createFileRoute("/_public/documentation/")({
	component: App,
	head: () => ({
		meta: [
			{
				title: "Documentation | url.space",
			},
		],
	}),
});

function App() {
	return (
		<Page.Main>
			<Heading level={1} text="Documentation" />
			<p>
				Welcome to <strong>url.space</strong> You can save, organise and browse
				your links without needing a manual. When you want to delve deeper into
				a particular concept or explore more advanced features, this
				documentation is here to help.
			</p>
			<Toc>
				<ul>
					<li>
						<Link to="/documentation/core-concepts">Core concepts</Link>
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
					</li>
					<li>
						<Link to="/documentation/browser-extensions">
							Browser extensions
						</Link>
					</li>
					<li>
						<Link to="/documentation/desktop-and-mobile-apps">
							Desktop and mobile apps
						</Link>
					</li>
					<li>
						<Link to="/documentation/integrations">Integrations</Link>
						<ul>
							<li>
								<Link to="/documentation/integrations/apple-shortcuts">
									Apple Shortcuts
								</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link to="/documentation/api">API</Link>
					</li>
				</ul>
			</Toc>

			<p>
				Feel free to contact me at{" "}
				<a href="mailto:mail@url.space">mail@url.space</a> to report an issue,
				suggest a feature, ask a question, or chat about the service.
			</p>
		</Page.Main>
	);
}
