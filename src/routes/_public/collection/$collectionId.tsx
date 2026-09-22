import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicCollection } from "#/queries/collections.ts";
import { formatDate } from "#/utils.ts";
import {
  Button,
  ButtonLink,
  CollectionLink,
  DashboardButton,
  DashboardButtonLink,
  Heading,
  Icon,
  Stack,
} from "#/components/index.ts";
import React from "react";

type Layout = "list" | "masonry";
const layoutStorageKey = "public-collection-layout";

export const Route = createFileRoute("/_public/collection/$collectionId")({
  loader: async ({ params }) => {
    const collection = await getPublicCollection({
      data: params.collectionId,
    });
    if (collection === null) throw notFound({ routeId: "__root__" });
    return collection;
  },
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };

    const title = `${loaderData.name} by ${loaderData.author.displayName} | url.space`;
    const description = loaderData.description.trim();
    const collectionUrl = `https://url.space/collection/${encodeURIComponent(params.collectionId)}`;

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
  component: PagePublicCollection,
});

function PagePublicCollection() {
  const [layout, setLayout] = React.useState<Layout>("list");
  const collection = Route.useLoaderData();
  const { collectionId } = Route.useParams();
  const { hasSession } = Route.useRouteContext();

  const cloneSection = (
    <>
      <Heading
        level={3}
        text={hasSession ? "Clone this collection" : "Keep these links"}
      />
      <p>
        {hasSession
          ? "Copy this collection and all its links to your account. Your copy is private and yours to edit."
          : "Create a free account to save a private copy of this collection. Organise it your way."}
      </p>
      {hasSession ? (
        <Button
          text="Clone collection"
          type="button"
          onClick={() => console.log("clone")}
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
    <main className="collection">
      <header className="collection__header">
        <Heading level={1} text={collection.name} />
        <p className="collection__description">{collection.description}</p>
        <p className="collection__author">
          Created by{" "}
          <Link
            to="/user/$username"
            params={{ username: collection.author.username }}
          >
            {collection.author.displayName}
          </Link>{" "}
          on{" "}
          <time dateTime={collection.createdAt}>
            {formatDate(collection.createdAt)}
          </time>
        </p>
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
          <div className="collection__option">
            <DashboardButtonLink
              text="Feed"
              to={`/collection/${encodeURIComponent(collectionId)}/feed.xml`}
              icon={<Icon.Rss />}
              reloadDocument
            />
          </div>
        </div>
      </header>
      {layout === "masonry" ? (
        <div className="collection__viewMasonry">
          <header className="collection__viewMasonryHeader">
            <Heading
              level={2}
              text={`Links (${collection.links.length} items)`}
            />
          </header>
          <main className="collection__viewMasonryMain">
            {collection.links.length === 0 ? (
              <p>No links yet.</p>
            ) : (
              collection.links.map((link) => (
                <div>
                  <CollectionLink
                    title={link.title}
                    description={link.description}
                    id={link.id}
                    url={link.url}
                    createdAt={link.createdAt}
                  />
                </div>
              ))
            )}
          </main>
          <aside className="collection__viewMasonryAside">
            {cloneSection}
          </aside>
        </div>
      ) : (
        <div className="collection__viewList">
          <main className="collection__viewListMain">
            <Stack gap={2}>
              <Heading
                level={2}
                text={`Links (${collection.links.length} items)`}
              />
              {collection.links.length === 0 ? (
                <p>No links yet.</p>
              ) : (
                collection.links.map((link) => (
                  <CollectionLink
                    title={link.title}
                    description={link.description}
                    id={link.id}
                    url={link.url}
                    createdAt={link.createdAt}
                  />
                ))
              )}
            </Stack>
          </main>
          <aside className="collection__viewListAside">
            {cloneSection}
          </aside>
        </div>
      )}
    </main>
  );
}
