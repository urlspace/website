import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useSyncExternalStore } from "react";

type Layout = "list" | "masonry";

const cookieName = "collection-layout";
const listeners = new Set<() => void>();
// Used when cookies are blocked, so switching layout still works for the
// rest of the visit.
let memoryLayout: Layout | null = null;

function toLayout(value: string | undefined): Layout {
	return value === "masonry" ? "masonry" : "list";
}

// A cookie rather than localStorage: the server reads it from the request and
// renders the saved layout straight away, and the browser reads the same
// cookie while hydrating, so the page never jumps between layouts.
const getLayout = createIsomorphicFn()
	.server(() => toLayout(getCookie(cookieName)))
	.client(() => {
		const saved = document.cookie
			.split("; ")
			.find((cookie) => cookie.startsWith(`${cookieName}=`))
			?.slice(cookieName.length + 1);
		return saved === undefined && memoryLayout !== null
			? memoryLayout
			: toLayout(saved);
	});

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

// Written in the browser, so switching needs no request. Not HttpOnly, since
// a layout preference has nothing to protect.
function setLayout(layout: Layout) {
	memoryLayout = layout;
	document.cookie = `${cookieName}=${layout}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
	for (const listener of listeners) {
		listener();
	}
}

function useCollectionLayout() {
	const layout = useSyncExternalStore(subscribe, getLayout, getLayout);
	return [layout, setLayout] as const;
}

export default useCollectionLayout;
