import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { meQueryOptions } from "#/queries/me.ts";

import { Footer, HeaderProtected, Heading, Page } from "../components";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ context }) => {
		if (!context.hasSession) {
			context.queryClient.clear();
			throw redirect({
				to: "/auth/signin",
			});
		}
		const user = await context.queryClient.query({
			...meQueryOptions,
			staleTime: 0,
		});
		return { user };
	},
	staleTime: 5 * 60 * 1000,
	component: Outlet,
	errorComponent: ComponentError,
	preload: false,
});

function ComponentError() {
	return (
		<Page>
			<Page.Header>
				<HeaderProtected />
			</Page.Header>
			<Page.Main>
				<Heading level={1} text="Error" />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
}
