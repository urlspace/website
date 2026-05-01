import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import Footer from "../components/Footer";
import Header from "../components/Header";

import appCss from "../styles.css?url";

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

const getUser = createServerFn({ method: "GET" }).handler(async () => {
	const cookie = getRequest().headers.get("cookie") ?? "";
	const res = await fetch("http://localhost:3000/v1/me", {
		headers: { cookie },
	});
	if (!res.ok) return null;
	const json = (await res.json()) as { data: User };
	return json.data;
});

export const Route = createRootRouteWithContext<{ user: User | null }>()({
	beforeLoad: async () => {
		const user = await getUser();
		return { user };
	},
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "url.space",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
});

function NotFound() {
	return (
		<main>
			<h1>404</h1>
			<p>Page not found</p>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<div className="app">
					<div className="app__header">
						<Header />
					</div>
					<div className="app__main">{children}</div>
					<div className="app__footer">
						<Footer />
					</div>
				</div>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
