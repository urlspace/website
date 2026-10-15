import { describe, expect, test } from "vitest";
import bookmarksHtml from "./fixtures/safari-bookmarks.html?raw";
import readingListHtml from "./fixtures/safari-reading-list.html?raw";
import parseSafari from "./safari.ts";

function link(html: string, title: string) {
  return parseSafari(html).links.find((l) => l.title === title);
}

describe("Safari bookmarks", () => {
  test("Favourites links are favourites without a collection", () => {
    expect(link(bookmarksHtml, "Example News")).toMatchObject({
      favourite: true,
      collection: null,
      forLater: false,
    });
  });

  test("Favourites subfolders become favourite collections", () => {
    expect(link(bookmarksHtml, "Example Tools")).toMatchObject({
      favourite: true,
      collection: "Tools",
    });
  });

  test("Bookmarks Menu is dropped without marking favourites", () => {
    expect(link(bookmarksHtml, "Menu Link")).toMatchObject({
      favourite: false,
      collection: null,
    });
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

  test("root-level links have no collection", () => {
    expect(link(bookmarksHtml, "Root link")).toMatchObject({
      collection: null,
      favourite: false,
    });
  });

  test("nested folders are lifted and merged case-insensitively", () => {
    const { collections } = parseSafari(bookmarksHtml);
    expect(collections.find((c) => c.name === "Notes")).toEqual({
      name: "Notes",
      description:
        "Imported from Safari, where it was merged from the nested folders “Work / Notes”, “Home / notes”.",
    });
    expect(link(bookmarksHtml, "Home notes")?.collection).toBe("Notes");
  });

  test("a single nested folder keeps its original path", () => {
    const { collections } = parseSafari(bookmarksHtml);
    expect(collections.find((c) => c.name === "Tools")?.description).toBe(
      "Imported from Safari, where it was the nested folder “Favourites / Tools”.",
    );
  });

  test("top-level collections have no description", () => {
    const { collections } = parseSafari(bookmarksHtml);
    expect(collections.find((c) => c.name === "Clothing")?.description).toBe(
      "",
    );
  });

  test("empty and dropped folders are not collections", () => {
    const names = parseSafari(bookmarksHtml).collections.map((c) => c.name);
    expect(names).toEqual(["Tools", "Clothing", "Notes"]);
  });

  test("short titles are padded to 3 characters", () => {
    expect(link(bookmarksHtml, "X!!")).toBeDefined();
  });

  test("unsupported URLs are skipped with a reason", () => {
    expect(parseSafari(bookmarksHtml).skipped).toEqual([
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

  test("Safari exports no dates, tags or descriptions", () => {
    for (const parsed of parseSafari(bookmarksHtml).links) {
      expect(parsed).toMatchObject({
        createdAt: null,
        tags: [],
        description: "",
      });
    }
  });
});

describe("Safari reading list", () => {
  test("Reading List links are for later without a collection", () => {
    const { links, collections } = parseSafari(readingListHtml);
    expect(links.map((l) => [l.title, l.forLater, l.collection])).toEqual([
      ["First post", true, null],
      ["Second post", true, null],
    ]);
    expect(collections).toEqual([]);
  });
});

describe("Safari titles", () => {
  test("long titles are cut to 255 characters", () => {
    const html = `<DT><A HREF="https://example.com/">${"a".repeat(300)}</A>`;
    expect(parseSafari(html).links[0].title).toHaveLength(255);
  });

  test("empty titles fall back to the URL", () => {
    const html = `<DT><A HREF="https://example.com/"></A>`;
    expect(parseSafari(html).links[0].title).toBe("https://example.com/");
  });

  test("URLs longer than 2048 characters are skipped", () => {
    const url = `https://example.com/${"a".repeat(2048)}`;
    const html = `<DT><A HREF="${url}">Long</A>`;
    expect(parseSafari(html).skipped[0].reason).toBe(
      "URL longer than 2048 characters",
    );
  });
});
