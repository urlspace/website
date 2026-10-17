import { COLLECTION_DESCRIPTION_LENGTH_MAX } from "./constants.ts";
import type {
	ParsedBookmarks,
	ParsedCollection,
	ParsedLink,
	SkippedLink,
} from "./types.ts";
import {
	folderList,
	folderName,
	normaliseCollectionName,
	normaliseDescription,
	normaliseTags,
	normaliseTitle,
	parseDate,
	removeControlCharacters,
	validateUrl,
} from "./utils.ts";

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function collectionSlug(h3: Element) {
	const slug = (h3.getAttribute("slug") ?? "").trim().toLowerCase();
	if (slug.length < 2 || slug.length > 128 || !slugPattern.test(slug)) {
		return undefined;
	}
	return slug;
}

function collectionDescription(dd: Element | null) {
	if (!dd) {
		return "";
	}
	const text = [...dd.childNodes]
		.filter((node) => node.nodeType === Node.TEXT_NODE)
		.map((node) => node.textContent ?? "")
		.join("");
	const description = removeControlCharacters(text).trim();
	return [...description]
		.slice(0, COLLECTION_DESCRIPTION_LENGTH_MAX)
		.join("")
		.trimEnd();
}

function linkDescription(dt: Element) {
	const next = dt.nextElementSibling;
	return next?.tagName === "DD"
		? normaliseDescription(next.textContent ?? "")
		: "";
}

export default function parseUrlspace(html: string): ParsedBookmarks {
	const doc = new DOMParser().parseFromString(html, "text/html");
	const links: Array<ParsedLink> = [];
	const skipped: Array<SkippedLink> = [];
	const tags = new Set<string>();
	const collections = new Map<string, ParsedCollection>();

	function addLink(a: Element, dt: Element, collection: string | null) {
		const url = (a.getAttribute("href") ?? "").trim();
		const rawTitle = (a.textContent ?? "").trim();
		const reason = validateUrl(url);
		if (reason) {
			skipped.push({ url, title: rawTitle, reason });
			return;
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
			favourite: a.getAttribute("favourite") === "1",
			forLater: a.getAttribute("toread") === "1",
			createdAt: parseDate(a.getAttribute("add_date")),
			collection,
		});
	}

	const root = doc.querySelector("dt")?.parentElement;
	if (root) {
		for (const dt of root.querySelectorAll(":scope > dt")) {
			const h3 = dt.querySelector(":scope > h3");
			if (!h3) {
				const a = dt.querySelector(":scope > a");
				if (a) {
					addLink(a, dt, null);
				}
				continue;
			}

			const next = dt.nextElementSibling;
			const dd = next?.tagName === "DD" ? next : null;
			const list = folderList(dt) ?? dd?.querySelector(":scope > dl");
			if (!list) {
				continue;
			}

			const name = normaliseCollectionName(folderName(h3));
			const key = name.toLowerCase();
			const collection = collections.get(key) ?? {
				name,
				slug: collectionSlug(h3),
				description: collectionDescription(dd),
			};
			collections.set(key, collection);

			for (const linkDt of list.querySelectorAll(":scope > dt")) {
				const a = linkDt.querySelector(":scope > a");
				if (a) {
					addLink(a, linkDt, collection.name);
				}
			}
		}
	}

	const usedCollections = new Set(links.map((link) => link.collection));

	return {
		links,
		collections: [...collections.values()].filter((collection) =>
			usedCollections.has(collection.name),
		),
		tags: [...tags],
		skipped,
	};
}
