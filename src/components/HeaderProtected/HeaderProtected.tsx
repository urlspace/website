import { Icon, Logo } from "..";
import { DashboardButtonLink } from "..";

import styles from "./HeaderProtected.module.css";

function HeaderProtected() {
	return (
		<div className={styles.header}>
			<Logo to="/dashboard" />
			<DashboardButtonLink
				icon={<Icon.Back />}
				to="/dashboard"
				text="Back to dashboard"
			/>
		</div>
	);
}

export default HeaderProtected;
