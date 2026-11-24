import meAvif from "#/assets/images/me.avif";
import meJpg from "#/assets/images/me.jpg";
import meWebp from "#/assets/images/me.webp";

import Heading from "../Heading/Heading";

import styles from "./About.module.css";

function About() {
	return (
		<section className={styles.wrapper} id="about">
			<div className={styles.dots}>
				<div className={styles.grid}>
					<div className={styles.content}>
						<Heading level={2} text="Why another bookmarking service?" />
						<p>
							The web is filling up with junk. AI-written articles have
							outnumbered human ones, and bots now generate more traffic than we
							do. Search engines have stopped sending us to websites. Instead,
							they serve up a mediocre mashup of someone else's work without
							crediting the original creators, while tracking us and selling
							everything they learn. I don't care about that internet. I care
							about the one built by people, for people.
						</p>

						<p>
							Browser bookmarks suck. I've tried pretty much{" "}
							<a href="https://url.space/pawelgrzybek/bookmarking-tools">
								every bookmarking service out there
							</a>
							. Plenty of them are good, but most have drifted into adding
							features a bookmarking tool simply doesn't need. So I
							cherry-picked what matters and built url.space. Accessibility,
							performance and user experience come first, and everything else
							has to earn its place.
						</p>
					</div>
					<aside className={styles.author} aria-label="About the author">
						<picture className={styles.image}>
							<source srcSet={meAvif} type="image/avif" />
							<source srcSet={meWebp} type="image/webp" />
							<img
								src={meJpg}
								width={1000}
								height={1000}
								loading="lazy"
								alt="Paweł Grzybek, smiling, wearing NN1 Dev Club tshirt at the beach."
							/>
						</picture>

						<div className={styles.bio}>
							<div>
								<p className={styles.name}>Paweł Grzybek</p>
								<p className={styles.role}>Creator of url.space</p>
							</div>
							<p>
								I'm a software developer from Poland living in Northampton, UK.
								I'm a web standards enthusiast, accessibility advocate, and
								simplicity guardian. The guy behind the{" "}
								<a href="https://nn1.dev">NN1 Dev Club meetup</a>. After-hours
								hip hop head, funky records collector, and photographer.
							</p>

							<ul className={styles.social}>
								<li>
									<a href="https://pawelgrzybek.com">Website</a>
								</li>
								<li>
									<a href="https://github.com/pawelgrzybek">GitHub</a>
								</li>
								<li>
									<a href="https://mastodon.social/@pawelgrzybek">Mastodon</a>
								</li>
								<li>
									<a href="https://bsky.app/profile/pawelgrzybek.com">
										Bluesky
									</a>
								</li>
								<li>
									<a href="https://www.linkedin.com/in/pgrzybek/">LinkedIn</a>
								</li>
							</ul>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}

export default About;
