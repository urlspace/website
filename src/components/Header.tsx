import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./AuthContext";

export default function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const res = await fetch("http://localhost:3000/v1/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      navigate({ to: "/" });
      window.location.reload();
    }
  }

  return (
    <header>
      <nav>
        <div>
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Home
          </Link>
          {!loading && !user && (
            <>
              <Link
                to="/auth/signin"
                activeProps={{ className: "nav-link is-active" }}
              >
                Sign in
              </Link>
              <Link
                to="/auth/signup"
                activeProps={{ className: "nav-link is-active" }}
              >
                Sign up
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link
                to="/dashboard"
                activeProps={{ className: "nav-link is-active" }}
              >
                Dashboard
              </Link>
              <button type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
