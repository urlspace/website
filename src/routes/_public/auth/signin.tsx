import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Form, Heading, Page, Stack } from "#/components";
import type { SubmitHelpers } from "#/components/Form/Form";

export const Route = createFileRoute("/_public/auth/signin")({
	beforeLoad: ({ context }) => {
		if (context.hasSession)
			throw redirect({
				to: "/dashboard",
			});
	},
	component: SignIn,
	head: () => ({
		meta: [
			{
				title: "Sign in | url.space",
			},
		],
	}),
});

function SignIn() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!res.ok) {
				switch (res.status) {
					case 400:
					case 401:
						setError("Invalid email or password.");
						break;
					case 403:
						setError("Your account is not verified. Check your inbox.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			await router.invalidate();
			await router.navigate({ to: "/dashboard" });
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Page narrow>
			<Stack gap={2}>
				<Heading level={1} text="Sign in" />
				<Form onSubmit={handleSubmit}>
					<Form.Input
						autoComplete="username"
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
					<Form.Input
						autoComplete="current-password"
						label="Password"
						maxLength={128}
						minLength={12}
						name="password"
						onChange={setPassword}
						placeholder="Min 12 characters"
						required
						type="password"
						value={password}
					/>
					<Form.Submit text="Sign in" textLoading="Signing in..." />
				</Form>
				<p>
					If you forgot your password, go to the{" "}
					<Link to="/auth/reset-password">password reset page</Link>.
				</p>
			</Stack>
		</Page>
	);
}
