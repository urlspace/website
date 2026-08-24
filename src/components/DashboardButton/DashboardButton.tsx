import styles from "./DashboardButton.module.css";

function DashbrardButton({
  ariaPressed,
  text,
  counter,
  icon,
  onClick,
}: {
  ariaPressed?: boolean;
  icon?: React.ReactNode;
  text: string;
  counter?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-pressed={ariaPressed}
    >
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.text}>
        {text}{" "}
        {counter || counter === 0 ? (
          <span className={styles.counter}>({counter}) </span>
        ) : null}
        {
          // this space at the end of the span is intentional
          // there is a terrible bug in safari that cuts off the last
          // closing parenthesis in the overflow: hodden containers
          // awful bug, and maybe one day i will have a better solutoin but for know
          // adding extra space is the simplext fix in this case
        }
      </div>
    </button>
  );
}

export default DashbrardButton;
