import styles from "./Stack.module.css";

function Stack({
  children,
  gap = 1,
  fullHeight = false,
  spaceBetween = false,
  direction = "column",
}: {
  children: React.ReactNode;
  gap?: number;
  fullHeight?: boolean;
  spaceBetween?: boolean;
  direction?: "column" | "row";
}) {
  return (
    <div
      className={[
        styles.stack,
        fullHeight && styles.fullHeight,
        spaceBetween && styles.spaceBetween,
        direction === "row" && styles.row,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--gap": gap } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default Stack;
