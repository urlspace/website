import { Link, useRouteContext } from "@tanstack/react-router";
import styles from "./Header.module.css";

export default function Header() {
	const { hasSession } = useRouteContext({ from: "__root__" });

	return (
		<div className={styles.header}>
			<a href="#main" className={styles.skipLink}>
				Skip to main content
			</a>
			<nav>
				<ul>
					<li>
						<Link to="/" aria-label="Home">
							url.space
						</Link>
					</li>
					{import.meta.env.VITE_BETA ? null : (
						<>
							<li>
								<Link to="/docs">Docs</Link>
							</li>
							<li>
								<Link to="/blog">Blog</Link>
							</li>
							{hasSession ? (
								<li>
									<Link to="/dashboard">Dashboard</Link>
								</li>
							) : (
								<>
									<li>
										<Link to="/auth/signin">Sign in</Link>
									</li>
									<li>
										<Link to="/auth/signup">Sign up</Link>
									</li>
								</>
							)}
						</>
					)}
				</ul>
			</nav>
		</div>
	);
}
