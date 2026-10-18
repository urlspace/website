import { ButtonLink, Heading, Stack } from "#/components";

import styles from "./Intro.module.css";

function Intro() {
	return (
		<div className={styles.intro}>
			<div className={styles.content}>
				<Stack>
					<Heading text="url.space" level={1} bg="bg" />
					<p className={styles.description}>
						A bookmarking service for people who love the web. Save, organise
						and share links. Open source, no ads, no tracking, no AI. Free for
						everyday use, unlimited for a small fee.
					</p>
					{/* <ButtonLink to="/signup" text="Sign up" /> */}
				</Stack>
			</div>
		</div>
	);
}

export default Intro;
