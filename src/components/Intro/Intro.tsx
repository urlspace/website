import { ButtonLink, Heading, Stack, Icon } from "#/components";

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
						<ButtonLink to="/auth/signup" text="Sign up for free" />
					</Stack>
				</div>

				<div className={styles.anime}>
					<div className={styles.rows}>
						<div className={styles.row}>
							<Label icon={<Icon.List />} text="All" />
							<Label icon={<Icon.Heart />} text="Favourite" />
							<Label icon={<Icon.Coffee />} text="For later" />
						</div>
						<div className={styles.row}>
							<Label icon={<Icon.Folder />} text="Garden" />
							<Label icon={<Icon.Folder />} text="Courses" />
							<Label icon={<Icon.FolderPublic />} text="Conference Talks" />
						</div>
						<div className={styles.row}>
							<Label icon={<Icon.Tag />} text="golang" />
							<Label icon={<Icon.Tag />} text="productivity" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Label({ icon, text }: { icon: React.ReactNode; text: string }) {
	return (
		<div className={styles.label}>
			{icon}
			<div className={styles.labelText}>{text}</div>
		</div>
	);
}

export default Intro;
