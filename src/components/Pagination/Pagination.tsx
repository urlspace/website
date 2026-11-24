import { ButtonBiggie } from "..";

import styles from "./Pagination.module.css";

function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className={styles.pagination}>
			{/* Keep focus on Previous or Next when it reaches a page boundary. */}
			<div className={styles.previous}>
				<ButtonBiggie
					text="Previous"
					ariaDisabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				/>
			</div>
			<span aria-live="polite">
				Page {page} of {totalPages}
			</span>
			<div className={styles.next}>
				<ButtonBiggie
					text="Next"
					ariaDisabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				/>
			</div>
		</div>
	);
}

export default Pagination;
