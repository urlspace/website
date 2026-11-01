import type { ReactNode } from "react";

import styles from "./Manual.module.css";

function Manual({ steps }: { steps: Array<ReactNode> }) {
	return (
		<ol className={styles.manual}>
			{steps.map((step, index) => (
				<li key={index} className={styles.step}>
					{step}
				</li>
			))}
		</ol>
	);
}

export default Manual;
