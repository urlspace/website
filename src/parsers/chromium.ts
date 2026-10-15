import type { ParsedBookmarks, ParsedLink, SkippedLink } from "./types.ts";

const rootFolderNames = [
  "bookmarks bar",
  "other bookmarks",
  "mobile bookmarks",
  "favorites bar",
  "other favorites",
  "mobile favorites",
];

function isValidLinkUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

function parseDate(value: string | null): string | null {
  const seconds = Number(value);
  if (!value || !Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }
  return new Date(seconds * 1000).toISOString();
}

function isRootFolder(h3: Element) {
  return (
    h3.hasAttribute("personal_toolbar_folder") ||
    rootFolderNames.includes((h3.textContent ?? "").trim().toLowerCase())
  );
}

function folderList(dt: Element): Element | null {
  const inner = dt.querySelector(":scope > dl");
  if (inner) {
    return inner;
  }
  const next = dt.nextElementSibling;
  return next?.tagName === "DL" ? next : null;
}

export default function parseChromium(html: string): ParsedBookmarks {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links: Array<ParsedLink> = [];
  const skipped: Array<SkippedLink> = [];

  function walk(dl: Element, path: Array<string>) {
    for (const dt of dl.querySelectorAll(":scope > dt")) {
      const h3 = dt.querySelector(":scope > h3");
      if (h3) {
        const list = folderList(dt);
        if (!list) {
          continue;
        }
        if (path.length === 0 && isRootFolder(h3)) {
          walk(list, path);
        } else {
          walk(list, [...path, (h3.textContent ?? "").trim()]);
        }
        continue;
      }

      const a = dt.querySelector(":scope > a");
      if (!a) {
        continue;
      }
      const url = (a.getAttribute("href") ?? "").trim();
      const title = (a.textContent ?? "").trim();
      if (!isValidLinkUrl(url)) {
        skipped.push({ url, title, reason: "unsupported URL" });
        continue;
      }
      links.push({
        url,
        title: title || url,
        description: "",
        tags: [],
        favourite: false,
        forLater: false,
        createdAt: parseDate(a.getAttribute("add_date")),
        collection: path.length ? path.join(" / ") : null,
      });
    }
  }

  const root = doc.querySelector("dt")?.parentElement;
  if (root) {
    walk(root, []);
  }

  return {
    links,
    collections: [
      ...new Set(links.flatMap((link) => link.collection ?? [])),
    ].map((name) => ({ name, description: "" })),
    tags: [],
    skipped,
  };
}
