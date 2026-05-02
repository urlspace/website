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
	const res = await fetch("http://localhost:3000/v1/me", {
		headers: { cookie },
	});
	if (res.status === 401) return null;
	if (!res.ok) throw new Error(`/me failed: ${res.status}`);
	const json = (await res.json()) as { data: User };
	return json.data;
});

const clearSession = createServerFn({ method: "POST" }).handler(() => {
	deleteCookie("session_id", { path: "/" });
});

export const Route = createFileRoute("/{-$locale}/_protected")({
	beforeLoad: ({ context, params }) => {
		if (!context.hasSession)
			throw redirect({
				to: "/{-$locale}/auth/signin",
				params: { locale: params.locale },
			});
	},
	loader: async ({ params }) => {
		const user = await getUser();
		if (!user) {
			await clearSession();
			throw redirect({
				to: "/{-$locale}/auth/signin",
				params: { locale: params.locale },
			});
		}
		return { user };
	},
	staleTime: 5 * 60 * 1000,
	component: RouteComponent,
	errorComponent: GenericError,
	preload: false,
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}

const errorContent = {
	en: { title: "Something went wrong", body: "Please try again in a moment." },
	pl: { title: "Coś poszło nie tak", body: "Spróbuj ponownie za chwilę." },
};

function GenericError() {
	const { locale } = Route.useParams();
	const t = errorContent[locale === "pl" ? "pl" : "en"];
	return (
		<main>
			<h1>{t.title}</h1>
			<p>{t.body}</p>
		</main>
	);
}
