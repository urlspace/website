import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { sources } from "#/parsers/index.ts";
import type { ParsedBookmarks, ParsedCollection } from "#/parsers/types.ts";
import {
	type CollectionRow,
	collectionsQueryOptions,
} from "#/queries/collections.ts";
import { linksQueryKey } from "#/queries/links.ts";
import { type User, meQueryOptions } from "#/queries/me.ts";
import { type TagRow, tagsQueryOptions } from "#/queries/tags.ts";
import { slugify } from "#/utils.ts";

import CopyBox from "../CopyBox/CopyBox.tsx";
import Form, { type SubmitHelpers } from "../Form/Form.tsx";
import Manual from "../Manual/Manual.tsx";

function FormImport() {
	const queryClient = useQueryClient();
	const { data: existingCollections } = useSuspenseQuery(
		collectionsQueryOptions,
	);
	const { data: existingTags } = useSuspenseQuery(tagsQueryOptions);
	const {
		data: { stats },
	} = useSuspenseQuery(meQueryOptions);
	const [sourceId, setSourceId] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [parsed, setParsed] = useState<ParsedBookmarks | null>(null);
	const [imported, setImported] = useState<number | null>(null);

	async function parse(id: string, selected: File | null) {
		setImported(null);
		const source = sources.find((s) => s.id === id);
		if (!source || !selected) {
			setParsed(null);
			return;
		}
		const [{ default: parser }, text] = await Promise.all([
			source.load(),
			selected.text(),
		]);
		setParsed(parser(text));
	}

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();

		if (!parsed || parsed.links.length === 0) {
			setError("There are no links to import. Choose a different file.");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/tools/import`, {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					collections: withSlugs(parsed.collections, existingCollections),
					links: parsed.links,
				}),
			});

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
					case 409:
						setError(
							"One of the collections clashes with a collection created in the meantime. Try again.",
						);
						break;
					case 403: {
						const message = ((await res.json()) as { data: string }).data;
						if (message === "link limit reached") {
							setError(
								"This import would exceed the link limit on a free account. Remove some links from the file or upgrade your account.",
							);
						} else if (message === "collection limit reached") {
							setError(
								"This import would exceed the collection limit on a free account. Remove some folders from the file or upgrade your account.",
							);
						} else if (message === "tag limit reached") {
							setError(
								"This import would exceed the tag limit on a free account. Remove some tags from the file or upgrade your account.",
							);
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

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: linksQueryKey }),
				queryClient.invalidateQueries({
					queryKey: collectionsQueryOptions.queryKey,
				}),
				queryClient.invalidateQueries({ queryKey: tagsQueryOptions.queryKey }),
				queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey }),
			]);

			setImported(parsed.links.length);
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	const source = sources.find((s) => s.id === sourceId);

	if (imported !== null) {
		return (
			<p role="status">
				Imported {imported} {imported === 1 ? "link" : "links"}.
			</p>
		);
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Select
				label="Import from browser or service"
				name="source"
				onChange={(value) => {
					setSourceId(value);
					parse(value, file);
				}}
				value={sourceId}
				options={[
					...sources
						.filter((source) => source.kind === "browser")
						.map((source) => ({ name: source.label, value: source.id })),
					"hr",
					...sources
						.filter((source) => source.kind === "service")
						.map((source) => ({ name: source.label, value: source.id })),
				]}
				placeholder="Choose a source"
				required
			/>
			{source && source.steps.length > 0 ? (
				<Manual steps={source.steps} />
			) : null}
			{source?.address ? (
				<CopyBox value={source.address} label="Bookmarks page address" />
			) : null}
			{sourceId ? (
				<Form.FileInput
					label="Bookmarks file"
					name="file"
					accept=".html,.htm,text/html"
					onChange={(selected) => {
						setFile(selected);
						parse(sourceId, selected);
					}}
					required
				/>
			) : null}
			{parsed ? (
				<ImportAction
					parsed={parsed}
					stats={stats}
					existingCollections={existingCollections}
					existingTags={existingTags}
				/>
			) : null}
		</Form>
	);
}

function ImportAction({
	parsed,
	stats,
	existingCollections,
	existingTags,
}: {
	parsed: ParsedBookmarks;
	stats: User["stats"];
	existingCollections: Array<CollectionRow>;
	existingTags: Array<TagRow>;
}) {
	const existingCollectionNames = new Set(
		existingCollections.map((collection) => collection.name.toLowerCase()),
	);
	const existingTagNames = new Set(existingTags.map((tag) => tag.name));
	const newCollections = parsed.collections.filter(
		(collection) => !existingCollectionNames.has(collection.name.toLowerCase()),
	).length;
	const newTags = parsed.tags.filter(
		(tag) => !existingTagNames.has(tag),
	).length;

	const exceeded = [
		["links", parsed.links.length, stats.linksCount, stats.linksLimit],
		[
			"collections",
			newCollections,
			stats.collectionsCount,
			stats.collectionsLimit,
		],
		["tags", newTags, stats.tagsCount, stats.tagsLimit],
	] as const;
	const overLimit = exceeded.filter(
		([, added, count, limit]) =>
			limit !== null && added > 0 && count + added > limit,
	);

	if (overLimit.length === 0) {
		return <Form.Submit text={importText(parsed)} textLoading="Importing..." />;
	}

	const limited = exceeded.filter(([, , , limit]) => limit !== null);
	const limits = limited.map(([name, , , limit]) => `${limit} ${name}`);
	const totals = limited.map(
		([name, added, count]) => `${count + added} ${name}`,
	);

	return (
		<Form.Warning>
			Free account is limited to {listFormat.format(limits)}. Your import would
			exceed these limits ({totals.join(", ")}). Import a smaller collection or
			upgrade your account.
		</Form.Warning>
	);
}

const listFormat = new Intl.ListFormat("en-GB", {
	style: "long",
	type: "conjunction",
});

function withSlugs(
	collections: Array<ParsedCollection>,
	existing: Array<CollectionRow>,
) {
	const existingSlugs = new Map(
		existing.map((collection) => [
			collection.name.toLowerCase(),
			collection.slug,
		]),
	);
	const taken = new Set(existing.map((collection) => collection.slug));

	return collections.map((collection) => {
		const existingSlug = existingSlugs.get(collection.name.toLowerCase());
		if (existingSlug) {
			return { ...collection, slug: existingSlug };
		}

		if (collection.slug && !taken.has(collection.slug)) {
			taken.add(collection.slug);
			return { ...collection, slug: collection.slug };
		}

		let slug = slugify(collection.name);
		if (slug.length < 2 || taken.has(slug)) {
			slug = randomizeSlug(slug);
		}
		taken.add(slug);

		return { ...collection, slug };
	});
}

function randomizeSlug(slug: string) {
	const suffix = crypto.randomUUID().slice(0, 8);
	const base = slug.slice(0, 128 - suffix.length - 1).replace(/-+$/, "");
	return base ? `${base}-${suffix}` : `collection-${suffix}`;
}

function importText(parsed: ParsedBookmarks) {
	const parts = [
		[parsed.links.length, "link", "links"],
		[parsed.collections.length, "collection", "collections"],
		[parsed.tags.length, "tag", "tags"],
	] as const;
	const counts = parts
		.filter(([count]) => count > 0)
		.map(([count, one, many]) => `${count} ${count === 1 ? one : many}`);

	if (counts.length === 0) {
		return "Import";
	}

	if (counts.length === 1) {
		return `Import ${counts[0]}`;
	}

	return `Import ${counts.slice(0, -1).join(", ")} and ${counts.at(-1)}`;
}

export default FormImport;
