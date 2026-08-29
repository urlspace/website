import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { linksQueryKey } from "#/queries/links.ts";
import { tagsQueryOptions } from "#/queries/tags.ts";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";

type LinkRow = {
	id: string;
	title: string;
	description: string;
	url: string;
	tags: Array<{ id: string; name: string }>;
	collection: { id: string; name: string } | null;
	favourite: boolean;
	forLater: boolean;
};

function FormLink({
	onClose,
	collections,
	tags,
	link,
}: {
	onClose: () => void;
	collections: Array<{
		id: string;
		name: string;
	}>;
	tags: Array<{
		id: string;
		name: string;
	}>;
	link?: LinkRow;
}) {
	const queryClient = useQueryClient();
	const isEdit = !!link;

	const [title, setTitle] = useState(link?.title ?? "");
	const [url, setUrl] = useState(link?.url ?? "");
	const [description, setDescription] = useState(link?.description ?? "");
	const [collection, setCollection] = useState(link?.collection?.id ?? "");
	const [selectedTags, setSelectedTags] = useState<string[]>(
		link?.tags.map((t) => t.name) ?? [],
	);
	const [favourite, setFavourite] = useState(link?.favourite ?? false);
	const [forLater, setForLater] = useState(link?.forLater ?? false);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		setError(null);
		setLoading(true);

		try {
			const res = await fetch(
				isEdit
					? `${import.meta.env.VITE_API_URL}/links/${link.id}`
					: `${import.meta.env.VITE_API_URL}/links`,
				{
					method: isEdit ? "PUT" : "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						title,
						url,
						description: description.trim(),
						collectionId: collection || null,
						tags: selectedTags,
						favourite,
						forLater,
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
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey }),
			]);

			if (!isEdit) {
				setTitle("");
				setUrl("");
				setDescription("");
				setCollection("");
				setSelectedTags([]);
				setFavourite(false);
				setForLater(false);
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
				label="Title"
				name="title"
				onChange={setTitle}
				placeholder="Boo"
				required
				type="text"
				value={title}
				minLength={3}
				maxLength={255}
			/>
			<Form.Input
				label="URL"
				name="url"
				onChange={setUrl}
				placeholder="https://cloudflare.com"
				required
				type="url"
				value={url}
				maxLength={2048}
			/>
			<Form.Input
				label="Description"
				name="description-link"
				onChange={setDescription}
				placeholder="What a cool description"
				type="text"
				value={description}
				maxLength={512}
			/>
			<Form.Combobox
				label="Collection"
				name="collection"
				onChange={setCollection}
				value={collection}
				options={[...collections.map((c) => ({ name: c.name, value: c.id }))]}
				placeholder="Select a collection"
			/>
			<Form.TagsInput
				label="Tags"
				name="tags"
				onChange={setSelectedTags}
				value={selectedTags}
				options={tags.map((t) => t.name)}
				placeholder="Add up to 10 tags"
			/>
			<Form.Row>
				<Form.Checkbox
					label="Favourite"
					name="favourite"
					onChange={setFavourite}
					value={favourite}
				/>
				<Form.Checkbox
					label="For later"
					name="forlater"
					onChange={setForLater}
					value={forLater}
				/>
			</Form.Row>
			<Form.Submit
				text={isEdit ? "Save changes" : "Add new link"}
				textLoading={isEdit ? "Saving..." : "Adding..."}
			/>
		</Form>
	);
}

export default FormLink;
