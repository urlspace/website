import { Link } from "@tanstack/react-router";

import styles from "./Footer.module.css";

function Footer() {
	return (
		<nav aria-label="Footer navigation">
			<ul className={styles.navList}>
				<li>
					<Link className={styles.link} to="/privacy-policy">
						Privacy Policy
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Footer;
