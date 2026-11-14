import { useState } from "react";

import { DashboardButton, Drawer, Icon, Logo } from "../";
import { DashboardButtonLink } from "../";

import styles from "./PublicHeader.module.css";

function PublicHeader({ hasSession }: { hasSession: boolean }) {
	const [isNavOpen, setIsNavOpen] = useState(false);

	function links(onNavigate?: () => void) {
		return (
			<>
				<li>
					<DashboardButtonLink
						to="/"
						hash="pricing"
						onClick={onNavigate}
						text="Pricing"
					/>
				</li>
				{/* <li> */}
				{/* 	<DashboardButtonLink */}
				{/* 		to="/docs" */}
				{/* 		onClick={onNavigate} */}
				{/* 		text="Documentation" */}
				{/* 	/> */}
				{/* </li> */}
				{/* <li> */}
				{/* 	 */}
				{/* </li> */}
				{hasSession ? (
					<li>
						<DashboardButtonLink
							to="/dashboard"
							onClick={onNavigate}
							text="Dashboard"
						/>
					</li>
				) : (
					<>
						<li>
							<DashboardButtonLink
								to="/auth/signin"
								onClick={onNavigate}
								text="Sign in"
							/>
						</li>
						<li>
							<DashboardButtonLink
								to="/auth/signup"
								onClick={onNavigate}
								text="Sign up"
							/>
						</li>
					</>
				)}
			</>
		);
	}

	return (
		<header className={styles.header}>
			<Logo to="/" />
			<nav aria-label="Main navigation" className={styles.nav}>
				<ul className={styles.navList}>{links()}</ul>
			</nav>
			<div className={styles.trigger}>
				<DashboardButton
					icon={<Icon.List />}
					onClick={() => setIsNavOpen(true)}
					text="Menu"
				/>
			</div>
			<Drawer open={isNavOpen} onClose={() => setIsNavOpen(false)} title="Menu">
				<nav aria-label="Main navigation" className={styles.drawerNav}>
					<ul className={styles.drawerList}>
						{links(() => setIsNavOpen(false))}
					</ul>
				</nav>
			</Drawer>
		</header>
	);
}

export default PublicHeader;
