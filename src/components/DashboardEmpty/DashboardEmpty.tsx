import { ButtonBiggie, ButtonBiggieLink } from "../Button/Button";
import Stack from "../Stack/Stack";

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
		<Stack>
			<p>
				Welcome to url.space! Add your first link, or import the bookmarks you
				already have in your browser or another service.
			</p>
			<Stack direction="row" gap={0.5}>
				<ButtonBiggie text="Add Link" onClick={onAddLink} />
				<ButtonBiggieLink text="Import bookmarks" to="/tools" />
			</Stack>
			<p>Thank you for using url.space 🫶</p>
		</Stack>
	);
}

export default DashbrardEmpty;
