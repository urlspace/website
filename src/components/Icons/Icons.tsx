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

Icon.Filter = IconsFilter;
Icon.Plus = IconsPlus;
Icon.Edit = IconsEdit;
Icon.List = IconsList;
Icon.Heart = IconsHeart;
Icon.Coffee = IconsCoffee;
Icon.Expand = IconsExpand;
Icon.Folder = IconsFolder;
Icon.Tag = IconsTag;

export default Icon;
