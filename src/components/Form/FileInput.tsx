import { type ReactNode, useState } from "react";

import { useFieldIds } from "./context";

import styles from "./Form.module.css";

function FileInput({
	accept,
	description,
	disabled,
	label,
	multiple,
	name,
	onChange,
	required,
}: {
	accept?: string;
	description?: ReactNode;
	disabled?: boolean;
	label: string;
	multiple?: boolean;
	name: string;
	onChange: (files: Array<File>) => void;
	required?: boolean;
}) {
	const { inputId, descriptionId, ariaDescribedBy, loading } = useFieldIds(
		name,
		!!description,
	);
	const isDisabled = disabled || loading;
	const [fileNames, setFileNames] = useState<Array<string>>([]);

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
					multiple={multiple}
					name={name}
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						setFileNames(files.map((file) => file.name));
						onChange(files);
					}}
					required={required}
					type="file"
				/>
				<span aria-hidden="true" className={styles.fileButton}>
					Choose file
				</span>
				<span aria-hidden="true" className={styles.fileName}>
					{fileNames.length > 0 ? fileNames.join(", ") : "No file chosen"}
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
