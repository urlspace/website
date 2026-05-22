import {
  Button,
  Dialog,
  Form,
  Stack,
  Dashboard,
  DashboardLogo,
  DashboardButton,
  Icon,
  DashboardSection,
  DashboardNavDialog,
  DashboardNav,
  DashboardList,
  DashboardLink,
} from "#/components/index.ts";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  // useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";

type LinkRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
  collection: {
    id: string;
    name: string;
  } | null;
  favourite: boolean;
  forLater: boolean;
  createdAt: string;
  updatedAt: string;
};

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

const getLinks = createServerFn().handler(async () => {
  const cookie = getRequest().headers.get("cookie") ?? "";
  const res = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
    headers: { cookie },
  });
  if (!res.ok) throw new Error(`/links failed: ${res.status}`);
  const json = (await res.json()) as { data: LinkRow[] };
  return json.data ?? [];
});

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

const linksQueryOptions = queryOptions({
  queryKey: ["links"],
  queryFn: () => getLinks(),
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
      context.queryClient.ensureQueryData(linksQueryOptions),
      context.queryClient.ensureQueryData(collectionsQueryOptions),
      context.queryClient.ensureQueryData(tagsQueryOptions),
    ]);
  },
  component: PageDashboard,
});

function PageDashboard() {
  // const { user } = useLoaderData({ from: "/_protected" });
  const { data: links } = useSuspenseQuery(linksQueryOptions);
  const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  const [value, setValue] = useState<string>("");
  const [favourite, setFavourite] = useState(false);
  const [forLater, setForLater] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [newLinkTags, setNewLinkTags] = useState("");

  async function handleSubmitLink(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/links`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: newLinkTitle,
        description: newLinkDescription,
        url: newLinkUrl,
        tags: newLinkTags.split(",").map((t) => t.trim()),
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: linksQueryOptions.queryKey,
    });
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkDescription("");
    setNewLinkTags("");
    setIsAddLinkOpen(false);
  }

  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  async function handleSubmitCollection(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: newCollectionName,
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: collectionsQueryOptions.queryKey,
    });
    setNewCollectionName("");
    setIsAddCollectionOpen(false);
  }

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

  const filteredLinks = links
    .filter((link) => (favourite ? link.favourite : true))
    .filter((link) => (forLater ? link.forLater : true))
    .filter((link) =>
      !selectedCollection ? true : link.collection?.id === selectedCollection,
    )
    .filter((link) =>
      selectedTags.length > 0
        ? selectedTags.every((tag) =>
            link.tags.some((linkTag) => linkTag.id === tag),
          )
        : true,
    )
    .filter((link) => link.title.toLowerCase().includes(value.toLowerCase()));

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
          handleSignOut={handleSignOut}
          showLogo={true}
          favourite={favourite}
          forLater={forLater}
          setFavourite={setFavourite}
          setForLater={setForLater}
          setSelectedCollection={setSelectedCollection}
          setSelectedTags={setSelectedTags}
          collections={collections}
          tags={tags}
          selectedCollection={selectedCollection}
          selectedTags={selectedTags}
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
        </DashboardSection>

        {filteredLinks.map((link) => (
          <DashboardLink link={link} />
        ))}
      </Dashboard.Main>
      <Dashboard.AsideTwo>
        <Stack fullHeight spaceBetween gap={0}>
          <DashboardSection>
            <DashboardList>
              <DashboardList.Li>
                <DashboardButton
                  icon={<Icon.Plus />}
                  onClick={() => setIsAddLinkOpen(true)}
                  text="Add link"
                />
              </DashboardList.Li>
              <DashboardList.Li>
                <DashboardButton
                  icon={<Icon.Plus />}
                  onClick={() => setIsAddCollectionOpen(true)}
                  text="Add collection"
                />
              </DashboardList.Li>
            </DashboardList>
          </DashboardSection>
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
            {
              // <h1>User</h1>
              // <p>Username: {user.username}</p>
              // <p>Display name: {user.displayName}</p>
              // <p>Email: {user.email}</p>
              // <p>Pro: {user.isPro ? "Yes" : "No"}</p>
              // <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
              // <p>Member since: {user.createdAt.slice(0, 10)}</p>
            }
          </DashboardSection>
        </Stack>
      </Dashboard.AsideTwo>

      <Dialog
        open={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        title="Add new collection"
      >
        <Form onSubmit={handleSubmitCollection}>
          <Form.Input
            label="Collection name"
            name="collection-name"
            onChange={setNewCollectionName}
            placeholder="Cats"
            required
            type="text"
            value={newCollectionName}
          ></Form.Input>
          <Button type="submit" text="Add new collection" />
        </Form>
      </Dialog>

      <DashboardNavDialog
        open={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Menu"
      >
        <DashboardNav
          collections={collections}
          favourite={favourite}
          forLater={forLater}
          handleSignOut={handleSignOut}
          selectedCollection={selectedCollection}
          selectedTags={selectedTags}
          setFavourite={setFavourite}
          setForLater={setForLater}
          setSelectedCollection={setSelectedCollection}
          setSelectedTags={setSelectedTags}
          showLogo={false}
          tags={tags}
        />
      </DashboardNavDialog>

      <Dialog
        open={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        title="Add new link"
      >
        <Form onSubmit={handleSubmitLink}>
          <Form.Input
            label="Title"
            name="title"
            onChange={setNewLinkTitle}
            placeholder="Boo"
            required
            type="text"
            value={newLinkTitle}
          ></Form.Input>
          <Form.Input
            label="URL"
            name="url"
            onChange={setNewLinkUrl}
            placeholder="https://cloudflare.com"
            required
            type="text"
            value={newLinkUrl}
          ></Form.Input>
          <Form.Input
            label="Description"
            name="description"
            onChange={setNewLinkDescription}
            placeholder="What a cool description"
            required
            type="text"
            value={newLinkDescription}
          ></Form.Input>
          <Form.Input
            label="Tags"
            name="tags"
            onChange={setNewLinkTags}
            placeholder="comma,separated,tags"
            required
            type="text"
            value={newLinkTags}
          ></Form.Input>
          <Button type="submit" text="Add new link" />
        </Form>
      </Dialog>
    </Dashboard>
  );
}
