import { Link } from "@tanstack/react-router";

import styles from "./Logo.module.css";

function Logo({ to }: { to: string }) {
	return (
		<Link to={to} className={styles.logo} preload={false}>
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
			>
				<path d="M2 12H12V10H14V14H0V10H2V12Z" />
				<path d="M6 6H2V4H6V6Z" />
				<path d="M12 4V6H8V4H12Z" />
				<path d="M2 4H0V2H2V4Z" />
				<path d="M8 4H6V2H8V4Z" />
				<path d="M14 4H12V2H14V4Z" />
				<path d="M6 2H2V0H6V2Z" />
				<path d="M12 2H8V0H12V2Z" />
			</svg>
			<span className="visually-hidden">url.space</span>
		</Link>
	);
}

export default Logo;
