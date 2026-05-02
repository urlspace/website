import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/{-$locale}/_public/auth/signup")({
	beforeLoad: ({ context, params }) => {
		if (context.hasSession)
			throw redirect({
				to: "/{-$locale}/dashboard",
				params: { locale: params.locale },
			});
	},
	component: SignUp,
});

const content = {
	en: {
		title: "Sign up",
		username: "Username",
		email: "Email",
		password: "Password",
		submit: "Sign up",
		submitting: "Signing up…",
		success: "Account created! Check your email for a verification link.",
		failed: (status: number) => `Signup failed: ${status}`,
	},
	pl: {
		title: "Zarejestruj się",
		username: "Nazwa użytkownika",
		email: "Email",
		password: "Hasło",
		submit: "Zarejestruj się",
		submitting: "Rejestrowanie…",
		success:
			"Konto utworzone! Sprawdź skrzynkę e-mail i kliknij link aktywacyjny.",
		failed: (status: number) => `Rejestracja nie powiodła się: ${status}`,
	},
};

function SignUp() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
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
				setError(t.failed(res.status));
				return;
			}

			setSuccess(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setLoading(false);
		}
	}

	if (loading) return <p>{t.submitting}</p>;
	if (success) return <p>{t.success}</p>;

	return (
		<main>
			<section>
				<h1>{t.title}</h1>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						{t.username}
						<input name="username" required />
					</label>
					<label>
						{t.email}
						<input name="email" type="email" required />
					</label>
					<label>
						{t.password}
						<input name="password" type="password" required />
					</label>
					<button type="submit">{t.submit}</button>
				</form>
			</section>
		</main>
	);
}
