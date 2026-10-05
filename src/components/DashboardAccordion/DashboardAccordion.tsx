import Icon from "../Icons/Icons";
import styles from "./DashboardAccordion.module.css";

function DashbrardAccordtion({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details open>
      <summary className={styles.summary}>
        {summary}
        <Icon.ChevronDown />
      </summary>
      {children}
    </details>
  );
}

export default DashbrardAccordtion;
