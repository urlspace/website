import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormDeleteAccount({ onClose }: { onClose: () => void }) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const [password, setPassword] = useState("");

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
				method: "DELETE",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Please check your input and try again.");
						break;
					case 401:
						setError("Incorrect password.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			onClose();
			queryClient.clear();
			await router.invalidate();
			await router.navigate({ to: "/" });
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<p>
				This will permanently delete your account and all your links, tags,
				collections, sessions, and access tokens. This cannot be undone.
			</p>

			<Form.Input
				autoComplete="current-password"
				description="Enter your current password to confirm account deletion."
				label="Current password"
				maxLength={128}
				minLength={12}
				name="password"
				onChange={setPassword}
				placeholder="Min 12 characters"
				required
				type="password"
				value={password}
			/>
			<Form.Submit text="Delete my account" textLoading="Deleting..." />
		</Form>
	);
}

export default FormDeleteAccount;
