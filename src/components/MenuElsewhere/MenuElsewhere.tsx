import { DashboardButtonLink } from "..";

import styles from "./menuElsewhere.module.css";

function MenuElsewhere() {
	return (
		<div className={styles.wrapper}>
			<p className={styles.title}>Elsewhere:</p>
			<ul className={styles.list}>
				<li className={styles.item}>
					<DashboardButtonLink to="https://github.com/urlspace" text="GitHub" />
				</li>
				<li className={styles.item}>
					<DashboardButtonLink
						to="https://mastodon.social/@urlspace"
						text="Mastodon"
					/>
				</li>
				<li className={styles.item}>
					<DashboardButtonLink
						to="https://bsky.app/profile/url.space"
						text="Bluesky"
					/>
				</li>
			</ul>
		</div>
	);
}

export default MenuElsewhere;
