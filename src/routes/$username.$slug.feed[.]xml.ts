import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollection } from "#/queries/collections.ts";

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function publicationDate(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? ""
		: `<pubDate>${date.toUTCString()}</pubDate>`;
}

export const Route = createFileRoute("/$username/$slug/feed.xml")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const username = params.username.toLowerCase();
				const slug = params.slug.toLowerCase();
				if (params.username !== username || params.slug !== slug) {
					return Response.redirect(
						new URL(
							`/${encodeURIComponent(username)}/${encodeURIComponent(slug)}/feed.xml`,
							request.url,
						),
						301,
					);
				}

				const collection = await getPublicCollection({
					data: { username: params.username, slug: params.slug },
				});
				if (collection === null) {
					return new Response("Collection not found", {
						status: 404,
						headers: { "Cache-Control": "no-store" },
					});
				}

				const collectionUrl = new URL(
					`/${encodeURIComponent(params.username)}/${encodeURIComponent(params.slug)}`,
					request.url,
				).href;
				const feedUrl = `${collectionUrl}/feed.xml`;
				const items = collection.links
					.map(
						(link) => `
		<item>
			<title>${escapeXml(link.title || link.url)}</title>
			<link>${escapeXml(link.url)}</link>
			<description>${escapeXml(escapeXml(link.description))}</description>
			<guid isPermaLink="false">${escapeXml(link.id)}</guid>
			${publicationDate(link.createdAt)}
		</item>`,
					)
					.join("");

				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(`${collection.name} by ${collection.author.displayName} | url.space`)}</title>
		<link>${escapeXml(collectionUrl)}</link>
		<description>${escapeXml(collection.description || `Links from ${collection.name}`)}</description>
		<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
		${items}
	</channel>
</rss>`;

				return new Response(xml, {
					headers: {
						"Content-Type": "application/rss+xml; charset=utf-8",
						"Cache-Control": "no-store",
					},
				});
			},
		},
	},
});
