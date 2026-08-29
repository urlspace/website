import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Form, Heading, Page, Stack } from "#/components";
import type { SubmitHelpers } from "#/components/Form/Form";

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
	const [done, setDone] = useState(false);
	const [email, setEmail] = useState("");

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);

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
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			setDone(true);
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Page narrow>
			<Stack gap={2}>
				<Heading level={1} text="Request password reset" />
				{done ? (
					<p role="status">
						Sent! Check your inbox and click the link within the next hour to
						set a new password.
					</p>
				) : (
					<Form onSubmit={handleSubmit}>
						<Form.Input
							autoComplete="email"
							label="Email"
							maxLength={254}
							name="email"
							onChange={setEmail}
							pattern="[^\s@]{1,64}@[^\s@]+\.[^\s@]+"
							placeholder="sylvester@stallone.com"
							required
							type="email"
							value={email}
						/>
						<Form.Submit text="Send reset link" textLoading="Sending..." />
					</Form>
				)}
			</Stack>
		</Page>
	);
}
