import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import appCss from "../styles.css?url";

const checkSession = createServerFn().handler(() => ({
	hasSession: getCookie("session_id") !== undefined,
}));

export const Route = createRootRouteWithContext<{ hasSession: boolean }>()({
	beforeLoad: () => checkSession(),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
	errorComponent: GenericError,
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

function GenericError() {
	return (
		<main>
			<h1>Something went wrong</h1>
			<p>Please try again in a moment.</p>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
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
