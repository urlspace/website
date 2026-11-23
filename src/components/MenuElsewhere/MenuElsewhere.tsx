import { DashboardButtonLink } from "..";

import styles from "./MenuElsewhere.module.css";

function MenuElsewhere() {
	return (
		<div className={styles.wrapper}>
			<p className={styles.title}>Elsewhere:</p>
			<ul className={styles.list}>
				<li className={styles.item}>
					<DashboardButtonLink
						to="https://github.com/urlspace"
						rel="me"
						text="GitHub"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButtonLink
						to="https://mastodon.social/@urlspace"
						rel="me"
						text="Mastodon"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButtonLink
						to="https://bsky.app/profile/url.space"
						rel="me"
						text="Bluesky"
					/>
				</li>
			</ul>
		</div>
	);
}

export default MenuElsewhere;
