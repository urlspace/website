import { useEffect, useRef } from "react";

const G_SEQUENCE_MS = 500;

type Options = {
	// The focusable titles of the items j/k/g/G move between, in order.
	getTitles: () => HTMLElement[];
	onShowShortcuts: () => void;
	onAddLink: () => void;
	onRefresh: () => void;
	onClearFilters: () => void;
};

// j/k move focus between link card titles (Gmail/GitHub style), G jumps to
// the last one and gg to the first (Vim style), ? opens the shortcuts
// dialog, n the add link form, r refreshes the data and x clears every
// filter. Ignored while typing and when a modifier is held, so browser
// shortcuts like Ctrl+K keep working.
function useKeyboardShortcuts(options: Options) {
	// Always calls the latest callbacks without re-adding the listener.
	const optionsRef = useRef(options);

	useEffect(() => {
		optionsRef.current = options;
	});

	useEffect(() => {
		let lastG = Number.NEGATIVE_INFINITY;
		function handleKey(e: KeyboardEvent) {
			if (e.key !== "g") {
				lastG = Number.NEGATIVE_INFINITY;
			}
			if (!["j", "k", "g", "G", "?", "n", "r", "x"].includes(e.key)) {
				return;
			}
			// ignore modifiers so browser shortcuts like Ctrl+K keeps working
			if (e.ctrlKey || e.metaKey || e.altKey) {
				return;
			}
			// prevent holding down g to trigger gg
			if (e.key === "g" && e.repeat) {
				return;
			}
			const target = e.target as HTMLElement;
			// ignore typing in the fields
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			) {
				return;
			}
			// Shortcuts are off while a dialog or the drawer is open. That includes
			// the closing animation, since the element stays [open] until it ends.
			if (document.querySelector("dialog[open]")) {
				return;
			}

			if (e.key === "?") {
				e.preventDefault();
				optionsRef.current.onShowShortcuts();
				return;
			}

			if (e.key === "n") {
				e.preventDefault();
				optionsRef.current.onAddLink();
				return;
			}

			if (e.key === "r") {
				e.preventDefault();
				optionsRef.current.onRefresh();
				return;
			}

			if (e.key === "x") {
				e.preventDefault();
				optionsRef.current.onClearFilters();
				return;
			}

			const titles = optionsRef.current.getTitles();
			if (!titles.length) {
				return;
			}

			let next: number;
			if (e.key === "G") {
				next = titles.length - 1;
			} else if (e.key === "g") {
				if (e.timeStamp - lastG > G_SEQUENCE_MS) {
					lastG = e.timeStamp;
					return;
				}
				lastG = Number.NEGATIVE_INFINITY;
				next = 0;
			} else {
				const current = titles.findIndex((a) =>
					a.closest("article")?.contains(target),
				);
				next = current === -1 ? 0 : current + (e.key === "j" ? 1 : -1);
			}
			e.preventDefault();

			// clamp so the j and k do not go out of bounds
			const title = titles[Math.max(0, Math.min(next, titles.length - 1))];
			title.focus({ preventScroll: true });
			title.closest("article")?.scrollIntoView({ block: "nearest" });
		}
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);
}

export default useKeyboardShortcuts;
