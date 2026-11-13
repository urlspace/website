import { Link } from "@tanstack/react-router";

import { Heading } from "#/components";

import styles from "./Features.module.css";

function Features() {
	return (
		<section className={styles.wrapper}>
			<div className={styles.list}>
				<div className={styles.item}>
					<Heading level={2} text="Save, organise and browse" />
					<p>
						Saving links is simple on its own, and browser extensions and
						integrations with the tools you already use make it even easier.
						Group links into collections, add tags, mark favourites and keep a
						list for later.
					</p>
					<Link to="/docs">Learn more about links</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="Private and public collections" />
					<p>
						Collections are private by default, but some lists are meant to be
						shared, like a wedding wishlist, a course reading list or your
						favourite conference talks. Make a collection public to give it its
						own page and RSS feed, and let anyone clone it into their own
						account. Available on Pro.
					</p>
					<Link to="/docs">Learn more about collections</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="No AI features" />
					<p>
						In an age when AI assistants are built into washing machines and
						toasters, you don't need another one telling you how to save a link.
						No intelligent suggestions, just you and your curated list of links.
					</p>
					<Link to="/docs">Learn more about the no-AI approach</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="Open source" />
					<p>
						Built in public, with privacy and transparency at its core. Only the
						data needed to run the service is collected. Every line of code is
						open source on <a href="https://github.com/urlspace">GitHub</a>.
					</p>
					<Link to="/docs">Learn more about the project</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="API for developers" />
					<p>
						Missing a feature? Build it. The API lets you manage your links and
						collections without opening the website. Automate your workflow,
						connect your apps, and share what you've built.
					</p>
					<Link to="/docs">Learn more about the API</Link>
				</div>
			</div>
		</section>
	);
}

export default Features;
