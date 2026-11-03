export type ParsedLink = {
	url: string;
	title: string;
	description: string;
	tags: Array<string>;
	favourite: boolean;
	forLater: boolean;
	createdAt: string | null;
	collection: string | null;
};

export type ParsedCollection = {
	name: string;
	description: string;
};

export type SkippedLink = {
	url: string;
	title: string;
	reason: string;
};

export type ParsedBookmarks = {
	links: Array<ParsedLink>;
	collections: Array<ParsedCollection>;
	tags: Array<string>;
	skipped: Array<SkippedLink>;
};

export type Parser = (input: string) => ParsedBookmarks;
