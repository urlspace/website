import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Page, Footer, PublicHeader } from "../components";

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
				<Footer />
			</Page.Footer>
		</Page>
	);
}
