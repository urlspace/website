import styles from "./Toc.module.css";

function Toc({ children }: { children: React.ReactNode }) {
	return <div className={styles.toc}>{children}</div>;
}

export default Toc;
