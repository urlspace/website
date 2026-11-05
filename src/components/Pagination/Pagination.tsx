import { Button } from "..";

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
			<div className={styles.previous}>
				<Button
					text="Previous"
					ariaDisabled={page <= 1}
					onClick={() => {
						if (page > 1) {
							onPageChange(page - 1);
						}
					}}
				/>
			</div>
			<span aria-live="polite">
				Page {page} of {totalPages}
			</span>
			<div className={styles.next}>
				<Button
					text="Next"
					ariaDisabled={page >= totalPages}
					onClick={() => {
						if (page < totalPages) {
							onPageChange(page + 1);
						}
					}}
				/>
			</div>
		</div>
	);
}

export default Pagination;
