import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Page, PublicFooter, PublicHeader } from "../components";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	const { hasSession } = Route.useRouteContext();

	return (
		<Page>
			<Page.Header>
				<PublicHeader hasSession={hasSession} />
			</Page.Header>

			<Outlet />

			<Page.Footer>
				<PublicFooter />
			</Page.Footer>
		</Page>
	);
}
