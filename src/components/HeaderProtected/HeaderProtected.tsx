import { Icon, Logo } from "..";
import { ButtonLink } from "..";

import styles from "./HeaderProtected.module.css";

function HeaderProtected() {
	return (
		<div className={styles.header}>
			<Logo to="/dashboard" />
			<ButtonLink
				icon={<Icon.Back />}
				to="/dashboard"
				text="Back to dashboard"
			/>
		</div>
	);
}

export default HeaderProtected;
