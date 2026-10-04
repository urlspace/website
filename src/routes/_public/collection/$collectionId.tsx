import {
  createFileRoute,
  Link,
  notFound,
  useRouter,
} from "@tanstack/react-router";
import {
  collectionsQueryOptions,
  getPublicCollection,
} from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { clearSession } from "#/queries/session.ts";
import { formatDate } from "#/utils.ts";
import {
  Button,
  ButtonLink,
  DashboardButton,
  DashboardButtonLink,
  Heading,
  Icon,
  LinkCardSlim,
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
  remountDeps: ({ params }) => params.collectionId,
  component: PagePublicCollection,
});

function PagePublicCollection() {
  const router = useRouter();
  const [layout, setLayout] = React.useState<Layout>("list");
  const [isCloning, setIsCloning] = React.useState(false);
  const [isCloned, setIsCloned] = React.useState(false);
  const [isOwnCollection, setIsOwnCollection] = React.useState(false);
  const [cloneError, setCloneError] = React.useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = React.useState(false);
  const collection = Route.useLoaderData();
  const { collectionId } = Route.useParams();
  const { hasSession, queryClient } = Route.useRouteContext();
  const canClone = hasSession && !sessionExpired;

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

  async function handleClone() {
    if (!canClone || isCloning || isCloned || isOwnCollection) return;

    setCloneError(null);
    setIsCloning(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collections/${encodeURIComponent(collectionId)}/clone`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
        },
      );

      if (res.status === 401) {
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
          case 403:
            setIsOwnCollection(true);
            setCloneError("You cannot clone your own collection.");
            break;
          case 404:
            setCloneError("This collection is no longer available to clone.");
            break;
          case 409:
            setCloneError("You already have a collection with that name.");
            break;
          case 429:
            setCloneError("Too many attempts. Try again in a moment.");
            break;
          default:
            setCloneError(
              "We couldn't confirm whether the collection was cloned. Check your collections before trying again.",
            );
        }
        return;
      }

      setIsCloned(true);
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: collectionsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: linksQueryKey }),
      ]);
    } catch {
      setCloneError(
        "We couldn't confirm whether the collection was cloned. Check your collections before trying again.",
      );
    } finally {
      setIsCloning(false);
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
      {isCloned ? (
        <p role="status">Collection cloned. Your copy is private.</p>
      ) : sessionExpired ? (
        <ButtonLink text="Sign in" to="/auth/signin" />
      ) : isOwnCollection ? null : hasSession ? (
        <Button
          text={isCloning ? "Cloning..." : "Clone collection"}
          type="button"
          disabled={isCloning}
          onClick={handleClone}
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
          <div className="collection__option">
            <DashboardButton
              text="Share"
              onClick={handleShare}
              icon={<Icon.Share />}
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
                <div key={link.id}>
                  <LinkCardSlim
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
          <aside className="collection__viewMasonryAside">{cloneSection}</aside>
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
                  <LinkCardSlim
                    key={link.id}
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
          <aside className="collection__viewListAside">{cloneSection}</aside>
        </div>
      )}
    </main>
  );
}
