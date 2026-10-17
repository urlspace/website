import type { Parser } from "./types.ts";

type Source = {
	id: string;
	label: string;
	kind: "browser" | "service";
	steps: Array<string>;
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
			"Open chrome://bookmarks in the address bar.",
			"Click the three-dot menu at the top right of the Bookmarks page.",
			"Choose Export bookmarks and save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "edge",
		label: "Edge",
		kind: "browser",
		address: "edge://favorites",
		steps: [
			"Open edge://favorites in the address bar.",
			"Click the three-dot More options button at the top of the Favorites page.",
			"Choose Export favorites and save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "brave",
		label: "Brave",
		kind: "browser",
		address: "brave://bookmarks",
		steps: [
			"Open brave://bookmarks in the address bar.",
			"Click the three-dot menu at the top right of the Bookmarks page.",
			"Choose Export bookmarks and save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "opera",
		label: "Opera",
		kind: "browser",
		address: "opera://bookmarks",
		steps: [
			"Open opera://bookmarks in the address bar.",
			"Click the Import/Export button at the bottom left of the Bookmarks page.",
			"Choose Export bookmarks and save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "vivaldi",
		label: "Vivaldi",
		kind: "browser",
		steps: [
			"Open the Vivaldi menu and go to File.",
			"Choose Export Bookmarks.",
			"Save the HTML file.",
		],
		load: chromium,
	},
	{
		id: "firefox",
		label: "Firefox",
		kind: "browser",
		steps: [
			"Open the Bookmarks menu and choose Manage Bookmarks.",
			"Choose “Export Bookmarks to HTML” from the “Import and backup your bookmarks” (two arrows icon) menu.",
		],
		load: firefox,
	},
	{
		id: "safari",
		label: "Safari (bookmarks or reading list)",
		kind: "browser",
		steps: [
			"Open the File menu and choose Export.",
			"Choose Bookmarks, then do the same for Reading List.",
			"Save both HTML files and import them one after the other.",
		],
		load: safari,
	},
	{
		id: "pinboard",
		label: "Pinboard",
		kind: "service",
		address: "https://pinboard.in/settings/backup",
		steps: [
			"Open https://pinboard.in/settings/backup while signed in to Pinboard.",
			"In the Bookmarks section, choose the HTML format.",
			"Download and save the HTML file.",
		],
		load: pinboard,
	},
	{
		id: "raindrop",
		label: "Raindrop.io",
		kind: "service",
		address: "https://app.raindrop.io/settings/backups",
		steps: [
			"Open https://app.raindrop.io/settings/backups while signed in to Raindrop.io.",
			"Click Create new and choose HTML.",
			"When the email arrives, download the HTML file from the same page.",
		],
		load: raindrop,
	},
	{
		id: "urlspace",
		label: "url.space",
		kind: "service",
		steps: [
			"Go to the Export section on the Tools page.",
			"Click Export bookmarks and save the HTML file.",
		],
		load: urlspace,
	},
];
