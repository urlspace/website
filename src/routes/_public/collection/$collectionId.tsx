import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicCollection } from "#/queries/collections.ts";

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
  const collection = Route.useLoaderData();

  return (
    <main>
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
      <p>
        By{" "}
        <Link
          to="/user/$username"
          params={{ username: collection.author.username }}
        >
          {collection.author.displayName}
        </Link>
      </p>
      <p>
        Created:{" "}
        <time dateTime={collection.createdAt}>{collection.createdAt}</time>
      </p>
      <p>
        Updated:{" "}
        <time dateTime={collection.updatedAt}>{collection.updatedAt}</time>
      </p>
      <h2>Links</h2>
      {collection.links.length === 0 ? (
        <p>No links yet.</p>
      ) : (
        <ul>
          {collection.links.map((link) => (
            <li key={link.id}>
              <h3>
                <a href={link.url}>{link.title}</a>
              </h3>
              <p>{link.description}</p>
              <p>{link.url}</p>
              <p>
                Added: <time dateTime={link.createdAt}>{link.createdAt}</time>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
