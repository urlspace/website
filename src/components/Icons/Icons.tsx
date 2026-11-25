import styles from "./Icons.module.css";

function Icon() {
	return null;
}

function IconBase({ children }: { children: React.ReactNode }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={styles.icon}
		>
			{children}
		</svg>
	);
}

function IconsFilter() {
	return (
		<IconBase>
			<path d="M21 5H3" />
			<path d="M21 12H9" />
			<path d="M21 19H7" />
		</IconBase>
	);
}

function IconsPlus() {
	return (
		<IconBase>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</IconBase>
	);
}

function IconsEdit() {
	return (
		<IconBase>
			<path d="M14 17H5" />
			<path d="M19 7h-9" />
			<circle cx="17" cy="17" r="3" />
			<circle cx="7" cy="7" r="3" />
		</IconBase>
	);
}
function IconsList() {
	return (
		<IconBase>
			<path d="M21 5H3" />
			<path d="M15 12H3" />
			<path d="M17 19H3" />
		</IconBase>
	);
}

function IconsHeart() {
	return (
		<IconBase>
			<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
		</IconBase>
	);
}

function IconsCoffee() {
	return (
		<IconBase>
			<path d="M10 2v2" />
			<path d="M14 2v2" />
			<path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
			<path d="M6 2v2" />
		</IconBase>
	);
}

function IconsChevronDown() {
	return (
		<IconBase>
			<path d="m6 9 6 6 6-6" />
		</IconBase>
	);
}

function IconsFolder() {
	return (
		<IconBase>
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		</IconBase>
	);
}

function IconsFolderPublic() {
	return (
		<IconBase>
			<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
		</IconBase>
	);
}

function IconsLock() {
	return (
		<IconBase>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</IconBase>
	);
}

function IconsCopy() {
	return (
		<IconBase>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</IconBase>
	);
}

function IconsCheck() {
	return (
		<IconBase>
			<path d="M20 6 9 17l-5-5" />
		</IconBase>
	);
}

function IconsTag() {
	return (
		<IconBase>
			<line x1="4" x2="20" y1="9" y2="9" />
			<line x1="4" x2="20" y1="15" y2="15" />
			<line x1="10" x2="8" y1="3" y2="21" />
			<line x1="16" x2="14" y1="3" y2="21" />
		</IconBase>
	);
}

function IconsClose() {
	return (
		<IconBase>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</IconBase>
	);
}
function IconsSignOut() {
	return (
		<IconBase>
			<path d="m16 17 5-5-5-5" />
			<path d="M21 12H9" />
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		</IconBase>
	);
}
function IconsUser() {
	return (
		<IconBase>
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</IconBase>
	);
}

function IconsExtension() {
	return (
		<IconBase>
			<path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
			<rect x="14" y="2" width="8" height="8" rx="1" />
		</IconBase>
	);
}

function IconsSearch() {
	return (
		<IconBase>
			<path d="m21 21-4.34-4.34" />
			<circle cx="11" cy="11" r="8" />
		</IconBase>
	);
}

function IconsBack() {
	return (
		<IconBase>
			<path d="m12 19-7-7 7-7" />
			<path d="M19 12H5" />
		</IconBase>
	);
}

function IconsReturn() {
	return (
		<IconBase>
			<path d="M20 4v7a4 4 0 0 1-4 4H4" />
			<path d="m9 10-5 5 5 5" />
		</IconBase>
	);
}

function IconsMasonry() {
	return (
		<IconBase>
			<rect width="7" height="9" x="3" y="3" rx="1" />
			<rect width="7" height="5" x="14" y="3" rx="1" />
			<rect width="7" height="9" x="14" y="12" rx="1" />
			<rect width="7" height="5" x="3" y="16" rx="1" />
		</IconBase>
	);
}

function IconsRss() {
	return (
		<IconBase>
			<path d="M4 11a9 9 0 0 1 9 9" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<circle cx="5" cy="19" r="1" />
		</IconBase>
	);
}

