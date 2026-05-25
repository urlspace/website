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
  required?: boolean;
  type: "text" | "email" | "password" | "url";
  value: string;
}) {
  return (
    <div className="form__field">
      <label className="form__label" htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> (required)</span> : null}
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

function Select({
  description,
  disabled,
  label,
  name,
  onChange,
  required,
  value,
  options,
}: {
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
  options: { name: string; value: string }[];
}) {
  return (
    <div className="form__field">
      <label className="form__label" htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> (required)</span> : null}
      </label>

      <select
        className="form__input form__input--select"
        name={name}
        id={name}
        disabled={disabled}
        onChange={(e) => {
          console.log(e.target.value);
          onChange(e.target.value);
        }}
        value={value}
      >
        <option value="">Choose a collection</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>

      {description ? (
        <p id={`${name}-description`} className="form__description">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FormError({ errorMessage }: { errorMessage: React.ReactNode }) {
  return errorMessage ? (
    <p id="form-error" className="form__error" role="alert">
      {errorMessage}
    </p>
  ) : null;
}

Form.Input = Input;
Form.Select = Select;
Form.Error = FormError;

export default Form;
