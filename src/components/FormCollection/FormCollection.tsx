import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { collectionsQueryOptions } from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function normalizeName(name: string) {
	return name.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

function FormCollection({
	collection,
	collections,
	isPro,
	isAdmin,
	onClose,
}: {
	collection?: {
		id: string;
		name: string;
		description: string;
		public: boolean;
	};
	collections: Array<{
		id: string;
		name: string;
	}>;
	isPro: boolean;
	isAdmin: boolean;
	onClose: () => void;
}) {
	const queryClient = useQueryClient();
	const isEdit = !!collection;
	const canPublish = isPro || isAdmin;
	const duplicateNameError = "You already have a collection with that name.";

	const [name, setName] = useState(collection?.name ?? "");
	const [description, setDescription] = useState(collection?.description ?? "");
	const [publicCollection, setPublicCollection] = useState(
		canPublish ? (collection?.public ?? false) : false,
	);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		const trimmedName = name.trim();
		if (trimmedName.length < 2) {
			setError("Collection name must be at least 2 characters.");
			return;
		}

		// Catch duplicate names, but allow editing the existing collection.
		// Mirrors the API's case-insensitive check; the 409 catches edge cases.
		if (
			collections.some(
				(c) =>
					c.id !== collection?.id &&
					normalizeName(c.name) === normalizeName(trimmedName),
			)
		) {
			setError(duplicateNameError);
			return;
		}

		setError(null);
		setLoading(true);
		try {
			const res = await fetch(
				isEdit
					? `${import.meta.env.VITE_API_URL}/collections/${collection.id}`
					: `${import.meta.env.VITE_API_URL}/collections`,
				{
					method: isEdit ? "PUT" : "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						name: trimmedName,
						description: description.trim(),
						public: canPublish && publicCollection,
					}),
				},
			);

			// Reload so the route guard can clear the invalid session and cached data.
			if (res.status === 401 && ((await res.clone().json()) as { data: string }).data === "unauthorized") {
				window.location.reload();
				return;
			}

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
				queryClient.invalidateQueries({
					queryKey: collectionsQueryOptions.queryKey,
				}),
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
			]);

			if (!isEdit) {
				setName("");
				setDescription("");
				setPublicCollection(false);
			}
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
				label="Collection name"
				name="collection-name"
				onChange={setName}
				placeholder="Cats"
				required
				type="text"
				value={name}
				minLength={2}
				maxLength={128}
				pattern="[^\p{Cc}]{2,128}"
				description="Between 2 and 128 characters."
			/>

			<Form.Input
				label="Description"
				name="description-collection"
				onChange={setDescription}
				placeholder="What a cool description"
				type="text"
				value={description}
				maxLength={1024}
				pattern="[^\p{Cc}]{0,1024}"
				description="Up to 1024 characters."
			/>

			<Form.Checkbox
				label="Public collection"
				name="public"
				onChange={setPublicCollection}
				value={canPublish && publicCollection}
				disabled={!canPublish}
				description={
					canPublish ? null : (
						<>
							Available only to pro users. {
								// TODO: change to /upgrade when the page is ready
							}
							<Link to="/blog">Upgrade now</Link>.
						</>
					)
				}
			/>
			<Form.Submit
				text={isEdit ? "Save changes" : "Add new collection"}
				textLoading={isEdit ? "Saving..." : "Adding..."}
			/>
		</Form>
	);
}

export default FormCollection;
