import type { CollectionRow } from "#/queries/collections.ts";
import type { LinkRow } from "#/queries/links.ts";

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function toUnixSeconds(value: string) {
	const time = new Date(value).getTime();
	return Number.isNaN(time) ? null : Math.floor(time / 1000);
}

function buildLink(link: LinkRow, indent: string) {
	const attributes = [`HREF="${escapeHtml(link.url)}"`];
	const added = toUnixSeconds(link.createdAt);
	if (added !== null) {
		attributes.push(`ADD_DATE="${added}"`);
	}
	const modified = toUnixSeconds(link.updatedAt);
	if (modified !== null) {
		attributes.push(`LAST_MODIFIED="${modified}"`);
	}
	if (link.tags.length) {
		attributes.push(
			`TAGS="${escapeHtml(link.tags.map((tag) => tag.name).join(","))}"`,
		);
	}
	if (link.forLater) {
		attributes.push(`TOREAD="1"`);
	}
	if (link.favourite) {
		attributes.push(`FAVOURITE="1"`);
	}

	const lines = [
		`${indent}<DT><A ${attributes.join(" ")}>${escapeHtml(link.title || link.url)}</A>`,
	];
	if (link.description) {
		lines.push(`${indent}<DD>${escapeHtml(link.description)}`);
	}
	return lines.join("\n");
}

export default function buildNetscape(
	links: Array<LinkRow>,
	collectionRows: Array<CollectionRow>,
): string {
	const collectionsById = new Map(
		collectionRows.map((collection) => [collection.id, collection]),
	);
	const collections = new Map<
		string,
		{ name: string; slug: string; description: string; links: Array<LinkRow> }
	>();
	const loose: Array<LinkRow> = [];

	for (const link of links) {
		if (!link.collection) {
			loose.push(link);
			continue;
		}
		const collection = collections.get(link.collection.id);
		if (collection) {
			collection.links.push(link);
		} else {
			const row = collectionsById.get(link.collection.id);
			collections.set(link.collection.id, {
				name: link.collection.name,
				slug: row?.slug ?? "",
				description: row?.description ?? "",
				links: [link],
			});
		}
	}

	const body = [
		...[...collections.values()].map((collection) =>
			[
				collection.slug
					? `    <DT><H3 SLUG="${escapeHtml(collection.slug)}">${escapeHtml(collection.name)}</H3>`
					: `    <DT><H3>${escapeHtml(collection.name)}</H3>`,
				...(collection.description
					? [`    <DD>${escapeHtml(collection.description)}`]
					: []),
				"    <DL><p>",
				...collection.links.map((link) => buildLink(link, "        ")),
				"    </DL><p>",
			].join("\n"),
		),
		...loose.map((link) => buildLink(link, "    ")),
	];

	return [
		"<!DOCTYPE NETSCAPE-Bookmark-file-1>",
		'<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
		"<TITLE>Bookmarks</TITLE>",
		"<H1>Bookmarks</H1>",
		"<DL><p>",
		...body,
		"</DL><p>",
		"",
	].join("\n");
}
