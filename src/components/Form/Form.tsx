import { useCombobox } from "downshift";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useState,
} from "react";
import Icon from "../Icons/Icons";
import styles from "./Form.module.css";

type FormContextValue = {
	formId: string;
	error: ReactNode;
	loading: boolean;
};

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext() {
	const ctx = useContext(FormContext);
	if (!ctx) throw new Error("Form.* must be used inside <Form>");
	return ctx;
}

function useFieldIds(name: string, hasDescription: boolean) {
	const { formId, error, loading } = useFormContext();
	const inputId = `${name}-${formId}`;
	const descriptionId = `${name}-description-${formId}`;
	const ariaDescribedBy =
		[hasDescription ? descriptionId : null, error ? `error-${formId}` : null]
			.filter(Boolean)
			.join(" ") || undefined;
	return { inputId, descriptionId, ariaDescribedBy, loading };
}

export type SubmitHelpers = {
	setError: (msg: ReactNode) => void;
	setLoading: (loading: boolean) => void;
};

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
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
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
				disabled={disabled || loading}
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
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
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
				disabled={disabled || loading}
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

type ComboboxOption = { name: string; value: string };

function Combobox({
	description,
	disabled,
	label,
	name,
	onChange,
	options,
	placeholder,
	required,
	value,
}: {
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: string) => void;
	required?: boolean;
	value: string;
	options: ComboboxOption[];
	placeholder: string;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const selected = options.find((o) => o.value === value) ?? null;
	const isDisabled = disabled || loading;
	const [inputValue, setInputValue] = useState(selected?.name ?? "");

	// Keep the input text in sync when the external `value` changes (e.g. parent
	// resets the form).
	useEffect(() => {
		setInputValue(selected?.name ?? "");
	}, [selected]);

	const query = inputValue.trim().toLowerCase();
	const filtered =
		!query || query === selected?.name.toLowerCase()
			? options
			: options.filter((o) => o.name.toLowerCase().includes(query));

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		getItemProps,
		highlightedIndex,
		selectItem,
	} = useCombobox({
		items: filtered,
		selectedItem: selected,
		inputValue,
		itemToString: (item) => item?.name ?? "",
		onInputValueChange: ({ inputValue: nextInput }) =>
			setInputValue(nextInput ?? ""),
		onSelectedItemChange: ({ selectedItem }) =>
			onChange(selectedItem?.value ?? ""),
		id: inputId,
		// On blur, discard free text that isn't a committed selection — revert the
		// input to the selected option's name, or clear it if nothing is selected.
		stateReducer: (_state, { type, changes }) => {
			if (type === useCombobox.stateChangeTypes.InputBlur) {
				return { ...changes, inputValue: changes.selectedItem?.name ?? "" };
			}
			return changes;
		},
	});

	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<div className={styles.comboboxWrapper}>
				<div className={styles.comboboxInputGroup}>
					<input
						{...getInputProps({
							"aria-describedby": ariaDescribedBy,
							className: styles.comboboxInput,
							disabled: isDisabled,
							name,
							placeholder,
							required,
						})}
					/>
					{inputValue && !isDisabled ? (
						<button
							type="button"
							aria-label="Clear selection"
							className={styles.comboboxButton}
							onClick={() => {
								selectItem(null);
								setInputValue("");
							}}
						>
							<Icon.Close />
						</button>
					) : null}
				</div>

				<ul
					{...getMenuProps({
						className: styles.comboboxPopup,
						hidden: !isOpen,
					})}
				>
					{isOpen && filtered.length === 0 ? (
						<li className={styles.comboboxEmpty}>No matching collection</li>
					) : null}
					{isOpen
						? filtered.map((item, index) => (
								<li
									key={item.value}
									{...getItemProps({ item, index })}
									data-highlighted={highlightedIndex === index ? "" : undefined}
									className={styles.comboboxItem}
								>
									{item.name}
								</li>
							))
						: null}
				</ul>
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
Form.Select = Select;
Form.Combobox = Combobox;
Form.Checkbox = Checkbox;
Form.Row = Row;
Form.Submit = Submit;

export default Form;
