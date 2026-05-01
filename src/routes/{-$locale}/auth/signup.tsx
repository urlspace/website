import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/{-$locale}/auth/signup")({
	beforeLoad: ({ context, params }) => {
		if (context.user)
			throw redirect({
				to: "/{-$locale}/dashboard",
				params: { locale: params.locale },
			});
	},
	component: SignUp,
});

function SignUp() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const form = new FormData(e.currentTarget);

		try {
			const res = await fetch("http://localhost:3000/v1/auth/signup", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					username: form.get("username"),
					email: form.get("email"),
					password: form.get("password"),
				}),
			});
			if (!res.ok) {
				setError(`Signup failed: ${res.status}`);
				return;
			}

			setSuccess(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setLoading(false);
		}
	}

	if (loading) return <p>Signing up…</p>;
	if (error) return <p>Error: {error}</p>;

	if (success)
		return <p>Account created! Check your email for a verification link.</p>;

	return (
		<main>
			<section>
				<h1>Sign up</h1>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						Username
						<input name="username" required />
					</label>
					<label>
						Email
						<input name="email" type="email" required />
					</label>
					<label>
						Password
						<input name="password" type="password" required />
					</label>
					<button type="submit">Sign up</button>
				</form>
			</section>
		</main>
	);
}
