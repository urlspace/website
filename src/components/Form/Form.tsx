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
}: {
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
      />
      {description ? (
        <p className="form__description">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio
          dignissimos aut cupiditate voluptate. Eveniet esse illum, rerum iste
          ut commodi.
        </p>
      ) : null}
    </div>
  );
}

function Error({ errorMessage }: { errorMessage: string | null }) {
  return errorMessage ? <p className="form__error">{errorMessage}</p> : null;
}

Form.Input = Input;
Form.Error = Error;

export default Form;
