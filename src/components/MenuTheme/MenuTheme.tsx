import { DashboardButton } from "..";

import styles from "./menuTheme.module.css";

function MenuTheme() {
	return (
		<div className={styles.wrapper}>
			<p className={styles.title}>Theme:</p>
			<ul className={styles.list}>
				<li className={styles.item}>
					<DashboardButton
						onClick={() => console.log("Menu button clicked")}
						text="System"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButton
						onClick={() => console.log("Menu button clicked")}
						text="Light"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButton
						onClick={() => console.log("Menu button clicked")}
						text="Dark"
					/>
				</li>
			</ul>
		</div>
	);
}

export default MenuTheme;