function IconsShare() {
	return (
		<IconBase>
			<path d="M12 2v13" />
			<path d="m16 6-4-4-4 4" />
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
		</IconBase>
	);
}

function IconsKeyboard() {
	return (
		<IconBase>
			<path d="M10 8h.01" />
			<path d="M12 12h.01" />
			<path d="M14 8h.01" />
			<path d="M16 12h.01" />
			<path d="M18 8h.01" />
			<path d="M6 8h.01" />
			<path d="M7 16h10" />
			<path d="M8 12h.01" />
			<rect width="20" height="16" x="2" y="4" rx="2" />
		</IconBase>
	);
}

function IconsTools() {
	return (
		<IconBase>
			<path d="M16 12v4" />
			<path d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
			<path d="M17 6a2 2 0 011.414.586l3 3A2 2 0 0122 11v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 01.586-1.414l3-3A2 2 0 017 6z" />
			<path d="M2 14h20" />
			<path d="M8 12v4" />
		</IconBase>
	);
}

function IconsRefresh() {
	return (
		<IconBase>
			<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
			<path d="M21 3v5h-5" />
		</IconBase>
	);
}

function IconsTrash() {
	return (
		<IconBase>
			<path d="M10 11v6" />
			<path d="M14 11v6" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
			<path d="M3 6h18" />
			<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		</IconBase>
	);
}

function IconsDashboard() {
	return (
		<IconBase>
			<rect width="18" height="18" x="3" y="3" rx="2" />
			<path d="M3 9h18" />
			<path d="M9 21V9" />
		</IconBase>
	);
}

function IconsContrast() {
	return (
		<IconBase>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 18a6 6 0 0 0 0-12v12z" />
		</IconBase>
	);
}

function IconsGlobe() {
	return (
		<IconBase>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
			<path d="M2 12h20" />
		</IconBase>
	);
}

function IconsGitHub() {
	return (
		<IconBase>
			<path
				d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				fill="currentColor"
				stroke="none"
			/>
		</IconBase>
	);
}

function IconsMastodon() {
	return (
		<IconBase>
			<path
				d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"
				fill="currentColor"
				stroke="none"
			/>
		</IconBase>
	);
}

function IconsBluesky() {
	return (
		<IconBase>
			<path
				d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
				fill="currentColor"
				stroke="none"
			/>
		</IconBase>
	);
}

function IconsLinkedIn() {
	return (
		<IconBase>
			<path
				d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				fill="currentColor"
				stroke="none"
			/>
		</IconBase>
	);
}

Icon.Filter = IconsFilter;
Icon.Plus = IconsPlus;
Icon.Edit = IconsEdit;
Icon.List = IconsList;
Icon.Heart = IconsHeart;
Icon.Coffee = IconsCoffee;
Icon.ChevronDown = IconsChevronDown;
Icon.Folder = IconsFolder;
Icon.FolderPublic = IconsFolderPublic;
Icon.Lock = IconsLock;
Icon.Tag = IconsTag;
Icon.Close = IconsClose;
Icon.SignOut = IconsSignOut;
Icon.User = IconsUser;
Icon.Extension = IconsExtension;
Icon.Search = IconsSearch;
Icon.Back = IconsBack;
Icon.Return = IconsReturn;
Icon.Copy = IconsCopy;
Icon.Check = IconsCheck;
Icon.Masonry = IconsMasonry;
Icon.Rss = IconsRss;
Icon.Share = IconsShare;
Icon.Keyboard = IconsKeyboard;
Icon.Tools = IconsTools;
Icon.Refresh = IconsRefresh;
Icon.Trash = IconsTrash;
Icon.Dashboard = IconsDashboard;
Icon.Contrast = IconsContrast;
Icon.Globe = IconsGlobe;
Icon.GitHub = IconsGitHub;
Icon.Mastodon = IconsMastodon;
Icon.Bluesky = IconsBluesky;
Icon.LinkedIn = IconsLinkedIn;

export default Icon;
