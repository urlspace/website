import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
	Dashboard,
	Button,
	DashboardCollectionInfo,
	DashboardEmpty,
	Logo,
	DashboardNav,
	Dialog,
	Drawer,
	Form,
	FormCollection,
	FormDeleteCollection,
	FormDeleteTag,
	FormLink,
	FormTag,
	Icon,
	KeyboardShortcuts,
	Pagination,
	Stats,
	LinkCard,
	MenuTheme,
} from "#/components/index.ts";
import useDebouncedValue from "#/hooks/useDebouncedValue.ts";
import useKeyboardShortcuts from "#/hooks/useKeyboardShortcuts.ts";
import {
	type CollectionRow,
	collectionsQueryOptions,
} from "#/queries/collections.ts";
import {
	type LinkFilters,
	type LinkRow,
	linksQueryKey,
	linksQueryOptions,
} from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { clearSession } from "#/queries/session.ts";
import { type TagRow, tagsQueryOptions } from "#/queries/tags.ts";
import {
	type IsFilter,
	isTypingFilter,
	parseSearchQuery,
	renameCollectionFilter,
	renameTagFilter,
	setCollectionFilter,
	setIsFilter,
	setTagFilters,
} from "#/searchQuery.ts";

const REFRESH_THROTTLE_MS = 10_000;

function getTitles(container: HTMLElement | null) {
	return [...(container?.querySelectorAll<HTMLElement>("article h2 a") ?? [])];
}

type DashboardSearch = Pick<LinkFilters, "query"> & {
	page?: number;
};

function toLinkFilters(
	{
		text,
		favourite,
		forLater,
		tagIds,
		collectionId,
	}: ReturnType<typeof parseSearchQuery>,
	page: number,
): LinkFilters {
	return {
		query: text || undefined,
		collectionId,
		favourite,
		forLater,
		tagIds,
		page,
	};
}

export const Route = createFileRoute("/_protected/dashboard")({
	validateSearch: (search: Record<string, unknown>): DashboardSearch => ({
		query:
			typeof search.query === "string" || typeof search.query === "number"
				? String(search.query).trim() || undefined
				: undefined,
		page:
			typeof search.page === "number" &&
			Number.isInteger(search.page) &&
			search.page > 1
				? search.page
				: undefined,
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps, cause }) => {
		const [collections, tags] = await Promise.all([
			context.queryClient.query({
				...collectionsQueryOptions,
				staleTime: "static",
			}),
			context.queryClient.query({ ...tagsQueryOptions, staleTime: "static" }),
			context.queryClient.query({ ...meQueryOptions, staleTime: "static" }),
		]);

		if (cause === "stay") {
			return;
		}

		const links = await context.queryClient.query({
			...linksQueryOptions(
				toLinkFilters(
					parseSearchQuery(deps.query ?? "", tags, collections),
					deps.page ?? 1,
				),
			),
			staleTime: "static",
		});

		if (deps.page && deps.page > links.pagination.totalPages) {
			throw redirect({
				to: "/dashboard",
				search: { ...deps, page: undefined },
				replace: true,
			});
		}
	},
	component: PageDashboard,
});

