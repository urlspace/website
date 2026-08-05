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
function IconsImport() {
  return (
    <IconBase>
      <path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
      <path d="M2 13h10" />
      <path d="m9 16 3-3-3-3" />
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

function IconsStar() {
  return (
    <IconBase>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
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
Icon.Import = IconsImport;
Icon.Reload = IconsReload;
Icon.Star = IconsStar;
Icon.Extension = IconsExtension;
Icon.Search = IconsSearch;

export default Icon;
