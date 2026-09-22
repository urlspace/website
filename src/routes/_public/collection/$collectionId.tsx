import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicCollection } from "#/queries/collections.ts";
import { formatDate } from "#/utils.ts";
import {
  Button,
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
  gcTime: 5 * 60 * 1000,
  preloadStaleTime: 5 * 60 * 1000,
  component: PagePublicCollection,
});

function PagePublicCollection() {
  const [layout, setLayout] = React.useState<Layout>("list");
  const collection = Route.useLoaderData();

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
            <DashboardButtonLink text="Feed" to="/" icon={<Icon.Rss />} />
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
            <Heading level={3} text="Clone this collectoin" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              eveniet libero nesciunt aperiam quibusdam cupiditate
              exercitationem deleniti nobis officia sint!
            </p>
            <Button
              text="Clone collection"
              type="button"
              onClick={() => console.log("clone")}
            />
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
            <Heading level={3} text="Clone this collectoin" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              eveniet libero nesciunt aperiam quibusdam cupiditate
              exercitationem deleniti nobis officia sint!
            </p>
            <Button
              text="Clone collection"
              type="button"
              onClick={() => console.log("clone")}
            />
          </aside>
        </div>
      )}
    </main>
  );
}
