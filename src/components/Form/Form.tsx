import styles from "./Form.module.css";

function Form({
  onSubmit,
  children,
}: {
  onSubmit: React.ComponentProps<"form">["onSubmit"];
  children: React.ReactNode;
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
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
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> (required)</span> : null}
      </label>

      <input
        aria-describedby={
          description ? `${name}-description form-error` : "form-error"
        }
        autoComplete={autoComplete}
        className={styles.input}
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
        <p id={`${name}-description`} className={styles.description}>
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
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
  options: { name: string; value: string }[];
  placeholder: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> (required)</span> : null}
      </label>

      <select
        className={[styles.input, styles.inputSelect].join(" ")}
        name={name}
        id={name}
        disabled={disabled}
        onChange={(e) => {
          console.log(e.target.value);
          onChange(e.target.value);
        }}
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
        <p id={`${name}-description`} className={styles.description}>
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
  description?: string;
}) {
  return (
    <div className={[styles.field, styles.fieldRow].join(" ")}>
      <input
        type="checkbox"
        id={name}
        name={name}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        checked={value}
        className={styles.checkbox}
      />

      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> (required)</span> : null}
      </label>

      {description ? (
        <p id={`${name}-description`} className={styles.description}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FormError({ errorMessage }: { errorMessage: React.ReactNode }) {
  return errorMessage ? (
    <p id="form-error" className={styles.error} role="alert">
      {errorMessage}
    </p>
  ) : null;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

Form.Input = Input;
Form.Select = Select;
Form.Checkbox = Checkbox;
Form.Row = Row;
Form.Error = FormError;

export default Form;
