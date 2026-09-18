import { createServerFn } from "@tanstack/react-start";

export type PublicUser = {
	displayName: string;
	collections: Array<{
		id: string;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
	}>;
};

export const getPublicUser = createServerFn()
	.inputValidator((username: string) => {
		if (typeof username !== "string") throw new Error("Invalid username");
		return username;
	})
	.handler(async ({ data: username }) => {
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/public/user/${encodeURIComponent(username)}`,
			{ cache: "no-store" },
		);
		if (res.status === 404) return null;
		if (!res.ok) {
			throw new Error(`/public/user failed: ${res.status}`);
		}
		const json = (await res.json()) as { data: PublicUser };
		return json.data;
	});
