import { type ReactNode, useState } from "react";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";
import { Button } from "../Button/Button";
import { DashboardButtonAction, Icon } from "..";

function TagsInput({
  description,
  disabled,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  description?: ReactNode;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (value: string[]) => void;
  value: string[];
  options: string[];
  placeholder: string;
}) {
  const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
    name,
    !!description,
  );
  const isDisabled = disabled || loading;
  const listId = `${inputId}-options`;
  const [inputValue, setInputValue] = useState("");

  function addTag(rawValue: string) {
    const tag = rawValue.trim();
    if (!tag || isDisabled) return;

    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
  }

  return (
    <div className={styles.field}>
      <label
        className={[styles.label, isDisabled && styles.labelDisabled]
          .filter(Boolean)
          .join(" ")}
        htmlFor={inputId}
      >
        {label}
      </label>

      <div className={styles.fieldRow}>
        <input
          aria-describedby={ariaDescribedBy}
          className={styles.input}
          disabled={isDisabled}
          form=""
          id={inputId}
          list={listId}
          name={name}
          placeholder={placeholder}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              addTag(e.currentTarget.value);
            }
          }}
        />
        <datalist id={listId}>
          {options.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
        <DashboardButtonAction
          onClick={() => addTag(inputValue)}
          text="Add tag"
          disabled={isDisabled}
        />
      </div>
      <ul className={styles.tagsList}>
        {value.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
            <button
              className={styles.tagRemove}
              type="button"
              aria-label={`Remove ${tag}`}
              disabled={isDisabled}
              onClick={() =>
                onChange(value.filter((selected) => selected !== tag))
              }
            >
              <Icon.Close />
            </button>
          </li>
        ))}
      </ul>

      {description ? (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default TagsInput;
