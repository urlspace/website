import styles from "./Page.module.css";

function Page({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}

function PageHeader({ children }: { children: React.ReactNode }) {
  return <div className={styles.header}>{children}</div>;
}

function PageContent({ children }: { children: React.ReactNode }) {
  return children;
}

function PageFooter({ children }: { children: React.ReactNode }) {
  return <div className={styles.footer}>{children}</div>;
}

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Footer = PageFooter;

export default Page;
