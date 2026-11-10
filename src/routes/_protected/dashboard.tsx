import {
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
	Dashboard,
	DashboardButton,
	DashboardCollectionInfo,
	DashboardEmpty,
	Logo,
	DashboardNav,
	Dialog,
	Drawer,
	Form,
	FormCollection,
	FormLink,
	FormTag,
	Icon,
	KeyboardShortcuts,
	Pagination,
	Stats,
	LinkCard,
} from "#/components/index.ts";
import useDebouncedValue from "#/hooks/useDebouncedValue.ts";
import {
	type CollectionRow,
	collectionsQueryOptions,
} from "#/queries/collections.ts";
import {
	type LinkFilters,
	type LinkRow,
	linksQueryOptions,
} from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { clearSession } from "#/queries/session.ts";
import { type TagRow, tagsQueryOptions } from "#/queries/tags.ts";
import {
	type IsFilter,
	isTypingFilter,
	parseSearchQuery,
	setCollectionFilter,
	setIsFilter,
	setTagFilters,
} from "#/searchQuery.ts";

const G_SEQUENCE_MS = 500;
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
	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);

	// editing link/collection/tag dialogs
	const [editingLink, setEditingLink] = useState<LinkRow | null>(null);
	const [isEditLinkOpen, setIsEditLinkOpen] = useState(false);
	const [editingCollection, setEditingCollection] =
		useState<CollectionRow | null>(null);
	const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<TagRow | null>(null);
	const [isEditTagOpen, setIsEditTagOpen] = useState(false);
	const [formKey, setFormKey] = useState(0);

	// additional global state
	const signingOut = useRef(false);
	const [criticalError, setCriticalError] = useState<string | null>(null);

	const debouncedValue = useDebouncedValue(value, 250, (settled) => {
		const next = settled.trim();
		// Waiting for a filter to be finished stops results flashing empty.
		if (next === query || isTypingFilter(settled, tags, collections)) {
			return;
		}
		void navigate({
			search: (prev) => ({
				...prev,
				query: next || undefined,
				page: undefined,
			}),
			replace: true,
		});
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

	function setFilter(filter: IsFilter, on: boolean) {
		const next = setIsFilter(value, filter, on);
		setValue(next);
		void navigate({
			search: (prev) => ({
				...prev,
				query: next || undefined,
				page: undefined,
			}),
			replace: true,
		});
	}

	function setFavourite(on: boolean) {
		setFilter("favourite", on);
	}

	function setForLater(on: boolean) {
		setFilter("for-later", on);
	}

	function setSelectedCollection(id: string | null) {
		const next = setCollectionFilter(value, collections, id);
		setValue(next);
		void navigate({
			search: (prev) => ({
				...prev,
				query: next || undefined,
				page: undefined,
			}),
			replace: true,
		});
	}

	function setSelectedTags(ids: Array<string>) {
		const next = setTagFilters(value, tags, ids);
		setValue(next);
		void navigate({
			search: (prev) => ({
				...prev,
				query: next || undefined,
				page: undefined,
			}),
			replace: true,
		});
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

	// j/k move focus between link card titles (Gmail/GitHub style), G jumps to
	// the last one and gg to the first (Vim style), ? opens the shortcuts
	// dialog, n the add link form, r refreshes the data and x clears every
	// filter. Ignored while typing and when a modifier is held, so browser
	// shortcuts like Ctrl+K keep working.
	useEffect(() => {
		let lastG = Number.NEGATIVE_INFINITY;
		function handleKey(e: KeyboardEvent) {
			if (e.key !== "g") {
				lastG = Number.NEGATIVE_INFINITY;
			}
			if (!["j", "k", "g", "G", "?", "n", "r", "x"].includes(e.key)) {
				return;
			}
			// ignore modifiers so browser shortcuts like Ctrl+K keeps working
			if (e.ctrlKey || e.metaKey || e.altKey) {
				return;
			}
			// prevent holding down g to trigger gg
			if (e.key === "g" && e.repeat) {
				return;
			}
			const target = e.target as HTMLElement;
			// ignore typing in the fields
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			) {
				return;
			}

			if (e.key === "?") {
				if (!target.closest("dialog")) {
					e.preventDefault();
					setIsShortcutsOpen(true);
				}
				return;
			}

			if (e.key === "n") {
				if (!target.closest("dialog")) {
					e.preventDefault();
					openAddLink();
				}
				return;
			}

			if (e.key === "r") {
				if (!document.querySelector("dialog[open]")) {
					e.preventDefault();
					void refresh();
				}
				return;
			}

			if (e.key === "x") {
				if (!document.querySelector("dialog[open]")) {
					e.preventDefault();
					clearFiltersAndSearchQuery();
				}
				return;
			}

			const titles = getTitles(linksRef.current);
			if (!titles.length) {
				return;
			}

			let next: number;
			if (e.key === "G") {
				next = titles.length - 1;
			} else if (e.key === "g") {
				if (e.timeStamp - lastG > G_SEQUENCE_MS) {
					lastG = e.timeStamp;
					return;
				}
				lastG = Number.NEGATIVE_INFINITY;
				next = 0;
			} else {
				const current = titles.findIndex((a) =>
					a.closest("article")?.contains(target),
				);
				next = current === -1 ? 0 : current + (e.key === "j" ? 1 : -1);
			}
			e.preventDefault();

			// clamp so the j and k do not go out of bounds
			const title = titles[Math.max(0, Math.min(next, titles.length - 1))];
			title.focus({ preventScroll: true });
			title.closest("article")?.scrollIntoView({ block: "nearest" });
		}
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);

	const totalResults = linksResponse?.pagination.totalCount;
	const currentPage = linksResponse?.pagination.currentPage;
	const totalPages = linksResponse?.pagination.totalPages;
	const linkResponseMs = linksResponse?.meta.durationMs;

	const newAccount = user.stats.linksCount === 0;

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

	return (
		<Dashboard>
			<Dashboard.Header>
				<Logo to="/dashboard" />
				<Dashboard.HeaderSearch>
					<Form.SearchInput
						label="Search"
						placeholder='Search, #tag, collection:"name", is:favourite'
						value={value}
						onValueChange={setValue}
						onEnter={focusFirstResult}
						tags={tags}
						collections={collections}
					/>
					<Dashboard.HeaderTrigger>
						<DashboardButton
							icon={<Icon.Filter />}
							onClick={() => setIsNavOpen(true)}
							text="Menu"
						/>
					</Dashboard.HeaderTrigger>
				</Dashboard.HeaderSearch>
				<Dashboard.HeaderActions>
					<Dashboard.StandaloneOnly>
						<DashboardButton
							ariaKeyShortcuts="r"
							icon={<Icon.Refresh />}
							onClick={() => void refresh()}
							text="Refresh"
						/>
					</Dashboard.StandaloneOnly>
					<DashboardButton
						icon={<Icon.Plus />}
						onClick={openAddCollection}
						text="Add collection"
					/>
					<DashboardButton
						ariaKeyShortcuts="n"
						icon={<Icon.Plus />}
						onClick={openAddLink}
						text="Add link"
					/>
				</Dashboard.HeaderActions>
			</Dashboard.Header>

			<Dashboard.SkipFilters />
			<Dashboard.SkipMain />

			<Dashboard.Filters>
				<DashboardNav
					collections={collections}
					favourite={favourite}
					forLater={forLater}
					handleSignOut={handleSignOut}
					onError={setCriticalError}
					onEditCollection={openEditCollection}
					onRenameTag={openEditTag}
					selectedCollection={selectedCollection}
					selectedTags={selectedTags}
					setFavourite={setFavourite}
					setForLater={setForLater}
					onAddCollection={openAddCollection}
					onAddLink={openAddLink}
					onClearFiltersAndSearchQuery={clearFiltersAndSearchQuery}
					setIsShortcutsOpen={setIsShortcutsOpen}
					setSelectedCollection={setSelectedCollection}
					setSelectedTags={setSelectedTags}
					tags={tags}
				/>
			</Dashboard.Filters>

			<Dashboard.Main>
				<Dashboard.MainStats>
					<Stats
						totalResults={totalResults}
						totalPages={totalPages}
						currentPage={currentPage}
						linksResponse={linkResponseMs}
					/>
				</Dashboard.MainStats>

				{displayedError ? (
					<Dashboard.MainCritical errorMessage={displayedError} />
				) : null}

				{selectedCollectionObj ? (
					<DashboardCollectionInfo
						collection={selectedCollectionObj}
						username={user.username}
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
											void navigate({
												search: {
													query: setTagFilters("", tags, [tagId]) || undefined,
												},
												replace: true,
											});
										}}
										onCollectionClick={(collectionId) => {
											void navigate({
												search: {
													query:
														setCollectionFilter(
															"",
															collections,
															collectionId,
														) || undefined,
												},
												replace: true,
											});
										}}
									/>
								</li>
							))}
						</Dashboard.MainLinksList>
					) : isError ? null : (
						<DashboardEmpty newAccount={newAccount} onAddLink={openAddLink} />
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
				<DashboardNav
					collections={collections}
					favourite={favourite}
					forLater={forLater}
					handleSignOut={handleSignOut}
					onError={setCriticalError}
					onEditCollection={openEditCollection}
					onRenameTag={openEditTag}
					selectedCollection={selectedCollection}
					selectedTags={selectedTags}
					setFavourite={setFavourite}
					setForLater={setForLater}
					onAddCollection={openAddCollection}
					onAddLink={openAddLink}
					onClearFiltersAndSearchQuery={clearFiltersAndSearchQuery}
					setIsShortcutsOpen={setIsShortcutsOpen}
					setSelectedCollection={setSelectedCollection}
					setSelectedTags={setSelectedTags}
					tags={tags}
				/>
			</Drawer>

			<Dialog
				open={isShortcutsOpen}
				onClose={() => setIsShortcutsOpen(false)}
				title="Keyboard shortcuts"
			>
				<KeyboardShortcuts />
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
					isPro={user.isPro}
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
						isPro={user.isPro}
						isAdmin={user.isAdmin}
						username={user.username}
						onClose={() => setIsEditCollectionOpen(false)}
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
					/>
				) : null}
			</Dialog>
		</Dashboard>
	);
}
