import { Link } from "@tanstack/react-router";
import styles from "./DashboardButton.module.css";

function DashbrardButtonLink({
	text,
	icon,
	to,
}: {
	icon?: React.ReactNode;
	text: string;
	to: string;
}) {
	return (
		<Link to={to} type="button" className={styles.button}>
			{icon ? <div className={styles.icon}>{icon}</div> : null}
			<div className={styles.text}>{text} </div>
		</Link>
	);
}

export default DashbrardButtonLink;
