import styles from "./Stack.module.css";

function Stack({
  children,
  gap = 1,
  direction = "column",
}: {
  children: React.ReactNode;
  gap?: number;
  direction?: "column" | "row";
}) {
  return (
    <div
      className={[styles.stack, direction === "row" && styles.row]
        .filter(Boolean)
        .join(" ")}
      style={{ "--gap": gap } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default Stack;
