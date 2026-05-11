import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Form, Heading, Page, Stack } from "#/components";

export const Route = createFileRoute("/_public/auth/reset-password/")({
	beforeLoad: ({ context }) => {
		if (context.hasSession)
			throw redirect({
				to: "/dashboard",
			});
	},
	component: ResetPassword,
	head: () => ({
		meta: [
			{
				title: "Request password reset | url.space",
			},
		],
	}),
});

function ResetPassword() {
	const [sent, setSent] = useState(false);
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		setError(null);
		setIsLoading(true);

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/auth/reset-password-request`,
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						email,
					}),
				},
			);

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Invalid email.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				form.focus();
				return;
			}

			setSent(true);
		} catch {
			setError("Something went wrong. Try again in a moment.");
			form.focus();
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Page>
			<Stack gap={2}>
				<Heading level={1} text="Request password reset" />
				{sent ? (
					<p role="status">
						Sent! Check your inbox and click the link within the next hour to
						set a new password.
					</p>
				) : (
					<Form onSubmit={handleSubmit} isLoading={isLoading}>
						<Form.Error errorMessage={error} />
						<Form.Input
							autoComplete="username"
							disabled={isLoading}
							label="Email"
							maxLength={254}
							name="email"
							onChange={setEmail}
							pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
							placeholder="sylvester@stallone.com"
							required
							type="email"
							value={email}
						/>
						<Button
							disabled={isLoading}
							text={isLoading ? "Sending..." : "Send reset link"}
							type="submit"
						/>
					</Form>
				)}
			</Stack>
		</Page>
	);
}
