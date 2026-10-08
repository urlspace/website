import { redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { clearSession } from "#/queries/session.ts";

export type CollectionRow = {
	id: string;
	name: string;
	slug: string;
	description: string;
	public: boolean;
	createdAt: string;
	updatedAt: string;
	count: number;
};

const getCollections = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
		headers: { cookie },
	});
	if (res.status === 401 && ((await res.clone().json()) as { data: string }).data === "unauthorized") {
		await clearSession();
		throw redirect({
			to: "/auth/signin",
			reloadDocument: true,
			replace: true,
		});
	}
	if (!res.ok) throw new Error(`/collections failed: ${res.status}`);
	const json = (await res.json()) as { data: CollectionRow[] };
	return json.data ?? [];
});

export const collectionsQueryOptions = queryOptions({
	queryKey: ["collections"],
	queryFn: () => getCollections(),
	staleTime: 5 * 60 * 1000,
});

export type PublicCollection = {
	id: string;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	author: {
		displayName: string;
		username: string;
	};
	links: Array<{
		id: string;
		title: string;
		description: string;
		createdAt: string;
		url: string;
	}>;
};

const usernamePattern = /^[a-z0-9_-]{3,32}$/;
const slugPattern = /^(?=.{2,128}$)[a-z0-9]+(-[a-z0-9]+)*$/;

export const getPublicCollection = createServerFn()
	.inputValidator((input: { username: string; slug: string }) => {
		if (typeof input?.username !== "string" || typeof input?.slug !== "string") {
			throw new Error("Invalid collection address");
		}
		return input;
	})
	.handler(async ({ data: { username, slug } }) => {
		// Only well-formed usernames and slugs may reach the URL below. The values come
		// from the visitor's URL, and encodeURIComponent leaves ".." untouched, so a
		// request like /%2E%2E/%2E%2E would build ".../v1/public/../.." and fetch would
		// resolve it to the root of the API host, outside /v1. That lets anyone make
		// this server request paths we never meant to expose (server-side request
		// forgery). Anything else returns null, which the routes render as a 404.
		if (!usernamePattern.test(username) || !slugPattern.test(slug)) {
			return null;
		}
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/public/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
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
			throw new Error(`/public collection failed: ${res.status}`);
		}
		const json = (await res.json()) as { data: PublicCollection };
		return json.data;
	});
