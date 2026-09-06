import { type ReactNode, useRef, useState } from "react";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";
import { DashboardButtonAction, Icon } from "..";

const tagNamePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const maxTags = 10;

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const errorId = `${inputId}-error`;

  function addTag(rawValue: string) {
    if (isDisabled) return;

    const tag = rawValue.trim().toLowerCase();

    if (tag.length < 2 || tag.length > 50) {
      setError("Tag names must be between 2 and 50 characters.");
      return;
    }

    if (!tagNamePattern.test(tag)) {
      setError(
        "Use letters a–z, numbers, and single hyphens between words. Start and end with a letter or number.",
      );
      return;
    }

    if (value.some((selected) => selected.toLowerCase() === tag)) {
      setInputValue("");
      setError(null);
      return;
    }

    if (value.length >= maxTags) {
      setError(`You can add up to ${maxTags} tags. Remove one to add another.`);
      return;
    }

    onChange([...value, tag]);
    setInputValue("");
    setError(null);
    setStatus(`Tag ${tag} added.`);
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
          aria-describedby={
            [ariaDescribedBy, error ? errorId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={error ? true : undefined}
          className={styles.input}
          disabled={isDisabled}
          form=""
          id={inputId}
          ref={inputRef}
          list={listId}
          name={name}
          pattern="\s*(?=[A-Za-z0-9\-]{2,50}\s*$)[A-Za-z0-9]+(-[A-Za-z0-9]+)*\s*"
          placeholder={placeholder}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              addTag(e.currentTarget.value);
            }
          }}
        />
        <datalist id={listId}>
          {options
            .filter(
              (tag) =>
                !value.some(
                  (selected) => selected.toLowerCase() === tag.toLowerCase(),
                ),
            )
            .map((tag) => (
              <option key={tag} value={tag} />
            ))}
        </datalist>
        <DashboardButtonAction
          onClick={() => {
            addTag(inputValue);
            inputRef.current?.focus();
          }}
          text="Add tag"
          disabled={isDisabled}
        />
      </div>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <ul className={styles.tagsList} role="list">
        {value.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
            <button
              className={styles.tagRemove}
              type="button"
              aria-label={`Remove ${tag}`}
              disabled={isDisabled}
              onClick={() => {
                onChange(value.filter((selected) => selected !== tag));
                setError(null);
                setStatus(`Tag ${tag} removed.`);
              }}
            >
              <Icon.Close />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.visuallyHidden} role="status" aria-atomic="true">
        {status}
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
