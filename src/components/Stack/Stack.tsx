import styles from "./Stack.module.css";

function Stack({
	children,
	gap = 1,
	direction = "column",
	spaceBetween,
	alignCenter,
}: {
	children: React.ReactNode;
	gap?: number;
	direction?: "column" | "row";
	spaceBetween?: boolean;
	alignCenter?: boolean;
}) {
	return (
		<div
			className={[
				styles.stack,
				direction === "row" && styles.row,
				spaceBetween && styles.spaceBetween,
				alignCenter && styles.alignCenter,
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
