import styles from "./Page.module.css";

function Page({
	children,
	narrow,
}: {
	children: React.ReactNode;
	narrow?: boolean;
}) {
	return (
		<div className={styles.page}>
			<div
				className={
					narrow ? `${styles.content} ${styles.narrow}` : styles.content
				}
			>
				{children}
			</div>
		</div>
	);
}

export default Page;
