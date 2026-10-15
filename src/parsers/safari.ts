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
  validateUrl,
} from "./utils.ts";

const favouritesFolderNames = ["favourites", "favorites"];
const droppedFolderNames = ["bookmarks menu"];
const readingListId = "com.apple.ReadingList";

export default function parseSafari(html: string): ParsedBookmarks {
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
    forLater: boolean,
  ) {
    for (const dt of dl.querySelectorAll(":scope > dt")) {
      const h3 = dt.querySelector(":scope > h3");
      if (h3) {
        const list = folderList(dt);
        if (!list) {
          continue;
        }
        const name = folderName(h3);
        const lowerName = name.toLowerCase();
        if (path.length === 0 && h3.id === readingListId) {
          walk(list, [name], false, false, true);
        } else if (
          path.length === 0 &&
          favouritesFolderNames.includes(lowerName)
        ) {
          walk(list, [name], false, true, false);
        } else if (
          path.length === 0 &&
          droppedFolderNames.includes(lowerName)
        ) {
          walk(list, [name], false, favourite, forLater);
        } else {
          walk(list, [...path, name], true, favourite, forLater);
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
        forLater,
        createdAt: null,
        collection: isCollection ? addToCollection(path) : null,
      });
    }
  }

  const root = doc.querySelector("dt")?.parentElement;
  if (root) {
    walk(root, [], false, false, false);
  }

  const parsedCollections: Array<ParsedCollection> = [
    ...collections.values(),
  ].map((collection) => ({
    name: collection.name,
    description: describeCollection("Safari", [...collection.paths]),
  }));

  return {
    links,
    collections: parsedCollections,
    tags: [],
    skipped,
  };
}
