import styles from "./ButtonLinkLike.module.css";

function ButtonLinkLike({
	text,
	onClick,
	type = "button",
	disabled,
	ariaDisabled,
}: {
	text: string;
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
	ariaDisabled?: boolean;
}) {
	return (
		<button
			className={styles.buttonLinkLike}
			onClick={ariaDisabled ? (event) => event.preventDefault() : onClick}
			type={type}
			disabled={disabled}
			aria-disabled={ariaDisabled}
		>
			{text}
		</button>
	);
}

export default ButtonLinkLike;
