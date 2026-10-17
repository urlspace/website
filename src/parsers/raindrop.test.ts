import { describe, expect, test } from "vite-plus/test";

import bookmarksHtml from "./fixtures/raindrop-bookmarks.html?raw";
import parseRaindrop from "./raindrop.ts";

function link(title: string) {
	return parseRaindrop(bookmarksHtml).links.find((l) => l.title === title);
}

describe("Raindrop.io bookmarks", () => {
	test("folders become collections", () => {
		expect(link("Better git diff")?.collection).toBe("Test");
		expect(link("Using Webmentions")?.collection).toBe("links");
	});

	test("nested folders are lifted with their original path", () => {
		expect(link("Nested link")?.collection).toBe("nested folder");
		expect(
			parseRaindrop(bookmarksHtml).collections.find(
				(c) => c.name === "nested folder",
			)?.description,
		).toBe(
			"Imported from Raindrop.io, where it was the nested folder “links / nested folder”.",
		);
	});

	test("Unsorted links have no collection", () => {
		expect(link("Unsorted link")?.collection).toBeNull();
		expect(parseRaindrop(bookmarksHtml).collections.map((c) => c.name)).toEqual(
			["Test", "links", "nested folder"],
		);
	});

	test("DATA-IMPORTANT becomes favourite", () => {
		expect(link("Using Webmentions")?.favourite).toBe(true);
		expect(link("Better git diff")?.favourite).toBe(false);
	});

	test("ADD_DATE becomes createdAt", () => {
		expect(link("Better git diff")?.createdAt).toBe("2023-11-14T22:13:20.000Z");
	});

	test("the note becomes the description and highlights are dropped", () => {
		expect(link("With note")?.description).toBe("My own note");
		expect(link("Better git diff")?.description).toBe("");
	});

	test("the excerpt is used when there is no note", () => {
		expect(link("With excerpt")?.description).toBe("Page excerpt");
	});

	test("tags are slugified", () => {
		expect(link("Better git diff")?.tags).toEqual(["git", "cli-tools"]);
	});

	test("non-http URLs are skipped", () => {
		expect(parseRaindrop(bookmarksHtml).skipped).toEqual([
			{
				url: "file:///Users/me/doc.pdf",
				title: "Local file",
				reason: "only http and https URLs are supported",
			},
		]);
	});
});
