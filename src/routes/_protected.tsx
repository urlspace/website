import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getRequest } from "@tanstack/react-start/server";

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

const meQueryOptions = queryOptions({
	queryKey: ["me"],
	queryFn: () => getUser(),
});

const clearSession = createServerFn({ method: "POST" }).handler(() => {
	deleteCookie("session", {
		path: "/",
		secure: true,
		domain: import.meta.env.VITE_API_URL.includes("localhost")
			? ""
			: ".url.space",
	});
});

export const Route = createFileRoute("/_protected")({
	beforeLoad: ({ context }) => {
		if (!context.hasSession)
			throw redirect({
				to: "/auth/signin",
			});
	},
	loader: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(meQueryOptions);
		if (!user) {
			context.queryClient.removeQueries({ queryKey: meQueryOptions.queryKey });
			await clearSession();
			throw redirect({
				to: "/auth/signin",
			});
		}
		return { user };
	},
	staleTime: 5 * 60 * 1000,
	component: ComponentPage,
	errorComponent: ComponentError,
	preload: false,
	head: () => ({
		meta: [
			{
				title: "Dashboard | url.space",
			},
		],
	}),
});

function ComponentPage() {
	return <Outlet />;
}

function ComponentError() {
	return (
		<>
			<h1>Error protected</h1>
			<p>Generic error</p>
		</>
	);
}
