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
  normaliseDescription,
  normaliseTags,
  normaliseTitle,
  parseDate,
  validateUrl,
} from "./utils.ts";

const favouritesFolderNames = ["bookmarks toolbar"];
const droppedFolderNames = [
  "bookmarks menu",
  "other bookmarks",
  "mobile bookmarks",
];

function isFavouritesFolder(h3: Element) {
  return (
    h3.hasAttribute("personal_toolbar_folder") ||
    favouritesFolderNames.includes(folderName(h3).toLowerCase())
  );
}

function isDroppedFolder(h3: Element) {
  return (
    h3.hasAttribute("unfiled_bookmarks_folder") ||
    droppedFolderNames.includes(folderName(h3).toLowerCase())
  );
}

function linkDescription(dt: Element) {
  const next = dt.nextElementSibling;
  return next?.tagName === "DD"
    ? normaliseDescription(next.textContent ?? "")
    : "";
}

export default function parseFirefox(html: string): ParsedBookmarks {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links: Array<ParsedLink> = [];
  const skipped: Array<SkippedLink> = [];
  const tags = new Set<string>();
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
        } else if (path.length === 0 && isDroppedFolder(h3)) {
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
      const linkTags = normaliseTags(a.getAttribute("tags"));
      for (const tag of linkTags) {
        tags.add(tag);
      }
      links.push({
        url,
        title: normaliseTitle(rawTitle, url),
        description: linkDescription(dt),
        tags: linkTags,
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
    tags: [...tags],
    skipped,
  };
}
