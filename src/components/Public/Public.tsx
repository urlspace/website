import styles from "./Public.module.css";

function Public({ children }: { children: React.ReactNode }) {
  return <main className={styles.wrapper}>{children}</main>;
}

// header
function PublicHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

function PublicDescription({ children }: { children: React.ReactNode }) {
  return <p className={styles.description}>{children}</p>;
}

function PublicAuthor({ children }: { children: React.ReactNode }) {
  return <p className={styles.author}>{children}</p>;
}

function PublicOptions({ children }: { children: React.ReactNode }) {
  return <div className={styles.options}>{children}</div>;
}

function PublicOption({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout?: boolean;
}) {
  return (
    <div className={layout ? styles.optionLayout : undefined}>{children}</div>
  );
}

function PublicItem({ children }: { children: React.ReactNode }) {
  return <div className={styles.item}>{children}</div>;
}

// list view
function PublicViewList({ children }: { children: React.ReactNode }) {
  return <div className={styles.viewList}>{children}</div>;
}

function PublicViewListMain({ children }: { children: React.ReactNode }) {
  return <div className={styles.viewListMain}>{children}</div>;
}

function PublicViewListAside({ children }: { children: React.ReactNode }) {
  return <aside className={styles.viewListAside}>{children}</aside>;
}

// masonry view
function PublicViewMasonry({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function PublicViewMasonryHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.viewMasonryHeader}>{children}</header>;
}

function PublicViewMasonryMain({ children }: { children: React.ReactNode }) {
  return <div className={styles.viewMasonryMain}>{children}</div>;
}

function PublicViewMasonryAside({ children }: { children: React.ReactNode }) {
  return <aside className={styles.viewMasonryAside}>{children}</aside>;
}

Public.Header = PublicHeader;
Public.Description = PublicDescription;
Public.Author = PublicAuthor;
Public.Options = PublicOptions;
Public.Option = PublicOption;
Public.Item = PublicItem;
Public.ViewList = PublicViewList;
Public.ViewListMain = PublicViewListMain;
Public.ViewListAside = PublicViewListAside;
Public.ViewMasonry = PublicViewMasonry;
Public.ViewMasonryHeader = PublicViewMasonryHeader;
Public.ViewMasonryMain = PublicViewMasonryMain;
Public.ViewMasonryAside = PublicViewMasonryAside;

export default Public;
