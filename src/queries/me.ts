import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type User = {
	id: string;
	email: string;
	username: string;
	displayName: string;
	isAdmin: boolean;
	isPro: boolean;
	createdAt: string;
	updatedAt: string;
};

const getUser = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
		headers: { cookie },
	});
	if (res.status === 401) return null;
	if (!res.ok) throw new Error(`/me failed: ${res.status}`);
	const json = (await res.json()) as { data: User };
	return json.data;
});

export const meQueryOptions = queryOptions({
	queryKey: ["me"],
	queryFn: () => getUser(),
});
