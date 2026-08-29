import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { linksQueryKey } from "#/queries/links.ts";
import { tagsQueryOptions } from "#/queries/tags.ts";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

// Mirrors the backend's tag name rule: lowercase letters/digits/hyphens,
// 2-50 chars, no leading/trailing or consecutive hyphens. Each hyphen must
// be followed by an alnum run, so "-tag", "tag-", "ta--g" can't match.
const tagNamePattern = "(?=.{2,50}$)[a-z0-9]+(-[a-z0-9]+)*";

function FormTag({
	onClose,
	tag,
	tags,
}: {
	onClose: () => void;
	tag: {
		id: string;
		name: string;
	};
	tags: Array<{
		id: string;
		name: string;
	}>;
}) {
	const queryClient = useQueryClient();
	const duplicateNameError = "You already have a tag with that name.";

	const [name, setName] = useState(tag.name);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		// Catch duplicate names, but allow keeping the existing tag name.
		if (
			tags.some(
				(t) =>
					t.id !== tag.id && t.name.toLowerCase() === name.trim().toLowerCase(),
			)
		) {
			setError(duplicateNameError);
			return;
		}

		setError(null);
		setLoading(true);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/tags/${tag.id}`,
				{
					method: "PUT",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: name.trim() }),
				},
			);

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Incorrect body.");
						break;
					case 409:
						setError(duplicateNameError);
						break;
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey }),
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
			]);

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
				label="Tag name"
				name="tag-name"
				onChange={setName}
				placeholder="keto-diet"
				required
				type="text"
				value={name}
				minLength={2}
				maxLength={50}
				pattern={tagNamePattern}
				description="Lowercase letters, numbers, and hyphens only. Between 2 and 50 characters."
			/>
			<Form.Submit text="Save changes" textLoading="Saving..." />
		</Form>
	);
}

export default FormTag;
