import styles from "./KeyboardShortcuts.module.css";

function KeyboardShortcuts() {
	return (
		<div className={styles.wrapper}>
			<section className={styles.group} aria-labelledby="shortcuts-navigation">
				<h3 id="shortcuts-navigation" className={styles.heading}>
					Navigation
				</h3>
				<dl className={styles.list}>
					<div className={styles.item}>
						<dt>Focus search</dt>
						<dd>
							<kbd>/</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Next link</dt>
						<dd>
							<kbd>j</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Previous link</dt>
						<dd>
							<kbd>k</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>First link</dt>
						<dd>
							<kbd>g</kbd> <kbd>g</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Last link</dt>
						<dd>
							<kbd>G</kbd>
						</dd>
					</div>
				</dl>
			</section>

			<section className={styles.group} aria-labelledby="shortcuts-filters">
				<h3 id="shortcuts-filters" className={styles.heading}>
					Filters
				</h3>
				<dl className={styles.list}>
					<div className={styles.item}>
						<dt>All</dt>
						<dd>
							<kbd>g</kbd> <kbd>a</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Favourite</dt>
						<dd>
							<kbd>g</kbd> <kbd>f</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>For later</dt>
						<dd>
							<kbd>g</kbd> <kbd>l</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Clear search text</dt>
						<dd>
							<kbd>x</kbd>
						</dd>
					</div>
				</dl>
			</section>

			<section className={styles.group} aria-labelledby="shortcuts-link">
				<h3 id="shortcuts-link" className={styles.heading}>
					Focused link
				</h3>
				<dl className={styles.list}>
					<div className={styles.item}>
						<dt>Favourite</dt>
						<dd>
							<kbd>f</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>For later</dt>
						<dd>
							<kbd>l</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Edit</dt>
						<dd>
							<kbd>e</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Delete</dt>
						<dd>
							Hold <kbd>d</kbd>
						</dd>
					</div>
				</dl>
			</section>

			<section className={styles.group} aria-labelledby="shortcuts-general">
				<h3 id="shortcuts-general" className={styles.heading}>
					General
				</h3>
				<dl className={styles.list}>
					<div className={styles.item}>
						<dt>Add link</dt>
						<dd>
							<kbd>n</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Refresh</dt>
						<dd>
							<kbd>r</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Show keyboard shortcuts</dt>
						<dd>
							<kbd>?</kbd>
						</dd>
					</div>
					<div className={styles.item}>
						<dt>Close dialog</dt>
						<dd>
							<kbd>Esc</kbd>
						</dd>
					</div>
				</dl>
			</section>
		</div>
	);
}

export default KeyboardShortcuts;
