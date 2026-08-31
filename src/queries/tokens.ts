import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type TokenRow = {
	id: string;
	description: string;
	lastUsedAt: string;
	createdAt: string;
	updatedAt: string;
};

const getTokens = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/tokens`, {
		headers: { cookie },
	});
	if (!res.ok) throw new Error(`/tokens failed: ${res.status}`);
	const json = (await res.json()) as { data: TokenRow[] };
	return json.data;
});

export const tokensQueryKey = ["tokens"] as const;

export const tokensQueryOptions = queryOptions({
	queryKey: tokensQueryKey,
	queryFn: () => getTokens(),
});
