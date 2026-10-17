import { describe, expect, test } from "vite-plus/test";

import bookmarksHtml from "./fixtures/pinboard-bookmarks.html?raw";
import parsePinboard from "./pinboard.ts";

function link(title: string) {
	return parsePinboard(bookmarksHtml).links.find((l) => l.title === title);
}

describe("Pinboard bookmarks", () => {
	test("links have no collection and are not favourites", () => {
		expect(parsePinboard(bookmarksHtml).collections).toEqual([]);
		expect(link("Example")).toMatchObject({
			collection: null,
			favourite: false,
		});
	});

	test("TOREAD becomes forLater", () => {
		expect(link("Example")?.forLater).toBe(true);
		expect(link("Search")?.forLater).toBe(false);
	});

	test("ADD_DATE becomes createdAt", () => {
		expect(link("Example")?.createdAt).toBe("2023-11-14T22:13:21.000Z");
	});

	test("DD becomes the description", () => {
		expect(link("Example article | example.com")?.description).toBe(
			"A multi-line description",
		);
		expect(link("Search")?.description).toBe("Short description");
		expect(link("Example")?.description).toBe("");
	});

	test("HTML entities in URLs are decoded", () => {
		expect(link("Search")?.url).toBe("https://example.com/search?q=a&b=c");
	});

	test("tags are slugified", () => {
		expect(link("Example")?.tags).toEqual([
			"blog",
			"writing",
			"developers",
			"bookmarks-bar",
		]);
	});

	test("all tags are collected without duplicates", () => {
		expect(parsePinboard(bookmarksHtml).tags).toEqual([
			"blog",
			"writing",
			"developers",
			"bookmarks-bar",
			"regex",
		]);
	});

	test("short titles are padded", () => {
		expect(link("x!!")?.url).toBe("https://example.org/");
	});

	test("non-http URLs are skipped", () => {
		expect(parsePinboard(bookmarksHtml).skipped).toEqual([
			{
				url: "javascript:alert(1)",
				title: "Bookmarklet",
				reason: "only http and https URLs are supported",
			},
		]);
	});
});
