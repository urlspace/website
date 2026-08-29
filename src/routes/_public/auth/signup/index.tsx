import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Form, Heading, Page, Stack } from "#/components";
import type { SubmitHelpers } from "#/components/Form/Form";

const minContextualLen = 4;

function containsContext(password: string, ...values: string[]): boolean {
	const p = password.toLowerCase();
	return values.some((v) => {
		const trimmed = v.trim().toLowerCase();
		return trimmed.length >= minContextualLen && p.includes(trimmed);
	});
}

export const Route = createFileRoute("/_public/auth/signup/")({
	beforeLoad: ({ context }) => {
		if (context.hasSession)
			throw redirect({
				to: "/dashboard",
			});
	},
	component: SignUp,
	head: () => ({
		meta: [
			{
				title: "Sign up | url.space",
			},
		],
	}),
});

function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [done, setDone] = useState(false);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);

		const emailLocalPart = email.split("@")[0] ?? "";
		if (containsContext(password, username, emailLocalPart)) {
			setError("Password cannot contain your username or email.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					username,
					email,
					password,
				}),
			});

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Please check your input and try again.");
						break;
					case 409:
						setError("An account with this username or email already exists.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
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
				<Heading level={1} text="Sign up" />
				{done ? (
					<p role="status">
						Check your inbox and confirm your email address within the next 24
						hours.
					</p>
				) : (
					<>
						<Form onSubmit={handleSubmit}>
							<Form.Input
								autoComplete="nickname"
								description="Use 3 to 32 lowercase letters or digits. Hyphens and underscores are also allowed, but not as a prefix or suffix."
								label="Username"
								maxLength={32}
								minLength={3}
								name="username"
								onChange={setUsername}
								pattern="[a-z0-9]([a-z0-9_\-]*[a-z0-9])?"
								placeholder="rocky"
								required
								type="text"
								value={username}
							/>
							<Form.Input
								autoComplete="username"
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
							<Form.Input
								autoComplete="new-password"
								description="Use a strong password that is a minimum of 12 characters long. Don't include parts of your email address or username in your password."
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
							<Form.Submit text="Sign up" textLoading="Signing up..." />
						</Form>

						<p>
							By signing up, you agree to our{" "}
							<Link to="/terms-of-service">Terms of Service</Link> and{" "}
							<Link to="/privacy-policy">Privacy Policy</Link>.
						</p>
					</>
				)}
			</Stack>
		</Page>
	);
}
