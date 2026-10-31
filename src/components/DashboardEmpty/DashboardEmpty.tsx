import { Link } from "@tanstack/react-router";

import { ButtonLinkLike } from "../Button/Button";

function DashbrardEmpty({
	newAccount,
	onAddLink,
}: {
	newAccount: boolean;
	onAddLink: () => void;
}) {
	if (!newAccount) {
		return (
			<p>
				No links found. Try fewer filters, a different collection or tag, or a
				shorter search term.
			</p>
		);
	}

	return (
		<p>
			No links yet!{" "}
			<ButtonLinkLike
				type="button"
				onClick={onAddLink}
				text="Add your first link"
			/>{" "}
			or <Link to="/tools">import your bookmarks</Link>. Folders become
			collections, and your tags come too.
		</p>
	);
}

export default DashbrardEmpty;
