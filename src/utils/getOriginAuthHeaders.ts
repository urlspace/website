import { createServerOnlyFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

const isLocalApi = ["localhost", "127.0.0.1"].includes(
	new URL(import.meta.env.VITE_API_URL).hostname,
);

// The API's Railway edge rules only let requests through with this header.
// Cloudflare adds it to browser requests, but same-zone Worker subrequests
// skip that rule, so server calls send it themselves. The local API has no
// edge rules.
export const getOriginAuthHeaders = createServerOnlyFn(
	(): Record<string, string> =>
		isLocalApi ? {} : { "x-origin-auth": env.ORIGIN_SECRET },
);
