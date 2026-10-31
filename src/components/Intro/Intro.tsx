import { ButtonLink, Heading, Stack } from "#/components";

import styles from "./Intro.module.css";

function Intro() {
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
						<ButtonLink to="/auth/signup" text="Sign up free" />
					</Stack>
				</div>
			</div>
		</div>
	);
}

{
	/* <div className={styles.boo}> */
}
{
	/* 	<p> */
}
{
	/* 		There are around 1.5 billion websites on the internet, and we’re */
}
{
	/* 		getting 600,000 new ones every day. The good ones are getting lost in */
}
{
	/* 		the maze of AI slop, and search engines don't surface websites */
}
{
	/* 		anymore. Curating your very own collection is the only way. */
}
{
	/* 	</p> */
}
{
	/* 	<p> */
}
{
	/* 		We have a simple, fast and powerful solution to help you curate your */
}
{
	/* 		own collection, browse effectively and share with others. Browser */
}
{
	/* 		extension? Of course! There’s also a powerful public API for */
}
{
	/* 		developers. */
}
{
	/* 	</p> */
}
{
	/* </div> */
}

export default Intro;
