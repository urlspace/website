import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/{-$locale}/auth/signin")({
	beforeLoad: ({ context, params }) => {
		if (context.user)
			throw redirect({
				to: "/{-$locale}/dashboard",
				params: { locale: params.locale },
			});
	},
	component: SignIn,
});

function SignIn() {
	const router = useRouter();
	const { locale } = Route.useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		const form = new FormData(e.currentTarget);
		try {
			const res = await fetch("http://localhost:3000/v1/auth/signin", {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					email: form.get("email"),
					password: form.get("password"),
				}),
			});

			if (!res.ok) {
				setError(`Sign in failed: ${res.status}`);
				return;
			}

			await router.invalidate();
			router.navigate({ to: "/{-$locale}/dashboard", params: { locale } });
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main>
			<section>
				<h1>Sign in</h1>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						Email
						<input name="email" type="email" required />
					</label>
					<label>
						Password
						<input name="password" type="password" required />
					</label>
					<button type="submit" disabled={isLoading}>
						{isLoading ? "Signing in…" : "Sign in"}
					</button>
				</form>
			</section>
		</main>
	);
}
