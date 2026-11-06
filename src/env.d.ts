interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_SITE_URL: string;
	readonly VITE_DASHBOARD_URL: string;
}

declare namespace Cloudflare {
	interface Env {
		ORIGIN_SECRET: string;
	}
}
