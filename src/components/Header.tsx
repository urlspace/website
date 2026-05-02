import { Link, useRouteContext } from "@tanstack/react-router";
import "./Header.css";

export default function Header() {
  const { hasSession } = useRouteContext({ from: "__root__" });

  const getEmoji = () => {
    const emojis = ["😀", "😎", "🤩", "🥳", "🤗", "🤔", "🙃", "😇", "😜", "🤪"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className="logo"
              activeProps={{ className: "nav-link is-active" }}
            >
              {getEmoji()}
            </Link>
          </li>

          <li>
            <Link
              to="/"
              className="link"
              activeProps={{ className: "link--active" }}
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="link"
              activeProps={{ className: "link--active" }}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="link"
              activeProps={{ className: "link--active" }}
            >
              Docs
            </Link>
          </li>
          <li className="d">
            <Link
              to="/"
              className="link"
              activeProps={{ className: "link--active" }}
            >
              Pricing
            </Link>
          </li>

          {!hasSession && (
            <>
              <li>
                <Link
                  to="/auth/signin"
                  className="link"
                  activeProps={{ className: "link--active" }}
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/signup"
                  className="link"
                  activeProps={{ className: "link--active" }}
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
          {hasSession && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="link"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  Dashboard
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
