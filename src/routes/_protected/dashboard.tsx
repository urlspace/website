import { Form } from "#/components/index.ts";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
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
  component: Dashboard,
});

function Dashboard() {
  const { user } = useLoaderData({ from: "/_protected" });
  const { data: links } = useSuspenseQuery(linksQueryOptions);
  const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  const [value, setValue] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSubmitLink(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElm = e.currentTarget;
    const form = new FormData(formElm);

    await fetch(`${import.meta.env.VITE_API_URL}/links`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        url: form.get("url"),
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: linksQueryOptions.queryKey,
    });
    formElm.reset();
  }

  async function handleSubmitCollection(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElm = e.currentTarget;
    const form = new FormData(formElm);

    await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
      }),
    });

    await queryClient.invalidateQueries({
      queryKey: collectionsQueryOptions.queryKey,
    });
    formElm.reset();
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

  return (
    <div className="dashboard">
      <aside className="dashbaord__sidebar">
        <div className="dashboard__section">
          <Link to="/" className="dashboard__title">
            url.space
          </Link>
          <ul className="dashboard__list">
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dashboard__icon"
                >
                  <path d="M21 5H3" />
                  <path d="M15 12H3" />
                  <path d="M17 19H3" />
                </svg>
                All
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dashboard__icon"
                >
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                </svg>
                Favourite
              </button>
            </li>
            <li>
              <button className="dashboard__list-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dashboard__icon"
                >
                  <path d="M12 7v14" />
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
                Reading list
              </button>
            </li>
          </ul>
        </div>
        <div className="dashboard__section">
          <details className="dashboard__details" open>
            <summary className="dashboard__summary">
              <div className="dashboard__title">Collections</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dashboard__icon"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </summary>
            <ul className="dashboard__list">
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    className="dashboard__list-btn"
                    onClick={() =>
                      setSelectedCollection((prev) =>
                        prev === c.id ? null : c.id,
                      )
                    }
                    aria-pressed={selectedCollection === c.id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dashboard__icon"
                    >
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    </svg>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <button className="dashboard__list-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dashboard__icon"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add collection
            </button>
            <button className="dashboard__list-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dashboard__icon"
              >
                <path d="M14 17H5" />
                <path d="M19 7h-9" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
              Edit collections
            </button>
          </details>
        </div>
        <div className="dashboard__section">
          <details className="dashboard__details" open>
            <summary className="dashboard__summary">
              <div className="dashboard__title">Tags</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dashboard__icon"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </summary>
            <ul className="dashboard__list">
              {tags.map((t) => (
                <li key={t.id}>
                  <button
                    className="dashboard__list-btn"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(t.id)
                          ? prev.filter((id) => id !== t.id)
                          : [...prev, t.id],
                      )
                    }
                    aria-pressed={selectedTags.includes(t.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dashboard__icon"
                    >
                      <line x1="4" x2="20" y1="9" y2="9" />
                      <line x1="4" x2="20" y1="15" y2="15" />
                      <line x1="10" x2="8" y1="3" y2="21" />
                      <line x1="16" x2="14" y1="3" y2="21" />
                    </svg>
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>

            <button className="dashboard__list-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dashboard__icon"
              >
                <path d="M14 17H5" />
                <path d="M19 7h-9" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
              Edit tags
            </button>
          </details>
        </div>
      </aside>
      <div className="dashbaord__links">
        <div className="dashboard__search">
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
        </div>
        {links
          .filter((link) =>
            !selectedCollection
              ? true
              : link.collection?.id === selectedCollection,
          )
          .filter((link) =>
            selectedTags.length > 0
              ? selectedTags.every((tag) =>
                  link.tags.some((linkTag) => linkTag.id === tag),
                )
              : true,
          )
          .filter((link) =>
            link.title.toLowerCase().includes(value.toLowerCase()),
          )
          .map((link) => (
            <article className="dashboard__link" key={link.id}>
              <a href={link.url} className="dashboard__link-a">
                {link.title}
              </a>
              <p>{link.description}</p>
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
            </article>
          ))}
      </div>
      <aside className="dashbaord__sidebar">
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>

        <h1>User</h1>
        <p>Username: {user.username}</p>
        <p>Display name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Pro: {user.isPro ? "Yes" : "No"}</p>
        <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
        <p>Member since: {user.createdAt.slice(0, 10)}</p>

        <h2>Add link</h2>
        <form onSubmit={handleSubmitLink}>
          <label>
            Title
            <input name="title" required />
          </label>
          <br />
          <label>
            Description
            <input name="description" required />
          </label>
          <br />
          <label>
            URL
            <input name="url" type="url" required />
          </label>
          <br />
          <button type="submit">Add</button>
        </form>
        <h2>Add collection</h2>
        <form onSubmit={handleSubmitCollection}>
          <label>
            Name
            <input name="name" required />
          </label>
          <br />
          <button type="submit">Add</button>
        </form>
      </aside>
    </div>
  );
}
