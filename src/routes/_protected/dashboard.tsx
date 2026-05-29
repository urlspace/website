import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";
import {
  Dashboard,
  DashboardButton,
  DashboardLink,
  DashboardList,
  DashboardLogo,
  DashboardNav,
  DashboardSection,
  Dialog,
  Drawer,
  Form,
  FormCollection,
  FormLink,
  Icon,
  Stack,
} from "#/components/index.ts";
import useDebouncedValue from "#/hooks/useDebouncedValue.ts";
import {
  type LinkFilters,
  type LinkRow,
  linksQueryOptions,
} from "#/queries/links.ts";

type CollectionRow = {
  id: string;
  name: string;
  description: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
};

type TagRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const getCollections = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
    headers: { cookie },
  });
  if (!res.ok) throw new Error(`/collections failed: ${res.status}`);
  const json = (await res.json()) as { data: CollectionRow[] };
  return json.data ?? [];
});

const getTags = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/tags`, {
    headers: { cookie },
  });
  if (!res.ok) throw new Error(`/tags failed: ${res.status}`);
  const json = (await res.json()) as { data: TagRow[] };
  return json.data ?? [];
});

const collectionsQueryOptions = queryOptions({
  queryKey: ["collections"],
  queryFn: () => getCollections(),
});

const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: () => getTags(),
});

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
  const { user } = useLoaderData({ from: "/_protected" });
  const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  const [value, setValue] = useState<string>("");
  const [favourite, setFavourite] = useState(false);
  const [forLater, setForLater] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const router = useRouter();

  const debouncedQuery = useDebouncedValue(value, 200, () => setPage(1));

  // function refreshDashboard() {
  //   queryClient.invalidateQueries({ queryKey: ["links"] });
  //   queryClient.invalidateQueries({ queryKey: ["collections"] });
  //   queryClient.invalidateQueries({ queryKey: ["tags"] });
  // }

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
  const totalCount = linksResponse?.pagination.totalCount ?? 0;

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkRow | null>(null);

  async function handleSignOut() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    // TODO: bug, what if the authentication fails on the sighout click,
    // user should still be moved away from the dashboard, anc cookie should be cleard
    // somethign similar that we do on the _protected file with clearing cookies,
    //  maybe this should run on server, i dont know

    if (res.ok) {
      await router.invalidate();
      await router.navigate({ to: "/auth/signin" });
    }
  }

  return (
    <Dashboard>
      <Dashboard.Header>
        <DashboardLogo />
        <Stack direction="row" gap={0.5}>
          <DashboardButton
            icon={<Icon.Plus />}
            onClick={() => setIsAddLinkOpen(true)}
            text="Link"
          />
          <DashboardButton
            icon={<Icon.Plus />}
            onClick={() => setIsAddCollectionOpen(true)}
            text="Collection"
          />
          <DashboardButton
            icon={<Icon.Filter />}
            onClick={() => setIsNavOpen(true)}
            text="Menu"
          />
        </Stack>
      </Dashboard.Header>
      <Dashboard.AsideOne>
        <DashboardNav
          collections={collections}
          favourite={favourite}
          forLater={forLater}
          handleSignOut={handleSignOut}
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
          showLogo={true}
          tags={tags}
        />
      </Dashboard.AsideOne>
      <Dashboard.Main>
        <DashboardSection search>
          <Form onSubmit={() => console.log("search")}>
            <Form.Input
              name="search"
              value={value}
              onChange={setValue}
              label="Search"
              type="text"
              placeholder="Search for..."
            ></Form.Input>
          </Form>

          {
            // <div>
            //   {value !== "" ? (
            //     <button onClick={() => setValue("")}>
            //       Search: {value} <Icon.Close />
            //     </button>
            //   ) : null}
            //   {selectedCollection ? (
            //     <button
            //       onClick={() => {
            //         setSelectedCollection(null);
            //         setPage(1);
            //       }}
            //     >
            //       collection:{" "}
            //       {collections.find((c) => c.id === selectedCollection)?.name ??
            //         "Unknown"}{" "}
            //       <Icon.Close />
            //     </button>
            //   ) : null}
            //   {selectedTags.length
            //     ? selectedTags.map((tagId) => {
            //         const tag = tags.find((t) => t.id === tagId);
            //         if (!tag) return null;
            //
            //         return (
            //           <button
            //             key={tagId}
            //             onClick={() => {
            //               setSelectedTags(
            //                 selectedTags.filter((t) => t !== tagId),
            //               );
            //               setPage(1);
            //             }}
            //           >
            //             tag: {tag.name} <Icon.Close />
            //           </button>
            //         );
            //       })
            //     : null}
            // </div>
          }
        </DashboardSection>
        <DashboardSection>
          {
            // <button type="button" onClick={refreshDashboard}>
            //   Reset cache //{" "}
            // </button>
          }
          Results: {totalCount}
        </DashboardSection>

        {links.map((link) => (
          <DashboardLink
            key={link.id}
            link={link}
            loading={isPlaceholderData}
            onEdit={setEditingLink}
            onTagClick={(tagId) => {
              setFavourite(false);
              setForLater(false);
              setSelectedCollection(null);
              setSelectedTags([tagId]);
              setPage(1);
            }}
            onCollectionClick={(collectionId) => {
              setFavourite(false);
              setForLater(false);
              setSelectedCollection(collectionId);
              setSelectedTags([]);
              setPage(1);
            }}
          />
        ))}
      </Dashboard.Main>
      <Dashboard.AsideTwo>
        <DashboardSection>
          {
            // this is the same list as on the dashboard nav
            // now it is just repeated, it is fine, but if we need it in
            // more places we should extract to a component
          }
          <DashboardList>
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.User />}
                onClick={() => alert("Show profile")}
                text="Profile"
              />
            </DashboardList.Li>
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.Settings />}
                onClick={() => alert("Show settings")}
                text="Settings"
              />
            </DashboardList.Li>
            <DashboardList.Li>
              <DashboardButton
                icon={<Icon.SignOut />}
                onClick={handleSignOut}
                text="Sign out"
              />
            </DashboardList.Li>
          </DashboardList>
        </DashboardSection>
      </Dashboard.AsideTwo>

      <Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
        <DashboardNav
          collections={collections}
          favourite={favourite}
          forLater={forLater}
          handleSignOut={handleSignOut}
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
          showLogo={false}
          tags={tags}
        />
      </Drawer>

      <Dialog
        open={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        title="Add new link"
      >
        <FormLink
          onClose={() => setIsAddLinkOpen(false)}
          collections={collections}
          tags={tags}
        />
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
        <FormCollection
          onClose={() => setIsAddCollectionOpen(false)}
          isPro={user.isPro}
          collections={collections}
        />
      </Dialog>
    </Dashboard>
  );
}
