import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { tokensQueryKey } from "#/queries/tokens.ts";
import { Button, Stack } from "..";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormToken({ onClose }: { onClose: () => void }) {
	const queryClient = useQueryClient();

	const [password, setPassword] = useState("");
	const [description, setDescription] = useState("");
	const [rawToken, setRawToken] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/tokens`, {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ password, description }),
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

			const json = (await res.json()) as { data: string };
			await queryClient.invalidateQueries({ queryKey: tokensQueryKey });
			setRawToken(json.data);
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	async function handleCopy() {
		if (!rawToken) return;
		await navigator.clipboard.writeText(rawToken);
		setCopied(true);
	}

	if (rawToken) {
		return (
			<Stack>
				<p>Copy this token now — you won't be able to see it again.</p>
				<code>{rawToken}</code>
				<Stack direction="row">
					<Button text={copied ? "Copied!" : "Copy"} onClick={handleCopy} />
					<Button text="Done" onClick={onClose} />
				</Stack>
				<span className="visually-hidden" role="status">
					{copied ? "Token copied." : ""}
				</span>
			</Stack>
		);
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Input
				autoComplete="off"
				description="A label to help you recognise this token later."
				label="Description"
				maxLength={255}
				name="description"
				onChange={setDescription}
				placeholder="e.g. CI pipeline"
				required
				type="text"
				value={description}
			/>
			<Form.Input
				autoComplete="current-password"
				description="Enter your current password to confirm this change."
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
			<Form.Submit text="Create token" textLoading="Creating..." />
		</Form>
	);
}

export default FormToken;
