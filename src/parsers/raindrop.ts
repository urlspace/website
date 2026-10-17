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

const droppedFolderNames = ["unsorted"];

function linkDescription(a: Element, dt: Element) {
	const next = dt.nextElementSibling;
	const note =
		next?.tagName === "DD"
			? [...next.childNodes]
					.filter((node) => node.nodeType === Node.TEXT_NODE)
					.map((node) => node.textContent ?? "")
					.join("")
			: "";
	return (
		normaliseDescription(note) ||
		normaliseDescription(a.getAttribute("description") ?? "")
	);
}

export default function parseRaindrop(html: string): ParsedBookmarks {
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

	function walk(dl: Element, path: Array<string>, isCollection: boolean) {
		for (const dt of dl.querySelectorAll(":scope > dt")) {
			const h3 = dt.querySelector(":scope > h3");
			if (h3) {
				const list = folderList(dt);
				if (!list) {
					continue;
				}
				const name = folderName(h3);
				if (
					path.length === 0 &&
					droppedFolderNames.includes(name.toLowerCase())
				) {
					walk(list, [], false);
				} else {
					walk(list, [...path, name], true);
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
				description: linkDescription(a, dt),
				tags: linkTags,
				favourite: a.getAttribute("data-important") === "true",
				forLater: false,
				createdAt: parseDate(a.getAttribute("add_date")),
				collection: isCollection ? addToCollection(path) : null,
			});
		}
	}

	const root = doc.querySelector("dt")?.parentElement;
	if (root) {
		walk(root, [], false);
	}

	const parsedCollections: Array<ParsedCollection> = [
		...collections.values(),
	].map((collection) => ({
		name: collection.name,
		description: describeCollection("Raindrop.io", [...collection.paths]),
	}));

	return {
		links,
		collections: parsedCollections,
		tags: [...tags],
		skipped,
	};
}
