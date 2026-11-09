import styles from "./Stats.module.css";

function Stats({
	totalResults,
	currentPage,
	totalPages,
	linksResponse,
}: {
	totalResults: number | undefined;
	currentPage: number | undefined;
	totalPages: number | undefined;
	linksResponse: number | undefined;
}) {
	return (
		<dl className={styles.stats}>
			<div className={styles.item} aria-live="polite" aria-atomic="true">
				<dt className={styles.term}>Results</dt>
				<dd>{totalResults ? totalResults : "-"}</dd>
			</div>

			{currentPage !== undefined &&
			totalPages !== undefined &&
			totalPages > 1 ? (
				<div className={styles.item}>
					<dt className={styles.term}>Pages</dt>
					<dd>
						{currentPage}/{totalPages}
					</dd>
				</div>
			) : null}

			{linksResponse !== undefined ? (
				<div className={styles.item}>
					<dt className={styles.term}>Response time</dt>
					<dd>{linksResponse}ms</dd>
				</div>
			) : null}
		</dl>
	);
}

export default Stats;
