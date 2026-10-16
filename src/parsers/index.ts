import type { Parser } from "./types.ts";

type Source = {
	id: string;
	label: string;
	steps: Array<string>;
	address?: string;
	load: () => Promise<{ default: Parser }>;
};

const chromium = () => import("./chromium.ts");
const firefox = () => import("./firefox.ts");
const safari = () => import("./safari.ts");

export const sources: Array<Source> = [
	{
		id: "chrome",
		label: "Chrome",
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
		steps: [
			"Open the Bookmarks menu and choose Manage Bookmarks.",
			"Choose “Export Bookmarks to HTML” from the “Import and backup your bookmarks” (two arrows icon) menu.",
		],
		load: firefox,
	},
	{
		id: "safari",
		label: "Safari (bookmarks or reading list)",
		steps: [
			"Open the File menu and choose Export.",
			"Choose Bookmarks, then do the same for Reading List.",
			"Save both HTML files and import them one after the other.",
		],
		load: safari,
	},
];
