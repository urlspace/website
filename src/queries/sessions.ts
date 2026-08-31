import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type SessionRow = {
	id: string;
	description: string | null;
	current: boolean;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
};

const getSessions = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
		headers: { cookie },
	});
	if (!res.ok) throw new Error(`/sessions failed: ${res.status}`);
	const json = (await res.json()) as { data: SessionRow[] };
	return json.data;
});

export const sessionsQueryKey = ["sessions"] as const;

export const sessionsQueryOptions = queryOptions({
	queryKey: sessionsQueryKey,
	queryFn: () => getSessions(),
});
