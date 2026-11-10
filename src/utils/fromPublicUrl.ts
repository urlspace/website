import { dashboardUrl } from "./urls.ts";

// Address shown to visitors → router path. Undoes toPublicUrl's root mapping.
export function fromPublicUrl(url: URL) {
	if (url.origin !== new URL(dashboardUrl).origin || url.pathname !== "/") {
		return url;
	}
	const result = new URL(url);
	result.pathname = "/dashboard";
	return result;
}
