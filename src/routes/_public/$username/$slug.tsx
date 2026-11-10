import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	notFound,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import React from "react";

import type { SubmitHelpers } from "#/components/Form/Form";
import {
	Button,
	ButtonLink,
	DashboardButton,
	DashboardButtonLink,
	Dialog,
	Form,
	Heading,
	Icon,
	LinkCardSlim,
	Public,
	Stack,
} from "#/components/index.ts";
import {
	collectionsQueryOptions,
	getPublicCollection,
} from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { clearSession } from "#/queries/session.ts";
import { type SearchItem, setCollectionFilter } from "#/searchQuery.ts";
import { formatDate } from "#/utils/formatDate.ts";

type Layout = "list" | "masonry";
const layoutStorageKey = "public-collection-layout";

export const Route = createFileRoute("/_public/$username/$slug")({
	// Usernames and slugs are stored lowercase. Mixed-case links redirect so
	// every collection has exactly one URL.
	beforeLoad: ({ params }) => {
		const username = params.username.toLowerCase();
		const slug = params.slug.toLowerCase();
		if (params.username !== username || params.slug !== slug) {
			throw redirect({
				to: "/$username/$slug",
				params: { username, slug },
				statusCode: 301,
			});
		}
	},
	loader: async ({ params }) => {
		const collection = await getPublicCollection({
			data: { username: params.username, slug: params.slug },
		});
		if (collection === null) throw notFound({ routeId: "__root__" });
		return collection;
	},
	staleTime: 5 * 60 * 1000,
	head: ({ loaderData, params }) => {
		if (!loaderData) return { meta: [] };

		const title = `${loaderData.name} by ${loaderData.author.displayName} | url.space`;
		const description = loaderData.description.trim();
		const collectionUrl = `https://url.space/${encodeURIComponent(params.username)}/${encodeURIComponent(params.slug)}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: collectionUrl },
			],
			links: [
				{ rel: "canonical", href: collectionUrl },
				{
					rel: "alternate",
					type: "application/rss+xml",
					title,
					href: `${collectionUrl}/feed.xml`,
				},
			],
		};
	},
	gcTime: 5 * 60 * 1000,
	preloadStaleTime: 5 * 60 * 1000,
	remountDeps: ({ params }) => `${params.username}/${params.slug}`,
	component: PagePublicCollection,
});

function normalizeName(name: string) {
	return name.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

function PagePublicCollection() {
	const router = useRouter();
	const [layout, setLayout] = React.useState<Layout>("list");
	const [isCloneOpen, setIsCloneOpen] = React.useState(false);
	const [cloneName, setCloneName] = React.useState("");
	const [cloneFormKey, setCloneFormKey] = React.useState(0);
	const [clonedCollection, setClonedCollection] =
		React.useState<SearchItem | null>(null);
	const [isOwnCollection, setIsOwnCollection] = React.useState(false);
	const [cloneError, setCloneError] = React.useState<string | null>(null);
	const [sessionExpired, setSessionExpired] = React.useState(false);
	const collection = Route.useLoaderData();
	const { username, slug } = Route.useParams();
	const { hasSession, queryClient } = Route.useRouteContext();
	const canClone = hasSession && !sessionExpired;
	const { data: collections = [] } = useQuery({
		...collectionsQueryOptions,
		enabled: isCloneOpen,
	});

	async function handleShare() {
		if (!navigator.share) {
			window.alert("Sharing is not supported in this browser.");
			return;
		}

		try {
			await navigator.share({
				title: `${collection.name} by ${collection.author.displayName} | url.space`,
				url: window.location.href,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}
			window.alert("Unable to share this page. Please try again.");
		}
	}

	function openCloneDialog() {
		setCloneName(collection.name);
		setCloneError(null);
		setCloneFormKey((key) => key + 1);
		setIsCloneOpen(true);
	}

	async function handleClone(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		const trimmedName = cloneName.trim();
		if (trimmedName.length < 2) {
			setError("Collection name must be at least 2 characters.");
			return;
		}

		// Mirrors the API's case-insensitive check; the 409 catches edge cases.
		if (
			collections.some(
				(c) => normalizeName(c.name) === normalizeName(trimmedName),
			)
		) {
			setError("You already have a collection with that name.");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/collections/${encodeURIComponent(collection.id)}/clone`,
				{
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: trimmedName }),
				},
			);

			if (res.status === 401) {
				setIsCloneOpen(false);
				setSessionExpired(true);
				setCloneError(
					"Your session expired. Sign in to clone this collection.",
				);
				queryClient.clear();

				try {
					await clearSession();
					await router.invalidate();
				} catch {
					setCloneError(
						"Your session expired, but we couldn't refresh your sign-in state. Reload the page and sign in again.",
					);
				}
				return;
			}

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Incorrect body.");
						break;
					case 403: {
						const message = ((await res.json()) as { data: string }).data;
						if (message === "collection limit reached") {
							setError(
								"You've reached the collection limit on a free account. Delete a collection or upgrade your account.",
							);
						} else if (message === "link limit reached") {
							setError(
								"Cloning this collection would exceed the link limit on a free account. Delete some links or upgrade your account.",
							);
						} else {
							setIsCloneOpen(false);
							setIsOwnCollection(true);
							setCloneError("You cannot clone your own collection.");
						}
						break;
					}
					case 404:
						setError("This collection is no longer available to clone.");
						break;
					case 409:
						setError("You already have a collection with that name.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError(
							"We couldn't confirm whether the collection was cloned. Check your collections before trying again.",
						);
				}
				return;
			}

			setClonedCollection(((await res.json()) as { data: SearchItem }).data);
			setIsCloneOpen(false);
			await Promise.allSettled([
				queryClient.invalidateQueries({
					queryKey: collectionsQueryOptions.queryKey,
				}),
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
			]);
		} catch {
			setError(
				"We couldn't confirm whether the collection was cloned. Check your collections before trying again.",
			);
		} finally {
			setLoading(false);
		}
	}

	const cloneSection = (
		<>
			<Heading
				level={3}
				text={canClone ? "Clone this collection" : "Keep these links"}
			/>
			<p>
				{canClone
					? "Copy this collection and all its links to your account. Your copy is private and yours to edit."
					: "Create a free account to save a private copy of this collection. Organise it your way."}
			</p>
			{cloneError ? <p role="alert">{cloneError}</p> : null}
			{clonedCollection ? (
				<p role="status">
					Collection cloned.{" "}
					<Link
						to="/dashboard"
						search={{
							query: setCollectionFilter(
								"",
								[clonedCollection],
								clonedCollection.id,
							),
						}}
					>
						Your copy
					</Link>{" "}
					is private.
				</p>
			) : sessionExpired ? (
				<ButtonLink text="Sign in" to="/auth/signin" />
			) : isOwnCollection ? null : hasSession ? (
				<Button
					text="Clone collection"
					type="button"
					onClick={openCloneDialog}
				/>
			) : (
				<ButtonLink text="Sign up and clone collection" to="/auth/signup" />
			)}
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

	return (
		<Public>
			<Public.Header>
				<Heading level={1} text={collection.name} />
				<Public.Description>{collection.description}</Public.Description>
				<Public.Author>
					Created by{" "}
					<Link
						to="/$username"
						params={{ username: collection.author.username }}
					>
						{collection.author.displayName}
					</Link>{" "}
					on{" "}
					<time dateTime={collection.createdAt}>
						{formatDate(collection.createdAt)}
					</time>
				</Public.Author>
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
						<DashboardButtonLink
							text="Feed"
							to={`/${encodeURIComponent(username)}/${encodeURIComponent(slug)}/feed.xml`}
							icon={<Icon.Rss />}
							reloadDocument
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
					<Public.ViewMasonryHeader>
						<Heading
							level={2}
							text={`Links (${collection.links.length} items)`}
						/>
					</Public.ViewMasonryHeader>
					<Public.ViewMasonryMain>
						{collection.links.length === 0 ? (
							<p>No links yet.</p>
						) : (
							collection.links.map((link) => (
								<Public.Item key={link.id}>
									<LinkCardSlim
										title={link.title}
										description={link.description}
										id={link.id}
										url={link.url}
										createdAt={link.createdAt}
									/>
								</Public.Item>
							))
						)}
					</Public.ViewMasonryMain>
					<Public.ViewMasonryAside>{cloneSection}</Public.ViewMasonryAside>
				</Public.ViewMasonry>
			) : (
				<Public.ViewList>
					<Public.ViewListMain>
						<Stack gap={2}>
							<Heading
								level={2}
								text={`Links (${collection.links.length} items)`}
							/>
							{collection.links.length === 0 ? (
								<p>No links yet.</p>
							) : (
								collection.links.map((link) => (
									<Public.Item key={link.id}>
										<LinkCardSlim
											title={link.title}
											description={link.description}
											id={link.id}
											url={link.url}
											createdAt={link.createdAt}
										/>
									</Public.Item>
								))
							)}
						</Stack>
					</Public.ViewListMain>
					<Public.ViewListAside>{cloneSection}</Public.ViewListAside>
				</Public.ViewList>
			)}
			<Dialog
				open={isCloneOpen}
				onClose={() => setIsCloneOpen(false)}
				title="Clone collection"
			>
				<Form key={cloneFormKey} onSubmit={handleClone}>
					<Form.Input
						label="Collection name"
						name="collection-name"
						onChange={setCloneName}
						placeholder="Keto recipes"
						required
						type="text"
						value={cloneName}
						minLength={2}
						maxLength={128}
						pattern="[^\p{Cc}]{2,128}"
						description="Between 2 and 128 characters."
					/>
					<Form.Submit text="Clone collection" textLoading="Cloning..." />
				</Form>
			</Dialog>
		</Public>
	);
}
