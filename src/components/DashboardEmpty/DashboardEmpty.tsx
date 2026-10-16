import { Link } from "@tanstack/react-router";

import { ButtonLinkLike } from "../Button/Button";

import styles from "./DashboardEmpty.module.css";

function DashbrardEmpty({
	newAccount,
	onAddLink,
}: {
	newAccount: boolean;
	onAddLink: () => void;
}) {
	if (!newAccount) {
		return (
			<div className={styles.empty}>
				<p>
					No links found. Try fewer filters, a different collection or tag, or a
					shorter search term.
				</p>
			</div>
		);
	}

	return (
		<div className={styles.empty}>
			<p>
				You haven't saved any links yet.{" "}
				<ButtonLinkLike type="button" onClick={onAddLink} text="Add one now" />,
				or <Link to="/tools">import the bookmarks</Link> you already have in
				your browser — folders become collections and tags come along too.
			</p>
		</div>
	);
}

export default DashbrardEmpty;
