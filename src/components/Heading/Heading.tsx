import styles from "./Heading.module.css";

function Heading({
	level,
	text,
	bg = "bg-content",
}: {
	level: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
	bg?: "bg" | "bg-content";
}) {
	const Tag = `h${level}` as const;

	return (
		<div className={styles.heading}>
			<Tag
				className={`${styles.inner} ${styles[Tag]} ${bg === "bg" ? styles.bg : styles.bgContent}`}
			>
				{text}
			</Tag>
		</div>
	);
}

export default Heading;
