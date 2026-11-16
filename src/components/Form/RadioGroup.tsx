import { type ReactNode } from "react";

import { useFieldIds } from "./context";

import styles from "./Form.module.css";

export type RadioOption<T extends string> = {
	name: string;
	value: T;
	disabled?: boolean;
};

function RadioGroup<T extends string>({
	description,
	disabled,
	label,
	name,
	onChange,
	options,
	value,
}: {
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (value: T) => void;
	options: Array<RadioOption<T>>;
	value: T;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);

	return (
		<fieldset
			aria-describedby={ariaDescribedBy}
			className={styles.fieldset}
			disabled={disabled}
		>
			<legend className={styles.label}>{label}</legend>

			<div className={styles.radioOptions}>
				{options.map((option) => {
					const optionId = `${inputId}-${option.value}`;
					return (
						<div key={option.value} className={styles.checkboxWrapper}>
							<input
								checked={value === option.value}
								className={styles.radio}
								disabled={disabled || option.disabled || loading}
								id={optionId}
								name={name}
								onChange={() => onChange(option.value)}
								type="radio"
								value={option.value}
							/>
							<label
								className={[
									styles.label,
									(disabled || option.disabled) && styles.labelDisabled,
								]
									.filter(Boolean)
									.join(" ")}
								htmlFor={optionId}
							>
								{option.name}
							</label>
						</div>
					);
				})}
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</fieldset>
	);
}

export default RadioGroup;
