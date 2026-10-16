import { describe, expect, test } from "vite-plus/test";

import parseFirefox from "./firefox.ts";
import bookmarksHtml from "./fixtures/firefox-bookmarks.html?raw";

function link(html: string, title: string) {
	return parseFirefox(html).links.find((l) => l.title === title);
}

describe("Firefox bookmarks", () => {
	test("Bookmarks Menu links at the root have no collection", () => {
		expect(link(bookmarksHtml, "Menu link")).toMatchObject({
			collection: null,
			favourite: false,
		});
	});

	test("the default Mozilla Firefox folder is a collection", () => {
		expect(link(bookmarksHtml, "Get Help")?.collection).toBe("Mozilla Firefox");
	});

	test("Bookmarks Toolbar links are favourites without a collection", () => {
		expect(link(bookmarksHtml, "Example News")).toMatchObject({
			favourite: true,
			collection: null,
			url: "https://example.com/news/?utm_source=bookmarks&utm_medium=toolbar",
		});
	});

	test("Bookmarks Toolbar subfolders become favourite collections", () => {
		expect(link(bookmarksHtml, "Example Tools")).toMatchObject({
			favourite: true,
			collection: "Tools",
		});
	});

	test("Other Bookmarks is dropped without marking favourites", () => {
		expect(link(bookmarksHtml, "Other link")).toMatchObject({
			favourite: false,
			collection: null,
		});
	});

	test("Mobile Bookmarks is dropped without marking favourites", () => {
		expect(link(bookmarksHtml, "Mobile link")).toMatchObject({
			favourite: false,
			collection: null,
		});
	});

	test("nested folders are lifted with their original path", () => {
		const { collections } = parseFirefox(bookmarksHtml);
		expect(collections.find((c) => c.name === "Notes")?.description).toBe(
			"Imported from your browser, where it was the nested folder “Work / Notes”.",
		);
	});

	test("empty and dropped folders are not collections", () => {
		const names = parseFirefox(bookmarksHtml).collections.map((c) => c.name);
		expect(names).toEqual(["Mozilla Firefox", "Tools", "Notes"]);
	});

	test("ADD_DATE becomes createdAt", () => {
		expect(link(bookmarksHtml, "Menu link")?.createdAt).toBe(
			"2023-11-14T22:13:23.000Z",
		);
	});

	test("DD becomes the description", () => {
		expect(link(bookmarksHtml, "Menu link")?.description).toBe(
			"A short description",
		);
		expect(link(bookmarksHtml, "Example News")?.description).toBe("");
	});

	test("tags are slugified", () => {
		expect(link(bookmarksHtml, "Example News")?.tags).toEqual([
			"eight",
			"one",
			"threeee-four-five",
			"two",
			"lodz",
		]);
	});

	test("all tags are collected without duplicates", () => {
		expect(parseFirefox(bookmarksHtml).tags).toEqual([
			"eight",
			"two",
			"one",
			"threeee-four-five",
			"lodz",
			"here",
			"something",
		]);
	});

	test("place: queries are skipped", () => {
		expect(parseFirefox(bookmarksHtml).skipped).toEqual([
			{
				url: "place:sort=8&maxResults=10",
				title: "Recent Tags",
				reason: "only http and https URLs are supported",
			},
		]);
	});
});

describe("Firefox tags and descriptions", () => {
	function parseTags(value: string) {
		const html = `<DL><p><DT><A HREF="https://example.com/" TAGS="${value}">Example</A></DL><p>`;
		return parseFirefox(html).links[0].tags;
	}

	test("tags shorter than 2 characters are dropped", () => {
		expect(parseTags("a,ok,!!")).toEqual(["ok"]);
	});

	test("tags are cut to 50 characters", () => {
		expect(parseTags("a".repeat(60))[0]).toHaveLength(50);
	});

	test("tags are deduplicated after slugifying", () => {
		expect(parseTags("Web Dev,web-dev,WEB  DEV")).toEqual(["web-dev"]);
	});

	test("only the first 10 tags are kept", () => {
		const tags = Array.from({ length: 12 }, (_, i) => `tag${i}`).join(",");
		expect(parseTags(tags)).toHaveLength(10);
	});

	test("descriptions are cut to 512 characters", () => {
		const html = `<DL><p><DT><A HREF="https://example.com/">Example</A><DD>${"a".repeat(600)}</DL><p>`;
		expect(parseFirefox(html).links[0].description).toHaveLength(512);
	});
});
