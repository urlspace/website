import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Form, Heading, Page, Stack } from "#/components";
import type { SubmitHelpers } from "#/components/Form/Form";

export const Route = createFileRoute("/_public/auth/resend-verification")({
	beforeLoad: ({ context }) => {
		if (context.hasSession)
			throw redirect({
				to: "/dashboard",
			});
	},
	component: ResendVerification,
	head: () => ({
		meta: [
			{
				title: "Resend verification | url.space",
			},
		],
	}),
});

function ResendVerification() {
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
				`${import.meta.env.VITE_API_URL}/auth/resend-verification`,
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
				<Heading level={1} text="Resend verification" />
				{done ? (
					<p role="status">
						Sent! Check your inbox and confirm your email address within the
						next 24 hours.
					</p>
				) : (
					<Form onSubmit={handleSubmit}>
						<Form.Input
							autoComplete="email"
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
						<Form.Submit
							text="Send verification link"
							textLoading="Sending..."
						/>
					</Form>
				)}
			</Stack>
		</Page>
	);
}
