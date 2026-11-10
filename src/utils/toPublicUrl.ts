import { isDashboardPath } from "./isDashboardPath.ts";
import { dashboardUrl, siteUrl } from "./urls.ts";

// Router path → address shown to visitors: dashboard pages on my.url.space,
// with the dashboard itself at its root, everything else on url.space.
export function toPublicUrl(url: URL) {
	const base = new URL(isDashboardPath(url.pathname) ? dashboardUrl : siteUrl);
	const result = new URL(url);
	result.protocol = base.protocol;
	result.host = base.host;
	if (result.pathname === "/dashboard") {
		result.pathname = "/";
	}
	return result;
}
