import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type LinkPreview = {
	title: string;
	description: string;
};

const emptyPreview: LinkPreview = { title: "", description: "" };
const maxBytes = 512 * 1024;

// Mirrors the backend's ValidateURL: only http/https, no embedded credentials.
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

const entities: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
};

// HTMLRewriter passes text and attribute values through without decoding entities.
function decodeEntities(value: string): string {
	return value.replace(
		/&(#x[\da-f]+|#\d+|[a-z]+);/gi,
		(match, entity: string) => {
			if (entity[0] === "#") {
				const codePoint =
					entity[1].toLowerCase() === "x"
						? Number.parseInt(entity.slice(2), 16)
						: Number.parseInt(entity.slice(1), 10);
				return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
			}
			return entities[entity.toLowerCase()] ?? match;
		},
	);
}

function clean(value: string, max: number): string {
	return decodeEntities(value)
		.replace(/\p{Cc}/gu, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, max)
		.trim();
}

export const getLinkPreview = createServerFn()
	.validator((url: string) => {
		if (typeof url !== "string") {
			throw new Error("Invalid URL");
		}
		return url;
	})
	.handler(async ({ data: url }): Promise<LinkPreview> => {
		if (!isValidLinkUrl(url)) {
			return emptyPreview;
		}

		// Only signed-in users may make this server fetch arbitrary URLs. Same-zone
		// Worker subrequests count towards the API's Cloudflare rate limit under the
		// visitor's IP, so going through /me also rate limits previews.
		const cookie = getRequest().headers.get("cookie") ?? "";
		const me = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
			headers: { cookie },
		});
		if (!me.ok) {
			return emptyPreview;
		}

		try {
			const res = await fetch(url, {
				headers: { "user-agent": "url.space" },
				signal: AbortSignal.timeout(5000),
			});
			if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) {
				return emptyPreview;
			}

			let ogTitle = "";
			let title = "";
			let titleDone = false;
			let ogDescription = "";
			let description = "";
			let headDone = false;

			const transformed = new HTMLRewriter()
				.on('meta[property="og:title"]', {
					element(el) {
						ogTitle ||= el.getAttribute("content") ?? "";
					},
				})
				.on("title", {
					text(chunk) {
						if (!titleDone) {
							title += chunk.text;
							titleDone = chunk.lastInTextNode;
						}
					},
				})
				.on('meta[property="og:description"]', {
					element(el) {
						ogDescription ||= el.getAttribute("content") ?? "";
					},
				})
				.on('meta[name="description"]', {
					element(el) {
						description ||= el.getAttribute("content") ?? "";
					},
				})
				.on("head", {
					element(el) {
						el.onEndTag(() => {
							headDone = true;
						});
					},
				})
				.transform(res);

			const reader = transformed.body?.getReader();
			if (!reader) {
				return emptyPreview;
			}
			let bytes = 0;
			while (!headDone && bytes < maxBytes) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				bytes += value.byteLength;
			}
			await reader.cancel();

			const cleanTitle = clean(ogTitle || title, 255);
			return {
				title: cleanTitle.length >= 3 ? cleanTitle : "",
				description: clean(ogDescription || description, 512),
			};
		} catch {
			return emptyPreview;
		}
	});
