import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { clearSession } from "#/queries/session.ts";

export type SubscriptionRow = {
	id: string;
	status: string;
	isActive: boolean;
	currentPeriodEnd: string;
	cancelAtPeriodEnd: boolean;
	createdAt: string;
	updatedAt: string;
};

const getSubscriptions = createServerFn().handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions`, {
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
	if (!res.ok) throw new Error(`/subscriptions failed: ${res.status}`);
	const json = (await res.json()) as { data: SubscriptionRow[] };
	return json.data;
});

export const subscriptionsQueryKey = ["subscriptions"] as const;

export const subscriptionsQueryOptions = queryOptions({
	queryKey: subscriptionsQueryKey,
	queryFn: () => getSubscriptions(),
	staleTime: 0,
});
