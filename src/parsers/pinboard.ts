import type { ParsedBookmarks, ParsedLink, SkippedLink } from "./types.ts";
import {
	normaliseDescription,
	normaliseTags,
	normaliseTitle,
	parseDate,
	validateUrl,
} from "./utils.ts";

function linkDescription(dt: Element) {
	const next = dt.nextElementSibling;
	return next?.tagName === "DD"
		? normaliseDescription(next.textContent ?? "")
		: "";
}

export default function parsePinboard(html: string): ParsedBookmarks {
	const doc = new DOMParser().parseFromString(html, "text/html");
	const links: Array<ParsedLink> = [];
	const skipped: Array<SkippedLink> = [];
	const tags = new Set<string>();

	for (const a of doc.querySelectorAll("dt > a")) {
		const dt = a.parentElement;
		if (!dt) {
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
			favourite: false,
			forLater: a.getAttribute("toread") === "1",
			createdAt: parseDate(a.getAttribute("add_date")),
			collection: null,
		});
	}

	return {
		links,
		collections: [],
		tags: [...tags],
		skipped,
	};
}
