import { describe, expect, test } from "vite-plus/test";

import parseChromium from "./chromium.ts";
import bookmarksHtml from "./fixtures/chromium-bookmarks.html?raw";

function link(html: string, title: string) {
	return parseChromium(html).links.find((l) => l.title === title);
}

describe("Chromium bookmarks", () => {
	test("Bookmarks bar links are favourites without a collection", () => {
		expect(link(bookmarksHtml, "Example News")).toMatchObject({
			favourite: true,
			collection: null,
			forLater: false,
		});
	});

	test("Bookmarks bar subfolders become favourite collections", () => {
		expect(link(bookmarksHtml, "Example Tools")).toMatchObject({
			favourite: true,
			collection: "Tools",
		});
	});

	test("the bookmarks bar is detected by attribute, whatever its name", () => {
		const html = `<DL><p><DT><H3 PERSONAL_TOOLBAR_FOLDER="true">Lesezeichenleiste</H3><DL><p><DT><A HREF="https://example.com/">Example</A></DL><p></DL><p>`;
		expect(parseChromium(html).links[0]).toMatchObject({
			favourite: true,
			collection: null,
		});
	});

	test("Edge Favorites bar links are favourites", () => {
		const html = `<DL><p><DT><H3>Favorites bar</H3><DL><p><DT><A HREF="https://example.com/">Example</A></DL><p></DL><p>`;
		expect(parseChromium(html).links[0]).toMatchObject({
			favourite: true,
			collection: null,
		});
	});

	test("Other bookmarks links at the root have no collection", () => {
		expect(link(bookmarksHtml, "Root link")).toMatchObject({
			collection: null,
			favourite: false,
		});
	});

	test("Mobile bookmarks is dropped without marking favourites", () => {
		expect(link(bookmarksHtml, "Mobile link")).toMatchObject({
			favourite: false,
			collection: null,
		});
	});

	test("ADD_DATE becomes createdAt", () => {
		expect(link(bookmarksHtml, "Root link")?.createdAt).toBe(
			"2023-11-14T22:13:26.000Z",
		);
	});

	test("links without ADD_DATE have no createdAt", () => {
		expect(link(bookmarksHtml, "Undated link")?.createdAt).toBeNull();
	});

	test("top-level folders become collections", () => {
		expect(link(bookmarksHtml, "Sale")).toMatchObject({
			collection: "Clothing",
			url: "https://shop.example.com/sale?size=11&page=2",
		});
	});

	test("HTML entities are decoded", () => {
		expect(
			link(bookmarksHtml, "Skate Shop | Footwear & Accessories"),
		).toBeDefined();
	});

	test("nested folders are lifted and merged case-insensitively", () => {
		const { collections } = parseChromium(bookmarksHtml);
		expect(collections.find((c) => c.name === "Notes")).toEqual({
			name: "Notes",
			description:
				"Imported from your browser, where it was merged from the nested folders “Work / Notes”, “Home / notes”.",
		});
		expect(link(bookmarksHtml, "Home notes")?.collection).toBe("Notes");
	});

	test("a single nested folder keeps its original path", () => {
		const { collections } = parseChromium(bookmarksHtml);
		expect(collections.find((c) => c.name === "Tools")?.description).toBe(
			"Imported from your browser, where it was the nested folder “Bookmarks bar / Tools”.",
		);
	});

	test("top-level collections have no description", () => {
		const { collections } = parseChromium(bookmarksHtml);
		expect(collections.find((c) => c.name === "Clothing")?.description).toBe(
			"",
		);
	});

	test("empty and dropped folders are not collections", () => {
		const names = parseChromium(bookmarksHtml).collections.map((c) => c.name);
		expect(names).toEqual(["Tools", "Clothing", "Notes"]);
	});

	test("short titles are padded to 3 characters", () => {
		expect(link(bookmarksHtml, "X!!")).toBeDefined();
	});

	test("unsupported URLs are skipped with a reason", () => {
		expect(parseChromium(bookmarksHtml).skipped).toEqual([
			{
				url: "javascript:void(0)",
				title: "Bookmarklet",
				reason: "only http and https URLs are supported",
			},
			{
				url: "http://192.168.1.1/",
				title: "Router",
				reason: "private or local address",
			},
			{
				url: "http://localhost:3000/",
				title: "Local dev",
				reason: "private or local address",
			},
			{
				url: "https://user:secret@example.com/",
				title: "Credentials",
				reason: "URL contains credentials",
			},
		]);
	});

	test("Chromium exports no tags or descriptions", () => {
		for (const parsed of parseChromium(bookmarksHtml).links) {
			expect(parsed).toMatchObject({ tags: [], description: "" });
		}
	});
});

describe("Chromium titles", () => {
	test("long titles are cut to 255 characters", () => {
		const html = `<DL><p><DT><A HREF="https://example.com/">${"a".repeat(300)}</A></DL><p>`;
		expect(parseChromium(html).links[0].title).toHaveLength(255);
	});

	test("empty titles fall back to the URL", () => {
		const html = `<DL><p><DT><A HREF="https://example.com/"></A></DL><p>`;
		expect(parseChromium(html).links[0].title).toBe("https://example.com/");
	});
});
