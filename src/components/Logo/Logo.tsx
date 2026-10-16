import { Link } from "@tanstack/react-router";

import styles from "./Logo.module.css";

function Logo({ to }: { to: string }) {
	return (
		<Link to={to} className={styles.logo} preload={false}>
			<svg
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2 0H4V2H2V0ZM8 0H10V2H8V0ZM0 2H2V4H0V2ZM4 2H8V4H4V2ZM10 2H12V4H10V2ZM2 4H4V6H2V4ZM8 4H10V6H8V4ZM0 7H2V12H0V7ZM10 7H12V12H10V7ZM2 10H10V12H2V10Z"
					fill="currentColor"
				/>
			</svg>
			<span className="visually-hidden">url.space</span>
		</Link>
	);
}

export default Logo;
