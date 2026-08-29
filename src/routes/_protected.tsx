import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie } from "@tanstack/react-start/server";
import { meQueryOptions } from "#/queries/me.ts";

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
