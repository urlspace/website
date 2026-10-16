import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { clearSession } from "#/queries/session.ts";

export type SessionRow = {
	id: string;
	description: string;
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
	if (!res.ok) throw new Error(`/sessions failed: ${res.status}`);
	const json = (await res.json()) as { data: SessionRow[] };

	return json.data.sort((a, b) => Number(b.current) - Number(a.current));
});

export const sessionsQueryKey = ["sessions"] as const;

export const sessionsQueryOptions = queryOptions({
	queryKey: sessionsQueryKey,
	queryFn: () => getSessions(),
	staleTime: 0,
});
