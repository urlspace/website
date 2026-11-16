import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	getRequest,
	setCookie,
	setResponseHeader,
} from "@tanstack/react-start/server";

import { clearSession } from "#/queries/session.ts";
import { getOriginAuthHeaders } from "#/utils/getOriginAuthHeaders.ts";

export type CollectionRow = {
	id: string;
	name: string;
	slug: string;
	description: string;
	public: boolean;
	password: string | null;
	createdAt: string;
	updatedAt: string;
	count: number;
};

const getCollections = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
		headers: { cookie, ...getOriginAuthHeaders() },
	});
	if (
		res.status === 401 &&
		((await res.clone().json()) as { data: string }).data === "unauthorized"
	) {
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

export type PasswordProtectedCollection = { passwordProtected: true };

const usernamePattern = /^[a-z0-9_-]{3,32}$/;
const slugPattern = /^(?=.{2,128}$)[a-z0-9]+(-[a-z0-9]+)*$/;

// One cookie per unlocked collection. Dots separate the parts, since
// usernames and slugs never contain one. Path=/ because the app also loads
// page data through /_serverFn/ requests, which a cookie limited to the
// collection's address would miss.
function collectionPasswordCookie(username: string, slug: string) {
	return `collection-password.${username}.${slug}`;
}

export const getPublicCollection = createServerFn()
	.validator((input: { username: string; slug: string }) => {
		if (
			typeof input?.username !== "string" ||
			typeof input?.slug !== "string"
		) {
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

		// Unlocked earlier in this browser session: ask with the password, so
		// the page renders unlocked straight away.
		const cookieName = collectionPasswordCookie(username, slug);
		const password = getCookie(cookieName);
		if (password !== undefined) {
			// The response holds an unlocked collection, so nothing may cache it.
			setResponseHeader("Cache-Control", "private, no-store");
			const unlocked = await fetchUnlockedCollection(username, slug, password);
			if (unlocked === "invalid-password") {
				// The owner changed the password since this browser unlocked it.
				deleteCookie(cookieName, { path: "/" });
				return { passwordProtected: true } as PasswordProtectedCollection;
			}
			return unlocked && { ...unlocked, password };
		}

		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/public/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
			{
				headers: getOriginAuthHeaders(),
				// Anonymous request, so Cloudflare can share the response between
				// visitors: one API call per location every 3 minutes per page.
				cf: {
					cacheEverything: true,
					cacheTtlByStatus: { "200-299": 180, "404": 30, "500-599": 0 },
				},
			},
		);
		if (res.status === 404) return null;
		// Password protected. The response carries nothing about the collection.
		if (res.status === 401)
			return { passwordProtected: true } as PasswordProtectedCollection;
		if (!res.ok) {
			throw new Error(`/public collection failed: ${res.status}`);
		}
		const json = (await res.json()) as { data: PublicCollection };
		return { ...json.data, password: null };
	});

// Headers only carry Latin-1, so the password is percent-encoded and the API
// decodes it. No Cloudflare caching: this response must never be shared with
// another visitor.
async function fetchUnlockedCollection(
	username: string,
	slug: string,
	password: string,
) {
	const res = await fetch(
		`${import.meta.env.VITE_API_URL}/public/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
		{
			headers: {
				...getOriginAuthHeaders(),
				"x-collection-password": encodeURIComponent(password),
			},
		},
	);
	if (res.status === 404) return null;
	if (res.status === 401) return "invalid-password" as const;
	if (!res.ok) {
		throw new Error(`/public collection unlock failed: ${res.status}`);
	}
	const json = (await res.json()) as { data: PublicCollection };
	return json.data;
}

export const unlockPublicCollection = createServerFn({ method: "POST" })
	.validator((input: { username: string; slug: string; password: string }) => {
		if (
			typeof input?.username !== "string" ||
			typeof input?.slug !== "string" ||
			typeof input?.password !== "string"
		) {
			throw new Error("Invalid collection address");
		}
		return input;
	})
	.handler(async ({ data: { username, slug, password } }) => {
		// Same guard as getPublicCollection, see the comment there.
		if (!usernamePattern.test(username) || !slugPattern.test(slug)) {
			return null;
		}
		const unlocked = await fetchUnlockedCollection(username, slug, password);
		if (unlocked === "invalid-password") {
			return { invalidPassword: true } as const;
		}
		if (unlocked === null) {
			return null;
		}
		// No Expires or Max-Age: a session cookie the browser drops when it
		// quits, so the password is asked for once per browser session.
		setCookie(collectionPasswordCookie(username, slug), password, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		});
		return { unlocked: true } as const;
	});