function PageDashboard() {
	// tanstack stuff
	const router = useRouter();
	const navigate = Route.useNavigate();
	const search = Route.useSearch();
	const queryClient = useQueryClient();
	const { data: user } = useSuspenseQuery(meQueryOptions);
	const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
	const { data: tags } = useSuspenseQuery(tagsQueryOptions);

	// filters
	const query = search.query ?? "";
	const [value, setValue] = useState(query);
	const parsedQuery = parseSearchQuery(query, tags, collections);
	const favourite = parsedQuery.favourite ?? false;
	const forLater = parsedQuery.forLater ?? false;
	const selectedTags = parsedQuery.tagIds ?? [];
	const selectedCollection = parsedQuery.collectionId ?? null;

	// pagination
	const page = search.page ?? 1;

	// mobile nav
	const [isNavOpen, setIsNavOpen] = useState(false);

	// new link/collection dialogs
	const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
	const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const [isThemesOpen, setIsThemesOpen] = useState(false);

	// editing link/collection/tag dialogs
	const [editingLink, setEditingLink] = useState<LinkRow | null>(null);
	const [isEditLinkOpen, setIsEditLinkOpen] = useState(false);
	const [editingCollection, setEditingCollection] =
		useState<CollectionRow | null>(null);
	const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<TagRow | null>(null);
	const [isEditTagOpen, setIsEditTagOpen] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const [addLinkCollectionId, setAddLinkCollectionId] = useState<
		string | undefined
	>(undefined);

	// additional global state
	const signingOut = useRef(false);
	const [criticalError, setCriticalError] = useState<string | null>(null);

	// Writes a search query to the URL and goes back to the first page. The
	// history entry is replaced, so filter changes don't pile up behind Back.
	function applyQuery(next: string) {
		void navigate({
			search: (prev) => ({
				...prev,
				query: next || undefined,
				page: undefined,
			}),
			replace: true,
		});
	}

	const debouncedValue = useDebouncedValue(value, 250, (settled) => {
		const next = settled.trim();
		// Waiting for a filter to be finished stops results flashing empty.
		if (next === query || isTypingFilter(settled, tags, collections)) {
			return;
		}
		applyQuery(next);
	});

	// Back/Forward can change the URL query while the input still shows the old
	// text. Our own debounced writes match debouncedValue, so they're skipped
	// and don't overwrite characters typed in the meantime.
	const [prevQuery, setPrevQuery] = useState(query);
	if (query !== prevQuery) {
		setPrevQuery(query);
		if (query !== debouncedValue.trim()) {
			setValue(query);
		}
	}

	// Keeps a filter on a renamed tag or collection working by pointing it at
	// the new name. Nothing happens when the query doesn't use it.
	function applyRenamedFilter(next: string) {
		if (next === value) {
			return;
		}
		setValue(next);
		applyQuery(next);
	}

	function setFilter(filter: IsFilter, on: boolean) {
		const next = setIsFilter(value, filter, on);
		setValue(next);
		applyQuery(next);
	}

	function setSelectedCollection(id: string | null) {
		const next = setCollectionFilter(value, collections, id);
		setValue(next);
		applyQuery(next);
	}

	function setSelectedTags(ids: Array<string>) {
		const next = setTagFilters(value, tags, ids);
		setValue(next);
		applyQuery(next);
	}

	// "All" and x go back to the unfiltered dashboard. Pushes a history entry,
	// unlike other filter changes, so Back restores the view.
	function clearFiltersAndSearchQuery() {
		setValue("");
		void navigate({ search: {} });
	}

	function setPage(value: number) {
		void navigate({
			search: (prev) => ({ ...prev, page: value > 1 ? value : undefined }),
			replace: true,
		});
	}

	// deleting collection/tag dialogs
	const [deletingCollection, setDeletingCollection] =
		useState<CollectionRow | null>(null);
	const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
	const [deletingTag, setDeletingTag] = useState<TagRow | null>(null);
	const [isDeleteTagOpen, setIsDeleteTagOpen] = useState(false);
	const focusAfterDeleteRef = useRef<HTMLElement | null>(null);

	function focusTargetAfterDelete(button?: HTMLElement) {
		const item = button?.closest("menu")?.closest("li");
		const sibling = item?.nextElementSibling ?? item?.previousElementSibling;
		return (
			sibling?.querySelector<HTMLElement>("button") ??
			item?.closest("details")?.querySelector<HTMLElement>("summary")
		);
	}

	// A failed delete keeps the item, so the focus target picked for after the
	// delete no longer makes sense.
	const deleteCollection = useMutation({
		mutationFn: async ({ id, cascade }: { id: string; cascade: boolean }) => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/collections/${id}${cascade ? "?cascade=true" : ""}`,
				{ method: "DELETE", credentials: "include" },
			);
			// Reload so the route guard can clear the invalid session and cached data.
			if (
				res.status === 401 &&
				((await res.clone().json()) as { data: string }).data === "unauthorized"
			) {
				window.location.reload();
				throw new Error("Session expired.");
			}

			if (!res.ok) {
				throw new Error(`DELETE /collections/${id} failed: ${res.status}`);
			}
		},
		onSuccess: async (_, { id, cascade }) => {
			if (selectedCollection === id) {
				setSelectedCollection(null);
			}
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: collectionsQueryOptions.queryKey,
				}),
				cascade
					? queryClient.invalidateQueries({
							queryKey: tagsQueryOptions.queryKey,
						})
					: null,
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
			]);
		},
		onError: () => {
			focusAfterDeleteRef.current = null;
		},
	});

	const deleteTag = useMutation({
		mutationFn: async ({ id, cascade }: { id: string; cascade: boolean }) => {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/tags/${id}${cascade ? "?cascade=true" : ""}`,
				{ method: "DELETE", credentials: "include" },
			);
			// Reload so the route guard can clear the invalid session and cached data.
			if (
				res.status === 401 &&
				((await res.clone().json()) as { data: string }).data === "unauthorized"
			) {
				window.location.reload();
				throw new Error("Session expired.");
			}

			if (!res.ok) {
				throw new Error(`DELETE /tags/${id} failed: ${res.status}`);
			}
		},
		onSuccess: async (_, { id, cascade }) => {
			if (selectedTags.includes(id)) {
				setSelectedTags(selectedTags.filter((t) => t !== id));
			}
			await Promise.all([
				cascade
					? queryClient.invalidateQueries({
							queryKey: collectionsQueryOptions.queryKey,
						})
					: null,
				queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey }),
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
			]);
		},
		onError: () => {
			focusAfterDeleteRef.current = null;
		},
	});

	function handleDeleteCollection(c: CollectionRow, button?: HTMLElement) {
		const target = focusTargetAfterDelete(button);
		setCriticalError(null);
		if (c.count > 0) {
			focusAfterDeleteRef.current = target ?? null;
			setFormKey((key) => key + 1);
			setDeletingCollection(c);
			setIsDeleteCollectionOpen(true);
			return;
		}
		deleteCollection.mutate(
			{ id: c.id, cascade: false },
			{
				onSuccess: () => target?.focus(),
				onError: () =>
					setCriticalError(
						`We couldn't delete collection "${c.name}". Please try again.`,
					),
			},
		);
	}

	function handleDeleteTag(t: TagRow, button?: HTMLElement) {
		const target = focusTargetAfterDelete(button);
		setCriticalError(null);
		if (t.count > 0) {
			focusAfterDeleteRef.current = target ?? null;
			setFormKey((key) => key + 1);
			setDeletingTag(t);
			setIsDeleteTagOpen(true);
			return;
		}
		deleteTag.mutate(
			{ id: t.id, cascade: false },
			{
				onSuccess: () => target?.focus(),
				onError: () =>
					setCriticalError(
						`We couldn't delete tag "${t.name}". Please try again.`,
					),
			},
		);
	}

	const lastRefreshRef = useRef(Number.NEGATIVE_INFINITY);

	// Refetches every query on screen (links, tags, collections, me) and marks
	// the rest stale. A collection or tag deleted elsewhere then becomes free
	// text in the search. Throttled, because each refresh makes several API
	// calls that count towards the rate limit.
	async function refresh() {
		const now = performance.now();
		if (now - lastRefreshRef.current < REFRESH_THROTTLE_MS) {
			return;
		}
		lastRefreshRef.current = now;
		await queryClient.invalidateQueries();
		await router.invalidate();
	}

	function openAddLink() {
		setAddLinkCollectionId(undefined);
		setFormKey((key) => key + 1);
		setIsAddLinkOpen(true);
	}

	function openAddLinkToCollection(collectionId: string) {
		setAddLinkCollectionId(collectionId);
		setFormKey((key) => key + 1);
		setIsAddLinkOpen(true);
	}

	function openAddCollection() {
		setFormKey((key) => key + 1);
		setIsAddCollectionOpen(true);
	}

	function openEditLink(link: LinkRow) {
		setFormKey((key) => key + 1);
		setEditingLink(link);
		setIsEditLinkOpen(true);
	}

	function openEditCollection(collection: CollectionRow) {
		setFormKey((key) => key + 1);
		setEditingCollection(collection);
		setIsEditCollectionOpen(true);
	}

	function openEditTag(tag: TagRow) {
		setFormKey((key) => key + 1);
		setEditingTag(tag);
		setIsEditTagOpen(true);
	}

	const {
		data: linksResponse,
		isPending,
		isError,
	} = useQuery(linksQueryOptions(toLinkFilters(parsedQuery, page)));
	const totalResults = linksResponse?.pagination.totalCount;
	const links = linksResponse?.data ?? [];
	const displayedError =
		criticalError ??
		(isError ? "We couldn't load your links. Try again in a moment." : null);

	const linksRef = useRef<HTMLElement>(null);

	// Used by Enter in search and the "Skip to results" link to jump straight to
	// the first result, skipping the sidebar in tab order. Ignored while a search
	// is in flight (debounce pending or results loading), otherwise focus
	// would land on a stale result that unmounts when data arrives.
	function focusFirstResult() {
		if (query !== value.trim() || isPending) {
			return;
		}
		getTitles(linksRef.current)[0]?.focus();
	}

	useKeyboardShortcuts({
		getTitles: () => getTitles(linksRef.current),
		onShowShortcuts: () => setIsShortcutsOpen(true),
		onAddLink: openAddLink,
		onRefresh: () => void refresh(),
		onClearFilters: clearFiltersAndSearchQuery,
	});

	const totalPages = linksResponse?.pagination.totalPages;

	// Any change to the filters, search or page scrolls back to the top and
	// moves focus from the current card to the links section, so j/k and
	// screen readers start again from the first link.
	// Doesn't run when the dashboard first opens, so a reload or Back keeps the
	// scroll position the browser restores.
	const lastFocusedRef = useRef<{ id: string; index: number } | null>(null);
	const tagsKey = [...selectedTags].sort().join();
	const isFirstListRenderRef = useRef(true);
	useEffect(() => {
		if (isFirstListRenderRef.current) {
			isFirstListRenderRef.current = false;
			return;
		}
		window.scrollTo({ top: 0, behavior: "instant" });
		if (linksRef.current?.contains(document.activeElement)) {
			linksRef.current.focus({ preventScroll: true });
		}
		lastFocusedRef.current = null;
	}, [
		parsedQuery.text,
		selectedCollection,
		tagsKey,
		favourite,
		forLater,
		page,
	]);

	// When the focused card unmounts, the browser drops focus to <body> and the
	// next j would start from the top. This moves focus to the card now at the
	// same position instead (the next one, or the new last one). Covers delete,
	// f/l under a matching filter, mouse clicks on card buttons, and edits that
	// move the link out of the current filter. In that last case the native
	// dialog's focus restore targets the removed card, so we wait for
	// editingLink to clear and take over. Bails out while the last focused link
	// is still in the list, since nothing needs restoring.
	useEffect(() => {
		const last = lastFocusedRef.current;
		if (
			!last ||
			editingLink ||
			linksResponse?.data.some((link) => link.id === last.id)
		) {
			return;
		}
		if (document.activeElement && document.activeElement !== document.body) {
			return;
		}
		const titles = getTitles(linksRef.current);
		lastFocusedRef.current = null;
		titles[Math.min(last.index, titles.length - 1)]?.focus();
	}, [linksResponse, editingLink]);

	async function handleSignOut() {
		if (signingOut.current) {
			return;
		}
		signingOut.current = true;
		setCriticalError(null);

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
				method: "POST",
				credentials: "include",
			});

			if (!res.ok && res.status !== 401) {
				setCriticalError("We couldn't sign you out. Please try again.");
				return;
			}

			await clearSession();
			queryClient.clear();
			router.clearCache();
			await router.invalidate();
			await router.navigate({ to: "/auth/signin", replace: true });
		} catch {
			setCriticalError("We couldn't finish signing you out. Please try again.");
		} finally {
			signingOut.current = false;
		}
	}

	const selectedCollectionObj = collections.find(
		(c) => c.id === selectedCollection,
	);

	// The sidebar and the mobile drawer show the same navigation.
	const nav = (
		<DashboardNav
			collections={collections}
			favourite={favourite}
			forLater={forLater}
			handleSignOut={handleSignOut}
			deletingCollectionId={
				deleteCollection.isPending
					? (deleteCollection.variables?.id ?? null)
					: null
			}
			deletingTagId={
				deleteTag.isPending ? (deleteTag.variables?.id ?? null) : null
			}
			onDeleteCollection={handleDeleteCollection}
			onDeleteTag={handleDeleteTag}
			onEditCollection={openEditCollection}
			onRenameTag={openEditTag}
			selectedCollection={selectedCollection}
			selectedTags={selectedTags}
			setFavourite={(on) => setFilter("favourite", on)}
			setForLater={(on) => setFilter("for-later", on)}
			onAddCollection={openAddCollection}
			onAddLink={openAddLink}
			onClearFiltersAndSearchQuery={clearFiltersAndSearchQuery}
			setIsShortcutsOpen={setIsShortcutsOpen}
			setIsThemesOpen={setIsThemesOpen}
			setSelectedCollection={setSelectedCollection}
			setSelectedTags={setSelectedTags}
			tags={tags}
		/>
	);

	return (
		<Dashboard>
			<Dashboard.Header>
				<Logo to="/dashboard" />
				<Dashboard.HeaderSearch>
					<Form.SearchInput
						label="Search"
						placeholder="Search links"
						value={value}
						onValueChange={setValue}
						onEnter={focusFirstResult}
						tags={tags}
						collections={collections}
					/>
					<Dashboard.HeaderTrigger>
						<Button
							icon={<Icon.Filter />}
							onClick={() => setIsNavOpen(true)}
							text="Menu"
						/>
					</Dashboard.HeaderTrigger>
				</Dashboard.HeaderSearch>
				<Dashboard.HeaderActions>
					<Dashboard.StandaloneOnly>
						<Button
							ariaKeyShortcuts="r"
							icon={<Icon.Refresh />}
							onClick={() => void refresh()}
							text="Refresh"
						/>
					</Dashboard.StandaloneOnly>
					<Button
						icon={<Icon.Plus />}
						onClick={openAddCollection}
						text="Add collection"
					/>
					<Button
						ariaKeyShortcuts="n"
						icon={<Icon.Plus />}
						onClick={openAddLink}
						text="Add link"
					/>
				</Dashboard.HeaderActions>
			</Dashboard.Header>

			<Dashboard.SkipFilters />
			<Dashboard.SkipMain />

			<Dashboard.Filters>{nav}</Dashboard.Filters>

			<Dashboard.Main>
				<Dashboard.MainStats>
					<Stats
						totalResults={totalResults}
						totalPages={totalPages}
						currentPage={linksResponse?.pagination.currentPage}
						linksResponse={linksResponse?.meta.durationMs}
					/>
					<output className="visually-hidden" aria-atomic="true">
						{!isPending && !isError && totalResults !== undefined ? (
							<span key={query}>
								{totalResults === 0 ? "No links found." : `Results: ${totalResults}.`}
							</span>
						) : null}
					</output>
				</Dashboard.MainStats>

				{displayedError ? (
					<Dashboard.MainCritical errorMessage={displayedError} />
				) : null}

				{selectedCollectionObj ? (
					<DashboardCollectionInfo
						collection={selectedCollectionObj}
						username={user.username}
						onAddLink={() => openAddLinkToCollection(selectedCollectionObj.id)}
						onEdit={() => openEditCollection(selectedCollectionObj)}
						onDelete={() => handleDeleteCollection(selectedCollectionObj)}
					/>
				) : null}

				<Dashboard.MainLinks ref={linksRef}>
					{isPending ? (
						<p>Loading...</p>
					) : links.length ? (
						<Dashboard.MainLinksList>
							{links.map((link, index) => (
								<li
									key={link.id}
									onFocus={() => {
										lastFocusedRef.current = { id: link.id, index };
									}}
								>
									<LinkCard
										link={link}
										query={parsedQuery.text}
										onEdit={openEditLink}
										onError={setCriticalError}
										onTagClick={(tagId) => {
											const next = setTagFilters("", tags, [tagId]);
											setValue(next);
											applyQuery(next);
										}}
										onCollectionClick={(collectionId) => {
											const next = setCollectionFilter(
												"",
												collections,
												collectionId,
											);
											setValue(next);
											applyQuery(next);
										}}
									/>
								</li>
							))}
						</Dashboard.MainLinksList>
					) : isError ? null : (
						<DashboardEmpty
							newAccount={user.stats.linksCount === 0}
							onAddLink={openAddLink}
						/>
					)}
				</Dashboard.MainLinks>

				{totalPages && totalPages > 1 ? (
					<Dashboard.Pagination>
						<Pagination
							page={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</Dashboard.Pagination>
				) : null}
			</Dashboard.Main>

			<Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
				{nav}
			</Drawer>

			<Dialog
				open={isShortcutsOpen}
				onClose={() => setIsShortcutsOpen(false)}
				title="Keyboard shortcuts"
			>
				<KeyboardShortcuts />
			</Dialog>

			<Dialog
				open={isThemesOpen}
				onClose={() => setIsThemesOpen(false)}
				title="Theme"
			>
				<MenuTheme hideTitle />
			</Dialog>

			<Dialog
				open={isAddLinkOpen}
				onClose={() => setIsAddLinkOpen(false)}
				title="Add new link"
			>
				<FormLink
					key={formKey}
					onClose={() => setIsAddLinkOpen(false)}
					collections={collections}
					tags={tags}
					collectionId={addLinkCollectionId}
				/>
			</Dialog>

			<Dialog
				open={isEditLinkOpen}
				onClose={() => setIsEditLinkOpen(false)}
				onClosed={() => setEditingLink(null)}
				title="Edit link"
			>
				{editingLink ? (
					<FormLink
						key={formKey}
						link={editingLink}
						onClose={() => setIsEditLinkOpen(false)}
						collections={collections}
						tags={tags}
					/>
				) : null}
			</Dialog>

			<Dialog
				open={isAddCollectionOpen}
				onClose={() => setIsAddCollectionOpen(false)}
				title="Add new collection"
			>
				<FormCollection
					key={formKey}
					onClose={() => setIsAddCollectionOpen(false)}
					isUnlimited={user.isUnlimited}
					isAdmin={user.isAdmin}
					username={user.username}
					collections={collections}
				/>
			</Dialog>

			<Dialog
				open={isEditCollectionOpen}
				onClose={() => setIsEditCollectionOpen(false)}
				title="Edit collection"
			>
				{editingCollection ? (
					<FormCollection
						key={formKey}
						collection={editingCollection}
						collections={collections}
						isUnlimited={user.isUnlimited}
						isAdmin={user.isAdmin}
						username={user.username}
						onClose={() => setIsEditCollectionOpen(false)}
						onRenamed={(name) =>
							applyRenamedFilter(
								renameCollectionFilter(value, editingCollection.name, name),
							)
						}
					/>
				) : null}
			</Dialog>

			<Dialog
				open={isEditTagOpen}
				onClose={() => setIsEditTagOpen(false)}
				title="Rename tag"
			>
				{editingTag ? (
					<FormTag
						key={formKey}
						tag={editingTag}
						tags={tags}
						onClose={() => setIsEditTagOpen(false)}
						onRenamed={(name) =>
							applyRenamedFilter(renameTagFilter(value, editingTag.name, name))
						}
					/>
				) : null}
			</Dialog>

			<Dialog
				open={isDeleteCollectionOpen}
				onClose={() => setIsDeleteCollectionOpen(false)}
				onClosed={() => {
					focusAfterDeleteRef.current?.focus();
					focusAfterDeleteRef.current = null;
				}}
				title="Delete collection"
			>
				{deletingCollection ? (
					<FormDeleteCollection
						key={formKey}
						collection={deletingCollection}
						onDelete={(cascade) =>
							deleteCollection.mutateAsync({
								id: deletingCollection.id,
								cascade,
							})
						}
						onClose={() => setIsDeleteCollectionOpen(false)}
					/>
				) : null}
			</Dialog>

			<Dialog
				open={isDeleteTagOpen}
				onClose={() => setIsDeleteTagOpen(false)}
				onClosed={() => {
					focusAfterDeleteRef.current?.focus();
					focusAfterDeleteRef.current = null;
				}}
				title="Delete tag"
			>
				{deletingTag ? (
					<FormDeleteTag
						key={formKey}
						tag={deletingTag}
						onDelete={(cascade) =>
							deleteTag.mutateAsync({ id: deletingTag.id, cascade })
						}
						onClose={() => setIsDeleteTagOpen(false)}
					/>
				) : null}
			</Dialog>
		</Dashboard>
	);
}
