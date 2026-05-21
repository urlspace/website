import {
  Button,
  Dialog,
  Form,
  Stack,
  Dashboard,
  DashboardLogo,
  DashboardButton,
  Icon,
  DashboardList,
  DashboardAccordion,
  DashboardSection,
} from "#/components/index.ts";
import {
  queryOptions,
  useQueryClient,
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
  const { user } = useLoaderData({ from: "/_protected" });
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
    <>
      <Dashboard>
        <Dashboard.Header>
          <DashboardLogo />
          <DashboardButton
            icon={<Icon.Filter />}
            onClick={() => alert("Show filters")}
            text="Filters"
          />
        </Dashboard.Header>
        <Dashboard.AsideOne>
          <DashboardSection>
            <DashboardLogo />
            <DashboardList>
              <DashboardList.Li>
                <DashboardButton
                  icon={<Icon.List />}
                  onClick={() => {
                    setFavourite(false);
                    setForLater(false);
                    setSelectedCollection(null);
                    setSelectedTags([]);
                  }}
                  text="All"
                />
              </DashboardList.Li>
              <DashboardList.Li>
                <DashboardButton
                  ariaPressed={favourite}
                  icon={<Icon.Heart />}
                  onClick={() => setFavourite((prev) => !prev)}
                  text="Favourite"
                />
              </DashboardList.Li>
              <DashboardList.Li>
                <DashboardButton
                  ariaPressed={forLater}
                  icon={<Icon.Coffee />}
                  onClick={() => setForLater((prev) => !prev)}
                  text="For later"
                />
              </DashboardList.Li>
            </DashboardList>
            <DashboardButton
              icon={<Icon.Plus />}
              onClick={() => setIsAddLinkOpen(true)}
              text="Add link"
            />
          </DashboardSection>
          <DashboardSection>
            <DashboardAccordion summary="Collections">
              <Stack>
                <DashboardList>
                  {collections.map((c) => (
                    <DashboardList.Li key={c.id}>
                      <DashboardButton
                        icon={<Icon.Folder />}
                        onClick={() =>
                          setSelectedCollection((prev) =>
                            prev === c.id ? null : c.id,
                          )
                        }
                        ariaPressed={selectedCollection === c.id}
                        text={c.name}
                      />
                    </DashboardList.Li>
                  ))}
                </DashboardList>
                <div>
                  <DashboardButton
                    icon={<Icon.Plus />}
                    onClick={() => setIsAddCollectionOpen(true)}
                    text="Add collection"
                  />
                  <DashboardButton
                    icon={<Icon.Edit />}
                    onClick={() => alert("Show filters")}
                    text="Edit collections"
                  />
                </div>
              </Stack>
            </DashboardAccordion>
          </DashboardSection>
          <DashboardSection>
            <DashboardAccordion summary="Tags">
              <Stack>
                <DashboardList>
                  {tags.map((t) => (
                    <DashboardList.Li key={t.id}>
                      <DashboardButton
                        icon={<Icon.Tag />}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(t.id)
                              ? prev.filter((id) => id !== t.id)
                              : [...prev, t.id],
                          )
                        }
                        ariaPressed={selectedTags.includes(t.id)}
                        text={t.name}
                      />
                    </DashboardList.Li>
                  ))}
                </DashboardList>

                <div>
                  <DashboardButton
                    icon={<Icon.Edit />}
                    text="Edit tags"
                    onClick={() => alert("Show filters")}
                  />
                </div>
              </Stack>
            </DashboardAccordion>
          </DashboardSection>
        </Dashboard.AsideOne>
        <Dashboard.Main>
          <DashboardSection>
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
            <article className="dashboard__link" key={link.id}>
              <Stack>
                <Stack gap={0}>
                  <a href={link.url} className="dashboard__link-title">
                    {link.title}
                  </a>
                  <a href={link.url} className="dashboard__link-a">
                    {link.url}
                  </a>
                </Stack>
                {link.description.length > 0 ? <p>{link.description}</p> : null}
                {link.tags.length > 0 ? (
                  <ul className="dashboard__link-tags">
                    {link.tags.map((tag) => (
                      <li key={tag.id} className="dashboard__link-tag">
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {link.collection ? (
                  <p className="dashboard__link-collection">
                    Collection: {link.collection.name}
                  </p>
                ) : null}
              </Stack>
            </article>
          ))}
        </Dashboard.Main>
        <Dashboard.AsideTwo>
          <DashboardSection>
            <Button
              text="Add link"
              onClick={() => setIsAddLinkOpen(true)}
              fullWidth
            />
            <Button
              text="Add collection"
              onClick={() => setIsAddCollectionOpen(true)}
              fullWidth
            />
            <Button
              type="button"
              onClick={handleSignOut}
              text="Sign out"
              fullWidth
            />

            <h1>User</h1>
            <p>Username: {user.username}</p>
            <p>Display name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>Pro: {user.isPro ? "Yes" : "No"}</p>
            <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
            <p>Member since: {user.createdAt.slice(0, 10)}</p>
          </DashboardSection>
        </Dashboard.AsideTwo>

        <Dialog open={isAddLinkOpen} onClose={() => setIsAddLinkOpen(false)}>
          <Form onSubmit={handleSubmitLink}>
            <Form.Input
              label="Title"
              required
              type="text"
              name="title"
              value={newLinkTitle}
              onChange={setNewLinkTitle}
              placeholder="Boo"
            ></Form.Input>
            <Form.Input
              label="URL"
              required
              type="text"
              name="url"
              value={newLinkUrl}
              onChange={setNewLinkUrl}
              placeholder="https://cloudflare.com"
            ></Form.Input>
            <Form.Input
              label="Description"
              required
              type="text"
              name="description"
              value={newLinkDescription}
              onChange={setNewLinkDescription}
              placeholder="What a cool description"
            ></Form.Input>
            <Form.Input
              label="Tags"
              required
              type="text"
              name="tags"
              value={newLinkTags}
              onChange={setNewLinkTags}
              placeholder="comma,separated,tags"
            ></Form.Input>
            <Button type="submit" text="Add new link" />
          </Form>
        </Dialog>

        <Dialog
          open={isAddCollectionOpen}
          onClose={() => setIsAddCollectionOpen(false)}
        >
          <Form onSubmit={handleSubmitCollection}>
            <Form.Input
              label="Collection name"
              required
              type="text"
              name="collection-name"
              value={newCollectionName}
              onChange={setNewCollectionName}
              placeholder="Cats"
            ></Form.Input>
            <Button type="submit" text="Add new collection" />
          </Form>
        </Dialog>
      </Dashboard>
    </>
  );
}
