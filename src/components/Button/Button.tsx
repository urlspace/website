import { Link } from "@tanstack/react-router";

import styles from "./Button.module.css";

function ButtonBiggie({
	text,
	onClick,
	type = "button",
	disabled,
	ariaDisabled,
	fullWidth,
}: {
	text: string;
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
	ariaDisabled?: boolean;
	fullWidth?: boolean;
}) {
	return (
		<button
			className={[styles.button, fullWidth && styles.fullWidth]
				.filter(Boolean)
				.join(" ")}
			onClick={ariaDisabled ? (event) => event.preventDefault() : onClick}
			type={type}
			disabled={disabled}
			aria-disabled={ariaDisabled}
		>
			{text}
		</button>
	);
}

function ButtonBiggieLink({
	text,
	to,
	fullWidth,
}: {
	text: string;
	to: string;
	fullWidth?: boolean;
}) {
	return (
		<Link
			className={[styles.button, fullWidth && styles.fullWidth]
				.filter(Boolean)
				.join(" ")}
			to={to}
		>
			{text}
		</Link>
	);
}

function ButtonBiggieDownload({ text, href }: { text: string; href: string }) {
	return (
		<a className={styles.button} href={href} download>
			{text}
		</a>
	);
}

export { ButtonBiggie, ButtonBiggieDownload, ButtonBiggieLink };
