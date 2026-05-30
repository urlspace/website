import { useCombobox } from "downshift";
import { useEffect, useId, useState } from "react";
import styles from "../Form/Form.module.css";
import Icon from "../Icons/Icons";
import localStyles from "./SearchInput.module.css";

type TagRow = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

type CollectionRow = {
	id: string;
	name: string;
	description: string;
	public: boolean;
	createdAt: string;
	updatedAt: string;
};

type ParsedInput = {
	freeText: string;
	mode: "tag" | "col" | null;
	query: string;
};

// Active prefix = last "tag:" or "col:" in the input that starts the string
// (or follows whitespace) AND has no whitespace between the colon and end.
// Whitespace after the query terminates prefix mode — see grilling notes.
function parseInput(raw: string): ParsedInput {
	const match = raw.match(/(?:^|\s)(tag:|col:)(\S*)$/);
	if (!match) return { freeText: raw, mode: null, query: "" };

	const prefix = match[1];
	const query = match[2];
	const hasLeadingWs = match[0].length > prefix.length + query.length;
	const prefixStart = (match.index ?? 0) + (hasLeadingWs ? 1 : 0);

	return {
		freeText: raw.slice(0, prefixStart),
		mode: prefix === "tag:" ? "tag" : "col",
		query,
	};
}

type Item = { id: string; name: string };

