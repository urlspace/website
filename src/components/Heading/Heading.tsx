import styles from "./Heading.module.css";

function Heading({
	level,
	text,
}: {
	level: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
}) {
	const Tag = `h${level}` as const;

	return (
		<div className={styles.heading}>
			<Tag className={`${styles.inner} ${styles[Tag]}`}>{text}</Tag>
		</div>
	);
}

export default Heading;
