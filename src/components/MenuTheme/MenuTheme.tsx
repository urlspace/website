import useTheme from "#/hooks/useTheme.ts";

import { DashboardButton } from "..";

import styles from "./MenuTheme.module.css";

function MenuTheme() {
	const [theme, setTheme] = useTheme();

	return (
		<div className={styles.wrapper}>
			<p className={styles.title}>Theme:</p>
			<ul className={styles.list}>
				<li className={styles.item}>
					<DashboardButton
						ariaPressed={theme === "system"}
						onClick={() => setTheme("system")}
						text="System"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButton
						ariaPressed={theme === "light"}
						onClick={() => setTheme("light")}
						text="Light"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButton
						ariaPressed={theme === "dark"}
						onClick={() => setTheme("dark")}
						text="Dark"
					/>
				</li>
			</ul>
		</div>
	);
}

export default MenuTheme;
