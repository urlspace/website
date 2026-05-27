import styles from "./App.module.css";

function App({ children }: { children: React.ReactNode }) {
	return <div className={styles.app}>{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
	return <header className={styles.header}>{children}</header>;
}
function Main({ children }: { children: React.ReactNode }) {
	return (
		<main id="main" className={styles.main}>
			{children}
		</main>
	);
}
function Footer({ children }: { children: React.ReactNode }) {
	return <footer>{children}</footer>;
}

App.Header = Header;
App.Main = Main;
App.Footer = Footer;

export default App;
