import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
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
  Pills,
  Stack,
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
  type LinksResponse,
  linksQueryKey,
  linksQueryOptions,
} from "#/queries/links.ts";
import { type TagRow, tagsQueryOptions } from "#/queries/tags.ts";
import { clearSession } from "#/queries/session.ts";

const G_SEQUENCE_MS = 500;

function getTitles(container: HTMLElement | null) {
  return [...(container?.querySelectorAll<HTMLElement>("article h2 a") ?? [])];
}

export const Route = createFileRoute("/_protected/dashboard")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(linksQueryOptions({ page: 1 })),
      context.queryClient.ensureQueryData(collectionsQueryOptions),
      context.queryClient.ensureQueryData(tagsQueryOptions),
    ]);
  },
  component: PageDashboard,
});

function PageDashboard() {
  // tanstack stuff
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useRouteContext({ from: "/_protected" });
  const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  // filters
  const [value, setValue] = useState<string>("");
  const [favourite, setFavourite] = useState(false);
  const [forLater, setForLater] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );

  // pagination
  const [page, setPage] = useState(1);

  // mobile nav
  const [isNavOpen, setIsNavOpen] = useState(false);

  // new link/collection dialogs
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);

  // editing link/collection/tag dialogs
  const [editingLink, setEditingLink] = useState<LinkRow | null>(null);
  const [editingCollection, setEditingCollection] =
    useState<CollectionRow | null>(null);
  const [editingTag, setEditingTag] = useState<TagRow | null>(null);

  // additional global state
  const signingOut = useRef(false);
  const [criticalError, setCriticalError] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(value, 250, () => setPage(1));

  function handleClearCache() {
    queryClient.invalidateQueries({ queryKey: linksQueryKey });
    queryClient.invalidateQueries({
      queryKey: collectionsQueryOptions.queryKey,
    });
    queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey });
  }

  const filters: LinkFilters = {
    page,
    ...(debouncedQuery && { query: debouncedQuery }),
    ...(selectedCollection && { collectionId: selectedCollection }),
    ...(selectedTags.length > 0 && { tagIds: selectedTags }),
    ...(favourite && { favourite: true as const }),
    ...(forLater && { forLater: true as const }),
  };

  const { data: linksResponse, isPlaceholderData } = useQuery(
    linksQueryOptions(filters),
  );
  const links = linksResponse?.data ?? [];

  const linksRef = useRef<HTMLElement>(null);

  // Used by Enter in search and the "Skip to results" link to jump straight to
  // the first result, skipping the sidebar in tab order. Ignored while a search
  // is in flight (debounce pending or placeholder data shown), otherwise focus
  // would land on a stale result that unmounts when data arrives.
  function focusFirstResult() {
    if (debouncedQuery !== value || isPlaceholderData) {
      return;
    }
    linksRef.current?.querySelector<HTMLElement>("li a[href]")?.focus();
  }

  // j/k move focus between link card titles (Gmail/GitHub style), G jumps to
  // the last one and gg to the first (Vim style). Ignored while typing and
  // when a modifier is held, so browser shortcuts like Ctrl+K keep working.
  useEffect(() => {
    let lastG = Number.NEGATIVE_INFINITY;
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "g") {
        lastG = Number.NEGATIVE_INFINITY;
      }
      if (!["j", "k", "g", "G"].includes(e.key)) {
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
      titles[Math.max(0, Math.min(next, titles.length - 1))].focus();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const totalResults = linksResponse?.pagination.totalCount;
  const currentPage = linksResponse?.pagination.currentPage;
  const totalPages = linksResponse?.pagination.totalPages;
  const linkResponseMs = linksResponse?.meta.durationMs;

  // Empty payload can mean a brand-new account or filters with no matches.
  // Read the loader's unfiltered cache to tell them apart.
  const newAccount =
    (queryClient.getQueryData<LinksResponse>(
      linksQueryOptions({ page: 1 }).queryKey,
    )?.pagination.totalCount ?? 0) === 0;

  // Mobile-only: snapshot active filters when the nav drawer opens, compare
  // on close, and scroll to top if anything changed so the user lands on the
  // start of the re-filtered list. On desktop the nav lives in the always-open
  // sidebar, so isNavOpen never flips and this effect never fires.
  const filtersAtOpenRef = useRef<string | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: only react to drawer open/close
  useEffect(() => {
    const key = JSON.stringify({
      favourite,
      forLater,
      selectedCollection,
      selectedTags: [...selectedTags].sort(),
    });
    if (isNavOpen) {
      filtersAtOpenRef.current = key;
    } else if (filtersAtOpenRef.current !== null) {
      if (filtersAtOpenRef.current !== key) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      filtersAtOpenRef.current = null;
    }
  }, [isNavOpen]);

  const lastFocusedRef = useRef<{ id: string; index: number } | null>(null);

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
    if (!last || editingLink || links.some((link) => link.id === last.id)) {
      return;
    }
    if (document.activeElement && document.activeElement !== document.body) {
      return;
    }
    const titles = getTitles(linksRef.current);
    lastFocusedRef.current = null;
    titles[Math.min(last.index, titles.length - 1)]?.focus();
  }, [links, editingLink]);

  async function handleSignOut() {
    if (signingOut.current) return;
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

  const filterPills = [
    ...(favourite
      ? [
          {
            id: "favourite",
            label: "Favourite",
            onRemove: () => setFavourite(false),
          },
        ]
      : []),
    ...(forLater
      ? [
          {
            id: "forLater",
            label: "For later",
            onRemove: () => setForLater(false),
          },
        ]
      : []),
    ...(selectedCollectionObj
      ? [
          {
            id: `collection:${selectedCollectionObj.id}`,
            label: `Collection: ${selectedCollectionObj.name}`,
            onRemove: () => setSelectedCollection(null),
          },
        ]
      : []),
    ...selectedTags.map((id) => ({
      id: `tag:${id}`,
      label: `#${tags.find((tag) => tag.id === id)?.name ?? id}`,
      onRemove: () => {
        setSelectedTags((selected) => selected.filter((tag) => tag !== id));
      },
    })),
  ].map((pill) => ({
    ...pill,
    onRemove: () => {
      pill.onRemove();
      setPage(1);
    },
  }));

  return (
    <Dashboard>
      <Dashboard.Header>
        <Logo to="/dashboard" />
        <Dashboard.HeaderSearch>
          <Form.SearchInput
            label="Search"
            placeholder="Search for..."
            value={value}
            onValueChange={setValue}
            onEnter={focusFirstResult}
            tags={tags}
            collections={collections}
            selectedTags={selectedTags}
            onSelectedTagsChange={(updater) => {
              setSelectedTags(updater);
              setPage(1);
            }}
            onSelectedCollectionChange={(updater) => {
              setSelectedCollection(updater);
              setPage(1);
            }}
            favourite={favourite}
            onFavouriteChange={(updater) => {
              setFavourite(updater);
              setPage(1);
            }}
            forLater={forLater}
            onForLaterChange={(updater) => {
              setForLater(updater);
              setPage(1);
            }}
          />
          <Dashboard.HeaderSkipButton onClick={focusFirstResult} />
          <Dashboard.HeaderTrigger>
            <DashboardButton
              icon={<Icon.Filter />}
              onClick={() => setIsNavOpen(true)}
              text="Menu"
            />
          </Dashboard.HeaderTrigger>
        </Dashboard.HeaderSearch>
        <Dashboard.HeaderActions>
          <DashboardButton
            icon={<Icon.Plus />}
            onClick={() => setIsAddLinkOpen(true)}
            text="Add link"
          />
          <DashboardButton
            icon={<Icon.Plus />}
            onClick={() => setIsAddCollectionOpen(true)}
            text="Add collection"
          />
        </Dashboard.HeaderActions>
      </Dashboard.Header>

      <Dashboard.Filters>
        <DashboardNav
          collections={collections}
          favourite={favourite}
          forLater={forLater}
          handleClearCache={handleClearCache}
          handleSignOut={handleSignOut}
          onError={setCriticalError}
          onEditCollection={setEditingCollection}
          onRenameTag={setEditingTag}
          selectedCollection={selectedCollection}
          selectedTags={selectedTags}
          setFavourite={(v) => {
            setFavourite(v);
            setPage(1);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          setForLater={(v) => {
            setForLater(v);
            setPage(1);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          setIsAddCollectionkOpen={setIsAddCollectionOpen}
          setIsAddLinkOpen={setIsAddLinkOpen}
          setSelectedCollection={(v) => {
            setSelectedCollection(v);
            setPage(1);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          setSelectedTags={(v) => {
            setSelectedTags(v);
            setPage(1);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          tags={tags}
        />
      </Dashboard.Filters>

      <Dashboard.Main>
        <Dashboard.MainPills>
          <Dashboard.MainPillsStats>
            <Stats
              totalResults={totalResults}
              totalPages={totalPages}
              currentPage={currentPage}
              linksResponse={linkResponseMs}
            />
          </Dashboard.MainPillsStats>
          {filterPills.length > 0 ? (
            <>
              <Dashboard.MainPillsContent>
                <Pills items={filterPills} noWrap />
              </Dashboard.MainPillsContent>
              <Dashboard.MainPillsButton
                onClick={() => {
                  setFavourite(false);
                  setForLater(false);
                  setSelectedCollection(null);
                  setSelectedTags([]);
                  setPage(1);
                }}
              />
            </>
          ) : null}
        </Dashboard.MainPills>

        {criticalError ? (
          <Dashboard.MainCritical errorMessage={criticalError} />
        ) : null}

        {selectedCollectionObj ? (
          <DashboardCollectionInfo collection={selectedCollectionObj} />
        ) : null}

        <Dashboard.MainLinks ref={linksRef}>
          {links.length ? (
            <Dashboard.MainLinksList>
              {links.map((link, index) => (
                <li
                  key={link.id}
                  onFocus={() => {
                    lastFocusedRef.current = { id: link.id, index };
                  }}
                  onBlur={(e) => {
                    // Keep: null (card removed), another card, or a dialog.
                    // Clear: focus left the list on purpose.
                    const next = e.relatedTarget as HTMLElement | null;
                    if (
                      next &&
                      // Moving to another card: its onFocus takes over.
                      !linksRef.current?.contains(next) &&
                      // Edit dialog: keep in case the edit filters the link out.
                      !next.closest("dialog")
                    ) {
                      lastFocusedRef.current = null;
                    }
                  }}
                >
                  <LinkCard
                    link={link}
                    loading={isPlaceholderData}
                    query={debouncedQuery}
                    onEdit={setEditingLink}
                    onTagClick={(tagId) => {
                      setFavourite(false);
                      setForLater(false);
                      setSelectedCollection(null);
                      setSelectedTags([tagId]);
                      setPage(1);
                      (document.activeElement as HTMLElement | null)?.blur();
                      lastFocusedRef.current = null;
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    onCollectionClick={(collectionId) => {
                      setFavourite(false);
                      setForLater(false);
                      setSelectedCollection(collectionId);
                      setSelectedTags([]);
                      setPage(1);
                      (document.activeElement as HTMLElement | null)?.blur();
                      lastFocusedRef.current = null;
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  />
                </li>
              ))}
            </Dashboard.MainLinksList>
          ) : (
            <DashboardEmpty
              newAccount={newAccount}
              setIsAddLinkOpen={setIsAddLinkOpen}
            />
          )}
        </Dashboard.MainLinks>

        {totalPages && totalPages > 1 ? (
          <nav
            aria-label="Pagination"
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <Stack direction="row" spaceBetween alignCenter>
              {page > 1 ? (
                <Button
                  text="Previous"
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                />
              ) : null}
              <span>
                Page {page}/{totalPages}
              </span>
              {page < totalPages ? (
                <Button
                  text="Next"
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                />
              ) : null}
            </Stack>
          </nav>
        ) : null}
      </Dashboard.Main>

      <Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
        <DashboardNav
          collections={collections}
          favourite={favourite}
          forLater={forLater}
          handleClearCache={handleClearCache}
          handleSignOut={handleSignOut}
          onError={setCriticalError}
          onEditCollection={setEditingCollection}
          onRenameTag={setEditingTag}
          selectedCollection={selectedCollection}
          selectedTags={selectedTags}
          setFavourite={(v) => {
            setFavourite(v);
            setPage(1);
          }}
          setForLater={(v) => {
            setForLater(v);
            setPage(1);
          }}
          setIsAddCollectionkOpen={setIsAddCollectionOpen}
          setIsAddLinkOpen={setIsAddLinkOpen}
          setSelectedCollection={(v) => {
            setSelectedCollection(v);
            setPage(1);
          }}
          setSelectedTags={(v) => {
            setSelectedTags(v);
            setPage(1);
          }}
          tags={tags}
        />
      </Drawer>

      <Dialog
        open={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        title="Add new link"
      >
        {isAddLinkOpen ? (
          <FormLink
            onClose={() => setIsAddLinkOpen(false)}
            collections={collections}
            tags={tags}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={!!editingLink}
        onClose={() => setEditingLink(null)}
        title="Edit link"
      >
        {editingLink ? (
          <FormLink
            key={editingLink.id}
            link={editingLink}
            onClose={() => setEditingLink(null)}
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
        {isAddCollectionOpen ? (
          <FormCollection
            onClose={() => setIsAddCollectionOpen(false)}
            isPro={user.isPro}
            isAdmin={user.isAdmin}
            collections={collections}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={!!editingCollection}
        onClose={() => setEditingCollection(null)}
        title="Edit collection"
      >
        {editingCollection ? (
          <FormCollection
            key={editingCollection.id}
            collection={editingCollection}
            collections={collections}
            isPro={user.isPro}
            isAdmin={user.isAdmin}
            onClose={() => setEditingCollection(null)}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={!!editingTag}
        onClose={() => setEditingTag(null)}
        title="Rename tag"
      >
        {editingTag ? (
          <FormTag
            key={editingTag.id}
            tag={editingTag}
            tags={tags}
            onClose={() => setEditingTag(null)}
          />
        ) : null}
      </Dialog>
    </Dashboard>
  );
}
