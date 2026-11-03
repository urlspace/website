import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

const ignorePatterns = [
	"src/routeTree.gen.ts",
	"src/parsers/fixtures/**",
	"worker-configuration.d.ts",
];

const requiredEnv = ["VITE_API_URL", "VITE_SITE_URL", "VITE_DASHBOARD_URL"];

// A plugin rather than a top-level check, so lint and fmt (which also load this
// config) and tests don't need the app's env.
const validateEnv = {
	name: "validate-env",
	apply: (_: unknown, { mode }: { mode: string }) => mode !== "test",
	configResolved(config: { env: Record<string, string | undefined> }) {
		for (const name of requiredEnv) {
			if (!URL.canParse(config.env[name] ?? "")) {
				throw new Error(
					`${name} must be set to a full URL, e.g. https://url.space`,
				);
			}
		}
	},
};

const config = defineConfig({
	fmt: {
		useTabs: true,
		printWidth: 80,
		sortImports: true,
		ignorePatterns,
	},
	lint: {
		plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
			"jsx-a11y/role-supports-aria-props": "off",
			"jsx-a11y/no-redundant-roles": "off",
		},
		options: { typeAware: true, typeCheck: true },
		ignorePatterns,
	},
	resolve: { tsconfigPaths: true },
	plugins: lazyPlugins(() => [
		validateEnv,
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		devtools(),
		tanstackStart(),
		viteReact({
			compiler: true,
		}),
	]),
});

export default config;
