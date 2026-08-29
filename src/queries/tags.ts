import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type TagRow = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	count: number;
};

const getTags = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/tags`, {
		headers: { cookie },
	});
	if (!res.ok) throw new Error(`/tags failed: ${res.status}`);
	const json = (await res.json()) as { data: TagRow[] };
	return json.data ?? [];
});

export const tagsQueryOptions = queryOptions({
	queryKey: ["tags"],
	queryFn: () => getTags(),
	staleTime: 5 * 60 * 1000,
});
