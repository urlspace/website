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

function IconsExpand() {
	return (
		<IconBase>
			<path d="m7 15 5 5 5-5" />
			<path d="m7 9 5-5 5 5" />
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
function IconsSettings() {
	return (
		<IconBase>
			<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
			<circle cx="12" cy="12" r="3" />
		</IconBase>
	);
}

function IconsReload() {
	return (
		<IconBase>
			<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
			<path d="M21 3v5h-5" />
		</IconBase>
	);
}

function IconsInfo() {
	return (
		<IconBase>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</IconBase>
	);
}

function IconsErease() {
	return (
		<IconBase>
			<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
			<path d="m5.082 11.09 8.828 8.828" />
		</IconBase>
	);
}

Icon.Filter = IconsFilter;
Icon.Plus = IconsPlus;
Icon.Edit = IconsEdit;
Icon.List = IconsList;
Icon.Heart = IconsHeart;
Icon.Coffee = IconsCoffee;
Icon.Expand = IconsExpand;
Icon.Folder = IconsFolder;
Icon.Tag = IconsTag;
Icon.Close = IconsClose;
Icon.SignOut = IconsSignOut;
Icon.User = IconsUser;
Icon.Settings = IconsSettings;
Icon.Reload = IconsReload;
Icon.Info = IconsInfo;
Icon.Erease = IconsErease;

export default Icon;
