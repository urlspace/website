import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useSyncExternalStore } from "react";

import { hasSeparateDashboard, siteUrl } from "#/utils/urls.ts";

type Theme = "system" | "light" | "dark";

const cookieName = "theme";
// Shared with the dashboard host (my.url.space). Locally both are the same
// host, so the cookie stays host-only.
const domain = hasSeparateDashboard
	? `; Domain=${new URL(siteUrl).hostname}`
	: "";
const listeners = new Set<() => void>();
// Used when cookies are blocked, so switching theme still works for the
// rest of the visit.
let memoryTheme: Theme | null = null;

function toTheme(value: string | undefined): Theme {
	return value === "light" || value === "dark" ? value : "system";
}

// A cookie rather than localStorage: the server renders the saved theme
// straight away, so the page never flashes the wrong one.
const getTheme = createIsomorphicFn()
	.server(() => toTheme(getCookie(cookieName)))
	.client(() => {
		const saved = document.cookie
			.split("; ")
			.find((cookie) => cookie.startsWith(`${cookieName}=`))
			?.slice(cookieName.length + 1);
		return saved === undefined && memoryTheme !== null
			? memoryTheme
			: toTheme(saved);
	});

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

// Choosing "system" (the default) deletes the cookie, the simple way to object
// that lets a preference cookie skip consent under UK PECR Schedule A1 para 6.
function setTheme(theme: Theme) {
	memoryTheme = theme;
	document.cookie =
		theme === "system"
			? `${cookieName}=; Path=/${domain}; Max-Age=0; SameSite=Lax; Secure`
			: `${cookieName}=${theme}; Path=/${domain}; Max-Age=31536000; SameSite=Lax; Secure`;
	for (const listener of listeners) {
		listener();
	}
}

function useTheme() {
	const theme = useSyncExternalStore(subscribe, getTheme, getTheme);
	return [theme, setTheme] as const;
}

export default useTheme;
