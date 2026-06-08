import { Link } from "@tanstack/react-router";
import styles from "./DashboardLogo.module.css";

function DashbrardLogo() {
	return (
		<Link to="/dashboard" className={styles.logo}>
			url.space
		</Link>
	);
}

export default DashbrardLogo;
