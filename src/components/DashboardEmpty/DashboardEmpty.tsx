import { Link } from "@tanstack/react-router";
import styles from "./DashboardEmpty.module.css";
import { ButtonLinkLike } from "../Button/Button";

function DashbrardEmpty() {
	// TODO: link to the right import page when this one is done

	return (
		<div className={styles.empty}>
			<p>
				You don't have an links yet.{" "}
				<ButtonLinkLike
					type="button"
					onClick={() => alert("Add link")}
					text="Add your first one"
				/>{" "}
				or <Link to="/dashboard">import</Link> your bookmarks from somewhere
				else to get started.
			</p>
		</div>
	);
}

export default DashbrardEmpty;
