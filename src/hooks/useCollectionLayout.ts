import { useSyncExternalStore } from "react";

type Layout = "list" | "masonry";

const storageKey = "public-collection-layout";
const listeners = new Set<() => void>();
// Used when storage is unavailable (private browsing, blocked site data), so
// switching layout still works for the rest of the visit.
let memoryLayout: Layout = "list";

function getSnapshot(): Layout {
	try {
		const saved = window.localStorage.getItem(storageKey);
		if (saved === "list" || saved === "masonry") {
			return saved;
		}
	} catch {
		return memoryLayout;
	}
	return memoryLayout;
}

// The server can't know the saved layout, so it renders the list and the
// browser switches after hydration without a mismatch.
function getServerSnapshot(): Layout {
	return "list";
}

// The storage event covers other tabs. Writes in this tab notify listeners
// directly, since that event doesn't fire in the tab that wrote.
function subscribe(listener: () => void) {
	listeners.add(listener);
	window.addEventListener("storage", listener);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", listener);
	};
}

function setLayout(layout: Layout) {
	memoryLayout = layout;
	try {
		window.localStorage.setItem(storageKey, layout);
	} catch {
		// Storage is unavailable, memoryLayout keeps the choice for this visit.
	}
	for (const listener of listeners) {
		listener();
	}
}

function useCollectionLayout() {
	const layout = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);
	return [layout, setLayout] as const;
}

export default useCollectionLayout;
