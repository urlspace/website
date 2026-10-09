// Pages for signed-out visitors live on the site (url.space), the signed-in app
// on my.url.space. Locally both point at the same host.
export const siteUrl: string = import.meta.env.VITE_SITE_URL ?? "";
export const dashboardUrl: string = import.meta.env.VITE_DASHBOARD_URL ?? "";

const dashboardPaths = ["/dashboard", "/settings"];

export function isDashboardPath(pathname: string) {
  return dashboardPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

// Letters that Unicode doesn't decompose into a base letter plus accent, so
// NFD can't strip them.
const slugTransliterations: Record<string, string> = {
  ł: "l",
  đ: "d",
  ø: "o",
  ß: "ss",
  æ: "ae",
  œ: "oe",
  þ: "th",
};

// Suggests a slug from the name: accents stripped (ą→a, é→e), apostrophes
// dropped, ASCII letters and digits kept lowercase, everything else a single
// hyphen.
export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[łđøßæœþ]/g, (c) => slugTransliterations[c])
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128)
    .replace(/-+$/, "");
}
