import styles from "./Pills.module.css";
import Icon from "../Icons/Icons.tsx";

function Pills({
  items,
  disabled,
  noWrap = false,
}: {
  items: {
    id: string;
    label: string;
    onRemove: () => void;
  }[];
  disabled?: boolean;
  noWrap?: boolean;
}) {
  return (
    <ul
      className={[styles.tagsList, noWrap && styles.tagsListNoWrap]
        .filter(Boolean)
        .join(" ")}
      role="list"
    >
      {items.map((item) => (
        <li key={item.id} className={styles.tag}>
          {item.label}
          <button
            className={styles.tagRemove}
            type="button"
            aria-label={`Remove ${item.label}`}
            disabled={disabled}
            onClick={item.onRemove}
          >
            <Icon.Close />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Pills;
