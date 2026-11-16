import { useState } from "react";

import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function linksLabel(count: number) {
	return count === 1 ? "1 link" : `${count} links`;
}

function FormDeleteTag({
	tag,
	onDelete,
	onClose,
}: {
	tag: {
		count: number;
	};
	onDelete: (cascade: boolean) => Promise<void>;
	onClose: () => void;
}) {
	const [cascade, setCascade] = useState(false);

	async function handleSubmit({ setError }: SubmitHelpers) {
		setError(null);
		try {
			await onDelete(cascade);
			onClose();
		} catch {
			setError("Something went wrong. Try again in a moment.");
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<p>
				Deleting this tag cannot be undone. All links will lose their
				association with the tag. Tick the box below to also permanently remove
				those links.
			</p>
			<Form.Checkbox
				label={`Also delete ${linksLabel(tag.count)} with this tag`}
				name="cascade-tag"
				onChange={setCascade}
				value={cascade}
			/>
			<Form.Submit
				text={
					cascade ? `Delete tag and ${linksLabel(tag.count)}` : "Delete tag"
				}
				textLoading="Deleting..."
			/>
		</Form>
	);
}

export default FormDeleteTag;
