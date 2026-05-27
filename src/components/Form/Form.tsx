import {
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import styles from "./Form.module.css";

type FormContextValue = {
	formId: string;
	errorMessage: ReactNode;
	loading: boolean;
};

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext() {
	const ctx = useContext(FormContext);
	if (!ctx) throw new Error("Form.* must be used inside <Form>");
	return ctx;
}

function useFieldIds(name: string, hasDescription: boolean) {
	const { formId, errorMessage } = useFormContext();
	const inputId = `${name}-${formId}`;
	const descriptionId = `${name}-description-${formId}`;
	const ariaDescribedBy =
		[
			hasDescription ? descriptionId : null,
			errorMessage ? `error-${formId}` : null,
		]
			.filter(Boolean)
			.join(" ") || undefined;
	return { inputId, descriptionId, ariaDescribedBy };
}

type SubmitHelpers = {
	setErrorMessage: (msg: ReactNode) => void;
	setLoading: (loading: boolean) => void;
};

function Form({
	onSubmit,
	children,
}: {
	onSubmit: (
		e: React.FormEvent<HTMLFormElement>,
		helpers: SubmitHelpers,
	) => void;
	children: React.ReactNode;
}) {
	const formId = useId();
	const [errorMessage, setErrorMessage] = useState<ReactNode>(null);
	const [loading, setLoading] = useState(false);

	return (
		<FormContext.Provider value={{ formId, errorMessage, loading }}>
			<form
				className={styles.form}
				onSubmit={(e) => {
					if (loading) {
						e.preventDefault();
						return;
					}
					onSubmit(e, { setErrorMessage, setLoading });
				}}
			>
				{errorMessage ? (
					<p id={`error-${formId}`} className={styles.error} role="alert">
						{errorMessage}
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
	const { inputId, descriptionId, ariaDescribedBy } = useFieldIds(
		name,
		!!description,
	);
	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<input
				aria-describedby={ariaDescribedBy}
				autoComplete={autoComplete}
				className={styles.input}
				disabled={disabled}
				id={inputId}
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

function Select({
	description,
	disabled,
	label,
	name,
	onChange,
	required,
	value,
	options,
	placeholder,
}: {
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: string) => void;
	required?: boolean;
	value: string;
	options: { name: string; value: string }[];
	placeholder: string;
}) {
	const { inputId, descriptionId, ariaDescribedBy } = useFieldIds(
		name,
		!!description,
	);
	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<select
				aria-describedby={ariaDescribedBy}
				className={[styles.input, styles.inputSelect].join(" ")}
				name={name}
				id={inputId}
				disabled={disabled}
				onChange={(e) => onChange(e.target.value)}
				value={value}
				required={required}
			>
				{required ? (
					<option value="" disabled hidden>
						{placeholder}
					</option>
				) : (
					<option value="">{placeholder}</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.name}
					</option>
				))}
			</select>

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
	const { inputId, descriptionId, ariaDescribedBy } = useFieldIds(
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
					disabled={disabled}
					onChange={(e) => onChange(e.target.checked)}
					checked={value}
					className={styles.checkbox}
					required={required}
				/>

				<label className={styles.label} htmlFor={inputId}>
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

function Submit({ children }: { children: ReactNode }) {
	const { loading } = useFormContext();
	return (
		<button type="submit" aria-disabled={loading} className={styles.submit}>
			{children}
		</button>
	);
}

function Row({ children }: { children: React.ReactNode }) {
	return <div className={styles.row}>{children}</div>;
}

Form.Input = Input;
Form.Select = Select;
Form.Checkbox = Checkbox;
Form.Row = Row;
Form.Submit = Submit;

export default Form;
