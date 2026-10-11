import { useEffect, useId, useRef } from "react";
import Icon from "../Icons/Icons";
import styles from "./Drawer.module.css";

function Dialog({
	open,
	onClose,
	children,
	title,
}: {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title: string;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const titleId = useId();

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		if (open) {
			el.removeAttribute("data-closing");
			if (!el.open) {
				el.showModal();
			}
			return;
		}
		if (!el.open) {
			return;
		}
		el.setAttribute("data-closing", "");
		Promise.allSettled(
			el.getAnimations({ subtree: true }).map((a) => a.finished),
		).then(() => {
			if (!el.hasAttribute("data-closing")) {
				return;
			}
			el.removeAttribute("data-closing");
			el.close();
		});
	}, [open]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: dialog backdrop is pointer-only; Escape closes via the built-in close event
		<dialog
			ref={ref}
			className={styles.drawer}
			aria-labelledby={titleId}
			onClose={onClose}
			onCancel={(e) => {
				e.preventDefault();
				onClose();
			}}
			onClick={(e) => {
				if (e.target === ref.current) onClose();
			}}
		>
			<div className={styles.header}>
				<h2 id={titleId} className={styles.title}>
					{title}
				</h2>
				<button
					type="button"
					className={styles.close}
					onClick={onClose}
					aria-label="Close dialog"
				>
					<Icon.Close />
				</button>
			</div>

			<div className={styles.content}>{children}</div>
		</dialog>
	);
}

export default Dialog;
