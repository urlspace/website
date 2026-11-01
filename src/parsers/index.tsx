import type { ReactNode } from "react";

import type { Parser } from "./types.ts";

type Source = {
	id: string;
	label: string;
	kind: "browser" | "service";
	steps: Array<ReactNode>;
	address?: string;
	load: () => Promise<{ default: Parser }>;
};

const chromium = () => import("./chromium.ts");
const firefox = () => import("./firefox.ts");
const pinboard = () => import("./pinboard.ts");
const raindrop = () => import("./raindrop.ts");
const safari = () => import("./safari.ts");
const urlspace = () => import("./urlspace.ts");

export const sources: Array<Source> = [
	{
		id: "chrome",
		label: "Chrome",
		kind: "browser",
		address: "chrome://bookmarks",
		steps: [
			<>
				Open <code>chrome://bookmarks</code> in the address bar.
			</>,
			"Click the three-dot menu at the top right of the Bookmarks page.",
			<>
				Choose <b>Export bookmarks</b> and save the HTML file.
			</>,
		],
		load: chromium,
	},
	{
		id: "edge",
		label: "Edge",
		kind: "browser",
		address: "edge://favorites",
		steps: [
			<>
				Open <code>edge://favorites</code> in the address bar.
			</>,
			<>
				Click the three-dot <b>More options</b> button at the top of the
				Favorites page.
			</>,
			<>
				Choose <b>Export favorites</b> and save the HTML file.
			</>,
		],
		load: chromium,
	},
	{
		id: "brave",
		label: "Brave",
		kind: "browser",
		address: "brave://bookmarks",
		steps: [
			<>
				Open <code>brave://bookmarks</code> in the address bar.
			</>,
			"Click the three-dot menu at the top right of the Bookmarks page.",
			<>
				Choose <b>Export bookmarks</b> and save the HTML file.
			</>,
		],
		load: chromium,
	},
	{
		id: "opera",
		label: "Opera",
		kind: "browser",
		address: "opera://bookmarks",
		steps: [
			<>
				Open <code>opera://bookmarks</code> in the address bar.
			</>,
			<>
				Click the <b>Import/Export</b> button at the bottom left of the
				Bookmarks page.
			</>,
			<>
				Choose <b>Export bookmarks</b> and save the HTML file.
			</>,
		],
		load: chromium,
	},
	{
		id: "vivaldi",
		label: "Vivaldi",
		kind: "browser",
		steps: [
			<>
				Open the Vivaldi menu and go to <b>File</b>.
			</>,
			<>
				Choose <b>Export Bookmarks</b>.
			</>,
			"Save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "firefox",
		label: "Firefox",
		kind: "browser",
		steps: [
			<>
				Open the <b>Bookmarks</b> menu and choose <b>Manage Bookmarks</b>.
			</>,
			<>
				Choose <b>Export Bookmarks to HTML</b> from the{" "}
				<b>Import and backup your bookmarks</b> (two arrows icon) menu.
			</>,
		],
		load: firefox,
	},
	{
		id: "safari",
		label: "Safari",
		kind: "browser",
		steps: [
			<>
				Open the <b>File</b> menu and choose{" "}
				<b>Export Browsing Data to File…</b>.
			</>,
			<>
				Choose <b>Bookmarks</b> and <b>Reading List</b>.
			</>,
			<>
				Unzip the exported file and choose both HTML files below. Hold{" "}
				<kbd>⌘ Command</kbd> while clicking to select both, or drag over them.
			</>,
		],
		load: safari,
	},
	{
		id: "pinboard",
		label: "Pinboard",
		kind: "service",
		steps: [
			<>
				Open the{" "}
				<a
					href="https://pinboard.in/settings/backup"
					target="_blank"
					rel="noreferrer"
					aria-description="Opens in a new tab"
				>
					Pinboard backup page
				</a>{" "}
				while signed in to Pinboard.
			</>,
			<>
				In the Bookmarks section, choose the <b>HTML</b> format.
			</>,
			"Download and save the HTML file.",
		],
		load: pinboard,
	},
	{
		id: "raindrop",
		label: "Raindrop.io",
		kind: "service",
		steps: [
			<>
				Open the{" "}
				<a
					href="https://app.raindrop.io/settings/backups"
					target="_blank"
					rel="noreferrer"
					aria-description="Opens in a new tab"
				>
					Raindrop.io backups page
				</a>{" "}
				while signed in to Raindrop.io.
			</>,
			<>
				Click <b>Create new</b> and choose <b>HTML</b>.
			</>,
			"When the email arrives, download the HTML file from the same page.",
		],
		load: raindrop,
	},
	{
		id: "urlspace",
		label: "url.space",
		kind: "service",
		steps: [
			<>
				Open the{" "}
				<a
					href="/tools"
					target="_blank"
					rel="noreferrer"
					aria-description="Opens in a new tab"
				>
					url.space Tools page
				</a>{" "}
				while signed in to the account you're moving from.
			</>,
			<>
				Click <b>Export bookmarks</b> and save the HTML file.
			</>,
		],
		load: urlspace,
	},
];
