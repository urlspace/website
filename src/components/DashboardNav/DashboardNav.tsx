import { useState } from "react";
import {
	DashboardAccordion,
	DashboardButton,
	DashboardButtonAction,
	DashboardList,
	DashboardLogo,
	DashboardMenu,
	DashboardSection,
	Truncate,
} from "..";
import Icon from "../Icons/Icons";
import Stack from "../Stack/Stack";

type CollectionRow = {
	id: string;
	name: string;
	description: string;
	public: boolean;
	createdAt: string;
	updatedAt: string;
};

type TagRow = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

function DashboardNav({
	collections,
	favourite,
	forLater,
	handleClearCache,
	handleSignOut,
	onEditCollection,
	onRenameTag,
	selectedCollection,
	selectedTags,
	setFavourite,
	setForLater,
	setIsAddCollectionkOpen,
	setIsAddLinkOpen,
	setSelectedCollection,
	setSelectedTags,
	showLogo,
	tags,
}: {
	collections: CollectionRow[];
	favourite: boolean;
	forLater: boolean;
	handleClearCache: () => void;
	handleSignOut: () => void;
	onEditCollection: (collection: CollectionRow) => void;
	onRenameTag: (tag: TagRow) => void;
	selectedCollection: string | null;
	selectedTags: string[];
	setFavourite: React.Dispatch<React.SetStateAction<boolean>>;
	setForLater: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAddCollectionkOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAddLinkOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedCollection: React.Dispatch<React.SetStateAction<string | null>>;
	setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
	showLogo: boolean;
	tags: TagRow[];
}) {
	const [editModeCollections, setEditModeCollections] = useState(false);
	const [editModeTags, setEditModeTags] = useState(false);

	return (
		<nav>
			<DashboardSection>
				{showLogo ? <DashboardLogo /> : null}
				<DashboardList>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.List />}
							onClick={() => {
								setFavourite(false);
								setForLater(false);
								setSelectedCollection(null);
								setSelectedTags([]);
							}}
							text="All"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							ariaPressed={favourite}
							icon={<Icon.Heart />}
							onClick={() => setFavourite((prev) => !prev)}
							text="Favourite"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							ariaPressed={forLater}
							icon={<Icon.Coffee />}
							onClick={() => setForLater((prev) => !prev)}
							text="For later"
						/>
					</DashboardList.Li>
				</DashboardList>

				<DashboardButton
					icon={<Icon.Plus />}
					onClick={() => setIsAddLinkOpen(true)}
					text="Add link"
				/>
			</DashboardSection>
			<DashboardSection>
				<DashboardAccordion summary="Collections">
					<Stack>
						<DashboardList>
							{collections.map((c) => (
								<DashboardList.Li
									key={c.id}
									highlightOnHover={editModeCollections}
								>
									<Truncate>
										<DashboardButton
											icon={<Icon.Folder />}
											onClick={() =>
												setSelectedCollection((prev) =>
													prev === c.id ? null : c.id,
												)
											}
											ariaPressed={selectedCollection === c.id}
											text={c.name}
										/>
									</Truncate>
									{editModeCollections ? (
										<DashboardMenu>
											<DashboardMenu.Li>
												<DashboardButtonAction
													text="Edit"
													onClick={() => onEditCollection(c)}
												/>
											</DashboardMenu.Li>
											<DashboardMenu.Li>
												<DashboardButtonAction
													text="Delete"
													onClick={() => alert("Delete collection")}
													destructive
												/>
											</DashboardMenu.Li>
										</DashboardMenu>
									) : null}
								</DashboardList.Li>
							))}
						</DashboardList>

						<div>
							<DashboardButton
								icon={<Icon.Plus />}
								onClick={() => setIsAddCollectionkOpen(true)}
								text="Add collection"
							/>
							{collections.length ? (
								<DashboardButton
									icon={<Icon.Edit />}
									onClick={() => setEditModeCollections((prev) => !prev)}
									text={
										editModeCollections
											? "Disable edit mode"
											: "Edit collections"
									}
								/>
							) : null}
						</div>
					</Stack>
				</DashboardAccordion>
			</DashboardSection>
			{tags.length ? (
				<DashboardSection>
					<DashboardAccordion summary="Tags">
						<Stack>
							<DashboardList>
								{tags.map((t) => (
									<DashboardList.Li key={t.id} highlightOnHover={editModeTags}>
										<Truncate>
											<DashboardButton
												icon={<Icon.Tag />}
												onClick={() =>
													setSelectedTags((prev) =>
														prev.includes(t.id)
															? prev.filter((id) => id !== t.id)
															: [...prev, t.id],
													)
												}
												ariaPressed={selectedTags.includes(t.id)}
												text={t.name}
											/>
										</Truncate>

										{editModeTags ? (
											<DashboardMenu>
												<DashboardMenu.Li>
													<DashboardButtonAction
														text="Rename"
														onClick={() => onRenameTag(t)}
													/>
												</DashboardMenu.Li>
												<DashboardMenu.Li>
													<DashboardButtonAction
														text="Delete"
														onClick={() => alert("Delete tag")}
														destructive
													/>
												</DashboardMenu.Li>
											</DashboardMenu>
										) : null}
									</DashboardList.Li>
								))}
							</DashboardList>

							<div>
								<DashboardButton
									icon={<Icon.Edit />}
									text={editModeTags ? "Disable edit mode" : "Edit tags"}
									onClick={() => setEditModeTags((prev) => !prev)}
								/>
							</div>
						</Stack>
					</DashboardAccordion>
				</DashboardSection>
			) : null}

			<DashboardSection>
				<DashboardList>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.User />}
							onClick={() => alert("Show profile")}
							text="Profile"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Settings />}
							onClick={() => alert("Show settings")}
							text="Settings"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Reload />}
							onClick={handleClearCache}
							text="Sync"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.SignOut />}
							onClick={handleSignOut}
							text="Sign out"
						/>
					</DashboardList.Li>
				</DashboardList>
				{
					// <h1>User</h1>
					// <p>Username: {user.username}</p>
					// <p>Display name: {user.displayName}</p>
					// <p>Email: {user.email}</p>
					// <p>Pro: {user.isPro ? "Yes" : "No"}</p>
					// <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
					// <p>Member since: {user.createdAt.slice(0, 10)}</p>
				}
			</DashboardSection>
		</nav>
	);
}

export default DashboardNav;
