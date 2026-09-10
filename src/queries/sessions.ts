import { redirect } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { clearSession } from "#/queries/session.ts";
import Bowser from "bowser";

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
	if (res.status === 401 && ((await res.clone().json()) as { data: string }).data === "unauthorized") {
		await clearSession();
		throw redirect({
			to: "/auth/signin",
			reloadDocument: true,
			replace: true,
		});
	}
	if (!res.ok) throw new Error(`/sessions failed: ${res.status}`);
	const json = (await res.json()) as {
		data: Array<Omit<SessionRow, "description"> & { userAgent: string | null }>;
	};

	return json.data
		.sort((a, b) => Number(b.current) - Number(a.current))
		.map(({ userAgent, ...session }): SessionRow => {
			if (!userAgent) {
				return { ...session, description: "Unknown device" };
			}

			const { browser, os, platform } = Bowser.parse(userAgent);
			const browserDescription = [browser.name, browser.version?.split(".")[0]]
				.filter(Boolean)
				.join(" ");
			const deviceDescription = os.name ?? platform.type;
			const description =
				browserDescription && deviceDescription
					? `${browserDescription} on ${deviceDescription}`
					: browserDescription || deviceDescription || "Unknown device";

			return { ...session, description };
		});
});

export const sessionsQueryKey = ["sessions"] as const;

export const sessionsQueryOptions = queryOptions({
	queryKey: sessionsQueryKey,
	queryFn: () => getSessions(),
	staleTime: 0,
});
