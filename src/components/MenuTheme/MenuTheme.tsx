import useTheme from "#/hooks/useTheme.ts";

import { Button } from "..";

import styles from "./MenuTheme.module.css";

function MenuTheme({ hideTitle }: { hideTitle?: boolean }) {
	const [theme, setTheme] = useTheme();

	return (
		<div className={styles.wrapper}>
			{hideTitle ? null : <p className={styles.title}>Theme:</p>}
			<ul className={styles.list}>
				<li className={styles.item}>
					<Button
						ariaPressed={theme === "system"}
						onClick={() => setTheme("system")}
						text="System"
					/>
				</li>
				<li className={styles.item}>
					<Button
						ariaPressed={theme === "light"}
						onClick={() => setTheme("light")}
						text="Light"
					/>
				</li>
				<li className={styles.item}>
					<Button
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
