import { Heading } from "#/components";

import styles from "./Features.module.css";

function Features() {
	return (
		<section className={styles.wrapper}>
			<div className={styles.list}>
				<div className={styles.item}>
					<Heading level={2} text="Save, organise and browse" />
					<p>
						There are plenty of ways to save links to url.space and organise
						them, and even more ways to filter and browse them. Everything is
						private by default, but if you'd like to share your wedding
						wishlist, public collections have you covered.
					</p>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="No AI features is a feature" />
					<p>
						In an age when AI assistants are built into washing machines and
						toasters, you don't need another one telling you how to save a link.
						No intelligent suggestions — just you and your curated list of
						links.
					</p>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="Open source" />
					<p>
						Privacy, transparency and building in public matter to us. Your data
						is yours, and we collect only what we need to give you the best
						bookmarking tool. Don't trust us? Every line of code is open source
						on <a href="https://github.com/urlspace">GitHub</a>.
					</p>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="API for developers" />
					<p>
						Missing a feature? No problem. Our API lets you manage your
						collections without ever opening the website. Build your own
						experience, integrate it with your apps, automate your workflow, and
						show us what you've built.
					</p>
				</div>
			</div>
		</section>
	);
}

export default Features;
