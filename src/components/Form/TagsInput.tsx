import { useCombobox, useMultipleSelection } from "downshift";
import { type ReactNode, useState } from "react";
import Icon from "../Icons/Icons";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";

// Mirrors the backend's tag name rule: lowercase letters/digits/hyphens,
// 2-50 chars, no leading/trailing or consecutive hyphens. Each hyphen must
// be followed by an alnum run, so "-tag", "tag-", "ta--g" can't match.
const TAG_PATTERN = /^(?=.{2,50}$)[a-z0-9]+(-[a-z0-9]+)*$/;

function TagsInput({
	description,
	disabled,
	label,
	name,
	onChange,
	options,
	placeholder,
	required,
	value,
	maxTags = 10,
}: {
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: string[]) => void;
	required?: boolean;
	value: string[];
	options: string[];
	placeholder: string;
	maxTags?: number;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const isDisabled = disabled || loading;
	const atMax = value.length >= maxTags;
	const [inputValue, setInputValue] = useState("");

	const query = inputValue.trim().toLowerCase();
	const available = options.filter((o) => !value.includes(o));
	const matches = query
		? available.filter((o) => o.includes(query))
		: available;
	const canCreate =
		TAG_PATTERN.test(query) &&
		!options.includes(query) &&
		!value.includes(query);
	const items = canCreate ? [...matches, query] : matches;

	const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
		useMultipleSelection<string>({
			selectedItems: value,
			onStateChange({ selectedItems: next, type }) {
				switch (type) {
					case useMultipleSelection.stateChangeTypes
						.SelectedItemKeyDownBackspace:
					case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
					case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
					case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
						onChange(next ?? []);
						break;
					default:
						break;
				}
			},
		});

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
	} = useCombobox<string>({
		items,
		inputValue,
		selectedItem: null,
		defaultHighlightedIndex: 0,
		inputId,
		stateReducer(_state, { changes, type }) {
			switch (type) {
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick:
					// Keep the menu open and the first item highlighted so the user
					// can add several tags in a row without re-opening.
					return { ...changes, isOpen: true, highlightedIndex: 0 };
				default:
					return changes;
			}
		},
		onStateChange({ inputValue: nextInput, type, selectedItem }) {
			switch (type) {
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick:
					if (selectedItem && !atMax) {
						onChange([...value, selectedItem]);
						setInputValue("");
					}
					break;
				case useCombobox.stateChangeTypes.InputChange:
					setInputValue(nextInput ?? "");
					break;
				default:
					break;
			}
		},
	});

	return (
		<div className={styles.field}>
			<label
				className={[styles.label, disabled && styles.labelDisabled]
					.filter(Boolean)
					.join(" ")}
				htmlFor={inputId}
			>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<div className={styles.comboboxWrapper}>
				<div className={styles.tagsInputGroup}>
					{value.map((tag, index) => (
						<span
							key={tag}
							className={styles.tag}
							{...getSelectedItemProps({ selectedItem: tag, index })}
						>
							{tag}
							<button
								type="button"
								className={styles.tagRemove}
								aria-label={`Remove ${tag}`}
								disabled={isDisabled}
								onClick={(e) => {
									e.stopPropagation();
									removeSelectedItem(tag);
								}}
							>
								<Icon.Close />
							</button>
						</span>
					))}
					<input
						{...getInputProps(
							getDropdownProps({
								"aria-describedby": ariaDescribedBy,
								className: styles.tagsInput,
								disabled: isDisabled,
								hidden: atMax,
								name,
								placeholder,
								preventKeyAction: isOpen,
								onKeyDown: (e) => {
									// Space commits the current text as a tag (no spaces allowed
									// in tags), matching the Apple Notes/Reminders convention.
									if (e.key === " ") {
										e.preventDefault();
										if (canCreate && !atMax) {
											onChange([...value, query]);
											setInputValue("");
										}
									}
								},
							}),
						)}
					/>
				</div>

				<ul
					{...getMenuProps({
						className: styles.comboboxPopup,
						hidden: !isOpen || atMax,
					})}
				>
					{isOpen && !atMax && items.length === 0 ? (
						<li className={styles.comboboxEmpty}>No matching tags</li>
					) : null}
					{isOpen && !atMax
						? items.map((item, index) => (
								<li
									key={item}
									{...getItemProps({ item, index })}
									data-highlighted={highlightedIndex === index ? "" : undefined}
									className={styles.comboboxItem}
								>
									{options.includes(item) ? item : `Add new tag "${item}"`}
								</li>
							))
						: null}
				</ul>
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

export default TagsInput;
