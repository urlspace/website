import { Link } from "@tanstack/react-router";

import styles from "./Logo.module.css";

function Logo({ to }: { to: string }) {
	return (
		<Link to={to} className={styles.logo} preload={false}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -0.25 14 14"
				fill="none"
				stroke="currentColor"
				strokeWidth="3.5"
				aria-hidden="true"
			>
				<path d="M-2 5C1 5 1 2 4 2C7 2 7 5 10 5C13 5 13 2 16 2" />
				<path d="M-2 12C1 12 1 12 4 12C7 12 7 12 10 12C13 12 13 12 16 12" />
			</svg>
			<span className="visually-hidden">url.space</span>
		</Link>
	);
}

export default Logo;
