import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Resource = {
	id: string;
	title: string;
	description: string;
	url: string;
	createdAt: string;
	updatedAt: string;
};

export const Route = createFileRoute("/{-$locale}/dashboard")({
	beforeLoad: ({ context, params }) => {
		if (!context.user)
			throw redirect({
				to: "/{-$locale}/auth/signin",
				params: { locale: params.locale },
			});
		return { user: context.user };
	},
	component: Dashboard,
});

function Dashboard() {
	const { user } = Route.useRouteContext();
	const [links, setLinks] = useState<Resource[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("http://localhost:3000/v1/links", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((json) => setLinks(json.data));
	}, []);

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
			setError(`Failed: ${res.status}`);
			return;
		}

		const json = await res.json();
		setLinks((prev) => [json.data, ...prev]);
		e.currentTarget.reset();
	}

	return (
		<main>
			<section>
				<h1>Dashboard</h1>
				<p>Username: {user.username}</p>
				<p>Display name: {user.displayName}</p>
				<p>Email: {user.email}</p>
				<p>Pro: {user.isPro ? "Yes" : "No"}</p>
				<p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
				<p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
			</section>

			<section>
				<h2>Add resource</h2>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						Title
						<input name="title" required />
					</label>
					<label>
						Description
						<input name="description" required />
					</label>
					<label>
						URL
						<input name="url" type="url" required />
					</label>
					<button type="submit">Add</button>
				</form>
			</section>

			<hr />

			<section>
				<h2>Resources</h2>
				{links.length === 0 && <p>No resources yet.</p>}
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
