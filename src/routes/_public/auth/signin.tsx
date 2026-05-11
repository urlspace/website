import {
	createFileRoute,
	Link,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button, Form, Heading, Page, Stack } from "#/components";

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
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		setError(null);
		setIsLoading(true);

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
				form.focus();
				return;
			}

			await router.invalidate();
			router.navigate({ to: "/dashboard" });
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
				<Heading level={1} text="Sign in" />
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
					<Form.Input
						autoComplete="current-password"
						disabled={isLoading}
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
					<Button
						type="submit"
						text={isLoading ? "Signing in..." : "Sign in"}
						disabled={isLoading}
					/>
				</Form>
				<p>
					If you forgot your password, go to the{" "}
					<Link to="/auth/reset-password">password reset page</Link>. For other
					sign-in trouble, email me at{" "}
					<a href="mailto:mail@url.space">mail@url.space</a>.
				</p>
			</Stack>
		</Page>
	);
}
