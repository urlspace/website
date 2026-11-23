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
				Welcome to <strong>url.space</strong>. It is designed in such a way that
				basic operations don't need complicated manuals. Save, organise, and
				browse your links without ever looking at this documentation. If you
				would like to explore more advanced features and read about the
				implementation, feel free to dig deeper. Exploring the{" "}
				<Link to="/documentation/core-concepts">core concepts</Link> is a good
				starting point. Downloading a{" "}
				<Link to="/documentation/browser-extensions">browser extension</Link>{" "}
				can massively speed up your workflow. If that's still not enough, go
				wild, explore the <Link to="/documentation/api">API section</Link> and
				build your own integration.
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
