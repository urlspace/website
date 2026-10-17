import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

const ignorePatterns = [
	"src/routeTree.gen.ts",
	"src/styles.css",
	"src/parsers/fixtures/**",
	"worker-configuration.d.ts",
];

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
		},
		options: { typeAware: true, typeCheck: true },
		ignorePatterns,
	},
	resolve: { tsconfigPaths: true },
	plugins: lazyPlugins(() => [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		devtools(),
		tanstackStart(),
		viteReact({
			compiler: true,
		}),
	]),
});

export default config;
