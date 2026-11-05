import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { collectionsQueryOptions } from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { meQueryOptions } from "#/queries/me.ts";
import { getLinkPreview, type LinkPreview } from "#/queries/preview.ts";
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
	const {
		data: { stats },
	} = useSuspenseQuery(meQueryOptions);
	const isEdit = !!link;

	const linkLimitError =
		"You've reached the link limit on a free account. Delete some links or upgrade your account.";
	const tagLimitError =
		"You've reached the tag limit on a free account. Use existing tags, delete unused ones, or upgrade your account.";

	const [title, setTitle] = useState(link?.title ?? "");
	const [url, setUrl] = useState(link?.url ?? "");
	const [description, setDescription] = useState(link?.description ?? "");
	const [collection, setCollection] = useState(link?.collection?.id ?? "");
	const [selectedTags, setSelectedTags] = useState<string[]>(
		link?.tags.map((t) => t.name) ?? [],
	);
	const [favourite, setFavourite] = useState(link?.favourite ?? false);
	const [forLater, setForLater] = useState(link?.forLater ?? false);
	const [isFetching, setIsFetching] = useState(false);
	const [previewStatus, setPreviewStatus] = useState("");
	const previewAbortRef = useRef<AbortController | null>(null);
	const previewRef = useRef<LinkPreview | null>(null);

	useEffect(() => {
		return () => {
			previewAbortRef.current?.abort();
		};
	}, []);

	function previewUrl(text: string) {
		const pasted = text.trim();
		if (!isValidLinkUrl(pasted) || (title.trim() && description.trim())) {
			return;
		}
		const titleWasEmpty = !title.trim();
		const descriptionWasEmpty = !description.trim();

		previewAbortRef.current?.abort();
		const controller = new AbortController();
		previewAbortRef.current = controller;
		previewRef.current = null;
		setPreviewStatus("");
		setIsFetching(true);

		void getLinkPreview({ data: pasted, signal: controller.signal })
			.then(async (preview) => {
				if (controller.signal.aborted) {
					return;
				}
				previewRef.current = preview;
				await typeInto(setTitle, preview.title, controller.signal);
				await typeInto(setDescription, preview.description, controller.signal);
				if (!controller.signal.aborted) {
					const titleFilled = titleWasEmpty && preview.title;
					const descriptionFilled = descriptionWasEmpty && preview.description;
					if (titleFilled && descriptionFilled) {
						setPreviewStatus("Title and description filled in.");
					} else if (titleFilled) {
						setPreviewStatus("Title filled in.");
					} else if (descriptionFilled) {
						setPreviewStatus("Description filled in.");
					}
				}
			})
			.catch(() => {})
			.finally(() => {
				if (previewAbortRef.current === controller) {
					previewRef.current = null;
					setIsFetching(false);
				}
			});
	}

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

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
						title: trimmedTitle,
						url,
						description: submittedDescription.trim(),
						collectionId: collection || null,
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
			const collectionChanged = (link?.collection?.id ?? "") !== collection;

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
				isEdit && newTagsCount === 0
					? null
					: queryClient.invalidateQueries({
							queryKey: meQueryOptions.queryKey,
						}),
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
			<output className="visually-hidden">
				{isFetching ? "Fetching title and description…" : previewStatus}
			</output>
			<Form.Input
				label="URL"
				name="url"
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
				onChange={setTitle}
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
				onChange={setDescription}
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
			{collections.length > 0 ? (
				<Form.Select
					label="Collection"
					name="collection"
					onChange={setCollection}
					value={collection}
					options={collections.map((c) => ({ name: c.name, value: c.id }))}
					placeholder="No collection"
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
