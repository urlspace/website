import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import React from "react";
import {
	ButtonLink,
	DashboardButton,
	Heading,
	Icon,
	LinkCardSlim,
	Public,
	Stack,
} from "#/components/index.ts";
import { getPublicUser } from "#/queries/user.ts";

type Layout = "list" | "masonry";
const layoutStorageKey = "public-collection-layout";

export const Route = createFileRoute("/_public/$username/")({
	// Usernames are stored lowercase. Mixed-case links redirect so every
	// profile has exactly one URL.
	beforeLoad: ({ params }) => {
		const username = params.username.toLowerCase();
		if (params.username !== username) {
			throw redirect({
				to: "/$username",
				params: { username },
				statusCode: 301,
			});
		}
	},
	loader: async ({ params }) => {
		const user = await getPublicUser({ data: params.username });
		if (user === null) throw notFound({ routeId: "__root__" });
		return user;
	},
	staleTime: 5 * 60 * 1000,
	head: ({ loaderData, params }) => {
		if (!loaderData) return { meta: [] };

		const title = `${loaderData.displayName} | url.space`;
		const description = `Explore public collections of links curated by ${loaderData.displayName} on url.space.`;
		const userUrl = `https://url.space/${encodeURIComponent(params.username)}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: userUrl },
			],
			links: [{ rel: "canonical", href: userUrl }],
		};
	},
	gcTime: 5 * 60 * 1000,
	preloadStaleTime: 5 * 60 * 1000,
	component: PagePublicUser,
});

function PagePublicUser() {
	const [layout, setLayout] = React.useState<Layout>("list");
	const user = Route.useLoaderData();
	const { username } = Route.useParams();
	const { hasSession } = Route.useRouteContext();

	async function handleShare() {
		if (!navigator.share) {
			window.alert("Sharing is not supported in this browser.");
			return;
		}

		try {
			await navigator.share({
				title: `${user.displayName} | url.space`,
				url: window.location.href,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}
			window.alert("Unable to share this page. Please try again.");
		}
	}

	const asideContent = (
		<>
			<Heading
				level={3}
				text={
					hasSession ? "Share your collections" : "Start your own collection"
				}
			/>
			<p>
				{hasSession
					? "Bring your favourite links together and share your collections with the world."
					: "Create a free account to save your favourite links and organise them your way."}
			</p>
			<ButtonLink
				text={hasSession ? "Go to dashboard" : "Create an account"}
				to={hasSession ? "/dashboard" : "/auth/signup"}
			/>
		</>
	);

	React.useEffect(() => {
		try {
			const savedLayout = window.localStorage.getItem(layoutStorageKey);
			if (savedLayout === "list" || savedLayout === "masonry") {
				setLayout(savedLayout);
			}
		} catch {
			return;
		}
	}, []);

	function changeLayout(nextLayout: Layout) {
		setLayout(nextLayout);
		try {
			window.localStorage.setItem(layoutStorageKey, nextLayout);
		} catch {
			return;
		}
	}

	const heading = (
		<Heading
			level={2}
			text={`Public Collections (${user.collections.length} items)`}
		/>
	);

	const collections =
		user.collections.length === 0 ? (
			<p>No public collections yet.</p>
		) : (
			user.collections.map((collection) => (
				<Public.Item key={collection.id}>
					<LinkCardSlim
						id={`collection-${collection.id}`}
						title={collection.name}
						description={collection.description}
						createdAt={collection.createdAt}
						url={`/${encodeURIComponent(username)}/${encodeURIComponent(collection.slug)}`}
						internal
					/>
				</Public.Item>
			))
		);

	return (
		<Public>
			<Public.Header>
				<Heading level={1} text={user.displayName} />
				<Public.Options>
					<Public.Option layout>
						<DashboardButton
							text="List"
							onClick={() => changeLayout("list")}
							icon={<Icon.List />}
							ariaPressed={layout === "list"}
						/>
					</Public.Option>
					<Public.Option layout>
						<DashboardButton
							text="Waterfall"
							onClick={() => changeLayout("masonry")}
							icon={<Icon.Masonry />}
							ariaPressed={layout === "masonry"}
						/>
					</Public.Option>
					<Public.Option>
						<DashboardButton
							text="Share"
							onClick={handleShare}
							icon={<Icon.Share />}
						/>
					</Public.Option>
				</Public.Options>
			</Public.Header>
			{layout === "masonry" ? (
				<Public.ViewMasonry>
					<Public.ViewMasonryHeader>{heading}</Public.ViewMasonryHeader>
					<Public.ViewMasonryMain>{collections}</Public.ViewMasonryMain>
					<Public.ViewMasonryAside>{asideContent}</Public.ViewMasonryAside>
				</Public.ViewMasonry>
			) : (
				<Public.ViewList>
					<Public.ViewListMain>
						<Stack gap={2}>
							{heading}
							{collections}
						</Stack>
					</Public.ViewListMain>
					<Public.ViewListAside>{asideContent}</Public.ViewListAside>
				</Public.ViewList>
			)}
		</Public>
	);
}
