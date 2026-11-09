import Icon from "../Icons/Icons.tsx";

import styles from "./Pills.module.css";

function Pills({
	items,
	disabled,
}: {
	items: {
		id: string;
		label: string;
		onRemove: () => void;
	}[];
	disabled?: boolean;
}) {
	return (
		<ul className={styles.tagsList} role="list">
			{items.map((item) => (
				<li key={item.id} className={styles.tag}>
					{item.label}
					<button
						className={styles.tagRemove}
						type="button"
						aria-label={`Remove ${item.label}`}
						disabled={disabled}
						onClick={item.onRemove}
					>
						<Icon.Close />
					</button>
				</li>
			))}
		</ul>
	);
}

export default Pills;
