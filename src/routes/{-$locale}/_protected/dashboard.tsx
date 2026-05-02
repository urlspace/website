import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Resource = {
	id: string;
	title: string;
	description: string;
	url: string;
	createdAt: string;
	updatedAt: string;
};

export const Route = createFileRoute("/{-$locale}/_protected/dashboard")({
	component: Dashboard,
});

const content = {
	en: {
		signOut: "Sign out",
		title: "Dashboard",
		username: "Username",
		displayName: "Display name",
		email: "Email",
		pro: "Pro",
		admin: "Admin",
		yes: "Yes",
		no: "No",
		memberSince: "Member since",
		addResource: "Add resource",
		resourceTitle: "Title",
		resourceDescription: "Description",
		resourceUrl: "URL",
		add: "Add",
		resources: "Resources",
		empty: "No resources yet.",
		failed: (status: number) => `Failed: ${status}`,
	},
	pl: {
		signOut: "Wyloguj się",
		title: "Panel",
		username: "Nazwa użytkownika",
		displayName: "Nazwa wyświetlana",
		email: "E-mail",
		pro: "Pro",
		admin: "Administrator",
		yes: "Tak",
		no: "Nie",
		memberSince: "Członek od",
		addResource: "Dodaj zasób",
		resourceTitle: "Tytuł",
		resourceDescription: "Opis",
		resourceUrl: "URL",
		add: "Dodaj",
		resources: "Zasoby",
		empty: "Brak zasobów.",
		failed: (status: number) => `Nie powiodło się: ${status}`,
	},
};

function Dashboard() {
	const { user } = useLoaderData({ from: "/{-$locale}/_protected" });
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	const [links, setLinks] = useState<Resource[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("http://localhost:3000/v1/links", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((json) => setLinks(json.data ?? []))
			.catch(() => setError(t.failed(0)));
	}, [t]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const form = new FormData(e.currentTarget);

		const res = await fetch("http://localhost:3000/v1/links", {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				title: form.get("title"),
				description: form.get("description"),
				url: form.get("url"),
			}),
		});

		if (!res.ok) {
			setError(t.failed(res.status));
			return;
		}

		const json = await res.json();
		setLinks((prev) => [json.data, ...prev]);
		e.currentTarget.reset();
	}

	const router = useRouter();
	async function handleSignOut() {
		const res = await fetch("http://localhost:3000/v1/auth/signout", {
			method: "POST",
			credentials: "include",
		});

		if (res.ok) {
			await router.invalidate();
			router.navigate({ to: "/{-$locale}/auth/signin", params: { locale } });
		}
	}

	return (
		<main>
			<button type="button" onClick={handleSignOut}>
				{t.signOut}
			</button>
			<section>
				<h1>{t.title}</h1>
				<p>
					{t.username}: {user.username}
				</p>
				<p>
					{t.displayName}: {user.displayName}
				</p>
				<p>
					{t.email}: {user.email}
				</p>
				<p>
					{t.pro}: {user.isPro ? t.yes : t.no}
				</p>
				<p>
					{t.admin}: {user.isAdmin ? t.yes : t.no}
				</p>
				<p>
					{t.memberSince}:{" "}
					{new Date(user.createdAt).toLocaleDateString(
						locale === "pl" ? "pl-PL" : "en-US",
					)}
				</p>
			</section>

			<section>
				<h2>{t.addResource}</h2>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						{t.resourceTitle}
						<input name="title" required />
					</label>
					<label>
						{t.resourceDescription}
						<input name="description" required />
					</label>
					<label>
						{t.resourceUrl}
						<input name="url" type="url" required />
					</label>
					<button type="submit">{t.add}</button>
				</form>
			</section>

			<hr />

			<section>
				<h2>{t.resources}</h2>
				{links.length === 0 && <p>{t.empty}</p>}
				<ul>
					{links.map((r) => (
						<li key={r.id}>
							<a href={r.url}>{r.title}</a> — {r.description}
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