function SearchInput({
	collections,
	label,
	onSelectedCollectionChange,
	onSelectedTagsChange,
	onValueChange,
	placeholder,
	selectedCollection,
	selectedTags,
	tags,
	value,
}: {
	collections: CollectionRow[];
	label: string;
	onSelectedCollectionChange: React.Dispatch<
		React.SetStateAction<string | null>
	>;
	onSelectedTagsChange: React.Dispatch<React.SetStateAction<string[]>>;
	onValueChange: (v: string) => void;
	placeholder: string;
	selectedCollection: string | null;
	selectedTags: string[];
	tags: TagRow[];
	value: string;
}) {
	const reactId = useId();
	const inputId = `search-${reactId}`;
	const [rawInput, setRawInput] = useState(value);
	const [escapeClosed, setEscapeClosed] = useState(false);

	// Sync external value resets (e.g. clear-all elsewhere) into rawInput.
	// biome-ignore lint/correctness/useExhaustiveDependencies: only react to external value changes
	useEffect(() => {
		const currentFree = parseInput(rawInput).freeText.trim();
		if (currentFree !== value) {
			setRawInput(value);
			setEscapeClosed(false);
		}
	}, [value]);

	const parsed = parseInput(rawInput);
	const queryLower = parsed.query.toLowerCase();
	const isOpen = parsed.mode !== null && !escapeClosed;

	const items: Item[] =
		parsed.mode === "tag"
			? tags
					.filter((t) => !selectedTags.includes(t.id))
					.filter(
						(t) => !queryLower || t.name.toLowerCase().includes(queryLower),
					)
					.map((t) => ({ id: t.id, name: t.name }))
			: parsed.mode === "col"
				? collections
						.filter(
							(c) => !queryLower || c.name.toLowerCase().includes(queryLower),
						)
						.map((c) => ({ id: c.id, name: c.name }))
				: [];

	const collectionPill = selectedCollection
		? (collections.find((c) => c.id === selectedCollection) ?? null)
		: null;
	const tagPills = selectedTags
		.map((id) => tags.find((t) => t.id === id))
		.filter((t): t is TagRow => t !== undefined);

	function updateRawAndValue(next: string) {
		setRawInput(next);
		const nextFree = parseInput(next).freeText.trim();
		if (nextFree !== value) onValueChange(nextFree);
	}

	function commit(item: Item) {
		const nextRaw = parsed.freeText;
		updateRawAndValue(nextRaw);
		if (parsed.mode === "tag") {
			onSelectedTagsChange((prev) =>
				prev.includes(item.id) ? prev : [...prev, item.id],
			);
		} else if (parsed.mode === "col") {
			onSelectedCollectionChange(item.id);
		}
	}

	function removeTag(id: string) {
		onSelectedTagsChange((prev) => prev.filter((t) => t !== id));
	}

	function removeCollection() {
		onSelectedCollectionChange(null);
	}

	function clearAll() {
		setRawInput("");
		setEscapeClosed(false);
		if (value !== "") onValueChange("");
		if (selectedTags.length > 0) onSelectedTagsChange([]);
		if (selectedCollection !== null) onSelectedCollectionChange(null);
	}

	const hasAnything =
		rawInput.length > 0 ||
		selectedTags.length > 0 ||
		selectedCollection !== null;

	const { getInputProps, getMenuProps, getItemProps, highlightedIndex } =
		useCombobox<Item>({
			items,
			inputValue: rawInput,
			isOpen,
			selectedItem: null,
			defaultHighlightedIndex: 0,
			id: inputId,
			itemToString: (item) => item?.name ?? "",
			stateReducer(_state, { changes, type }) {
				switch (type) {
					case useCombobox.stateChangeTypes.InputKeyDownEnter:
					case useCombobox.stateChangeTypes.ItemClick:
						return { ...changes, highlightedIndex: 0 };
					default:
						return changes;
				}
			},
			onStateChange({ inputValue: nextInput, type, selectedItem }) {
				switch (type) {
					case useCombobox.stateChangeTypes.InputChange:
						setEscapeClosed(false);
						updateRawAndValue(nextInput ?? "");
						break;
					case useCombobox.stateChangeTypes.InputKeyDownEnter:
					case useCombobox.stateChangeTypes.ItemClick:
						if (selectedItem) commit(selectedItem);
						break;
					case useCombobox.stateChangeTypes.InputKeyDownEscape:
						setEscapeClosed(true);
						break;
					default:
						break;
				}
			},
		});

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace" && rawInput === "") {
			if (tagPills.length > 0) {
				e.preventDefault();
				removeTag(tagPills[tagPills.length - 1].id);
			} else if (collectionPill) {
				e.preventDefault();
				removeCollection();
			}
		}
	}

	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
			</label>

			<div className={styles.comboboxWrapper}>
				<div className={localStyles.group}>
					<div className={localStyles.inner}>
						{collectionPill ? (
							<span className={styles.tag}>
								Collection: {collectionPill.name}
								<button
									type="button"
									className={styles.tagRemove}
									aria-label={`Remove collection ${collectionPill.name}`}
									onClick={removeCollection}
								>
									<Icon.Close />
								</button>
							</span>
						) : null}
						{tagPills.map((tag) => (
							<span key={tag.id} className={styles.tag}>
								#{tag.name}
								<button
									type="button"
									className={styles.tagRemove}
									aria-label={`Remove ${tag.name}`}
									onClick={() => removeTag(tag.id)}
								>
									<Icon.Close />
								</button>
							</span>
						))}
						<input
							{...getInputProps({
								className: styles.tagsInput,
								placeholder,
								onKeyDown: handleKeyDown,
							})}
						/>
					</div>
					{hasAnything ? (
						<button
							type="button"
							aria-label="Clear search"
							className={styles.comboboxButton}
							onClick={clearAll}
						>
							<Icon.Close />
						</button>
					) : null}
				</div>

				<ul
					{...getMenuProps({
						className: styles.comboboxPopup,
						hidden: !isOpen,
					})}
				>
					{isOpen && items.length === 0 ? (
						<li className={styles.comboboxEmpty}>
							{parsed.mode === "tag"
								? "No matching tags"
								: "No matching collections"}
						</li>
					) : null}
					{isOpen
						? items.map((item, index) => (
								<li
									key={item.id}
									{...getItemProps({ item, index })}
									data-highlighted={highlightedIndex === index ? "" : undefined}
									className={styles.comboboxItem}
								>
									{parsed.mode === "tag" ? `#${item.name}` : item.name}
								</li>
							))
						: null}
				</ul>
			</div>
		</div>
	);
}

export default SearchInput;
