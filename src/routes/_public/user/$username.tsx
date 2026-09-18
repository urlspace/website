import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublicUser } from "#/queries/user.ts";

export const Route = createFileRoute("/_public/user/$username")({
	loader: async ({ params }) => {
		const user = await getPublicUser({ data: params.username });
		if (user === null) throw notFound({ routeId: "__root__" });
		return user;
	},
	staleTime: 5 * 60 * 1000,
	gcTime: 5 * 60 * 1000,
	preloadStaleTime: 5 * 60 * 1000,
	component: PagePublicUser,
});

function PagePublicUser() {
	const user = Route.useLoaderData();

	return (
		<main>
			<h1>{user.displayName}</h1>
			<h2>Public collections</h2>
			{user.collections.length === 0 ? (
				<p>No public collections yet.</p>
			) : (
				<ul>
					{user.collections.map((collection) => (
						<li key={collection.id}>
							<h3>
								<Link
									to="/collection/$collectionId"
									params={{ collectionId: collection.id }}
								>
									{collection.name}
								</Link>
							</h3>
							<p>{collection.description}</p>
							<p>ID: {collection.id}</p>
							<p>
								Created:{" "}
								<time dateTime={collection.createdAt}>
									{collection.createdAt}
								</time>
							</p>
							<p>
								Updated:{" "}
								<time dateTime={collection.updatedAt}>
									{collection.updatedAt}
								</time>
							</p>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
