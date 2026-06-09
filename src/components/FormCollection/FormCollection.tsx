import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function FormCollection({
	collection,
	collections,
	isPro,
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
	onClose: () => void;
}) {
	const queryClient = useQueryClient();
	const isEdit = !!collection;

	const [name, setName] = useState(collection?.name ?? "");
	const [description, setDescription] = useState(collection?.description ?? "");
	const [publicCollection, setPublicCollection] = useState(
		isPro ? (collection?.public ?? false) : false,
	);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		// Catch duplicate names, but allow editing the existing collection.
		if (
			collections.some(
				(c) =>
					c.id !== collection?.id &&
					c.name.toLowerCase() === name.trim().toLowerCase(),
			)
		) {
			setError("You already have a collection with that name.");
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
						name,
						description: description.trim(),
						public: publicCollection,
					}),
				},
			);

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Incorrect body.");
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
				queryClient.invalidateQueries({ queryKey: ["collections"] }),
				queryClient.invalidateQueries({ queryKey: ["links"] }),
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
				maxLength={255}
				pattern="[^\p{Cc}]{2,255}"
				description="Between 2 and 255 characters."
			/>

			<Form.Input
				label="Description"
				name="description-collection"
				onChange={setDescription}
				placeholder="What a cool description"
				type="text"
				value={description}
				maxLength={512}
				pattern="[^\p{Cc}]{0,512}"
				description="Up to 512 characters."
			/>

			<Form.Checkbox
				label="Public collection"
				name="public"
				onChange={setPublicCollection}
				value={publicCollection}
				disabled={!isPro}
				description={
					isPro ? null : (
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
