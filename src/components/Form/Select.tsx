import { type ReactNode } from "react";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";

export type SelectOption = { name: string; value: string };

function Select({
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
	options: SelectOption[];
	placeholder: string;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const isDisabled = disabled || loading;

	return (
		<div className={styles.field}>
			<label
				className={[styles.label, isDisabled && styles.labelDisabled]
					.filter(Boolean)
					.join(" ")}
				htmlFor={inputId}
			>
				{label}
				{required ? <span aria-hidden="true"> (required)</span> : null}
			</label>

			<div className={styles.selectWrapper}>
				<select
					aria-describedby={ariaDescribedBy}
					className={styles.select}
					data-empty={value === "" ? "" : undefined}
					disabled={isDisabled}
					id={inputId}
					name={name}
					onChange={(e) => onChange(e.target.value)}
					required={required}
					value={value}
				>
					<option value="" disabled={required}>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.name}
						</option>
					))}
				</select>
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

export default Select;
