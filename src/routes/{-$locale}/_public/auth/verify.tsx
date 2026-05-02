import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/{-$locale}/_public/auth/verify")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: search.token as string,
	}),
	component: Verify,
});

const content = {
	en: {
		verifying: "Verifying…",
		failed: "Verification failed.",
		resend: "Resend verification email",
		success: "Email verified!",
	},
	pl: {
		verifying: "Weryfikacja…",
		failed: "Weryfikacja nie powiodła się.",
		resend: "Wyślij ponownie e-mail weryfikacyjny",
		success: "E-mail zweryfikowany!",
	},
};

function Verify() {
	const { token } = Route.useSearch();
	const { locale } = Route.useParams();
	const t = content[locale === "pl" ? "pl" : "en"];
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);

	useEffect(() => {
		fetch("http://localhost:3000/v1/auth/verify", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ token }),
		})
			.then((res) => setStatus(res.ok ? "success" : "error"))
			.catch(() => setStatus("error"));
	}, [token]);

	if (status === "loading") return <p>{t.verifying}</p>;
	if (status === "error")
		return (
			<p>
				{t.failed}{" "}
				<Link to="/{-$locale}/auth/resend-verification" params={{ locale }}>
					{t.resend}
				</Link>
			</p>
		);
	return <p>{t.success}</p>;
}
