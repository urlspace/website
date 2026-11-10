const IS_PREFIX = "is:";
const TAG_PREFIX = "#";
const COLLECTION_PREFIX = "collection:";
const IS_FILTERS = ["favourite", "for-later"] as const;
export type IsFilter = (typeof IS_FILTERS)[number];
export type SearchItem = { id: string; name: string };

// A word, or a collection token whose quoted name can contain spaces. An
// unclosed quote runs to the end of the text, so it can still be typed.
const WORD = /collection:"(?:[^"\\]|\\.)*(?:"(?=\s|$)|$)|\S+/gi;

function escapeName(name: string) {
	return name.replace(/[\\"]/g, "\\$&");
}

function isToken(filter: IsFilter) {
	return `${IS_PREFIX}${filter}`;
}

function tagToken({ name }: SearchItem) {
	return `${TAG_PREFIX}${name}`;
}

function collectionToken({ name }: SearchItem) {
	return `${COLLECTION_PREFIX}"${escapeName(name)}"`;
}

function splitWords(raw: string) {
	return [...raw.matchAll(WORD)].map((match) => match[0]);
}

// Accepts the American spelling of favourite.
function normalizeWord(word: string) {
	return word.toLowerCase().replace(/^is:favor/, "is:favour");
}

function includesToken(tokens: string[], word: string) {
	return tokens.some((token) => normalizeWord(token) === normalizeWord(word));
}

function candidatesFor(
	word: string,
	tags: SearchItem[],
	collections: SearchItem[],
) {
	if (word.startsWith(IS_PREFIX)) {
		const query = word.slice(IS_PREFIX.length);
		return IS_FILTERS.filter((filter) => filter.includes(query)).map(isToken);
	}
	if (word.startsWith(TAG_PREFIX)) {
		const query = word.slice(TAG_PREFIX.length);
		return tags.filter((tag) => tag.name.includes(query)).map(tagToken);
	}
	if (word.startsWith(COLLECTION_PREFIX)) {
		const query = word.slice(COLLECTION_PREFIX.length).replace(/^"|"$/g, "");
		return collections
			.filter((c) => escapeName(c.name).toLowerCase().includes(query))
			.map(collectionToken);
	}
	return [];
}

export function parseSearchQuery(
	raw: string,
	tags: SearchItem[],
	collections: SearchItem[],
) {
	const words = [...raw.matchAll(WORD)];
	const filters = new Set<IsFilter>();
	const tagIds = new Set<string>();
	const ranges: { start: number; end: number }[] = [];
	const text: string[] = [];

	const collectionIds = new Map(
		collections.map((c) => [collectionToken(c).toLowerCase(), c.id]),
	);
	const lastCollection = words
		.filter((m) => collectionIds.has(m[0].toLowerCase()))
		.at(-1);

	words.forEach((match) => {
		const word = match[0];
		const lower = normalizeWord(word);
		const end = match.index + word.length;
		const filter = IS_FILTERS.find((f) => isToken(f) === lower);
		const tag = tags.find((t) => tagToken(t) === lower);
		if (filter || tag || match === lastCollection) {
			if (filter) filters.add(filter);
			if (tag) tagIds.add(tag.id);
			ranges.push({ start: match.index, end });
			return;
		}
		text.push(word);
	});

	return {
		text: text.join(" "),
		favourite: filters.has("favourite") || undefined,
		forLater: filters.has("for-later") || undefined,
		tagIds: tagIds.size > 0 ? [...tagIds] : undefined,
		collectionId:
			lastCollection && collectionIds.get(lastCollection[0].toLowerCase()),
		ranges,
	};
}

// True while the last word can still become a filter.
export function isTypingFilter(
	raw: string,
	tags: SearchItem[],
	collections: SearchItem[],
) {
	const last = [...raw.matchAll(WORD)].at(-1);
	if (!last || last.index + last[0].length !== raw.length) {
		return false;
	}
	const candidates = candidatesFor(normalizeWord(last[0]), tags, collections);
	return candidates.length > 0 && !includesToken(candidates, last[0]);
}

export function getSuggestions(
	raw: string,
	caret: number,
	tags: SearchItem[],
	collections: SearchItem[],
) {
	const active = [...raw.matchAll(WORD)].find(
		(m) => m.index <= caret && caret <= m.index + m[0].length,
	);
	if (!active) {
		return null;
	}
	const word = normalizeWord(active[0]);
	const candidates = candidatesFor(word, tags, collections);
	if (includesToken(candidates, word)) {
		return null;
	}
	const used = splitWords(raw);
	const items = candidates.filter((c) => !includesToken(used, c));
	if (items.length === 0) {
		return null;
	}
	return {
		start: active.index,
		end: active.index + active[0].length,
		items,
	};
}

export function applySuggestion(
	raw: string,
	{ start, end }: { start: number; end: number },
	token: string,
) {
	// Only one collection can apply, so picking one replaces any other.
	const keep = (word: string) =>
		!token.startsWith(COLLECTION_PREFIX) ||
		!word.toLowerCase().startsWith(`${COLLECTION_PREFIX}"`);
	const before = splitWords(raw.slice(0, start)).filter(keep);
	const after = splitWords(raw.slice(end)).filter(keep);
	const head = `${[...before, token].join(" ")} `;
	return { value: `${head}${after.join(" ")}`, caret: head.length };
}

function replaceTokens(raw: string, family: string[], selected: string[]) {
	const words = splitWords(raw).filter(
		(word) => !includesToken(family, word) || includesToken(selected, word),
	);
	return [
		...words,
		...selected.filter((token) => !includesToken(words, token)),
	].join(" ");
}

export function setIsFilter(raw: string, filter: IsFilter, on: boolean) {
	const token = isToken(filter);
	return replaceTokens(raw, [token], on ? [token] : []);
}

export function setTagFilters(
	raw: string,
	tags: SearchItem[],
	tagIds: string[],
) {
	return replaceTokens(
		raw,
		tags.map(tagToken),
		tags.filter((tag) => tagIds.includes(tag.id)).map(tagToken),
	);
}

export function setCollectionFilter(
	raw: string,
	collections: SearchItem[],
	collectionId: string | null,
) {
	return replaceTokens(
		raw,
		collections.map(collectionToken),
		collections.filter((c) => c.id === collectionId).map(collectionToken),
	);
}
