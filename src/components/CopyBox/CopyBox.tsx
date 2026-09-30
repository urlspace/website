import { useId, useState } from "react";
import Icon from "../Icons/Icons";
import styles from "./CopyBox.module.css";

function CopyBox({ value, label }: { value: string; label: string }) {
  const tooltipId = useId();
  const [result, setResult] = useState<{
    value: string;
    success: boolean;
  } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const copied = result?.value === value && result.success;
  const failed = result?.value === value && !result.success;

  async function handleCopy() {
    setAnnouncement("");

    try {
      await navigator.clipboard.writeText(value);
      setResult({ value, success: true });
      setAnnouncement(`${label} copied to clipboard.`);
    } catch {
      setResult({ value, success: false });
      setAnnouncement("Could not copy. Please copy the text manually.");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.value} role="region" aria-label={label}>
          {value}
        </div>
        <button
          type="button"
          className={styles.copy}
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
          {...{ interestfor: tooltipId }}
          onClick={handleCopy}
        >
          {copied ? <Icon.Check /> : <Icon.Copy />}
        </button>
        <span
          id={tooltipId}
          popover="hint"
          role="tooltip"
          className={styles.tooltip}
        >
          Copy {label}
        </span>
      </div>
      <p role="status" aria-atomic="true" className="visually-hidden">
        {result?.value === value ? announcement : ""}
      </p>
      {failed ? (
        <p className={styles.error}>
          Could not copy. Please copy the text manually.
        </p>
      ) : null}
    </div>
  );
}

export default CopyBox;
