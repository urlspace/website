import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import React from "react";
import styles from "#/components/CollctionLink/CollectionLink.module.css";
import {
	ButtonLink,
	DashboardButton,
	Heading,
	Icon,
	Stack,
} from "#/components/index.ts";
import { getPublicUser } from "#/queries/user.ts";
import { formatDate } from "#/utils.ts";

type Layout = "list" | "masonry";
const layoutStorageKey = "public-collection-layout";

export const Route = createFileRoute("/_public/user/$username")({
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
		const userUrl = `https://url.space/user/${encodeURIComponent(params.username)}`;

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
	const { hasSession } = Route.useRouteContext();

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
				<div key={collection.id}>
					<article
						className={styles.link}
						aria-labelledby={`collection-${collection.id}`}
					>
						<div>
							<Link
								to="/collection/$collectionId"
								params={{ collectionId: collection.id }}
								className={styles.container}
							>
								<h3 id={`collection-${collection.id}`} className={styles.title}>
									{collection.name}
								</h3>
							</Link>
						</div>
						{collection.description.length > 0 ? (
							<p>{collection.description}</p>
						) : null}
						<div className={styles.meta}>
							<dl>
								<div className={styles.metaItem}>
									<dt>{"Added: "}</dt>
									<dd>
										<time dateTime={collection.createdAt}>
											{formatDate(collection.createdAt)}
										</time>
									</dd>
								</div>
							</dl>
						</div>
					</article>
				</div>
			))
		);

	return (
		<main className="collection">
			<header className="collection__header">
				<Heading level={1} text={user.displayName} />
				<div className="collection__options">
					<div className="collection__option collection__option--layout">
						<DashboardButton
							text="List"
							onClick={() => changeLayout("list")}
							icon={<Icon.List />}
							ariaPressed={layout === "list"}
						/>
					</div>
					<div className="collection__option collection__option--layout">
						<DashboardButton
							text="Waterfall"
							onClick={() => changeLayout("masonry")}
							icon={<Icon.Masonry />}
							ariaPressed={layout === "masonry"}
						/>
					</div>
				</div>
			</header>
			{layout === "masonry" ? (
				<div className="collection__viewMasonry">
					<header className="collection__viewMasonryHeader">{heading}</header>
					<div className="collection__viewMasonryMain">{collections}</div>
					<aside className="collection__viewMasonryAside">{asideContent}</aside>
				</div>
			) : (
				<div className="collection__viewList">
					<div className="collection__viewListMain">
						<Stack gap={2}>
							{heading}
							{collections}
						</Stack>
					</div>
					<aside className="collection__viewListAside">{asideContent}</aside>
				</div>
			)}
		</main>
	);
}
