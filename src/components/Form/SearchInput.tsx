import { useEffect, useId, useRef, useState } from "react";

import {
	applySuggestion,
	getSuggestions,
	parseSearchQuery,
	type SearchItem,
} from "#/searchQuery.ts";

import Icon from "../Icons/Icons";

import styles from "./Form.module.css";

// OpaqueRange isn't in TypeScript's DOM types yet.
type OpaqueRangeInput = HTMLInputElement & {
	createValueRange?: (start: number, end: number) => AbstractRange;
};

function SearchInput({
	collections,
	label,
	onEnter,
	onValueChange,
	placeholder,
	tags,
	value,
}: {
	collections: SearchItem[];
	label: string;
	onEnter: () => void;
	onValueChange: (v: string) => void;
	placeholder: string;
	tags: SearchItem[];
	value: string;
}) {
	const reactId = useId();
	const inputId = `search-${reactId}`;
	const listId = `${inputId}-list`;
	const inputRef = useRef<OpaqueRangeInput>(null);
	const popupRef = useRef<HTMLUListElement>(null);
	const [caret, setCaret] = useState(0);
	const [isDismissed, setIsDismissed] = useState(true);
	const [highlighted, setHighlighted] = useState(0);

	const suggestions = isDismissed
		? null
		: getSuggestions(value, caret, tags, collections);
	const isOpen = suggestions !== null;
	const activeIndex = suggestions
		? Math.min(highlighted, suggestions.items.length - 1)
		: 0;

	useEffect(() => {
		function handleGlobalKey(e: KeyboardEvent) {
			if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
			const target = e.target as HTMLElement | null;
			if (!target) return;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			)
				return;
			e.preventDefault();
			inputRef.current?.focus({ preventScroll: true });
		}
		window.addEventListener("keydown", handleGlobalKey);
		return () => window.removeEventListener("keydown", handleGlobalKey);
	}, []);

	useEffect(() => {
		popupRef.current?.togglePopover(isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		popupRef.current?.children[activeIndex]?.scrollIntoView({
			block: "nearest",
		});
	}, [isOpen, activeIndex]);

	useEffect(() => {
		const input = inputRef.current;
		if (!input?.createValueRange || !("highlights" in CSS)) return;
		const createRange = input.createValueRange.bind(input);
		const ranges = parseSearchQuery(value, tags, collections).ranges.map(
			({ start, end }) => createRange(start, end),
		);
		CSS.highlights.set("search-filter", new Highlight(...ranges));
		return () => {
			CSS.highlights.delete("search-filter");
		};
	}, [value, tags, collections]);

	function commit(token: string) {
		const input = inputRef.current;
		if (!suggestions || !input) return;
		const next = applySuggestion(value, suggestions, token);
		input.value = next.value;
		input.setSelectionRange(next.caret, next.caret);
		setCaret(next.caret);
		setHighlighted(0);
		onValueChange(next.value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.nativeEvent.isComposing) return;
		if (!suggestions) {
			if (e.key === "Enter") {
				e.preventDefault();
				onEnter();
			}
			return;
		}
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const count = suggestions.items.length;
			const step = e.key === "ArrowDown" ? 1 : -1;
			setHighlighted((activeIndex + step + count) % count);
		} else if (e.key === "Enter" || e.key === "Tab") {
			e.preventDefault();
			commit(suggestions.items[activeIndex]);
		} else if (e.key === "Escape") {
			e.preventDefault();
			setIsDismissed(true);
		}
	}

	function clearSearch() {
		onValueChange("");
		inputRef.current?.focus();
	}

	return (
		<search className={styles.field} style={{ marginInline: "-2px" }}>
			<label htmlFor={inputId} className={styles.visuallyHidden}>
				{label}
			</label>
			<div className={styles.comboboxWrapper}>
				<div className={styles.comboboxInputGroup}>
					<div className={styles.searchIcon}>
						<Icon.Search />
					</div>
					<input
						aria-activedescendant={
							isOpen ? `${listId}-${activeIndex}` : undefined
						}
						aria-autocomplete="list"
						aria-controls={listId}
						aria-expanded={isOpen}
						aria-keyshortcuts="/"
						autoComplete="off"
						className={styles.searchInput}
						id={inputId}
						onBlur={() => setIsDismissed(true)}
						onChange={(e) => {
							setCaret(e.currentTarget.selectionStart ?? 0);
							setIsDismissed(false);
							setHighlighted(0);
							onValueChange(e.currentTarget.value);
						}}
						onFocus={() => setIsDismissed(false)}
						onKeyDown={handleKeyDown}
						onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? 0)}
						placeholder={placeholder}
						ref={inputRef}
						role="combobox"
						spellCheck={false}
						type="text"
						value={value}
					/>
					{value === "" ? (
						<span className={styles.searchHint} aria-hidden="true">
							Press <kbd>/</kbd> to search
						</span>
					) : (
						<button
							type="button"
							className={styles.searchClear}
							aria-label="Clear search"
							onClick={clearSearch}
						>
							<Icon.Close />
						</button>
					)}
				</div>

				<ul
					aria-label="Filter suggestions"
					className={styles.comboboxPopup}
					id={listId}
					popover="manual"
					ref={popupRef}
					role="listbox"
				>
					{suggestions?.items.map((token, index) => (
						<li
							aria-selected={index === activeIndex}
							className={styles.comboboxItem}
							data-highlighted={index === activeIndex ? "" : undefined}
							id={`${listId}-${index}`}
							key={token}
							onClick={() => commit(token)}
							onMouseDown={(e) => e.preventDefault()}
							role="option"
						>
							{token}
						</li>
					))}
				</ul>
			</div>
		</search>
	);
}

export default SearchInput;
