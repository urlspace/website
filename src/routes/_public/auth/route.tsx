import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Page } from "#/components/index.ts";

export const Route = createFileRoute("/_public/auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<Page.Main>
			<Outlet />
		</Page.Main>
	);
}
