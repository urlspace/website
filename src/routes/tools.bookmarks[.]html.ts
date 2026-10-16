import { createFileRoute } from "@tanstack/react-router";

import buildNetscape from "#/parsers/netscape-export.ts";
import type { LinkRow, Pagination } from "#/queries/links.ts";

const PAGE_SIZE = 500;
const REQUESTS_PER_BATCH = 30;
const BATCH_PAUSE_MS = 30_000;

const isLocalApi = ["localhost", "127.0.0.1"].includes(
	new URL(import.meta.env.VITE_API_URL).hostname,
);

export const Route = createFileRoute("/tools/bookmarks.html")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const cookie = request.headers.get("cookie") ?? "";
				const links: Array<LinkRow> = [];
				let page = 1;
				let totalPages = 1;

				while (page <= totalPages) {
					if (
						!isLocalApi &&
						page > 1 &&
						(page - 1) % REQUESTS_PER_BATCH === 0
					) {
						await new Promise((resolve) => setTimeout(resolve, BATCH_PAUSE_MS));
					}

					const params = new URLSearchParams({
						page: String(page),
						pageSize: String(PAGE_SIZE),
					});
					const res = await fetch(
						`${import.meta.env.VITE_API_URL}/links?${params}`,
						{ headers: { cookie } },
					);
					if (res.status === 401) {
						return Response.redirect(new URL("/auth/signin", request.url), 302);
					}
					if (!res.ok) {
						return new Response("Export failed. Try again in a moment.", {
							status: 502,
							headers: { "Cache-Control": "no-store" },
						});
					}

					const json = (await res.json()) as {
						data: Array<LinkRow>;
						pagination: Pagination;
					};
					links.push(...json.data);
					totalPages = json.pagination.totalPages;
					page++;
				}

				const date = new Date().toISOString().slice(0, 10);
				return new Response(buildNetscape(links), {
					headers: {
						"Content-Type": "text/html; charset=utf-8",
						"Content-Disposition": `attachment; filename="url-space-bookmarks-${date}.html"`,
						"Cache-Control": "no-store",
					},
				});
			},
		},
	},
});
