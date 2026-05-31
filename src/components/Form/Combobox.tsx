import { useCombobox } from "downshift";
import { type ReactNode, useEffect, useState } from "react";
import Icon from "../Icons/Icons";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";

export type ComboboxOption = { name: string; value: string };

function Combobox({
  description,
  disabled,
  label,
  name,
  onChange,
  options,
  placeholder,
  required,
  value,
}: {
  description?: ReactNode;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
  options: ComboboxOption[];
  placeholder: string;
}) {
  const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
    name,
    !!description,
  );
  const selected = options.find((o) => o.value === value) ?? null;
  const isDisabled = disabled || loading;
  const [inputValue, setInputValue] = useState(selected?.name ?? "");

  // Keep the input text in sync when the external `value` changes (e.g. parent
  // resets the form).
  useEffect(() => {
    setInputValue(selected?.name ?? "");
  }, [selected]);

  const query = inputValue.trim().toLowerCase();
  const filtered =
    !query || query === selected?.name.toLowerCase()
      ? options
      : options.filter((o) => o.name.toLowerCase().includes(query));

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    selectItem,
  } = useCombobox({
    items: filtered,
    selectedItem: selected,
    inputValue,
    itemToString: (item) => item?.name ?? "",
    onInputValueChange: ({ inputValue: nextInput }) =>
      setInputValue(nextInput ?? ""),
    onSelectedItemChange: ({ selectedItem }) =>
      onChange(selectedItem?.value ?? ""),
    inputId,
    // On blur, discard free text that isn't a committed selection — revert the
    // input to the selected option's name, or clear it if nothing is selected.
    stateReducer: (_state, { type, changes }) => {
      if (type === useCombobox.stateChangeTypes.InputBlur) {
        return { ...changes, inputValue: changes.selectedItem?.name ?? "" };
      }
      return changes;
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
        <div className={styles.comboboxInputGroup}>
          <input
            {...getInputProps({
              "aria-describedby": ariaDescribedBy,
              className: styles.comboboxInput,
              disabled: isDisabled,
              name,
              placeholder,
              required,
            })}
          />
          {inputValue && !isDisabled ? (
            <button
              type="button"
              aria-label="Clear selection"
              className={styles.comboboxButton}
              onClick={() => {
                selectItem(null);
                setInputValue("");
              }}
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
          {isOpen && filtered.length === 0 ? (
            <li className={styles.comboboxEmpty}>No matching collection</li>
          ) : null}
          {isOpen
            ? filtered.map((item, index) => (
                <li
                  key={item.value}
                  {...getItemProps({ item, index })}
                  data-highlighted={highlightedIndex === index ? "" : undefined}
                  className={styles.comboboxItem}
                >
                  {item.name}
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

export default Combobox;
