import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormDisplayName({
	onClose,
	displayName,
}: {
	onClose: () => void;
	displayName: string;
}) {
	const queryClient = useQueryClient();

	const [value, setValue] = useState(displayName);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/me/update-display-name`,
				{
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ displayName: value.trim() }),
				},
			);

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Please check your input and try again.");
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			await queryClient.invalidateQueries({ queryKey: ["me"] });

			onClose();
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Input
				autoComplete="nickname"
				label="Display name"
				name="display-name"
				onChange={setValue}
				placeholder="Rocky"
				required
				type="text"
				value={value}
				minLength={1}
				maxLength={50}
			/>
			<Form.Submit text="Save changes" textLoading="Saving..." />
		</Form>
	);
}

export default FormDisplayName;
