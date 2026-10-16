import styles from "./Manual.module.css";

function Manual({ steps }: { steps: Array<string> }) {
	return (
		<ol className={styles.manual}>
			{steps.map((step) => (
				<li key={step} className={styles.step}>
					{step}
				</li>
			))}
		</ol>
	);
}

export default Manual;
