import { Icon } from "..";

import styles from "./MenuElsewhere.module.css";

function MenuElsewhere() {
	return (
		<div className={styles.wrapper}>
			<ul className={styles.list}>
				<li className={styles.item}>
					<a href="https://github.com/urlspace">
						<Icon.GitHub />
						<span className="visually-hidden">GitHub</span>
					</a>
				</li>
				<li className={styles.item}>
					<a href="https://mastodon.social/@urlspace">
						<Icon.Mastodon />
						<span className="visually-hidden">Mastodon</span>
					</a>
				</li>
				<li className={styles.item}>
					<a href="https://bsky.app/profile/url.space">
						<Icon.Bluesky />
						<span className="visually-hidden">Bluesky</span>
					</a>
				</li>
			</ul>
		</div>
	);
}

export default MenuElsewhere;
