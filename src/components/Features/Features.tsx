import { Link } from "@tanstack/react-router";

import { Heading } from "#/components";

import styles from "./Features.module.css";

function Features() {
	return (
		<section className={styles.wrapper} id="features">
			<div className={styles.list}>
				<div className={styles.item}>
					<Heading level={2} text="Save, organise and browse" />
					<p>
						Saving links is instant. Organise them however you like, mark
						favourites, keep some for later, then find any of them with powerful
						filters. No clutter, no features you'll never use, just what a good
						bookmarking service needs.
					</p>
					<Link to="/documentation/core-concepts">Explore core concepts</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="Private and public collections" />
					<p>
						Collections are private by default, but some lists are meant to be
						shared, like a wishlist or your favourite conference talks. A public
						collection gets its own page and RSS feed, and anyone can clone it
						into their own account. Add a password to keep it to the people you
						choose.
					</p>
					<Link to="/documentation/core-concepts/collections">
						Learn more about collections
					</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="No AI features" />
					<p>
						When even your washing machine has an AI assistant, you don't need
						another one deciding how to save a link. No intelligent suggestions,
						no auto-categorisation, just you and your curated list of links.
					</p>
					<Link to="/" hash="about">
						Thinking behind url.space
					</Link>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="Open source" />
					<p>
						Built in public, with privacy and transparency at its core. Only the
						data needed to run the service is collected. Every line of code is
						open source.
					</p>
					<a href="https://github.com/urlspace">
						Check out the project on GitHub
					</a>
				</div>
				<div className={styles.item}>
					<Heading level={2} text="API for developers" />
					<p>
						Missing a feature? Build it. The API lets you manage your links and
						collections without opening the website. Automate your workflow,
						connect your apps, and share what you've built.
					</p>
					<Link to="/documentation/api">Go to the API documentation</Link>
				</div>
			</div>
		</section>
	);
}

export default Features;
