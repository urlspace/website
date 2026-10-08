import { createServerFn } from "@tanstack/react-start";

export type PublicUser = {
	displayName: string;
	collections: Array<{
		id: string;
		name: string;
		slug: string;
		description: string;
		createdAt: string;
		updatedAt: string;
	}>;
};

const usernamePattern = /^[a-z0-9_-]{3,32}$/;

export const getPublicUser = createServerFn()
	.inputValidator((username: string) => {
		if (typeof username !== "string") throw new Error("Invalid username");
		return username;
	})
	.handler(async ({ data: username }) => {
		// Only well-formed usernames may reach the URL below. The value comes from the
		// visitor's URL, and encodeURIComponent leaves ".." untouched, so a request
		// like /%2E%2E would build ".../v1/public/.." and fetch would resolve it to a
		// different API path. That lets anyone make this server request paths we never
		// meant to expose (server-side request forgery). Anything else returns null,
		// which the route renders as a 404.
		if (!usernamePattern.test(username)) {
			return null;
		}
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/public/${encodeURIComponent(username)}`,
			{
				// Anonymous request, so Cloudflare can share the response between
				// visitors: one API call per location every 3 minutes per page.
				cf: {
					cacheEverything: true,
					cacheTtlByStatus: { "200-299": 180, "404": 30, "500-599": 0 },
				},
			},
		);
		if (res.status === 404) return null;
		if (!res.ok) {
			throw new Error(`/public user failed: ${res.status}`);
		}
		const json = (await res.json()) as { data: PublicUser };
		return json.data;
	});
