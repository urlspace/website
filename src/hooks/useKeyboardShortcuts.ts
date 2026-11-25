import { useEffect, useEffectEvent, useRef } from "react";

const SEQUENCE_MS = 500;

type Options = {
	// The focusable titles of the items j/k/g/G move between, in order.
	getTitles: () => HTMLElement[];
	onShowShortcuts: () => void;
	onAddLink: () => void;
	onRefresh: () => void;
	onClearSearchText: () => void;
	onGoToAll: () => void;
	onToggleFavourite: () => void;
	onToggleForLater: () => void;
};

// j/k move focus between link card titles (Gmail/GitHub style), G jumps to
// the last one and gg to the first (Vim style), ga/gf/gl work like the All,
// Favourite and For later buttons, ? opens the shortcuts dialog, n the add
// link form, r refreshes the data and x clears the search text. Ignored while
// typing and when a modifier is held, so browser shortcuts like Ctrl+K keep
// working.
function useKeyboardShortcuts(options: Options) {
	const lastG = useRef(Number.NEGATIVE_INFINITY);

	// Sees the latest options on every key press, while the listener below is
	// added only once.
	const handleKey = useEffectEvent((e: KeyboardEvent) => {
		const isSequence = e.timeStamp - lastG.current <= SEQUENCE_MS;
		if (e.key !== "g") {
			lastG.current = Number.NEGATIVE_INFINITY;
		}
		if (
			!["j", "k", "g", "G", "?", "n", "r", "x", "a", "f", "l"].includes(e.key)
		) {
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

		// Recorded before the titles check, so ga/gf/gl work with no links.
		if (e.key === "g") {
			if (!isSequence) {
				lastG.current = e.timeStamp;
				return;
			}
			lastG.current = Number.NEGATIVE_INFINITY;
		}

		if (e.key === "a" || e.key === "f" || e.key === "l") {
			if (!isSequence) {
				return;
			}
			e.preventDefault();
			// Stops a focused link card from also toggling its own flags.
			e.stopPropagation();
			if (e.key === "a") {
				options.onGoToAll();
			} else if (e.key === "f") {
				options.onToggleFavourite();
			} else {
				options.onToggleForLater();
			}
			return;
		}

		if (e.key === "?") {
			e.preventDefault();
			options.onShowShortcuts();
			return;
		}

		if (e.key === "n") {
			e.preventDefault();
			options.onAddLink();
			return;
		}

		if (e.key === "r") {
			e.preventDefault();
			options.onRefresh();
			return;
		}

		if (e.key === "x") {
			e.preventDefault();
			options.onClearSearchText();
			return;
		}

		const titles = options.getTitles();
		if (!titles.length) {
			return;
		}

		let next: number;
		if (e.key === "G") {
			next = titles.length - 1;
		} else if (e.key === "g") {
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
	});

	useEffect(() => {
		// Capture runs before the link cards' own f and l handlers.
		window.addEventListener("keydown", handleKey, { capture: true });
		return () =>
			window.removeEventListener("keydown", handleKey, { capture: true });
	}, []);
}

export default useKeyboardShortcuts;
