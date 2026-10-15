import type {
  ParsedBookmarks,
  ParsedCollection,
  ParsedLink,
  SkippedLink,
} from "./types.ts";
import {
  describeCollection,
  folderList,
  folderName,
  normaliseCollectionName,
  normaliseTitle,
  parseDate,
  validateUrl,
} from "./utils.ts";

const favouritesFolderNames = ["bookmarks bar", "favorites bar"];
const droppedFolderNames = [
  "other bookmarks",
  "mobile bookmarks",
  "other favorites",
  "mobile favorites",
];

function isFavouritesFolder(h3: Element) {
  return (
    h3.hasAttribute("personal_toolbar_folder") ||
    favouritesFolderNames.includes(folderName(h3).toLowerCase())
  );
}

export default function parseChromium(html: string): ParsedBookmarks {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links: Array<ParsedLink> = [];
  const skipped: Array<SkippedLink> = [];
  const collections = new Map<string, { name: string; paths: Set<string> }>();

  function addToCollection(path: Array<string>) {
    const name = normaliseCollectionName(path[path.length - 1]);
    const key = name.toLowerCase();
    const collection = collections.get(key) ?? { name, paths: new Set() };
    if (path.length > 1) {
      collection.paths.add(path.join(" / "));
    }
    collections.set(key, collection);
    return collection.name;
  }

  function walk(
    dl: Element,
    path: Array<string>,
    isCollection: boolean,
    favourite: boolean,
  ) {
    for (const dt of dl.querySelectorAll(":scope > dt")) {
      const h3 = dt.querySelector(":scope > h3");
      if (h3) {
        const list = folderList(dt);
        if (!list) {
          continue;
        }
        const name = folderName(h3);
        if (path.length === 0 && isFavouritesFolder(h3)) {
          walk(list, [name], false, true);
        } else if (
          path.length === 0 &&
          droppedFolderNames.includes(name.toLowerCase())
        ) {
          walk(list, [name], false, favourite);
        } else {
          walk(list, [...path, name], true, favourite);
        }
        continue;
      }

      const a = dt.querySelector(":scope > a");
      if (!a) {
        continue;
      }
      const url = (a.getAttribute("href") ?? "").trim();
      const rawTitle = (a.textContent ?? "").trim();
      const reason = validateUrl(url);
      if (reason) {
        skipped.push({ url, title: rawTitle, reason });
        continue;
      }
      links.push({
        url,
        title: normaliseTitle(rawTitle, url),
        description: "",
        tags: [],
        favourite,
        forLater: false,
        createdAt: parseDate(a.getAttribute("add_date")),
        collection: isCollection ? addToCollection(path) : null,
      });
    }
  }

  const root = doc.querySelector("dt")?.parentElement;
  if (root) {
    walk(root, [], false, false);
  }

  const parsedCollections: Array<ParsedCollection> = [
    ...collections.values(),
  ].map((collection) => ({
    name: collection.name,
    description: describeCollection("your browser", [...collection.paths]),
  }));

  return {
    links,
    collections: parsedCollections,
    tags: [],
    skipped,
  };
}
