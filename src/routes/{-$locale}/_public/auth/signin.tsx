import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/{-$locale}/_public/auth/signin")({
	beforeLoad: ({ context, params }) => {
		if (context.hasSession)
			throw redirect({
				to: "/{-$locale}/dashboard",
				params: { locale: params.locale },
			});
	},
	component: SignIn,
});

const content = {
	en: {
		title: "Sign in",
		email: "Email",
		password: "Password",
		submit: "Sign in",
		submitting: "Signing in…",
		failed: (status: number) => `Sign in failed: ${status}`,
	},
	pl: {
		title: "Zaloguj się",
		email: "Email",
		password: "Hasło",
		submit: "Zaloguj się",
		submitting: "Logowanie…",
		failed: (status: number) => `Nie udało się zalogować: ${status}`,
	},
};

function SignIn() {
	const router = useRouter();
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
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
				setError(t.failed(res.status));
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
				<h1>{t.title}</h1>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<label>
						{t.email}
						<input name="email" type="email" required />
					</label>
					<label>
						{t.password}
						<input name="password" type="password" required />
					</label>
					<button type="submit" disabled={isLoading}>
						{isLoading ? t.submitting : t.submit}
					</button>
				</form>
			</section>
		</main>
	);
}
