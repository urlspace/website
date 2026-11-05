import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type LinkPreview = {
	title: string;
	description: string;
};

const emptyPreview: LinkPreview = { title: "", description: "" };
const maxBytes = 2 * 1024 * 1024;

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

// Named HTML entities common in titles and descriptions. Anything missing here
// is left as is.
const entities: Record<string, string> = {
	// syntax
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",

	// spaces and invisible characters
	nbsp: " ",
	ensp: " ",
	emsp: " ",
	thinsp: " ",
	shy: "",
	zwj: "",
	zwnj: "",

	// quotes
	lsquo: "‘",
	rsquo: "’",
	sbquo: "‚",
	ldquo: "“",
	rdquo: "”",
	bdquo: "„",
	laquo: "«",
	raquo: "»",
	lsaquo: "‹",
	rsaquo: "›",
	prime: "′",
	Prime: "″",

	// punctuation
	ndash: "–",
	mdash: "—",
	hellip: "…",
	bull: "•",
	middot: "·",
	dagger: "†",
	Dagger: "‡",
	sect: "§",
	para: "¶",
	iexcl: "¡",
	iquest: "¿",

	// symbols
	copy: "©",
	reg: "®",
	trade: "™",
	deg: "°",
	plusmn: "±",
	times: "×",
	divide: "÷",
	minus: "−",
	permil: "‰",
	micro: "µ",
	frac12: "½",
	frac14: "¼",
	frac34: "¾",
	sup1: "¹",
	sup2: "²",
	sup3: "³",
	larr: "←",
	rarr: "→",
	uarr: "↑",
	darr: "↓",
	harr: "↔",
	hearts: "♥",
	check: "✓",
	star: "☆",

	// currencies
	cent: "¢",
	pound: "£",
	euro: "€",
	yen: "¥",
	curren: "¤",

	// Latin-1 letters
	Agrave: "À",
	Aacute: "Á",
	Acirc: "Â",
	Atilde: "Ã",
	Auml: "Ä",
	Aring: "Å",
	AElig: "Æ",
	Ccedil: "Ç",
	Egrave: "È",
	Eacute: "É",
	Ecirc: "Ê",
	Euml: "Ë",
	Igrave: "Ì",
	Iacute: "Í",
	Icirc: "Î",
	Iuml: "Ï",
	ETH: "Ð",
	Ntilde: "Ñ",
	Ograve: "Ò",
	Oacute: "Ó",
	Ocirc: "Ô",
	Otilde: "Õ",
	Ouml: "Ö",
	Oslash: "Ø",
	Ugrave: "Ù",
	Uacute: "Ú",
	Ucirc: "Û",
	Uuml: "Ü",
	Yacute: "Ý",
	THORN: "Þ",
	szlig: "ß",
	agrave: "à",
	aacute: "á",
	acirc: "â",
	atilde: "ã",
	auml: "ä",
	aring: "å",
	aelig: "æ",
	ccedil: "ç",
	egrave: "è",
	eacute: "é",
	ecirc: "ê",
	euml: "ë",
	igrave: "ì",
	iacute: "í",
	icirc: "î",
	iuml: "ï",
	eth: "ð",
	ntilde: "ñ",
	ograve: "ò",
	oacute: "ó",
	ocirc: "ô",
	otilde: "õ",
	ouml: "ö",
	oslash: "ø",
	ugrave: "ù",
	uacute: "ú",
	ucirc: "û",
	uuml: "ü",
	yacute: "ý",
	thorn: "þ",
	yuml: "ÿ",

	// Latin Extended letters (Central European, ligatures)
	Aogon: "Ą",
	aogon: "ą",
	Cacute: "Ć",
	cacute: "ć",
	Ccaron: "Č",
	ccaron: "č",
	Eogon: "Ę",
	eogon: "ę",
	Ecaron: "Ě",
	ecaron: "ě",
	Lstrok: "Ł",
	lstrok: "ł",
	Nacute: "Ń",
	nacute: "ń",
	Rcaron: "Ř",
	rcaron: "ř",
	Sacute: "Ś",
	sacute: "ś",
	Scaron: "Š",
	scaron: "š",
	Zacute: "Ź",
	zacute: "ź",
	Zdot: "Ż",
	zdot: "ż",
	Zcaron: "Ž",
	zcaron: "ž",
	OElig: "Œ",
	oelig: "œ",
	Yuml: "Ÿ",
};

// HTMLRewriter passes text and attribute values through without decoding entities.
function decodeEntities(value: string): string {
	return value.replace(
		/&(#x[\da-f]+|#\d+|[a-z][a-z\d]*);/gi,
		(match, entity: string) => {
			if (entity[0] === "#") {
				const codePoint =
					entity[1].toLowerCase() === "x"
						? Number.parseInt(entity.slice(2), 16)
						: Number.parseInt(entity.slice(1), 10);
				return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
			}
			return entities[entity] ?? match;
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
			console.log("preview: /me", me.status);
			return emptyPreview;
		}

		try {
			const res = await fetch(url, {
				headers: { "user-agent": "url.space" },
				signal: AbortSignal.timeout(5000),
			});
			if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) {
				console.log(
					"preview: upstream",
					new URL(url).hostname,
					res.status,
					res.headers.get("content-type"),
				);
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
		} catch (error) {
			console.log("preview: error", new URL(url).hostname, error);
			return emptyPreview;
		}
	});
