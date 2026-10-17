import { describe, expect, test } from "vite-plus/test";

import type { CollectionRow } from "#/queries/collections.ts";
import type { LinkRow } from "#/queries/links.ts";

import buildNetscape from "./netscape-export.ts";
import parseUrlspace from "./urlspace.ts";

function collectionRow(
	id: string,
	name: string,
	slug: string,
	description: string,
): CollectionRow {
	return {
		id,
		name,
		slug,
		description,
		public: false,
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
		count: 0,
	};
}

function linkRow(fields: Partial<LinkRow> & { id: string }): LinkRow {
	return {
		title: "Example",
		description: "",
		url: "https://example.com/",
		tags: [],
		collection: null,
		favourite: false,
		forLater: false,
		createdAt: "2024-03-01T10:20:30.000Z",
		updatedAt: "2024-03-02T10:20:30.000Z",
		...fields,
	};
}

const collections = [
	collectionRow(
		"c1",
		"Reading & <Notes>",
		"reading-notes",
		'Long "reads" & more',
	),
	collectionRow("c2", "Tools", "tools-x1", ""),
	collectionRow("c3", "Empty", "empty", "Never exported"),
];

const links = [
	linkRow({
		id: "l1",
		title: 'A <b>"quoted"</b> & title',
		description: 'Description with <tags> & "quotes"',
		url: "https://example.com/a?x=1&y=2",
		tags: [
			{ id: "t1", name: "web-dev" },
			{ id: "t2", name: "js" },
		],
		collection: { id: "c1", name: "Reading & <Notes>" },
		favourite: true,
		forLater: true,
	}),
	linkRow({
		id: "l2",
		title: "Ąę Łódź 日本語",
		url: "https://example.com/b",
		collection: { id: "c2", name: "Tools" },
		createdAt: "2023-11-14T22:13:20.000Z",
	}),
	linkRow({
		id: "l3",
		title: "Loose link",
		description: "Loose description",
		url: "https://example.com/c",
		forLater: true,
	}),
	linkRow({
		id: "l4",
		title: "Another reading link",
		url: "https://example.com/d",
		collection: { id: "c1", name: "Reading & <Notes>" },
	}),
];

describe("url.space export round-trip", () => {
	const parsed = parseUrlspace(buildNetscape(links, collections));

	test("every link round-trips one-to-one", () => {
		expect(parsed.skipped).toEqual([]);
		expect(
			[...parsed.links].sort((a, b) => a.url.localeCompare(b.url)),
		).toEqual(
			links.map((link) => ({
				url: link.url,
				title: link.title,
				description: link.description,
				tags: link.tags.map((tag) => tag.name),
				favourite: link.favourite,
				forLater: link.forLater,
				createdAt: link.createdAt,
				collection: link.collection?.name ?? null,
			})),
		);
	});

	test("collections keep name, slug and description", () => {
		expect(parsed.collections).toEqual([
			{
				name: "Reading & <Notes>",
				slug: "reading-notes",
				description: 'Long "reads" & more',
			},
			{ name: "Tools", slug: "tools-x1", description: "" },
		]);
	});

	test("tags are collected", () => {
		expect(parsed.tags).toEqual(["web-dev", "js"]);
	});

	test("createdAt is truncated to seconds", () => {
		const html = buildNetscape(
			[linkRow({ id: "l1", createdAt: "2024-03-01T10:20:30.987Z" })],
			[],
		);
		expect(parseUrlspace(html).links[0].createdAt).toBe(
			"2024-03-01T10:20:30.000Z",
		);
	});

	test("invalid slugs are dropped", () => {
		const html = `<DL><p><DT><H3 SLUG="Not a slug">Folder</H3><DL><p><DT><A HREF="https://example.com/">Example</A></DL><p></DL><p>`;
		expect(parseUrlspace(html).collections[0].slug).toBeUndefined();
	});
});
