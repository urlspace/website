import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(
	"/{-$locale}/_public/auth/resend-verification",
)({
	component: ResendVerification,
});

const content = {
	en: {
		title: "Resend verification email",
		email: "Email",
		submit: "Resend",
		success: "Verification email sent!",
		failed: (status: number) => `Failed: ${status}`,
	},
	pl: {
		title: "Wyślij ponownie e-mail weryfikacyjny",
		email: "Email",
		submit: "Wyślij ponownie",
		success: "E-mail weryfikacyjny wysłany!",
		failed: (status: number) => `Nie powiodło się: ${status}`,
	},
};

function ResendVerification() {
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const form = new FormData(e.currentTarget);

		try {
			const res = await fetch(
				"http://localhost:3000/v1/auth/resend-verification",
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ email: form.get("email") }),
				},
			);

			if (!res.ok) {
				setError(t.failed(res.status));
				return;
			}

			setSuccess(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	}

	if (success) return <p>{t.success}</p>;

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
					<button type="submit">{t.submit}</button>
				</form>
			</section>
		</main>
	);
}
