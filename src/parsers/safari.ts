import type {
  ParsedBookmarks,
  ParsedCollection,
  ParsedLink,
  SkippedLink,
} from "./types.ts";

const favouritesFolderNames = ["favourites", "favorites"];
const droppedFolderNames = ["bookmarks menu"];
const readingListId = "com.apple.ReadingList";

const URL_LENGTH_MAX = 2048;
const TITLE_LENGTH_MIN = 3;
const TITLE_LENGTH_MAX = 255;
const COLLECTION_NAME_LENGTH_MIN = 2;
const COLLECTION_NAME_LENGTH_MAX = 128;
const COLLECTION_DESCRIPTION_LENGTH_MAX = 1024;

function removeControlCharacters(value: string) {
  return value.replace(/\p{Cc}/gu, " ");
}

function fitLength(value: string, min: number, max: number) {
  const characters = [...value];
  if (characters.length > max) {
    return characters.slice(0, max).join("").trimEnd();
  }
  return value.padEnd(min, "!");
}

function isPrivateHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host === "::1" || /^f[cd][0-9a-f]*:/.test(host)) {
    return true;
  }
  const octets = host.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return false;
  }
  const [a, b] = octets;
  return (
    a === 127 ||
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

function validateUrl(value: string): string | null {
  if (value.length > URL_LENGTH_MAX) {
    return "URL longer than 2048 characters";
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return "invalid URL";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "only http and https URLs are supported";
  }
  if (!parsed.hostname) {
    return "invalid URL";
  }
  if (parsed.username || parsed.password) {
    return "URL contains credentials";
  }
  if (isPrivateHost(parsed.hostname)) {
    return "private or local address";
  }
  return null;
}

function normaliseTitle(value: string, url: string) {
  const title = removeControlCharacters(value).trim() || url;
  return fitLength(title, TITLE_LENGTH_MIN, TITLE_LENGTH_MAX);
}

function normaliseCollectionName(value: string) {
  const name = removeControlCharacters(value)
    .normalize("NFC")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
  return fitLength(
    name,
    COLLECTION_NAME_LENGTH_MIN,
    COLLECTION_NAME_LENGTH_MAX,
  );
}

function describeCollection(paths: Array<string>) {
  if (!paths.length) {
    return "";
  }
  const description =
    paths.length === 1
      ? `Imported from Safari, where it was the nested folder “${paths[0]}”.`
      : `Imported from Safari, where it was merged from the nested folders ${paths.map((path) => `“${path}”`).join(", ")}.`;
  return [...description].slice(0, COLLECTION_DESCRIPTION_LENGTH_MAX).join("");
}

function folderName(h3: Element) {
  return (h3.textContent ?? "").trim();
}

function folderList(dt: Element): Element | null {
  const inner = dt.querySelector(":scope > dl");
  if (inner) {
    return inner;
  }
  const next = dt.nextElementSibling;
  return next?.tagName === "DL" ? next : null;
}

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
    description: describeCollection([...collection.paths]),
  }));

  return {
    links,
    collections: parsedCollections,
    tags: [],
    skipped,
  };
}
