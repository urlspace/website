import "./Form.css";

function Form({
	onSubmit,
	children,
}: {
	onSubmit: React.ComponentProps<"form">["onSubmit"];
	children: React.ReactNode;
}) {
	return (
		<form className="form" onSubmit={onSubmit}>
			{children}
		</form>
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
	description?: string;
	disabled?: boolean;
	label: string;
	maxLength?: number;
	minLength?: number;
	name: string;
	onChange: (value: string) => void;
	pattern?: string;
	placeholder: string;
	required: boolean;
	type: "text" | "email" | "password";
	value: string;
}) {
	return (
		<div className="form__field">
			<label className="form__label" htmlFor={name}>
				{label}
				{required ? " (required)" : null}
			</label>

			<input
				aria-describedby={
					description ? `${name}-description form-error` : "form-error"
				}
				autoComplete={autoComplete}
				className="form__input"
				disabled={disabled}
				id={name}
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
				<p id={`${name}-description`} className="form__description">
					{description}
				</p>
			) : null}
		</div>
	);
}

function FormError({ errorMessage }: { errorMessage: string | null }) {
	return errorMessage ? (
		<p id="form-error" className="form__error" role="alert">
			{errorMessage}
		</p>
	) : null;
}

Form.Input = Input;
Form.Error = FormError;

export default Form;
