import { redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { clearSession } from "#/queries/session.ts";

export type CollectionRow = {
	id: string;
	name: string;
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
	name: string;
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

export const getPublicCollection = createServerFn()
	.inputValidator((id: string) => {
		if (typeof id !== "string") throw new Error("Invalid collection ID");
		return id;
	})
	.handler(async ({ data: id }) => {
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/public/collection/${encodeURIComponent(id)}`,
			{ cache: "no-store" },
		);
		if (res.status === 404) return null;
		if (!res.ok) {
			throw new Error(`/public collection failed: ${res.status}`);
		}
		const json = (await res.json()) as { data: PublicCollection };
		return json.data;
	});
