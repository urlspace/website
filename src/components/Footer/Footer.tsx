import { Link } from "@tanstack/react-router";

import Logo from "../Logo/Logo";
import MenuElsewhere from "../MenuElsewhere/MenuElsewhere";
import MenuTheme from "../MenuTheme/MenuTheme";

import styles from "./Footer.module.css";

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.top}>
				<div className={styles.intro}>
					<Logo to="/dashboard" />
					<p>
						A bookmarking service for people who love the web. Save, organise
						and share links. Open source, no ads, no tracking, no AI. Free for
						everyday use, unlimited for a small fee.
					</p>
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
				<div className={styles.menus}>
					<MenuElsewhere />
					<MenuTheme />
				</div>
			</div>
		</footer>
	);
}

export default Footer;
