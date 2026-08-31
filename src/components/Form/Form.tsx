import { type ReactNode, useId, useState } from "react";
import Combobox from "./Combobox";
import {
	FormContext,
	type SubmitHelpers,
	useFieldIds,
	useFormContext,
} from "./context";
import styles from "./Form.module.css";
import SearchInput from "./SearchInput";
import TagsInput from "./TagsInput";

export type { SubmitHelpers };

function Form({
	onSubmit,
	children,
}: {
	onSubmit: (
		e: React.SubmitEvent<HTMLFormElement>,
		helpers: SubmitHelpers,
	) => void;
	children: React.ReactNode;
}) {
	const formId = useId();
	const [error, setError] = useState<ReactNode>(null);
	const [loading, setLoading] = useState(false);

	return (
		<FormContext.Provider value={{ formId, error, loading }}>
			<form
				className={styles.form}
				aria-busy={loading || undefined}
				onSubmit={(e) => {
					if (loading) {
						e.preventDefault();
						return;
					}
					onSubmit(e, { setError, setLoading });
				}}
			>
				{error ? (
					<p id={`error-${formId}`} className={styles.error} role="alert">
						{error}
					</p>
				) : null}
				{children}
			</form>
		</FormContext.Provider>
	);
}

function Input({
	autoComplete,
	description,
	disabled,
	inputMode,
	label,
	maxLength,
	minLength,
	name,
	onChange,
	pattern,
	placeholder,
	required,
	type,
	value,
}: {
	autoComplete?: string;
	description?: ReactNode;
	disabled?: boolean;
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	label: string;
	maxLength?: number;
	minLength?: number;
	name: string;
	onChange: (value: string) => void;
	pattern?: string;
	placeholder: string;
	required?: boolean;
	type: "text" | "email" | "password" | "url";
	value: string;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	return (
		<div className={styles.field}>
			<label
				className={[styles.label, disabled && styles.labelDisabled]
					.filter(Boolean)
					.join(" ")}
				htmlFor={inputId}
			>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<input
				aria-describedby={ariaDescribedBy}
				autoComplete={autoComplete}
				className={styles.input}
				disabled={disabled || loading}
				id={inputId}
				inputMode={inputMode}
				maxLength={maxLength}
				minLength={minLength}
				name={name}
				onChange={(e) => onChange(e.target.value)}
				pattern={pattern}
				placeholder={placeholder}
				required={required}
				type={type}
				value={value}
			/>
			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

function Checkbox({
	disabled,
	label,
	name,
	onChange,
	required,
	value,
	description,
}: {
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: boolean) => void;
	required?: boolean;
	value: boolean;
	description?: ReactNode;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	return (
		<div className={styles.field}>
			<div className={styles.checkboxWrapper}>
				<input
					aria-describedby={ariaDescribedBy}
					type="checkbox"
					id={inputId}
					name={name}
					disabled={disabled || loading}
					onChange={(e) => onChange(e.target.checked)}
					checked={value}
					className={styles.checkbox}
					required={required}
				/>

				<label
					className={[styles.label, disabled && styles.labelDisabled]
						.filter(Boolean)
						.join(" ")}
					htmlFor={inputId}
				>
					{label}
					{required ? <span aria-hidden="true"> (required)</span> : null}
				</label>
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

function Submit({ text, textLoading }: { text: string; textLoading: string }) {
	const { loading } = useFormContext();
	return (
		<button type="submit" aria-disabled={loading} className={styles.submit}>
			{loading ? textLoading : text}
		</button>
	);
}

function Row({ children }: { children: React.ReactNode }) {
	return <div className={styles.row}>{children}</div>;
}

Form.Input = Input;
Form.Combobox = Combobox;
Form.TagsInput = TagsInput;
Form.SearchInput = SearchInput;
Form.Checkbox = Checkbox;
Form.Row = Row;
Form.Submit = Submit;

export default Form;
