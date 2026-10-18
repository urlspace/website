import { createFileRoute } from "@tanstack/react-router";

import {
	ButtonDownload,
	DashboardButtonLink,
	FormImport,
	Heading,
	Icon,
	Logo,
	Stack,
} from "#/components/index.ts";
import { collectionsQueryOptions } from "#/queries/collections.ts";
import { tagsQueryOptions } from "#/queries/tags.ts";

export const Route = createFileRoute("/_protected/tools")({
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(collectionsQueryOptions),
			context.queryClient.ensureQueryData(tagsQueryOptions),
		]),
	component: PageTools,
	head: () => ({
		meta: [
			{
				title: "Tools | url.space",
			},
		],
	}),
});

function PageTools() {
	return (
		<div className="page">
			<header className="page__header">
				<Logo to="/dashboard" />
				<DashboardButtonLink
					icon={<Icon.Back />}
					to="/dashboard"
					text="Back to dashboard"
				/>
			</header>
			<main className="page__main">
				<Stack gap={2}>
					<Heading level={1} text="Tools" />

					<Stack gap={1}>
						<Heading level={2} text="Import" />
						<p>
							Coming from Chrome, Firefox, Safari, Pinboard or somewhere else?
							Grab their HTML export (it's the{" "}
							<a href="https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)">
								Netscape Bookmark File Format
							</a>
							, which almost everything supports), pick the source below, and
							your folders, tags and dates come along.
						</p>
						<FormImport />
					</Stack>

					<hr />

					<Stack gap={1}>
						<Heading level={2} text="Export" />
						<p>
							Your data is yours. Export every link, collection and tag to a
							standard{" "}
							<a href="https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)">
								Netscape Bookmark File Format
							</a>{" "}
							HTML file that you can import into any browser, or back into
							url.space.
						</p>
						<ButtonDownload
							text="Export bookmarks"
							href="/tools/bookmarks.html"
						/>
					</Stack>
				</Stack>
			</main>
		</div>
	);
}
