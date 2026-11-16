import { useState } from "react";

import Form, { type SubmitHelpers } from "../Form/Form.tsx";

function linksLabel(count: number) {
	return count === 1 ? "1 link" : `${count} links`;
}

function FormDeleteCollection({
	collection,
	onDelete,
	onClose,
}: {
	collection: {
		count: number;
		public: boolean;
	};
	onDelete: (cascade: boolean) => Promise<void>;
	onClose: () => void;
}) {
	const [cascade, setCascade] = useState(false);

	async function handleSubmit(
		e: React.SubmitEvent<HTMLFormElement>,
		{ setError, setLoading }: SubmitHelpers,
	) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await onDelete(cascade);
			onClose();
		} catch {
			setError("Something went wrong. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<p>
				Deleting this collection cannot be undone. All links will lose their
				association with the collection. Tick the box below to also permanently
				remove those links.
			</p>
			<Form.Checkbox
				label={`Also delete ${linksLabel(collection.count)} in this collection`}
				name="cascade-collection"
				onChange={setCascade}
				value={cascade}
			/>
			{collection.public ? (
				<Form.Warning>
					Sir Tim Berners-Lee, the man who invented the World Wide Web,
					published{" "}
					<a
						href="https://www.w3.org/Provider/Style/URI"
						target="_blank"
						rel="noreferrer"
						aria-description="Opens in a new tab"
					>
						"Cool URIs don't change"
					</a>{" "}
					in 1998. Think twice before deleting this public collection.
				</Form.Warning>
			) : null}
			<Form.Submit
				text={
					cascade
						? `Delete collection and ${linksLabel(collection.count)}`
						: "Delete collection"
				}
				textLoading="Deleting..."
			/>
		</Form>
	);
}

export default FormDeleteCollection;
