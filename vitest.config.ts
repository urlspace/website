import { defineConfig } from "vite-plus";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"cloudflare:workers": new URL(
				"./src/testing/cloudflare-workers.ts",
				import.meta.url,
			).pathname,
		},
	},
	test: {
		environment: "jsdom",
		env: {
			VITE_API_URL: "http://localhost:3000",
			VITE_SITE_URL: "http://localhost:3000",
			VITE_DASHBOARD_URL: "http://localhost:3000",
		},
	},
});
