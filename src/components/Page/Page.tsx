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

function PageMain({ children }: { children: React.ReactNode }) {
	return <main className={styles.main}>{children}</main>;
}

function PageFooter({ children }: { children: React.ReactNode }) {
	return <footer className={styles.footer}>{children}</footer>;
}

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Main = PageMain;
Page.Footer = PageFooter;

export default Page;
