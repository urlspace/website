import {
  Link,
  useParams,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import "./Header.css";

type Locale = "en" | "pl";

function isLocale(value?: string): value is Locale {
  return ["en", "pl"].includes(value as Locale);
}

const content: Record<string, Record<Locale, string>> = {
  features: {
    en: "Features",
    pl: "Funkcje",
  },
  blog: {
    en: "Blog",
    pl: "Blog",
  },
  docs: {
    en: "Docs",
    pl: "Dokumentacja",
  },
  pricing: {
    en: "Pricing",
    pl: "Cennik",
  },
  signIn: {
    en: "Sign in",
    pl: "Zaloguj się",
  },
  signUp: {
    en: "Sign up",
    pl: "Zarejestruj się",
  },
  dashboard: {
    en: "Dashboard",
    pl: "Panel",
  },
  signOut: {
    en: "Sign out",
    pl: "Wyloguj się",
  },
};

export default function Header() {
  const { user } = useRouteContext({ from: "__root__" });
  const { locale } = useParams({ strict: false });
  const currentLocale = isLocale(locale) ? locale : "en";
  const router = useRouter();

  async function handleSignOut() {
    const res = await fetch("http://localhost:3000/v1/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      await router.invalidate();
      router.navigate({ to: "/{-$locale}", params: { locale } });
    }
  }

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
              to="/{-$locale}/auth/signin"
              params={{ locale }}
              className="link"
              activeProps={{ className: "link--active" }}
            >
              {content.features[currentLocale]}
            </Link>
          </li>
          <li>
            <Link
              to="/{-$locale}/auth/signin"
              params={{ locale }}
              className="link"
              activeProps={{ className: "link--active" }}
            >
              {content.blog[currentLocale]}
            </Link>
          </li>
          <li>
            <Link
              to="/{-$locale}/auth/signin"
              params={{ locale }}
              className="link"
              activeProps={{ className: "link--active" }}
            >
              {content.docs[currentLocale]}
            </Link>
          </li>
          <li>
            <Link
              to="/{-$locale}/auth/signin"
              params={{ locale }}
              className="link"
              activeProps={{ className: "link--active" }}
            >
              {content.pricing[currentLocale]}
            </Link>
          </li>

          {!user && (
            <>
              <li>
                <Link
                  to="/{-$locale}/auth/signin"
                  params={{ locale }}
                  className="link"
                  activeProps={{ className: "link--active" }}
                >
                  {content.signIn[currentLocale]}
                </Link>
              </li>
              <li>
                <Link
                  to="/{-$locale}/auth/signup"
                  params={{ locale }}
                  className="link"
                  activeProps={{ className: "link--active" }}
                >
                  {content.signUp[currentLocale]}
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link
                  to="/{-$locale}/dashboard"
                  params={{ locale }}
                  className="link"
                  activeProps={{ className: "nav-link is-active" }}
                >
                  {content.dashboard[currentLocale]}
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleSignOut}>
                  {content.signOut[currentLocale]}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
