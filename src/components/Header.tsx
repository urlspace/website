import { Link, useParams, useRouteContext } from "@tanstack/react-router";
import "./Header.css";

const content = {
	en: {
		features: "Features",
		blog: "Blog",
		docs: "Docs",
		pricing: "Pricing",
		signIn: "Sign in",
		signUp: "Sign up",
		dashboard: "Dashboard",
	},
	pl: {
		features: "Funkcje",
		blog: "Blog",
		docs: "Dokumentacja",
		pricing: "Cennik",
		signIn: "Zaloguj się",
		signUp: "Zarejestruj się",
		dashboard: "Panel",
	},
};

export default function Header() {
	const { hasSession } = useRouteContext({ from: "__root__" });
	const { locale } = useParams({ strict: false });
	const currentLocale = locale === "pl" ? "pl" : "en";
	const t = content[currentLocale];

	const getEmoji = () => {
		const emojis = ["😀", "😎", "🤩", "🥳", "🤗", "🤔", "🙃", "😇", "😜", "🤪"];
		return emojis[Math.floor(Math.random() * emojis.length)];
	};

	return (
		<div className="header">
			<nav>
				<ul>
					<li>
						<Link
							to="/{-$locale}"
							params={{ locale }}
							className="logo"
							activeProps={{ className: "nav-link is-active" }}
						>
							{getEmoji()}
						</Link>
					</li>

					<li>
						<Link
							to="/{-$locale}/features"
							params={{ locale }}
							className="link"
							activeProps={{ className: "link--active" }}
						>
							{t.features}
						</Link>
					</li>
					<li>
						<Link
							to="/{-$locale}/blog"
							params={{ locale }}
							className="link"
							activeProps={{ className: "link--active" }}
						>
							{t.blog}
						</Link>
					</li>
					<li>
						<Link
							to="/{-$locale}/docs"
							params={{ locale }}
							className="link"
							activeProps={{ className: "link--active" }}
						>
							{t.docs}
						</Link>
					</li>
					<li className="d">
						<Link
							to="/{-$locale}/pricing"
							params={{ locale }}
							className="link"
							activeProps={{ className: "link--active" }}
						>
							{t.pricing}
						</Link>
					</li>

					<li>
						<Link
							to="/{-$locale}"
							params={{ locale: undefined }}
							className="link"
							data-active={currentLocale === "en"}
						>
							EN
						</Link>
					</li>
					<li>
						<Link
							to="/{-$locale}"
							params={{ locale: "pl" }}
							className="link"
							data-active={currentLocale === "pl"}
						>
							PL
						</Link>
					</li>

					{!hasSession && (
						<>
							<li>
								<Link
									to="/{-$locale}/auth/signin"
									params={{ locale }}
									className="link"
									activeProps={{ className: "link--active" }}
								>
									{t.signIn}
								</Link>
							</li>
							<li>
								<Link
									to="/{-$locale}/auth/signup"
									params={{ locale }}
									className="link"
									activeProps={{ className: "link--active" }}
								>
									{t.signUp}
								</Link>
							</li>
						</>
					)}
					{hasSession && (
						<li>
							<Link
								to="/{-$locale}/dashboard"
								params={{ locale }}
								className="link"
								activeProps={{ className: "nav-link is-active" }}
							>
								{t.dashboard}
							</Link>
						</li>
					)}
				</ul>
			</nav>
		</div>
	);
}
