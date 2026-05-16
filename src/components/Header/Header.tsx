import { Link, useRouteContext } from "@tanstack/react-router";
import "./Header.css";

export default function Header() {
  const { hasSession } = useRouteContext({ from: "__root__" });

  return (
    <div className="header">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <nav>
        <ul>
          <li>
            <Link to="/" aria-label="Home">
              url.space
            </Link>
          </li>
          <li>
            <Link to="/docs">Docs</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          {import.meta.env.VITE_BETA ? null : hasSession ? (
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
        </ul>
      </nav>
    </div>
  );
}
