import { type ReactNode, useState } from "react";
import { useFieldIds } from "./context";
import styles from "./Form.module.css";

function FileInput({
	accept,
	description,
	disabled,
	label,
	name,
	onChange,
	required,
}: {
	accept?: string;
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	name: string;
	onChange: (file: File | null) => void;
	required?: boolean;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const isDisabled = disabled || loading;
	const [fileName, setFileName] = useState<string | null>(null);

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

			<div className={styles.file}>
				<input
					accept={accept}
					aria-describedby={ariaDescribedBy}
					className={styles.fileInput}
					disabled={isDisabled}
					id={inputId}
					name={name}
					onChange={(e) => {
						const file = e.target.files?.[0] ?? null;
						setFileName(file?.name ?? null);
						onChange(file);
					}}
					required={required}
					type="file"
				/>
				<span aria-hidden="true" className={styles.fileButton}>
					Choose file
				</span>
				<span aria-hidden="true" className={styles.fileName}>
					{fileName ?? "No file chosen"}
				</span>
			</div>

			{description ? (
				<p id={descriptionId} className={styles.description}>
					{description}
				</p>
			) : null}
		</div>
	);
}

export default FileInput;
