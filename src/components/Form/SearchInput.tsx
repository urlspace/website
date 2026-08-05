import { useCombobox } from "downshift";
import { useEffect, useId, useState } from "react";
import Icon from "../Icons/Icons";
import styles from "./Form.module.css";

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

type Mode = "tag" | "col" | "is";

type ParsedInput = {
  freeText: string;
  mode: Mode | null;
  query: string;
};

// Active prefix = last "tag:" / "col:" / "is:" in the input that starts the
// string (or follows whitespace) AND has no whitespace between the colon and
// end. Whitespace after the query terminates prefix mode — see grilling notes.
function parseInput(raw: string): ParsedInput {
  const match = raw.match(/(?:^|\s)(tag:|col:|is:)(\S*)$/);
  if (!match) return { freeText: raw, mode: null, query: "" };

  const prefix = match[1];
  const query = match[2];
  const hasLeadingWs = match[0].length > prefix.length + query.length;
  const prefixStart = (match.index ?? 0) + (hasLeadingWs ? 1 : 0);

  const mode: Mode =
    prefix === "tag:" ? "tag" : prefix === "col:" ? "col" : "is";

  return {
    freeText: raw.slice(0, prefixStart),
    mode,
    query,
  };
}

type Item = { id: string; name: string };

const IS_OPTIONS: Item[] = [
  { id: "favourite", name: "Favourite" },
  { id: "forLater", name: "For later" },
];

function SearchInput({
  collections,
  favourite,
  forLater,
  label,
  onFavouriteChange,
  onForLaterChange,
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
  favourite: boolean;
  forLater: boolean;
  label: string;
  onFavouriteChange: React.Dispatch<React.SetStateAction<boolean>>;
  onForLaterChange: React.Dispatch<React.SetStateAction<boolean>>;
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
      document.getElementById(inputId)?.focus();
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [inputId]);

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
        : parsed.mode === "is"
          ? IS_OPTIONS.filter((o) => {
              if (o.id === "favourite" && favourite) return false;
              if (o.id === "forLater" && forLater) return false;
              return !queryLower || o.name.toLowerCase().includes(queryLower);
            })
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
    } else if (parsed.mode === "is") {
      if (item.id === "favourite") onFavouriteChange(true);
      else if (item.id === "forLater") onForLaterChange(true);
    }
  }

  function removeTag(id: string) {
    onSelectedTagsChange((prev) => prev.filter((t) => t !== id));
  }

  function removeCollection() {
    onSelectedCollectionChange(null);
  }

  const hasAnyFilter =
    rawInput.trim() !== "" ||
    favourite ||
    forLater ||
    collectionPill !== null ||
    tagPills.length > 0;

  function clearAll() {
    updateRawAndValue("");
    onSelectedTagsChange([]);
    onSelectedCollectionChange(null);
    onFavouriteChange(false);
    onForLaterChange(false);
    setEscapeClosed(false);
  }

  const {
    getInputProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox<Item>({
      items,
      inputValue: rawInput,
      isOpen,
      selectedItem: null,
      defaultHighlightedIndex: 0,
      inputId,
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
      } else if (forLater) {
        e.preventDefault();
        onForLaterChange(false);
      } else if (favourite) {
        e.preventDefault();
        onFavouriteChange(false);
      }
    }
  }

  return (
    <div className={styles.field}>
      <label {...getLabelProps({ className: styles.visuallyHidden })}>
        {label}
      </label>
      <div className={styles.comboboxWrapper}>
        <div className={styles.comboboxInputGroup}>
          <div className={styles.searchIcon}>
            <Icon.Search />
          </div>
          <div className={styles.searchInputInner}>
            {favourite ? (
              <span className={styles.tag}>
                Favourite
                <button
                  type="button"
                  className={styles.tagRemove}
                  aria-label="Remove Favourite filter"
                  onClick={() => onFavouriteChange(false)}
                >
                  <Icon.Close />
                </button>
              </span>
            ) : null}
            {forLater ? (
              <span className={styles.tag}>
                For later
                <button
                  type="button"
                  className={styles.tagRemove}
                  aria-label="Remove For later filter"
                  onClick={() => onForLaterChange(false)}
                >
                  <Icon.Close />
                </button>
              </span>
            ) : null}
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
          {hasAnyFilter ? (
            <button
              type="button"
              className={styles.searchClear}
              aria-label="Clear all filters"
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
                : parsed.mode === "col"
                  ? "No matching collections"
                  : "No matching filters"}
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
