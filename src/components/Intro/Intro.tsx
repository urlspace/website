import { Heading, Stack } from "#/components";

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
					<Heading text="Save" level={2} bg="bg" />
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Consequatur, fugiat. Mollitia in atque, dignissimos eligendi iusto
						hic voluptatum fugiat sequi!
					</p>
					<Heading text="Organize" level={2} bg="bg" />
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Consequatur, fugiat. Mollitia in atque, dignissimos eligendi iusto
						hic voluptatum fugiat sequi!
					</p>
					<Heading text="Share" level={2} bg="bg" />
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						Consequatur, fugiat. Mollitia in atque, dignissimos eligendi iusto
						hic voluptatum fugiat sequi!
					</p>
				</Stack>
			</div>
		</div>
	);
}

export default Intro;
