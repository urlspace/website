import styles from "./Prose.module.css";

function Prose({ children }: { children: React.ReactNode }) {
	return <div className={styles.prose}>{children}</div>;
}

export default Prose;
