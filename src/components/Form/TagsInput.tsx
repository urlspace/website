import { type ReactNode, useEffect, useRef, useState } from "react";

import { DashboardButton, Icon, Pills } from "..";
import { useFieldIds } from "./context";

import styles from "./Form.module.css";

const tagNamePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const maxTags = 10;

function TagsInput({
	description,
	disabled,
	label,
	name,
	onChange,
	options,
	placeholder,
	value,
}: {
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: string[]) => void;
	value: string[];
	options: string[];
	placeholder: string;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const isDisabled = disabled || loading;
	const listId = `${inputId}-options`;
	const inputRef = useRef<HTMLInputElement>(null);
	const pillsWrapperRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState("");
	const errorId = `${inputId}-error`;

	useEffect(() => {
		const wrapper = pillsWrapperRef.current;
		const list = wrapper?.firstElementChild;
		if (!wrapper || !list) {
			return;
		}

		let height: number | null = null;
		let animation: Animation | null = null;

		const observer = new ResizeObserver(() => {
			const nextHeight = list.getBoundingClientRect().height;
			if (height === null || nextHeight === height) {
				height = nextHeight;
				return;
			}

			const fromHeight =
				animation?.playState === "running"
					? wrapper.getBoundingClientRect().height
					: height;
			height = nextHeight;
			animation?.cancel();

			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				return;
			}

			// The CSS minifier rewrites durations in production builds (220ms
			// becomes .22s), so the unit can't be assumed even though the source
			// always uses ms.
			const duration = getComputedStyle(wrapper)
				.getPropertyValue("--transition-duration")
				.trim();
			animation = wrapper.animate(
				[{ height: `${fromHeight}px` }, { height: `${nextHeight}px` }],
				{
					duration: duration.endsWith("ms")
						? Number.parseFloat(duration)
						: Number.parseFloat(duration) * 1000,
					easing: "ease",
				},
			);
		});

		observer.observe(list);
		return () => {
			observer.disconnect();
			animation?.cancel();
		};
	}, []);

	function addTag(rawValue: string) {
		if (isDisabled) return;

		const tag = rawValue.trim().toLowerCase();
		if (!tag) return;

		if (tag.length < 2 || tag.length > 50) {
			setError("Tag names must be between 2 and 50 characters.");
			return;
		}

		if (!tagNamePattern.test(tag)) {
			setError(
				"Use letters a–z, numbers, and single hyphens between words. Start and end with a letter or number.",
			);
			return;
		}

		if (value.some((selected) => selected.toLowerCase() === tag)) {
			setInputValue("");
			setError(null);
			return;
		}

		if (value.length >= maxTags) {
			setError(`You can add up to ${maxTags} tags. Remove one to add another.`);
			return;
		}

		onChange([...value, tag]);
		setInputValue("");
		setError(null);
		setStatus(`Tag ${tag} added.`);
	}

	return (
		<div className={styles.field}>
			<label
				className={[styles.label, isDisabled && styles.labelDisabled]
					.filter(Boolean)
					.join(" ")}
				htmlFor={inputId}
			>
				{label}
			</label>

			<div className={styles.fieldRow}>
				<input
					autoComplete="off"
					aria-describedby={
						[ariaDescribedBy, error ? errorId : null]
							.filter(Boolean)
							.join(" ") || undefined
					}
					aria-invalid={error ? true : undefined}
					className={styles.input}
					disabled={isDisabled}
					form=""
					id={inputId}
					ref={inputRef}
					list={listId}
					name={name}
					// Disabled because the Apple Passwords extension in Chrome treats this
					// field as a login field when it has a pattern, and offers to fill in
					// passwords. addTag already validates tags and shows the error.
					// pattern="\s*(?=[A-Za-z0-9\-]{2,50}\s*$)[A-Za-z0-9]+(-[A-Za-z0-9]+)*\s*"
					placeholder={placeholder}
					type="text"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						setError(null);
					}}
					onKeyUp={(e) => {
						if (e.key === "Enter" && !e.nativeEvent.isComposing) {
							addTag(e.currentTarget.value);
						}
					}}
				/>
				<datalist id={listId}>
					{options.map((tag) => (
						<option key={tag} value={tag} />
					))}
				</datalist>
				<div>
					<DashboardButton
						onClick={() => {
							addTag(inputValue);
							inputRef.current?.focus();
						}}
						text="Add tag"
						icon={<Icon.Return />}
					/>
				</div>
			</div>
			{error ? (
				<p id={errorId} className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.pillsWrapper} ref={pillsWrapperRef}>
				<Pills
					disabled={isDisabled}
					items={value.map((tag) => ({
						id: tag,
						label: tag,
						onRemove: () => {
							onChange(value.filter((selected) => selected !== tag));
							setError(null);
							setStatus(`Tag ${tag} removed.`);
						},
					}))}
				/>
			</div>
			<div className={styles.visuallyHidden} role="status" aria-atomic="true">
				{status}
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

export default TagsInput;
