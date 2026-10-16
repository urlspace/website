import { slugify } from "#/utils.ts";

import {
	COLLECTION_DESCRIPTION_LENGTH_MAX,
	COLLECTION_NAME_LENGTH_MAX,
	COLLECTION_NAME_LENGTH_MIN,
	DESCRIPTION_LENGTH_MAX,
	TAG_LENGTH_MAX,
	TAG_LENGTH_MIN,
	TAGS_PER_LINK_MAX,
	TITLE_LENGTH_MAX,
	TITLE_LENGTH_MIN,
	URL_LENGTH_MAX,
} from "./constants.ts";

export function removeControlCharacters(value: string) {
	return value.replace(/\p{Cc}/gu, " ");
}

export function fitLength(value: string, min: number, max: number) {
	const characters = [...value];
	if (characters.length > max) {
		return characters.slice(0, max).join("").trimEnd();
	}
	return value.padEnd(min, "!");
}

export function isPrivateHost(hostname: string) {
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

export function validateUrl(value: string): string | null {
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

export function normaliseTitle(value: string, url: string) {
	const title = removeControlCharacters(value).trim() || url;
	return fitLength(title, TITLE_LENGTH_MIN, TITLE_LENGTH_MAX);
}

export function normaliseDescription(value: string) {
	const description = removeControlCharacters(value).trim();
	return [...description].slice(0, DESCRIPTION_LENGTH_MAX).join("").trimEnd();
}

export function normaliseTags(value: string | null) {
	const tags = (value ?? "")
		.split(",")
		.map((tag) => slugify(tag).slice(0, TAG_LENGTH_MAX).replace(/-+$/, ""))
		.filter((tag) => tag.length >= TAG_LENGTH_MIN);
	return [...new Set(tags)].slice(0, TAGS_PER_LINK_MAX);
}

export function normaliseCollectionName(value: string) {
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

export function describeCollection(source: string, paths: Array<string>) {
	if (!paths.length) {
		return "";
	}
	const description =
		paths.length === 1
			? `Imported from ${source}, where it was the nested folder “${paths[0]}”.`
			: `Imported from ${source}, where it was merged from the nested folders ${paths.map((path) => `“${path}”`).join(", ")}.`;
	return [...description].slice(0, COLLECTION_DESCRIPTION_LENGTH_MAX).join("");
}

export function folderName(h3: Element) {
	return (h3.textContent ?? "").trim();
}

export function folderList(dt: Element): Element | null {
	const inner = dt.querySelector(":scope > dl");
	if (inner) {
		return inner;
	}
	const next = dt.nextElementSibling;
	return next?.tagName === "DL" ? next : null;
}

export function parseDate(value: string | null) {
	const seconds = Number(value);
	if (!value || !Number.isFinite(seconds) || seconds <= 0) {
		return null;
	}
	return new Date(seconds * 1000).toISOString();
}
