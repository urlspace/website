import { useState } from "react";

import {
	Button,
	ButtonLink,
	Drawer,
	Icon,
	Logo,
	MenuElsewhere,
	MenuTheme,
} from "../";

import styles from "./PublicHeader.module.css";

function PublicHeader({ hasSession }: { hasSession: boolean }) {
	const [isNavOpen, setIsNavOpen] = useState(false);

	function links(onNavigate?: () => void) {
		return (
			<>
				<li>
					<ButtonLink
						to="/"
						hash="features"
						onClick={onNavigate}
						text="Features"
					/>
				</li>
				<li>
					<ButtonLink to="/" hash="about" onClick={onNavigate} text="About" />
				</li>
				<li>
					<ButtonLink
						to="/"
						hash="pricing"
						onClick={onNavigate}
						text="Pricing"
					/>
				</li>
				<li>
					<ButtonLink
						to="/documentation"
						onClick={onNavigate}
						text="Documentation"
					/>
				</li>
				{hasSession ? (
					<li>
						<ButtonLink to="/dashboard" onClick={onNavigate} text="Dashboard" />
					</li>
				) : (
					<>
						<li>
							<ButtonLink
								to="/auth/signin"
								onClick={onNavigate}
								text="Sign in"
							/>
						</li>
						<li>
							<ButtonLink
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
			<div className={styles.buttons}>
				{hasSession ? (
					<ButtonLink
						to="/dashboard"
						icon={<Icon.Dashboard />}
						text="Dashboard"
					/>
				) : null}
				<Button
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
					<MenuElsewhere />
					<MenuTheme />
				</nav>
			</Drawer>
		</header>
	);
}

export default PublicHeader;
