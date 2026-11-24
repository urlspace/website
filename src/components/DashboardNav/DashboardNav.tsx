import { useState } from "react";

import {
	DashboardAccordion,
	Button,
	ButtonAction,
	ButtonLink,
	DashboardList,
	DashboardMenu,
} from "..";
import Icon from "../Icons/Icons";
import Stack from "../Stack/Stack";

import styles from "./DashboardNav.module.css";

type CollectionRow = {
	id: string;
	name: string;
	slug: string;
	description: string;
	public: boolean;
	password: string | null;
	createdAt: string;
	updatedAt: string;
	count: number;
};

type TagRow = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	count: number;
};

function DashboardNav({
	collections,
	favourite,
	forLater,
	handleSignOut,
	deletingCollectionId,
	deletingTagId,
	onDeleteCollection,
	onDeleteTag,
	onEditCollection,
	onRenameTag,
	selectedCollection,
	selectedTags,
	setFavourite,
	setForLater,
	onAddCollection,
	onAddLink,
	onClearFiltersAndSearchQuery,
	setIsShortcutsOpen,
	setIsThemesOpen,
	setSelectedCollection,
	setSelectedTags,
	tags,
}: {
	collections: CollectionRow[];
	favourite: boolean;
	forLater: boolean;
	handleSignOut: () => void;
	deletingCollectionId: string | null;
	deletingTagId: string | null;
	onDeleteCollection: (collection: CollectionRow, button: HTMLElement) => void;
	onDeleteTag: (tag: TagRow, button: HTMLElement) => void;
	onEditCollection: (collection: CollectionRow) => void;
	onRenameTag: (tag: TagRow) => void;
	selectedCollection: string | null;
	selectedTags: string[];
	setFavourite: (value: boolean) => void;
	setForLater: (value: boolean) => void;
	onAddCollection: () => void;
	onAddLink: () => void;
	onClearFiltersAndSearchQuery: () => void;
	setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsThemesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedCollection: (value: string | null) => void;
	setSelectedTags: (value: string[]) => void;
	tags: TagRow[];
}) {
	const [editModeCollections, setEditModeCollections] = useState(false);
	const [editModeTags, setEditModeTags] = useState(false);

	return (
		<div className={styles.nav}>
			<Stack gap={1.5}>
				<Stack gap={0.5}>
					<DashboardList ariaLabel="Quick filters">
						<DashboardList.Li>
							<Button
								ariaKeyShortcuts="x"
								icon={<Icon.List />}
								onClick={onClearFiltersAndSearchQuery}
								text="All"
							/>
						</DashboardList.Li>
						<DashboardList.Li>
							<Button
								ariaPressed={favourite}
								icon={<Icon.Heart />}
								onClick={() => setFavourite(!favourite)}
								text="Favourite"
							/>
						</DashboardList.Li>
						<DashboardList.Li>
							<Button
								ariaPressed={forLater}
								icon={<Icon.Coffee />}
								onClick={() => setForLater(!forLater)}
								text="For later"
							/>
						</DashboardList.Li>
					</DashboardList>

					<Button icon={<Icon.Plus />} onClick={onAddLink} text="Add link" />
				</Stack>
				<DashboardAccordion summary="Collections">
					<Stack gap={0.5}>
						{collections.some((c) => !c.public) ? (
							<DashboardList ariaLabel="Private collections">
								{collections
									.filter((c) => !c.public)
									.map((c, index, arr) => {
										const isDeleting = deletingCollectionId === c.id;
										return (
											<DashboardList.Li key={c.id} loading={isDeleting}>
												<div
													style={{
														minWidth: 0,
													}}
												>
													<Button
														icon={<Icon.Folder />}
														onClick={() =>
															setSelectedCollection(
																selectedCollection === c.id ? null : c.id,
															)
														}
														ariaPressed={selectedCollection === c.id}
														disabled={isDeleting}
														text={c.name}
														counter={c.count}
													/>
												</div>
												{editModeCollections ? (
													<DashboardMenu fadeIn order={arr.length - index}>
														<DashboardMenu.Li>
															<ButtonAction
																text="Edit"
																ariaLabel={`Edit collection "${c.name}"`}
																disabled={isDeleting}
																onClick={() => onEditCollection(c)}
															/>
														</DashboardMenu.Li>
														<DashboardMenu.Li>
															<ButtonAction
																text="Delete"
																ariaLabel={`Delete collection "${c.name}"`}
																disabled={isDeleting}
																onClick={(e) =>
																	onDeleteCollection(c, e.currentTarget)
																}
																destructive
															/>
														</DashboardMenu.Li>
													</DashboardMenu>
												) : null}
											</DashboardList.Li>
										);
									})}
							</DashboardList>
						) : null}

						{collections.some((c) => c.public && c.password === null) ? (
							<DashboardList ariaLabel="Public collections">
								{collections
									.filter((c) => c.public && c.password === null)
									.map((c, index, arr) => {
										const isDeleting = deletingCollectionId === c.id;
										return (
											<DashboardList.Li key={c.id} loading={isDeleting}>
												<div
													style={{
														minWidth: 0,
													}}
												>
													<Button
														icon={<Icon.FolderPublic />}
														onClick={() =>
															setSelectedCollection(
																selectedCollection === c.id ? null : c.id,
															)
														}
														ariaPressed={selectedCollection === c.id}
														disabled={isDeleting}
														text={c.name}
														counter={c.count}
													/>
												</div>
												{editModeCollections ? (
													<DashboardMenu fadeIn order={arr.length - index}>
														<DashboardMenu.Li>
															<ButtonAction
																text="Edit"
																ariaLabel={`Edit collection "${c.name}"`}
																disabled={isDeleting}
																onClick={() => onEditCollection(c)}
															/>
														</DashboardMenu.Li>
														<DashboardMenu.Li>
															<ButtonAction
																text="Delete"
																ariaLabel={`Delete collection "${c.name}"`}
																disabled={isDeleting}
																onClick={(e) =>
																	onDeleteCollection(c, e.currentTarget)
																}
																destructive
															/>
														</DashboardMenu.Li>
													</DashboardMenu>
												) : null}
											</DashboardList.Li>
										);
									})}
							</DashboardList>
						) : null}

						{collections.some((c) => c.password !== null) ? (
							<DashboardList ariaLabel="Password protected collections">
								{collections
									.filter((c) => c.password !== null)
									.map((c, index, arr) => {
										const isDeleting = deletingCollectionId === c.id;
										return (
											<DashboardList.Li key={c.id} loading={isDeleting}>
												<div
													style={{
														minWidth: 0,
													}}
												>
													<Button
														icon={<Icon.Lock />}
														onClick={() =>
															setSelectedCollection(
																selectedCollection === c.id ? null : c.id,
															)
														}
														ariaPressed={selectedCollection === c.id}
														disabled={isDeleting}
														text={c.name}
														counter={c.count}
													/>
												</div>
												{editModeCollections ? (
													<DashboardMenu fadeIn order={arr.length - index}>
														<DashboardMenu.Li>
															<ButtonAction
																text="Edit"
																ariaLabel={`Edit collection "${c.name}"`}
																disabled={isDeleting}
																onClick={() => onEditCollection(c)}
															/>
														</DashboardMenu.Li>
														<DashboardMenu.Li>
															<ButtonAction
																text="Delete"
																ariaLabel={`Delete collection "${c.name}"`}
																disabled={isDeleting}
																onClick={(e) =>
																	onDeleteCollection(c, e.currentTarget)
																}
																destructive
															/>
														</DashboardMenu.Li>
													</DashboardMenu>
												) : null}
											</DashboardList.Li>
										);
									})}
							</DashboardList>
						) : null}

						<div>
							<Button
								icon={<Icon.Plus />}
								onClick={onAddCollection}
								text="Add collection"
							/>
							{collections.length ? (
								<Button
									ariaPressed={editModeCollections}
									icon={<Icon.Edit />}
									onClick={() => setEditModeCollections((prev) => !prev)}
									text="Edit collections"
								/>
							) : null}
						</div>
					</Stack>
				</DashboardAccordion>
				{tags.length ? (
					<DashboardAccordion summary="Tags">
						<Stack gap={0.5}>
							<DashboardList ariaLabel="Tags">
								{tags.map((t, index, arr) => {
									const isDeleting = deletingTagId === t.id;
									return (
										<DashboardList.Li key={t.id} loading={isDeleting}>
											<div
												style={{
													minWidth: 0,
												}}
											>
												<Button
													icon={<Icon.Tag />}
													onClick={() =>
														setSelectedTags(
															selectedTags.includes(t.id)
																? selectedTags.filter((id) => id !== t.id)
																: [...selectedTags, t.id],
														)
													}
													ariaPressed={selectedTags.includes(t.id)}
													disabled={isDeleting}
													text={t.name}
													counter={t.count}
												/>
											</div>

											{editModeTags ? (
												<DashboardMenu fadeIn order={arr.length - index}>
													<DashboardMenu.Li>
														<ButtonAction
															text="Rename"
															ariaLabel={`Rename tag "${t.name}"`}
															disabled={isDeleting}
															onClick={() => onRenameTag(t)}
														/>
													</DashboardMenu.Li>
													<DashboardMenu.Li>
														<ButtonAction
															text="Delete"
															ariaLabel={`Delete tag "${t.name}"`}
															disabled={isDeleting}
															onClick={(e) => onDeleteTag(t, e.currentTarget)}
															destructive
														/>
													</DashboardMenu.Li>
												</DashboardMenu>
											) : null}
										</DashboardList.Li>
									);
								})}
							</DashboardList>

							<div>
								<Button
									ariaPressed={editModeTags}
									icon={<Icon.Edit />}
									text="Edit tags"
									onClick={() => setEditModeTags((prev) => !prev)}
								/>
							</div>
						</Stack>
					</DashboardAccordion>
				) : null}
				<DashboardList ariaLabel="Account">
					<DashboardList.Li>
						<ButtonLink
							icon={<Icon.User />}
							to="/settings"
							text="Account settings"
							preload={false}
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<ButtonLink
							icon={<Icon.Tools />}
							to="/tools"
							text="Tools"
							preload={false}
						/>
					</DashboardList.Li>
					{
						// <DashboardList.Li>
						//   <Button
						//     icon={<Icon.Extension />}
						//     onClick={() => alert("Browsers extensions")}
						//     text="Browsers extensions"
						//   />
						// </DashboardList.Li>
					}
					<DashboardList.Li hideOnTouchDevice>
						<Button
							icon={<Icon.Keyboard />}
							onClick={() => setIsShortcutsOpen(true)}
							text="Keyboard shortcuts"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<Button
							icon={<Icon.Contrast />}
							onClick={() => setIsThemesOpen(true)}
							text="Theme"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<Button
							icon={<Icon.SignOut />}
							onClick={handleSignOut}
							text="Sign out"
						/>
					</DashboardList.Li>
				</DashboardList>
			</Stack>
		</div>
	);
}

export default DashboardNav;
