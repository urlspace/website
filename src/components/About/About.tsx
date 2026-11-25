import meAvif from "#/assets/images/me.avif";
import meJpg from "#/assets/images/me.jpg";
import meWebp from "#/assets/images/me.webp";

import Heading from "../Heading/Heading";
import Icon from "../Icons/Icons";

import styles from "./About.module.css";

function About() {
	return (
		<section className={styles.wrapper} id="about">
			<div className={styles.dots}>
				<div className={styles.grid}>
					<div className={styles.content}>
						<Heading level={2} text="Why another bookmarking service?" />
						<p>
							The web is filling up with junk, and{" "}
							<a href="https://www.tomshardware.com/tech-industry/artificial-intelligence/bots-have-now-passed-human-traffic-online-cloudflare-boss-laments-says-agentic-traffic-wasnt-expected-to-eclipse-real-people-until-next-year">
								bots now generate more traffic than we do
							</a>
							. Search engines no longer search. They track us, sell our data
							and serve up a mediocre mashup of other people's work with no
							credit given. I don't care about that internet. I care about the
							one built by people, for people.
						</p>

						<p>
							Save the links you care about before they get lost in the slop.
							Browser bookmarks suck, and I've tried pretty much every
							bookmarking service out there. Plenty are good, but most have
							drifted into features a bookmarking tool doesn't need. So I
							cherry-picked what matters and built url.space. Accessibility,
							performance and user experience come first. Everything else has to
							earn its place.
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
								<a href="https://url.space">url.space</a> and{" "}
								<a href="https://nn1.dev">NN1 Dev Club meetup</a>. After-hours
								hip hop head, funky records collector, and photographer.
							</p>

							<ul className={styles.social}>
								<li>
									<a href="https://pawelgrzybek.com">
										<Icon.Globe />
										<span className="visually-hidden">Website</span>
									</a>
								</li>
								<li>
									<a href="https://github.com/pawelgrzybek">
										<Icon.GitHub />
										<span className="visually-hidden">GitHub</span>
									</a>
								</li>
								<li>
									<a href="https://mastodon.social/@pawelgrzybek">
										<Icon.Mastodon />
										<span className="visually-hidden">Mastodon</span>
									</a>
								</li>
								<li>
									<a href="https://bsky.app/profile/pawelgrzybek.com">
										<Icon.Bluesky />
										<span className="visually-hidden">Bluesky</span>
									</a>
								</li>
								<li>
									<a href="https://www.linkedin.com/in/pgrzybek/">
										<Icon.LinkedIn />
										<span className="visually-hidden">LinkedIn</span>
									</a>
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
