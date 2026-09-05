import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import Bowser from "bowser";

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
	const json = (await res.json()) as {
		data: Array<
			Omit<SessionRow, "description"> & { description: string | null }
		>;
	};

	return json.data
		.sort((a, b) => Number(b.current) - Number(a.current))
		.map((session) => {
			if (!session.description) {
				return { ...session, description: "Unknown device" };
			}

			const { browser, os, platform } = Bowser.parse(session.description);
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
});
