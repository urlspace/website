import appDarkAvif from "#/assets/images/app-dark.avif";
import appDarkPng from "#/assets/images/app-dark.png";
import appDarkWebp from "#/assets/images/app-dark.webp";
import appLightAvif from "#/assets/images/app-light.avif";
import appLightPng from "#/assets/images/app-light.png";
import appLightWebp from "#/assets/images/app-light.webp";
import { ButtonLink, Graph, Heading, Stack } from "#/components";

import styles from "./Intro.module.css";

function Intro({ hasSession }: { hasSession: boolean }) {
	return (
		<div className={styles.intro}>
			<div className={styles.container}>
				<div className={styles.content}>
					<Stack>
						<Heading text="url.space" level={1} bg="bg" />
						<p className={styles.description}>
							A bookmarking service for people who love the web. Save, organise
							and share links. Open source, no ads, no tracking, no AI. Free for
							everyday use, unlimited for a small fee.
						</p>
						{hasSession ? (
							<ButtonLink to="/dashboard" text="Go to your dashboard" />
						) : (
							<ButtonLink to="/auth/signup" text="Sign up for free" />
						)}
					</Stack>
				</div>

				<Graph />

				<picture className={styles.image}>
					<source
						srcSet={appDarkAvif}
						type="image/avif"
						media="(prefers-color-scheme: dark)"
					/>
					<source
						srcSet={appDarkWebp}
						type="image/webp"
						media="(prefers-color-scheme: dark)"
					/>
					<source srcSet={appDarkPng} media="(prefers-color-scheme: dark)" />
					<source srcSet={appLightAvif} type="image/avif" />
					<source srcSet={appLightWebp} type="image/webp" />
					<img
						src={appLightPng}
						width={1403}
						height={1273}
						alt="url.space dashboard and filters view on a mobile device"
					/>
				</picture>
			</div>
		</div>
	);
}

export default Intro;
