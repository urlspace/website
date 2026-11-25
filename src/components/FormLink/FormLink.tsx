import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { collectionsQueryOptions } from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { tagsQueryOptions } from "#/queries/tags.ts";

import Form, { type SubmitHelpers } from "../Form/Form.tsx";

// Mirrors the backend's ValidateURL: only http/https, no embedded credentials.
function isValidLinkUrl(value: string): boolean {
	try {
		const parsed = new URL(value);
		return (
			(parsed.protocol === "http:" || parsed.protocol === "https:") &&
			!parsed.username &&
			!parsed.password
		);
	} catch {
		return false;
	}
}

function normalizeName(name: string) {
	return name.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

// Select value for "New collection"; collection ids are UUIDs, so it can't clash.
const newCollectionValue = "new";

type LinkMetadata = {
	title: string;
	description: string;
};

const typingIntervalMs = 2;

// Types `value` into a field one character every `typingIntervalMs` for its first 100
// characters (wider fields show about that many), then sets the rest at once.
// Each step only writes while the field still holds the previous step, so a user
// typing into the field stops it.
function typeInto(
	setValue: React.Dispatch<React.SetStateAction<string>>,
	value: string,
	signal: AbortSignal,
): Promise<void> {
	const chars = Array.from(value);
	let written = "";

	function write(next: string) {
		const previous = written;
		written = next;
		setValue((current) =>
			current === previous || !current.trim() ? next : current,
		);
	}

	return new Promise((resolve) => {
		if (!value || signal.aborted) {
			resolve();
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			write(value);
			resolve();
			return;
		}

		const start = performance.now();
		function frame(now: number) {
			if (signal.aborted) {
				resolve();
				return;
			}
			const count = Math.floor((now - start) / typingIntervalMs);
			if (count >= Math.min(chars.length, 100)) {
				write(value);
				resolve();
				return;
			}
			write(chars.slice(0, count).join(""));
			requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	});
}

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
	collectionId,
}: {
	onClose: () => void;
	collections: Array<{
		id: string;
		name: string;
		public: boolean;
		password: string | null;
	}>;
	tags: Array<{
		id: string;
		name: string;
	}>;
	link?: LinkRow;
	collectionId?: string;
}) {
	const queryClient = useQueryClient();
	const {
		data: { stats },
	} = useSuspenseQuery(meQueryOptions);
	const isEdit = !!link;

	const linkLimitError =
		"You've reached the link limit on a free account. Delete some links or upgrade your account.";
	const tagLimitError =
		"You've reached the tag limit on a free account. Use existing tags, delete unused ones, or upgrade your account.";
	const collectionLimitError =
		"You've reached the collection limit on a free account. Delete a collection or upgrade your account.";
	const duplicateCollectionError =
		"You already have a collection with that name.";
	const canAddCollection =
		stats.collectionsLimit === null ||
		stats.collectionsCount < stats.collectionsLimit;

	const [title, setTitle] = useState(link?.title ?? "");
	const [url, setUrl] = useState(link?.url ?? "");
	const [description, setDescription] = useState(link?.description ?? "");
	const [collection, setCollection] = useState(
		link?.collection?.id ?? collectionId ?? "",
	);
	const [newCollectionName, setNewCollectionName] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>(
		link?.tags.map((t) => t.name) ?? [],
	);
	const [favourite, setFavourite] = useState(link?.favourite ?? false);
	const [forLater, setForLater] = useState(link?.forLater ?? false);
	const [isFetching, setIsFetching] = useState(false);
	const [previewStatus, setPreviewStatus] = useState("");
	const previewAbortRef = useRef<AbortController | null>(null);
	const previewRef = useRef<LinkMetadata | null>(null);
	// The URL of the last preview, so leaving the field again doesn't refetch
	// it. Starts at the saved URL, so editing a link only fetches a new one.
	const lastPreviewedUrlRef = useRef<string | null>(link?.url ?? null);
	// Whether a field holds the user's own text, which the preview leaves
	// alone. Only user typing goes through the inputs' onChange.
	const editedRef = useRef({ title: false, description: false });
	// The collection created by a submit whose link save then failed, so a
	// retry with the same name reuses it instead of creating it again.
	const createdCollectionRef = useRef<{ name: string; id: string } | null>(
		null,
	);

	useEffect(() => {
		return () => {
			previewAbortRef.current?.abort();
		};
	}, []);

	function previewUrl(text: string) {
		const target = text.trim();
		if (!isValidLinkUrl(target) || (title.trim() && description.trim())) {
			return;
		}

		lastPreviewedUrlRef.current = target;
		editedRef.current = {
			title: !!title.trim(),
			description: !!description.trim(),
		};
		previewAbortRef.current?.abort();
		const controller = new AbortController();
		previewAbortRef.current = controller;
		previewRef.current = null;
		setPreviewStatus("");
		setIsFetching(true);

		void fetch(`${import.meta.env.VITE_API_URL}/tools/metadata`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ url: target }),
			signal: controller.signal,
		})
			.then(async (res) => {
				// Any failure leaves the fields for the user to fill in, and lets
				// leaving the URL field try again.
				if (!res.ok) {
					if (previewAbortRef.current === controller) {
						lastPreviewedUrlRef.current = null;
					}
					return;
				}
				const preview = ((await res.json()) as { data: LinkMetadata }).data;
				if (controller.signal.aborted) {
					return;
				}
				previewRef.current = preview;
				await typeInto(setTitle, preview.title, controller.signal);
				await typeInto(setDescription, preview.description, controller.signal);
				if (!controller.signal.aborted) {
					const titleFilled = preview.title && !editedRef.current.title;
					const descriptionFilled =
						preview.description && !editedRef.current.description;
					if (titleFilled && descriptionFilled) {
						setPreviewStatus("Title and description filled in.");
					} else if (titleFilled) {
						setPreviewStatus("Title filled in.");
					} else if (descriptionFilled) {
						setPreviewStatus("Description filled in.");
					}
				}
			})
			.catch(() => {
				if (
					!controller.signal.aborted &&
					previewAbortRef.current === controller
				) {
					lastPreviewedUrlRef.current = null;
				}
			})
			.finally(() => {
				if (previewAbortRef.current === controller) {
					previewRef.current = null;
					setIsFetching(false);
				}
			});
	}

	async function handleSubmit({ setError }: SubmitHelpers) {
		// A running preview animation leaves only part of the text in the fields.
		const preview = previewRef.current;
		previewAbortRef.current?.abort();
		const submittedTitle = preview?.title.startsWith(title)
			? preview.title
			: title;
		const submittedDescription = preview?.description.startsWith(description)
			? preview.description
			: description;
		if (preview) {
			setTitle(submittedTitle);
			setDescription(submittedDescription);
		}

		if (!isValidLinkUrl(url)) {
			setError(
				"URL must start with http:// or https:// and contain no credentials.",
			);
			return;
		}

		const trimmedTitle = submittedTitle.trim();
		if (trimmedTitle.length < 3) {
			setError("Title must be at least 3 characters.");
			return;
		}

		if (
			!isEdit &&
			stats.linksLimit !== null &&
			stats.linksCount >= stats.linksLimit
		) {
			setError(linkLimitError);
			return;
		}

		const newTags = selectedTags.filter(
			(name) => !tags.some((tag) => tag.name === name),
		);
		const newTagsCount = newTags.length;

		if (
			stats.tagsLimit !== null &&
			newTagsCount > 0 &&
			stats.tagsCount + newTagsCount > stats.tagsLimit
		) {
			const remaining = Math.max(stats.tagsLimit - stats.tagsCount, 0);
			setError(
				`${newTags.join(", ")} ${newTagsCount === 1 ? "is a new tag" : "are new tags"}, but you can create only ${remaining} more on a free account (${stats.tagsCount}/${stats.tagsLimit}). Use existing tags, delete unused ones, or upgrade your account.`,
			);
			return;
		}

		const trimmedCollectionName = newCollectionName.trim();
		const createdCollection =
			createdCollectionRef.current &&
			normalizeName(createdCollectionRef.current.name) ===
				normalizeName(trimmedCollectionName)
				? createdCollectionRef.current
				: null;
		if (collection === newCollectionValue && !createdCollection) {
			if (trimmedCollectionName.length < 2) {
				setError("Collection name must be at least 2 characters.");
				return;
			}
			if (
				collections.some(
					(c) => normalizeName(c.name) === normalizeName(trimmedCollectionName),
				)
			) {
				setError(duplicateCollectionError);
				return;
			}
		}

		setError(null);

		try {
			let collectionId = collection;
			if (collection === newCollectionValue && createdCollection) {
				collectionId = createdCollection.id;
			} else if (collection === newCollectionValue) {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
					method: "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						name: trimmedCollectionName,
						description: "",
						public: false,
						slug: crypto.randomUUID(),
					}),
				});

				// Reload so the route guard can clear the invalid session and cached data.
				if (
					res.status === 401 &&
					((await res.clone().json()) as { data: string }).data ===
						"unauthorized"
				) {
					window.location.reload();
					return;
				}

				if (!res.ok) {
					switch (res.status) {
						case 400:
							setError("Incorrect body.");
							break;
						case 409:
							setError(duplicateCollectionError);
							break;
						case 403:
							setError(
								((await res.json()) as { data: string }).data ===
									"collection limit reached"
									? collectionLimitError
									: "Something went wrong. Try again in a moment.",
							);
							break;
						case 429:
							setError("Too many attempts. Try again in a moment.");
							break;
						default:
							setError("Something went wrong. Try again in a moment.");
					}
					return;
				}

				collectionId = ((await res.json()) as { data: { id: string } }).data.id;
				createdCollectionRef.current = {
					name: trimmedCollectionName,
					id: collectionId,
				};
			}

			const res = await fetch(
				isEdit
					? `${import.meta.env.VITE_API_URL}/links/${link.id}`
					: `${import.meta.env.VITE_API_URL}/links`,
				{
					method: isEdit ? "PUT" : "POST",
					credentials: "include",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						title: trimmedTitle,
						url,
						description: submittedDescription.trim(),
						collectionId: collectionId || null,
						tags: selectedTags,
						favourite,
						forLater,
					}),
				},
			);

			// Reload so the route guard can clear the invalid session and cached data.
			if (
				res.status === 401 &&
				((await res.clone().json()) as { data: string }).data === "unauthorized"
			) {
				window.location.reload();
				return;
			}

			if (!res.ok) {
				switch (res.status) {
					case 400:
						setError("Incorrect body.");
						break;
					case 403: {
						const message = ((await res.json()) as { data: string }).data;
						if (message === "link limit reached") {
							setError(linkLimitError);
						} else if (message === "tag limit reached") {
							setError(tagLimitError);
						} else {
							setError("Something went wrong. Try again in a moment.");
						}
						break;
					}
					case 429:
						setError("Too many attempts. Try again in a moment.");
						break;
					default:
						setError("Something went wrong. Try again in a moment.");
				}
				return;
			}

			const previousTags = link?.tags.map((tag) => tag.name) ?? [];
			const tagsChanged =
				previousTags.length !== selectedTags.length ||
				previousTags.some((name) => !selectedTags.includes(name));
			const collectionChanged = (link?.collection?.id ?? "") !== collectionId;

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				tagsChanged
					? queryClient.invalidateQueries({
							queryKey: tagsQueryOptions.queryKey,
						})
					: null,
				collectionChanged
					? queryClient.invalidateQueries({
							queryKey: collectionsQueryOptions.queryKey,
						})
					: null,
				isEdit && newTagsCount === 0 && collection !== newCollectionValue
					? null
					: queryClient.invalidateQueries({
							queryKey: meQueryOptions.queryKey,
						}),
			]);

			onClose();
		} catch {
			setError("Something went wrong. Try again in a moment.");
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<output className="visually-hidden">
				{isFetching ? "Fetching title and description…" : previewStatus}
			</output>
			<Form.Input
				label="URL"
				name="url"
				onBlur={() => {
					// Switching tab or app also blurs the field, often mid-typing.
					if (
						!document.hasFocus() ||
						url.trim() === lastPreviewedUrlRef.current
					) {
						return;
					}
					previewUrl(url);
				}}
				onChange={setUrl}
				onDrop={(e) => {
					previewUrl(e.dataTransfer.getData("text"));
				}}
				onPaste={(e) => {
					previewUrl(e.clipboardData.getData("text"));
				}}
				placeholder="https://alistapart.com/article/responsive-web-design/"
				required
				type="url"
				value={url}
				maxLength={2048}
			/>
			<Form.Input
				label="Title"
				name="title"
				onChange={(value) => {
					editedRef.current.title = true;
					setTitle(value);
				}}
				placeholder={isFetching ? "Fetching title…" : "Responsive Web Design"}
				required
				type="text"
				value={title}
				minLength={3}
				maxLength={255}
				pattern="[^\p{Cc}]{3,255}"
			/>
			<Form.Input
				label="Description"
				name="description-link"
				onChange={(value) => {
					editedRef.current.description = true;
					setDescription(value);
				}}
				placeholder={
					isFetching
						? "Fetching description…"
						: "Ethan Marcotte advocates we shift our design thinking to appropriate these constraints: using fluid grids, flexible images, and media queries."
				}
				type="text"
				value={description}
				maxLength={512}
				pattern="[^\p{Cc}]{0,512}"
			/>
			{collections.length > 0 || canAddCollection ? (
				<Form.Select
					label="Collection"
					name="collection"
					onChange={setCollection}
					value={collection}
					options={[
						collections.filter((c) => !c.public),
						collections.filter((c) => c.public && c.password === null),
						collections.filter((c) => c.password !== null),
						canAddCollection
							? [{ name: "New collection", id: newCollectionValue }]
							: [],
					]
						.filter((group) => group.length > 0)
						.flatMap((group) => [
							"hr" as const,
							...group.map((c) => ({ name: c.name, value: c.id })),
						])}
					placeholder="No collection"
				/>
			) : null}
			{collection === newCollectionValue ? (
				<Form.Input
					label="New collection name"
					name="new-collection-name"
					onChange={setNewCollectionName}
					placeholder="Keto recipes"
					required
					type="text"
					value={newCollectionName}
					minLength={2}
					maxLength={128}
					pattern="[^\p{Cc}]{2,128}"
				/>
			) : null}
			<Form.TagsInput
				label="Tags"
				name="tags"
				placeholder="design"
				value={selectedTags}
				onChange={setSelectedTags}
				options={tags.map((tag) => tag.name)}
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
