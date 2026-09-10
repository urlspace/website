import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { meQueryOptions } from "#/queries/me.ts";
import { clearSession } from "#/queries/session.ts";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ context }) => {
		if (!context.hasSession) {
			context.queryClient.clear();
			throw redirect({
				to: "/auth/signin",
			});
		}
		const user = await context.queryClient.fetchQuery({
			...meQueryOptions,
			staleTime: 0,
		});
		if (!user) {
			context.queryClient.clear();
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
