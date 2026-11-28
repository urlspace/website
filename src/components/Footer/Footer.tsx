import { Link } from "@tanstack/react-router";

import MenuElsewhere from "../MenuElsewhere/MenuElsewhere";
import MenuTheme from "../MenuTheme/MenuTheme";

import styles from "./Footer.module.css";

function Footer() {
	return (
		<div className={styles.footer}>
			<MenuElsewhere />
			<MenuTheme />
			<ul className={styles.navList}>
				<li>© 2026 url.space</li>
				<li>
					<Link className={styles.link} to="/privacy-policy">
						Privacy Policy
					</Link>
				</li>
				<li>
					<Link className={styles.link} to="/terms-of-service">
						Terms of service
					</Link>
				</li>
			</ul>
		</div>
	);
}

export default Footer;
