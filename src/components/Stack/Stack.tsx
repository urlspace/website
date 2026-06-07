import styles from "./Stack.module.css";

function Stack({
	children,
	gap = 1,
	direction = "column",
	spaceBetween,
}: {
	children: React.ReactNode;
	gap?: number;
	direction?: "column" | "row";
	spaceBetween?: boolean;
}) {
	return (
		<div
			className={[
				styles.stack,
				direction === "row" && styles.row,
				spaceBetween && styles.spaceBetween,
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
