import { Link } from "@tanstack/react-router";
import styles from "./DashboardEmpty.module.css";
import { ButtonLinkLike } from "../Button/Button";

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
				<p>No links match these filters. Try adjusting them.</p>
			</div>
		);
	}

	// TODO: link to the right import page when this one is done
	return (
		<div className={styles.empty}>
			<p>
				You don't have an links yet.{" "}
				<ButtonLinkLike
					type="button"
					onClick={onAddLink}
					text="Add your first one"
				/>{" "}
				or <Link to="/dashboard">import</Link> your bookmarks from somewhere
				else to get started.
			</p>
		</div>
	);
}

export default DashbrardEmpty;
