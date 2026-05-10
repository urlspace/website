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
  label,
  maxLength,
  minLength,
  name,
  onChange,
  placeholder,
  required,
  type,
  value,
  pattern,
}: {
  autoComplete?: string;
  description?: string;
  label: string;
  maxLength?: number;
  minLength?: number;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  required: boolean;
  type: "text" | "email" | "password";
  value: string;
  pattern?: string;
}) {
  return (
    <div className="form__field">
      <label className="form__label" htmlFor={name}>
        {label}
        {required ? " (required)" : null}
      </label>

      <input
        name={name}
        id={name}
        className="form__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        pattern={pattern}
      />
      {description ? <p className="form__description">{description}</p> : null}
    </div>
  );
}

function FormError({ errorMessage }: { errorMessage: string | null }) {
  return errorMessage ? (
    <p className="form__error" role="alert">
      {errorMessage}
    </p>
  ) : null;
}

Form.Input = Input;
Form.Error = FormError;

export default Form;
