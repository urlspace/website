// Pages for signed-out visitors live on the site (url.space), the signed-in app
// on my.url.space. Locally both point at the same host.
export const siteUrl = import.meta.env.VITE_SITE_URL;
export const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL;

export const hasSeparateDashboard = siteUrl !== dashboardUrl;
