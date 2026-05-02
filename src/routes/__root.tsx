import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import appCss from "../styles.css?url";

const fallbackContent = {
	en: {
		notFoundTitle: "404",
		notFoundBody: "Page not found",
		errorTitle: "Something went wrong",
		errorBody: "Please try again in a moment.",
	},
	pl: {
		notFoundTitle: "404",
		notFoundBody: "Strona nie znaleziona",
		errorTitle: "Coś poszło nie tak",
		errorBody: "Spróbuj ponownie za chwilę.",
	},
};

function useFallbackLocale() {
	const { pathname } = useLocation();
	return pathname.startsWith("/pl/") || pathname === "/pl" ? "pl" : "en";
}

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
	const t = fallbackContent[useFallbackLocale()];
	return (
		<main>
			<h1>{t.notFoundTitle}</h1>
			<p>{t.notFoundBody}</p>
		</main>
	);
}

function GenericError() {
	const t = fallbackContent[useFallbackLocale()];
	return (
		<main>
			<h1>{t.errorTitle}</h1>
			<p>{t.errorBody}</p>
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
